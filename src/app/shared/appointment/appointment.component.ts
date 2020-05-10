import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const moment = require('moment');

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
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
  constructor(
    private formBuilder: FormBuilder
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

  openModal(dateObj: any) {
    this.apptForm.patchValue({
      apptTitle: '',
      apptDescription: '',
      fromDate: '',
      fromTIme: '',
      toDate: '',
      toTime: ''
    });
    this.modalActions.emit({action : 'modal', params : ['open']});
    const getSelectedDateObj = moment(dateObj.date);
    this.apptForm.patchValue({
      fromDate: getSelectedDateObj.format('YYYY-MM-DD'),
      toDate: getSelectedDateObj.format('YYYY-MM-DD'),
      fromTime: getSelectedDateObj.format('HH:mm') === '00:00' ? '' : getSelectedDateObj.format('HH:mm'),
      toTime: getSelectedDateObj.format('HH:mm') === '00:00' ? '' : getSelectedDateObj.format('HH:mm'),
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
  }

}
