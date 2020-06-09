import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
  private socket;
  constructor(
    private authService: AuthService
  ) { }

  get socketId() {
    return this.socket.id;
  }

  public connect() {
    this.socket = io(`http://localhost:3000?token=${this.authService.getToken()}`);
  }

  public sendChat(chatInfo) {
    this.socket.emit('SendMessage', chatInfo);
  }

  public getChats = () => {
    return new Observable((observer) => {
      this.socket.on('GetMessages', (chatData) => {
        observer.next(chatData);
      });
    });
  }

  public getIncomingCalls = () => {
    return new Observable((observer) => {
      this.socket.on('BackOffer', (data) => {
        observer.next(data);
      });
    });
  }

  getAllConnectedClients = () => {
    return new Observable((observer) => {
      this.socket.on('AllActiveClients', (data) => {
        observer.next(data);
      });
    });
  }

  public listen(channel: string, fn) {
    this.socket.on(channel, fn);
  }

  private send(chanel: string, message) {
    this.socket.emit(chanel, message);
  }

  responseForJoiningRoom = () => {
    return new Observable((observer) => {
      this.socket.on('RoomJoinResponse', (data) => {
        observer.next(data);
      });
    });
  }

  requestForJoiningRoom(msg) {
    this.send('RoomJoinRequest', msg);
  }

  onRoomParticipants(fn: (participants: Array<string>) => void) {
    this.listen('RoomUsers', fn);
  }

  sendOfferSignal(data) {
    this.send('Offer', data);
  }

  sendAnswerSignal(data) {
    this.send('Answer', data);
  }

  getOnAnswer = () => {
    return new Observable((observer) => {
      this.socket.on('BackAnswer', (data) => {
        observer.next(data);
      });
    });
  }

  getOnOffer = () => {
    return new Observable((observer) => {
      this.socket.on('BackOffer', (data) => {
        observer.next(data);
      });
    });
  }

  disconnectCall(data){
    this.socket.emit('Disconnect', data);
  }

  onDisconnectCall(){
    return new Observable((observer) => {
      this.socket.on('OnDisconnect', (data) => {
        observer.next(data);
      });
    });
  }
}
