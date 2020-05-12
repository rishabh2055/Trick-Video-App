import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_utils/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  options = {
    menuWidth: 300, // Default is 240
    edge: 'left' // Choose the horizontal origin
  };
  isLoggedIn: any;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
   }

  ngOnInit(): void {
    this.authService.isLoggedInDetails.subscribe(
      isAuthorized => {
        this.isLoggedIn = isAuthorized;
      }
    );
  }

}
