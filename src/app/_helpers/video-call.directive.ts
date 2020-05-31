import { Directive, HostListener } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import * as Peer from 'simple-peer';
import { SocketIOService } from '../_utils/socketio.service';
import { UserService } from '../_utils/user.service';

@Directive({
  selector: '[appVideoCallDirective]'
})
export class VideoCallDirective {
  incomingCall: any;
  callDetails: any;
  userUid: any;
  currentUserCalling: any = false;
  userDetails: any = {};
  roomName: number;
  callInitiated: any = false;
  client: any = {};
  constructor(
    private router: Router,
    private userService: UserService,
    private socketService: SocketIOService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const url: Array<string> = event.url.split('/');
        if (url[1] && url[1] === 'video-call'){
          //this.currentURL = 'video-call';
          this.incomingCall = (this.router.getCurrentNavigation().extras.state) ?
          this.router.getCurrentNavigation().extras.state.callMade : false;
          this.callDetails =  (this.router.getCurrentNavigation().extras.state) ?
          this.router.getCurrentNavigation().extras.state.callDetails : {};
          this.init(url[2]);
        }
      }
    });
   }

   init(paramId){
    this.userUid = paramId;
    this.getUserDetails();
    if (this.incomingCall){
      this.currentUserCalling = false;
    }else{
      this.currentUserCalling = true;
    }
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
            const localVideo: any = document.getElementById('localVideo');
            localVideo.srcObject = stream;
            localVideo.play();
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
      document.querySelector('#peerVideo').remove();
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
    const peerVideo: any = document.querySelector('#peerVideo');
    peerVideo.style.height = '90vh';
    peerVideo.srcObject = stream;
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

  // handleOnEndCallEvent(){
  //   this.socketService.onDisconnectCall().subscribe(
  //     (data: any) => {
  //       this.socketService.disconnectCall({
  //         caller: this.socketService.socketId
  //       });
  //       this.reConnectWithSocket();
  //     }
  //   );
  // }

  reConnectWithSocket(){
    this.socketService.connect();
    this.socketService.listen('connect', () => {
      console.log(`My socket id is : ${this.socketService.socketId}`);
    });
    this.router.navigate(['/communication', this.userUid]);
  }

}
