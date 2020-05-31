import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Peer from 'simple-peer';
import { SocketIOService } from '../../_utils/socketio.service';
import { UserService } from '../../_utils/user.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @ViewChild('myVideo') myVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('peerVideo') peerVideo: ElementRef<HTMLVideoElement>;
  public mute = false;
  public incomingCall: any;
  public callDetails: any;
  public userUid: any;
  public currentUserCalling: any = false;
  public userDetails: any = {};
  public roomName: number;
  public callInitiated: any = false;
  public client: any = {};
  constructor(
    private router: Router,
    private userService: UserService,
    private socketService: SocketIOService,
    private route: ActivatedRoute
  ) {
    this.incomingCall = (this.router.getCurrentNavigation().extras.state) ?
    this.router.getCurrentNavigation().extras.state.callMade : false;
    this.callDetails =  (this.router.getCurrentNavigation().extras.state) ?
    this.router.getCurrentNavigation().extras.state.callDetails : {};
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userUid = params.uid;
      this.getUserDetails();
    });
    if (this.incomingCall){
      this.currentUserCalling = false;
    }else{
      this.currentUserCalling = true;
    }
    this.muteUnmute();
  }

  getUserDetails(){
    this.userService.getUserDetails(this.userUid).subscribe(
      (response) => {
        this.userDetails = response;
        this.getUsersSocketDetails();
        if (this.currentUserCalling){
          this.roomName = Math.ceil(Math.random() * 100000000);
        }
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            this.myVideo.nativeElement.srcObject = stream;
            this.myVideo.nativeElement.play();
            stream.getAudioTracks()[0].enabled = false;
            console.log(`My socket id is : ${this.socketService.socketId}`);
            this.signalAnswer(stream);
            this.socketService.requestForJoiningRoom({ roomName: this.roomName });
            if (this.currentUserCalling){
              this.callInitiated = true;
              this.makePeer(stream);
            }else{
              this.callInitiated = false;
              this.frontAnswer(stream);
            }
            this.socketService.onRoomParticipants(participants => {
              console.log(`${this.socketService.socketId} - On Room Participants`);
              console.log(participants);
            });
            const endCall = document.querySelector('#endCall');
            if (endCall !== null){
              endCall.addEventListener('click', this.handleEndCallClick.bind(this));
            }
          }).catch(err => {
            console.log(err);
          });
      },
      (error) => {

      }
    );
  }

  // Used to initialize a peer
  initPeer = (type: string, stream: any) => {
    const peer = new Peer({initiator: (type === 'init') ? true : false, stream, trickle: false});

    peer.on('close', () => {
      peer.destroy();
    });
    return peer;
  }

  makePeer(stream){
    this.client.gotAnswer = false;
    const peer = this.initPeer('init', stream);
    peer.on('signal', (offer) => {
      if (!this.client.gotAnswer){
        this.socketService.sendOfferSignal({
          offer,
          caller: this.socketService.socketId,
          callee: this.userDetails.socketId,
          roomName: this.roomName
        });
        this.client.peer = peer;
      }
    });
  }

  frontAnswer(stream){
    const peer = this.initPeer('notInit', stream);
    peer.on('signal', (answer: any) => {
      if (answer.sdp){
        this.socketService.sendAnswerSignal({
          answer,
          callee: this.callDetails.callee,
          caller: this.callDetails.caller
        });
        this.createVideo(stream);
      }
    });
    peer.signal(this.callDetails.offer);
  }

  signalAnswer(stream){
    this.socketService.getOnAnswer().subscribe(
      (answer: any) => {
        this.client.gotAnswer = true;
        this.createVideo(stream);
      }
    );
  }

  createVideo(stream){
    stream.getAudioTracks()[0].enabled = true;
    const callingVideoSection: HTMLElement = document.querySelector('#callingVideoSection');
    const peerVideoSection: HTMLElement = document.querySelector('#peerVideoSection');
    callingVideoSection.style.display = 'none';
    peerVideoSection.style.visibility = 'visible';
    this.peerVideo.nativeElement.style.height = '90vh';
    this.peerVideo.nativeElement.srcObject = stream;
  }

  sessionActive(){
    console.error('Already on another call !');
  }

  getUsersSocketDetails(){
    const getAllConnectedClients = JSON.parse(localStorage.getItem('connectedClients'));
    getAllConnectedClients.map(client => {
      if (client.user.uid === this.userDetails.uid){
        this.userDetails.socketId = client.socketId;
      }
    });
  }

  handleEndCallClick(event){
    this.socketService.disconnectCall({
      caller: this.socketService.socketId,
      callee: this.userDetails.socketId
    });
    this.reConnectWithSocket();
  }

  reConnectWithSocket(){
    this.socketService.connect();
    this.socketService.listen('connect', () => {
      console.log(`My socket id is : ${this.socketService.socketId}`);
    });
    this.router.navigate(['/communication', this.userUid]);
  }

  muteUnmute(){
    this.mute = !this.mute;
    //this.myVideo.nativeElement.muted = this.mute;
  }

  ngOnDestroy(){
    this.socketService.disconnectCall({
      caller: this.socketService.socketId,
      callee: this.userDetails.socketId
    });
  }

}
