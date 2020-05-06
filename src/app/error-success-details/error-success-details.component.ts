import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-success-details',
  templateUrl: './error-success-details.component.html',
  styleUrls: ['./error-success-details.component.css']
})
export class ErrorSuccessDetailsComponent implements OnInit {
  @Input() public isSuccess: boolean;
  @Input() public serverMessageInfo: object;
  constructor() { }

  ngOnInit(): void {

  }

}
