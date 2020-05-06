import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../_utils/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  isSuccess = false;
  showSuccessErrorDetails = false;
  serverMessageInfo: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private authervice: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.authervice.authenticate(this.loginForm.value).subscribe(
      (response) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = true;
        this.serverMessageInfo = response;
        this.authervice.saveToken(this.serverMessageInfo.accessToken);
        this.authervice.saveUser(this.serverMessageInfo.user);
        this.router.navigate(['/dashboard']);
      }, (error) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = false;
        this.serverMessageInfo = error.error;
      }
    );
  }
}
