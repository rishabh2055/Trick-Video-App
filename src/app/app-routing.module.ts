import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { AuthGuardService } from './_helpers/auth-guard.service';


const routes: Routes = [
  {path: '' , pathMatch: 'full' , component: HomeComponent},
  {path: 'dashboard' , component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'login' , component: LoginComponent},
  {path: 'signup' , component: SignupComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
