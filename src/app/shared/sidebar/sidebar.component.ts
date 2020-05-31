import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocketIOService } from '../../_utils/socketio.service';
import { IncomingCallComponent } from '../../shared/incoming-call/incoming-call.component';

import { AuthService } from '../../_utils/auth.service';
import { CommonService } from '../../_utils/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  showSuccessErrorDetails = false;
  serverMessageInfo: object = {};
  isSuccess = false;
  userLists = [];
  clickedUser: any = {};
  userUid;
  loggedInUserDetails: any = {};
  @ViewChild(IncomingCallComponent) incomingCall: IncomingCallComponent;
  calleeDetails: any = {};
  callerDetails: any = {};
  callDetails: any = {};
  showIncomingCall = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private commonService: CommonService,
    private socketService: SocketIOService
  ) { }

  ngOnInit(): void {
    this.checkIncomingCalls();
    this.loggedInUserDetails = this.authService.getUser();
    this.getAllUsers();
    this.route.params.subscribe(params => {
      this.userUid = params.uid;
   });
  }

  getAllUsers(){
    this.commonService.getAllUsers().subscribe(
      (response: any) => {
        // if (loggedInUserDetails.isDoctor){
        //   response.map(user => {
        //     if (!user.isDoctor){
        //       this.userLists.push(user);
        //     }
        //   });
        // }
        response.map(user => {
          this.userLists.push(user);
        });
      },
      (error) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = false;
        this.serverMessageInfo = error.error;
      }
    );
  }

  goToCommunication(user){
    this.router.navigate(['/communication', user.uid]);
  }

  doLogout(){
    this.authService.signout();
    this.socketService.disconnectCall({caller: this.socketService.socketId});
  }

  checkIncomingCalls() {
    this.socketService.connect();
    this.socketService.listen('connect', () => {
      console.log(`My socket id is : ${this.socketService.socketId}`);
      this.onCloseCall();
    });

    this.socketService.getAllConnectedClients().subscribe(
      (clients) => {
        localStorage.removeItem('connectedClients');
        localStorage.setItem('connectedClients', JSON.stringify(clients));
      }
    );

    this.socketService.getIncomingCalls().subscribe(
      async (callData: any) => {
        this.callDetails = callData;
        const getAllConnectedClients = JSON.parse(localStorage.getItem('connectedClients'));
        getAllConnectedClients.map(client => {
          if (client.socketId === callData.callee && this.authService.getUser().uid === client.user.uid) {
            this.showIncomingCall = true;
            this.calleeDetails = client;
            this.callerDetails = callData.callerDetails;
            this.openModal();
            return;
          }
        });
      });
  }

  openModal() {
    setTimeout(() => {
      this.incomingCall.openModal();
    }, 1000);
  }

  handleAnswerCall = async () => {
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/video-call', this.callerDetails.uid],
    //   {
    //     state:
    //     {
    //       callMade: true,
    //       callDetails: this.callDetails
    //     }
    //   })
    // );
    this.router.navigate(['/video-call', this.callerDetails.uid],
      {
        state:
        {
          callMade: true,
          callDetails: this.callDetails
        }
      }
    );

    //window.open(url, '', `scrollbars=yes,resizable=yes,left=0,width=${window.innerWidth},height=${window.innerHeight}`);
  }

  handleRejectCall() {
    this.incomingCall.closeModal();
    this.socketService.disconnectCall({
      caller: this.socketService.socketId,
      callee: this.callDetails.caller
    });
    this.socketService.connect();
    this.socketService.listen('connect', () => {
      console.log(`My socket id is : ${this.socketService.socketId}`);
    });
  }

  onCloseCall(){
    this.socketService.onDisconnectCall().subscribe(
      (data: any) => {
        this.socketService.disconnectCall({
          caller: this.socketService.socketId
        });
        this.reConnectWithSocket();
      }
    );
  }

  reConnectWithSocket(){
    this.socketService.connect();
    this.socketService.listen('connect', () => {
      console.log(`My socket id is : ${this.socketService.socketId}`);
    });
    this.router.navigate(['/communication', (this.userUid) ? this.userUid : this.callerDetails.uid]);
  }

}
