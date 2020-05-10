import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit, AfterViewInit {
  @ViewChild(PerfectScrollbarComponent) scrollbar?: PerfectScrollbarComponent;
  constructor() { }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollbar.directiveRef.scrollToBottom(0, 10);
    } catch (err) { }
  }

}
