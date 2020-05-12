import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppointmentService } from '../../_utils/appointment.service';

import * as moment from 'moment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  @Output() getAppointments = new EventEmitter();
  modalActions = new EventEmitter<string|MaterializeAction>();
  fromDateActions = new EventEmitter<string|MaterializeAction>();
  fromTimeActions = new EventEmitter<string|MaterializeAction>();
  toDateActions = new EventEmitter<string|MaterializeAction>();
  toTimeActions = new EventEmitter<string|MaterializeAction>();
  apptForm: FormGroup;
  submitted = false;
  isSuccess = false;
  showSuccessErrorDetails = false;
  serverMessageInfo: object = {};
  currentUser: any = {};
  deleteAppointment = false;
  constructor(
    private formBuilder: FormBuilder,
    private apptService: AppointmentService
    ) { }

  ngOnInit(): void {
    this.apptForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
      apptTitle: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      apptDescription: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(500)]],
    });
  }

  stopPropagation(event: Event){
    event.stopPropagation();
  }

  openModal(apptObj: any) {
    this.submitted = false;
    if(apptObj.title){
      this.deleteAppointment = true;
      this.apptForm.disable();
    }else{
      this.deleteAppointment = false;
      this.apptForm.enable();
    }
    this.modalActions.emit({action : 'modal', params : ['open']});
    this.apptForm.patchValue({
      fromDate: (apptObj.fromDate) ? apptObj.fromDate : moment(apptObj.date).format('YYYY-MM-DD'),
      toDate: (apptObj.toDate) ? apptObj.toDate : moment(apptObj.date).format('YYYY-MM-DD'),
      fromTime: (apptObj.fromTime) ? apptObj.fromTime : moment(apptObj.date).format('HH:mm') === '00:00' ? '' : moment(apptObj.date).format('HH:mm'),
      toTime: (apptObj.toTime) ? apptObj.toTime : moment(apptObj.date).format('HH:mm') === '00:00' ? '' : moment(apptObj.date).format('HH:mm'),
      apptTitle : (apptObj.title) ? apptObj.title : '',
      apptDescription : (apptObj.description) ? apptObj.description : ''
   });
  }

  closeModal() {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
  }

  // convenience getter for easy access to form fields
  get f() { return this.apptForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.apptForm.invalid) {
      return;
    }
    if (this.deleteAppointment){
      this.apptService.deleteAppointment(this.apptForm.value).subscribe(
        (response: any) => {
          this.closeModal();
          this.getAppointments.emit();
        }, (error) => {
          this.showSuccessErrorDetails = true;
          this.isSuccess = false;
          this.serverMessageInfo = error.error;
        }
      );
    }else{
      this.apptService.addNewAppointment(this.apptForm.value).subscribe(
        (response: any) => {
          this.closeModal();
          this.getAppointments.emit();
        }, (error) => {
          this.showSuccessErrorDetails = true;
          this.isSuccess = false;
          this.serverMessageInfo = error.error;
        }
      );
    }
  }

  onDelete(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.apptForm.invalid) {
      return;
    }
    this.apptService.addNewAppointment(this.apptForm.value).subscribe(
      (response: any) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = true;
        response.message = 'Appointment details added successfully.';
        this.serverMessageInfo = response;
        this.closeModal();
        this.getAppointments.emit();
      }, (error) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = false;
        this.serverMessageInfo = error.error;
      }
    );
  }

}
