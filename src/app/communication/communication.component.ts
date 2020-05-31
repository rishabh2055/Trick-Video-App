import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import {PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { SocketIOService } from '../_utils/socketio.service';
import { UserService } from '../_utils/user.service';
import { AuthService } from '../_utils/auth.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit, AfterViewInit {
  @ViewChild(PerfectScrollbarComponent) scrollbar?: PerfectScrollbarComponent;
  chatForm: FormGroup;
  chatList: string[] = [];
  userUid;
  userDetails: any = {};
  loggedInUser: any = {};
  videoCall = false;
  userDetailsLoaded = false;
  constructor(
    private formBuilder: FormBuilder,
    private socketIOService: SocketIOService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loggedInUser = this.authService.getUser();
    this.route.params.subscribe(params => {
      this.userUid = params.uid;
      this.getUserDetails();
    });
    this.chatForm = this.formBuilder.group({
      chatMessage: ['']
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollbar.directiveRef.scrollToBottom(0, 10);
    } catch (err) { }
  }

  getUserDetails(){
    this.userDetailsLoaded = false;
    this.userService.getUserDetails(this.userUid).subscribe(
      (response) => {
        this.userDetails = response;
        this.getAllChats();
        this.scrollToBottom();
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
  }

  getAllChats(){
    this.socketIOService.getChats().subscribe(
      (chatData: any) => {
        this.chatList.push(chatData);
        console.log(this.chatList);
    });
  }

  sendMessage() {
    let message: string;
    const messageInfo = this.chatForm.value.chatMessage.split('\n');
    if(messageInfo.length > 0){
      message = messageInfo[0];
    }
    if (message !== ''){
      this.socketIOService.sendChat({
        message,
        from: this.loggedInUser.id,
        to: this.userDetails.id,
        sender: this.socketIOService.socketId,
        reciever: this.userDetails.socketId
      });
      this.chatForm.patchValue({
        chatMessage: ''
      });
    }
  }

  resizeTextArea(e){
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
    e.target.style.maxHeight = '100px';
  }

  startVideoCall(){
    this.router.navigate(['/video-call', this.userDetails.uid]);
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/video-call', this.userDetails.uid])
    // );

    // window.open(url, '', `scrollbars=yes,resizable=yes,left=0,width=${window.innerWidth},height=${window.innerHeight}`);
  }

}
