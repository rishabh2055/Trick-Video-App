import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick

import { AppointmentComponent } from '../shared/appointment/appointment.component';
import { AuthService } from '../_utils/auth.service';
import { UserService } from '../_utils/user.service';
import { AppointmentService } from '../_utils/appointment.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
  @ViewChild(AppointmentComponent) appointment: AppointmentComponent;

  isSuccess = false;
  showSuccessErrorDetails = false;
  serverMessageInfo: object = {};
  userDetails: any = {};
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  showCalendar = false;
  calendarEvents: EventInput[] = [];
  appointmentDetails = {};
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private apptService: AppointmentService
  ){}

  ngOnInit(): void{
    const getLoggedINUser = this.authService.getUser();

    this.userService.getUserDetails(getLoggedINUser.uid).subscribe(
      (response) => {
        this.userDetails = response;
      },
      (error) => {

      }
    );
    if(getLoggedINUser.isDoctor){
      this.getAllAppointments();
    }
  }

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

  getAllAppointments(){
    this.showCalendar = false;
    this.calendarEvents = [];
    this.apptService.getAllAppointments().subscribe(
      (response: any) => {
        if (response.appointments.all.length > 0){
          const appointments = response.appointments;
          this.getAllAppointmentDates(appointments);
        }
        this.showCalendar = true;
      },
      (error) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = false;
        this.serverMessageInfo = error.error;
        this.showCalendar = true;
      }
    );
  }

  getAllAppointmentDates(appointments){
    const allAppointments: any = [];
    if(appointments.all.length > 0){
      appointments.all.map(apptDetails => {
        const startDate = moment(apptDetails.fromDate);
        const endDate = moment(apptDetails.toDate);
        const now = startDate;
        while (now.isBefore(endDate) || now.isSame(endDate)) {
          allAppointments.push({
            title: apptDetails.title,
            description: apptDetails.description,
            fromDate: `${now.format('YYYY-MM-DD')}`,
            fromTime: apptDetails.fromTime,
            toDate: `${now.format('YYYY-MM-DD')}`,
            toTime: apptDetails.toTime,
          });
          now.add(1, 'days');
        }
      });

      allAppointments.forEach(apptDetails => {
        if (appointments.deleted.length > 0){
          appointments.deleted.map(deleted => {
            if(apptDetails !== null){
              if (deleted.fromDate === apptDetails.fromDate && deleted.toDate === apptDetails.toDate){
                if (deleted.fromTime === apptDetails.fromTime && deleted.toTime === apptDetails.toTime){
                  apptDetails = null;
                }
              }
            }
          });
        }
        if(apptDetails !== null){
          this.calendarEvents.push({
            title: apptDetails.title,
            description: apptDetails.description,
            start: `${apptDetails.fromDate}T${apptDetails.fromTime}`,
            end: `${apptDetails.toDate}T${apptDetails.toTime}`,
            color: '#26a69a'
          });
        }
      });
    }
  }

  handleEventClick(info){
    const startDateObj = moment(info.event.start);
    const endDateObj = moment(info.event.end);
    this.appointmentDetails = {
      title: info.event.title,
      description: info.event.extendedProps.description,
      fromDate: startDateObj.format('YYYY-MM-DD'),
      fromTime: startDateObj.format('HH:mm'),
      toDate: endDateObj.format('YYYY-MM-DD'),
      toTime: endDateObj.format('HH:mm'),
    }
    this.appointment.openModal(this.appointmentDetails);
  }

}
