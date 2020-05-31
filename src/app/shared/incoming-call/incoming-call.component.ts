import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.component.html',
  styleUrls: ['./incoming-call.component.css']
})
export class IncomingCallComponent implements OnInit {
  @Input() public calleeDetails: any;
  @Input() public callerDetails: any;
  @Output() answerCall = new EventEmitter();
  @Output() rejectCall = new EventEmitter();
  modalActions = new EventEmitter<string|MaterializeAction>();
  showModal = false;
  constructor() { }

  ngOnInit(): void {

  }

  stopPropagation(event: Event){
    event.stopPropagation();
  }

  openModal() {
    this.modalActions.emit({action : 'modal', params : ['open']});
  }

  closeModal() {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
  }

  handleAnswerCall(){
    this.answerCall.emit();
    this.closeModal();
  }

  handleRejectCall(){
    this.rejectCall.emit();
    this.closeModal();
  }

}
