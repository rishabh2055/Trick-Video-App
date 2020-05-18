import { Component, OnInit } from '@angular/core';
import { SocketIOService } from './_utils/socketio.service';
import { AuthService } from './_utils/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'trick-video-app';
  constructor(
    private socketService: SocketIOService,
    private authService: AuthService
  ) { }

  ngOnInit(){
    this.checkIncomingCalls();
  }

  checkIncomingCalls(){
    this.socketService.connect();
    this.socketService.listen('connect', () => {
      console.log(`My socket id is : ${this.socketService.socketId}`);
    });

    this.socketService.getAllConnectedClients(participants => {
      console.log(participants);
    });

    this.socketService.getIncomingCalls().subscribe(
      (callData: any) => {
        console.log(callData);
    });
  }
}
