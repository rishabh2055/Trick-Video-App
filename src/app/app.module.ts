import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterializeModule } from 'angular2-materialize';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AuthInterceptor } from './_helpers/auth.interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './home/home.component';
import { ErrorSuccessDetailsComponent } from './error-success-details/error-success-details.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CommunicationComponent } from './communication/communication.component';
import { AppointmentComponent } from './shared/appointment/appointment.component';
import { ProfileComponent } from './profile/profile.component';
import { VideoCallComponent } from './shared/video-call/video-call.component';
import { IncomingCallComponent } from './shared/incoming-call/incoming-call.component';
import { VideoCallDirective } from './_helpers/video-call.directive';
import { ImageUploaderComponent } from './profile/image-uploader/image-uploader.component';

//import { ShowHideSidemenuDirective } from './_helpers/show-hide-sidemenu.directive';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    HomeComponent,
    ErrorSuccessDetailsComponent,
    SidebarComponent,
    CommunicationComponent,
    AppointmentComponent,
    ProfileComponent,
    VideoCallComponent,
    IncomingCallComponent,
    VideoCallDirective,
    ImageUploaderComponent,
   // ShowHideSidemenuDirective
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    PerfectScrollbarModule,
    FullCalendarModule,
    FileUploadModule,
    ImageCropperModule
  ],
  exports: [
    ErrorSuccessDetailsComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
