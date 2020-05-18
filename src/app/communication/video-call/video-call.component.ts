import { Component, OnInit, ViewChild, ElementRef, ViewChildren, Input } from '@angular/core';
const { RTCPeerConnection, RTCSessionDescription } = window;
import { SocketIOService } from '../../_utils/socketio.service';
import { AuthService } from '../../_utils/auth.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {
  @ViewChild('myVideo') myVideo: ElementRef<HTMLVideoElement>;
  @ViewChildren('peerVideo') peerVideo: ElementRef<HTMLVideoElement>;
  @Input() public userDetails: any;
  isAlreadyCalling = false;
  getCalled = false;
  existingCalls: Array<any> = new Array();
  roomName;
  callInitiated = false;
  callStarted = false;
  mute = false;
  peerConnection = new RTCPeerConnection();
  constructor(
    private socketService: SocketIOService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.roomName = Math.ceil(Math.random() * 100000000);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.myVideo.nativeElement.srcObject = stream;
        this.myVideo.nativeElement.play();
        console.log(`My socket id is : ${this.socketService.socketId}`);
        this.callInitiated = true;
        this.socketService.requestForJoiningRoom({ roomName: this.roomName });
        //stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));
        //this.peerConnection.ontrack = this.ontrackAdd(stream);
        this.callUser(this.socketService.socketId);
        this.socketService.onRoomParticipants(participants => {
          console.log(`${this.socketService.socketId} - On Room Participants`);
          console.log(participants);
        });
      }).catch(err => {
        console.log(err);
      });
  }

  ontrackAdd(stream): any{
    this.peerVideo.nativeElement.srcObject = stream;
  }

  muteUnmute(){
    this.mute = !this.mute;
    this.myVideo.nativeElement.muted = this.mute;
  }

  callUser = async socketId => {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    this.socketService.sendOfferSignal({ offer, caller: this.authService.getUser(), callee: this.userDetails, roomName: this.roomName });
  }

}
