import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SystemConstants } from '../core/common/system.constants';
import { UrlConstants } from '../core/common/url.constants';
import { UtilityService } from '../core/services/utility.service';
import { LoggedInUser } from '../core/domain/loggedin.user';
import { AuthenService } from '../core/services/authen.service';

declare var $ : any; //khai bao jquery

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

//co add them ham so so voi ban dau

export class MainComponent implements OnInit, AfterViewInit {
  public user: LoggedInUser;

  constructor(private utilityService: UtilityService, private authenService: AuthenService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
    console.log(this.user);
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this.utilityService.navigate(UrlConstants.LOGIN);
  }

  gotoHome() {
    this.utilityService.navigate(UrlConstants.HOME);
  }
  //fix loi khong the toogle menu
  ngAfterViewInit() {
    setTimeout(_ => {
      $.getScript("assets/js/jquery.app.js", function () {
        //do some things  
      });
    });

  }

}
