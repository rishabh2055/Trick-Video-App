import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

import { AppointmentComponent } from '../shared/appointment/appointment.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
  @ViewChild(AppointmentComponent) appointment: AppointmentComponent;

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [
    { title: 'Appointment with Rishabh Chitranshi', start:  '2020-05-09T14:30:00', end:  '2020-05-09T15:00:00', color: '#ef5350'},
    { title: 'Appointment 2', start:  '2020-05-09T15:30:00', end:  '2020-05-09T16:00:00', color: '#26a69a'},
    { title: 'Appointment 1', start:  '2020-05-09T17:30:00', end:  '2020-05-09T18:00:00', color: '#ef5350'},
    { title: 'Appointment 1', start:  '2020-05-09T18:30:00', end:  '2020-05-09T19:00:00', color: '#ef5350'},
    { title: 'Appointment 2', start:  '2020-05-09T19:30:00', end:  '2020-05-09T20:00:00', color: '#26a69a'},
    { title: 'Appointment 1', start:  '2020-05-09T20:30:00', end:  '2020-05-09T20:00:00', color: '#ef5350'},
    { title: 'Appointment with Rishabh Chitranshi', start:  '2020-05-11T14:30:00', end:  '2020-05-11T15:00:00', color: '#ef5350'},
    { title: 'Appointment 1', start:  '2020-05-11T16:30:00', end:  '2020-05-11T17:00:00', color: '#26a69a'},
    { title: 'Appointment 2', start:  '2020-05-11T17:30:00', end:  '2020-05-11T18:00:00', color: '#ef5350'}
  ];

  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }

  handleDateClick(arg) {
    this.appointment.openModal(arg);
  }

}
