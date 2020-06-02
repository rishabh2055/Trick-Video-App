import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SocketIOService } from '../_utils/socketio.service';
import { UserService } from '../_utils/user.service';
import { AuthService } from '../_utils/auth.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit, AfterContentChecked {
  chatForm: FormGroup;
  chatList: Array<any> = [];
  userUid;
  userDetails: any = {};
  loggedInUser: any = {};
  videoCall = false;
  userDetailsLoaded = false;
  public roomName: number;
  public showFromUserImage = false;
  public showToUserImage = false;
  public fromUseImage = '';
  public toUseImage = '';
  constructor(
    private formBuilder: FormBuilder,
    private socketIOService: SocketIOService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {
    this.chatForm = this.formBuilder.group({
      chatMessage: ['']
    });
  }

  ngOnInit() {
    this.authService.getUser().subscribe(
      (response) => {
        this.loggedInUser = response;
        if (this.loggedInUser.isDoctor && this.loggedInUser.doctorProfile.profileImage !== null){
          this.showFromUserImage = true;
          this.fromUseImage = `assets/uploads/${this.loggedInUser.doctorProfile.profileImage}`;
        }else{
          this.showFromUserImage = false;
        }
        this.route.params.subscribe(params => {
          this.userUid = params.uid;
          this.getUserDetails();
        });
      },
      (error) => {}
    );
  }

  ngAfterContentChecked(){
    this.cdref.detectChanges();
  }

  getUserDetails(){
    this.userDetailsLoaded = false;
    this.userService.getUserDetails(this.userUid).subscribe(
      (response) => {
        this.userDetails = response;
        if(this.userDetails.isDoctor && this.userDetails.doctorProfile.profileImage !== null){
          this.showToUserImage = true;
          this.toUseImage = `assets/uploads/${this.userDetails.doctorProfile.profileImage}`;
        }else{
          this.showToUserImage = false;
        }
        this.getAllChats();
        this.userDetailsLoaded = true;
        this.getUsersSocketDetails();
      },
      (error) => {

      }
    );
  }

  getUsersSocketDetails(){
    const getAllConnectedClients = JSON.parse(localStorage.getItem('connectedClients'));
    getAllConnectedClients.map(client => {
      if (client.user.uid === this.userDetails.uid){
        this.userDetails.socketId = client.socketId;
      }
    });
    this.getAllCommunications();
  }

  getAllCommunications(){
    const getParams = {
      from: +this.loggedInUser.id,
      to: +this.userDetails.id
    };
    this.userService.getAllCommunications(getParams).subscribe(
      (response: any) => {
        this.chatList = response;
        if (this.chatList.length === 0){
          this.roomName = Math.ceil(Math.random() * 100000000);
        }else{
          this.roomName = this.chatList[0].roomName;
        }
        this.socketIOService.requestForJoiningRoom(
          {
            roomName: this.roomName,
            from: this.loggedInUser.id,
            to: this.userDetails.id,
            sender: this.socketIOService.socketId,
            reciever: this.userDetails.socketId
          }
        );
      },
      (error) => {

      }
    );
  }

  getAllChats(){
    this.socketIOService.getChats().subscribe(
      (chatData: any) => {
        this.chatList.push(chatData);
    });
  }

  sendMessage(e) {
    let message: string;
    const messageInfo = this.chatForm.value.chatMessage.split('\n');
    if(messageInfo.length > 0){
      message = messageInfo[0];
    }
    if (message !== ''){
      const messageData = {
        message,
        fromUserId: this.loggedInUser.id,
        toUserId: this.userDetails.id,
        sender: this.socketIOService.socketId,
        reciever: this.userDetails.socketId,
        roomName: this.roomName
      }
      this.socketIOService.sendChat(messageData);
      this.resizeTextArea(e);
      this.userService.saveCommunication(messageData).subscribe(
        (response) => {

        },
        (error) => {

        }
      );
      this.chatForm.patchValue({
        chatMessage: ''
      });
    }
  }

  resizeTextArea(e){
    if(e.keyCode === 13){
      e.target.style.height = 'auto';
    }else{
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
      e.target.style.maxHeight = '100px';
    }
  }

  startVideoCall(){
    this.router.navigate(['/video-call', this.userDetails.uid]);
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/video-call', this.userDetails.uid])
    // );

    // window.open(url, '', `scrollbars=yes,resizable=yes,left=0,width=${window.innerWidth},height=${window.innerHeight}`);
  }

}
