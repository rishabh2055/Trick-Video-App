import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../_helpers/validators';
import { UserService } from '../_utils/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  isSuccess = false;
  showSuccessErrorDetails = false;
  serverMessageInfo: object = {};
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100), Validators.minLength(2)]],
      mobileNo: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      isDoctor: ['', Validators.required],
      clinicName: [''],
      registrationNo: [''],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    this.setDoctorFieldValidators();
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  setDoctorFieldValidators(){
    const clinicName = this.registerForm.get('clinicName');
    const registrationNo = this.registerForm.get('registrationNo');
    this.registerForm.get('isDoctor').valueChanges.subscribe(
      isDoc => {
        if (isDoc === 'Yes'){
          clinicName.setValidators([Validators.required, Validators.maxLength(100), Validators.minLength(2)]);
          registrationNo.setValidators([Validators.required, Validators.maxLength(100), Validators.minLength(6)]);
        }
      }
    );
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.registerNewUser(this.registerForm.value).subscribe(
      (response: any) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = true;
        response.message = 'Registered successfully. Go to login page.';
        this.serverMessageInfo = response;
      }, (error) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = false;
        this.serverMessageInfo = error.error;
      }
    );
  }

}
