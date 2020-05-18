import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SignalData } from 'simple-peer';

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
    this.socket.emit('chat-info', chatInfo);
  }

  public getChats = () => {
    return new Observable((observer) => {
      this.socket.on('chat-data', (chatData) => {
        observer.next(chatData);
      });
    });
  }

  public getIncomingCalls = () => {
    return new Observable((observer) => {
      this.socket.on('call_made', (data) => {
        observer.next(data);
      });
    });
  }

  getAllConnectedClients(fn: (participants: Array<string>) => void) {
    this.listen('all_clients', fn);
  }

  public listen(channel: string, fn) {
    this.socket.on(channel, fn);
  }

  private send(chanel: string, message) {
    this.socket.emit(chanel, message);
  }

  requestForJoiningRoom(msg) {
    this.send('room_join_request', msg);
  }

  onRoomParticipants(fn: (participants: Array<string>) => void) {
    this.listen('room_users', fn);
  }

  sendOfferSignal(data) {
    this.send('call_user', data);
  }

  sendAnswerSignal(msg) {
    this.send('answer_signal', msg);
  }

  onAnswer(fn: (msg) => void) {
    this.listen('answer', fn);
  }

  onRoomLeft(fn: (socketId: string) => void) {
    this.listen('room_left', fn);
  }
}
