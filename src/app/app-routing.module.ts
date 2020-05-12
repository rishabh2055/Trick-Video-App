import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommunicationComponent } from './communication/communication.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';

import { AuthGuardService } from './_helpers/auth-guard.service';
import { LoggedOutGuardSevice } from './_helpers/logged-out.guard.service';


const routes: Routes = [
  {path: '' , pathMatch: 'full' , component: HomeComponent, canActivate: [LoggedOutGuardSevice]},
  {path: 'login' , component: LoginComponent, canActivate: [LoggedOutGuardSevice]},
  {path: 'signup' , component: SignupComponent, canActivate: [LoggedOutGuardSevice]},
  {path: 'dashboard' , component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'communication' , component: CommunicationComponent, canActivate: [AuthGuardService]},
  {path: 'profile' , component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
