import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import $ from 'jquery';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import {  FileUploader, FileItem } from 'ng2-file-upload';
import csc from 'country-state-city';
// Import Interfaces`
import { IState, ICity } from 'country-state-city';
import { DoctorService } from '../_utils/doctor.service';
import { AuthService } from '../_utils/auth.service';
import { UserService } from '../_utils/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('multiSelect', { static: true }) multiSelect;
  @ViewChild('fileInput', { static: true }) fileInput;
  @ViewChild('city', { static: true }) city;
  @ViewChild(ImageUploaderComponent) imgUploadCmp: ImageUploaderComponent;
  public uploader: FileUploader = new FileUploader({ url: '/api/user/upload', itemAlias: 'file', authToken: this.authService.getToken() });
  public showSuccessErrorDetails = false;
  public isSuccess = false;
  public serverMessageInfo = {};
  public allDepartments: Array<string> = [];
  public profileForm: FormGroup;
  public submitted = false;
  public userDetails: any = {};
  public userImageSRC: SafeUrl = '';
  public showProfileImg = false;
  public stateList: IState[] = csc.getStatesOfCountry('101');
  public cityList: ICity[];
  public statesObj = {};
  public citiesObj = {'': null};
  public cityInstance;
  public stateInstance;
  constructor(
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private authService: AuthService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getStatesObject();
    this.uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false;
      this.userImageSRC  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
 };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('FileUpload:uploaded successfully:', item, status, response);
    };
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      clinicName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      mobileNo: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      profileImage: [''],
      aadharNo: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      regNo: ['', [Validators.required, Validators.minLength(6)]],
      consultationFee: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      department: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      specialization: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(500)]],
      experience: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(500)]],
      qualification: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(500)]],
      address: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(500)]],
      aboutYourself: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(1000)]]
    });
    this.getAllDoctorsDepartment();
  }

  imageCropped(image){
    const formData = new FormData();
    formData.append('upload', this.b64toBlob(image), 'image.jpg');
    formData.append('path', 'temp/');
    this.userService.uploadImage(formData).subscribe(
      (response: any) => {
        this.userImageSRC  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(this.b64toBlob(image))));
      },
      (error) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = false;
        this.serverMessageInfo = error.error;
      }
    );
  }

  b64toBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  getAllDoctorsDepartment(){
    this.doctorService.getAllDoctorsDepartment().subscribe(
      (response: any) => {
        this.allDepartments = response;
        this.getUserDetails();
      },
      (error) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = false;
        this.serverMessageInfo = error.error;
      }
    );
  }

  getUserDetails(){
    const getLoggedINUser = this.authService.getUser();

    this.userService.getUserDetails(getLoggedINUser.uid).subscribe(
      (response: any) => {
        this.userDetails = response;
        if (this.userDetails.doctorProfile && this.userDetails.doctorProfile.id){
          if(this.userDetails.doctorProfile.profileImage === null){
            this.userImageSRC = `assets/uploads/no-image.jpg`;
          }else{
            this.userImageSRC = `assets/uploads/${this.userDetails.doctorProfile.profileImage}`;
          }
          this.profileForm.patchValue({
            firstName: this.userDetails.firstName,
            lastName: this.userDetails.lastName,
            clinicName: this.userDetails.doctorProfile.clinicName,
            regNo: (this.userDetails.doctorProfile.registrationNo === null) ? '' : this.userDetails.doctorProfile.registrationNo,
            aadharNo: (this.userDetails.doctorProfile.aadharNo === null) ? '' : this.userDetails.doctorProfile.aadharNo,
            consultationFee: (this.userDetails.doctorProfile.consultationFee === null) ? '' :
            this.userDetails.doctorProfile.consultationFee,
            specialization: (this.userDetails.doctorProfile.specialization === null) ? '' : this.userDetails.doctorProfile.specialization,
            experience: (this.userDetails.doctorProfile.experience === null) ? '' : this.userDetails.doctorProfile.experience,
            qualification: (this.userDetails.doctorProfile.qualification === null) ? '' : this.userDetails.doctorProfile.qualification,
            address: (this.userDetails.doctorProfile.address === null) ? '' : this.userDetails.doctorProfile.address,
            mobileNo: this.userDetails.mobileNo,
            email: this.userDetails.email,
            department: (this.userDetails.doctorProfile.departmentIds === null) ? '' :
            JSON.parse(this.userDetails.doctorProfile.departmentIds)
         });
        }
      },
      (error) => {

      }
    );
  }

  getStatesObject(){
    this.stateList.map(state => {
      this.statesObj[state.name] = null;
    });

    this.stateInstance = {
      data: this.statesObj,
      onAutocomplete: (cv) => {
        // Get state Id
        let stateId;
        this.stateList.map(state => {
          if (state.name === this.f.state.value){
            stateId = state.id;
          }
        });
        this.cityList = csc.getCitiesOfState(stateId);
        this.cityList.map(city => {
          if (city.name.toLowerCase().indexOf('allahabad') > -1){
            const cityStr: string = city.name.replace(/allahabad/gi, 'Prayagraj');
            city.name = cityStr;
          }
          this.citiesObj[city.name] = null;
        });
        this.cityInstance.data = this.citiesObj;
      },
    };
    this.cityInstance = {
      data: this.citiesObj,
      onAutocomplete: (cv) => {
        console.log(cv);
      },
    };
  }

  chooseImage(){
    document.getElementById('fileInput').click();
  }

  fileChangeEvent(event){
    this.imgUploadCmp.openModal(event);
  }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }
    this.doctorService.updateDoctorProfile(this.profileForm.value, this.authService.getUser().uid).subscribe(
      (response: any) => {
        this.getUserDetails();
        this.showSuccessErrorDetails = true;
        this.isSuccess = true;
        this.serverMessageInfo = response;
        this.submitted = false;
      }, (error) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = false;
        this.serverMessageInfo = error.error;
      }
    );
  }

}
