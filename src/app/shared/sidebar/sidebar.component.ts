import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../_utils/auth.service';
import { CommonService } from '../../_utils/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  showSuccessErrorDetails = false;
  serverMessageInfo: object = {};
  isSuccess = false;
  userLists = [];
  clickedUser: any = {};
  userUid;
  loggedInUserDetails: any = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.loggedInUserDetails = this.authService.getUser();
    this.getAllUsers();
    this.route.params.subscribe(params => {
      this.userUid = params.uid;
   });
  }

  getAllUsers(){
    this.commonService.getAllUsers().subscribe(
      (response: any) => {
        // if (loggedInUserDetails.isDoctor){
        //   response.map(user => {
        //     if (!user.isDoctor){
        //       this.userLists.push(user);
        //     }
        //   });
        // }
        response.map(user => {
          this.userLists.push(user);
        });
      },
      (error) => {
        this.showSuccessErrorDetails = true;
        this.isSuccess = false;
        this.serverMessageInfo = error.error;
      }
    );
  }

  goToCommunication(user){
    this.router.navigate(['/communication', user.uid]);
  }

  doLogout(){
    this.authService.signout();
  }

}
