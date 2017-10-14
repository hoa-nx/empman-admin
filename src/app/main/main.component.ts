import { Component, OnInit, AfterViewInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { SystemConstants } from '../core/common/system.constants';
import { UrlConstants } from '../core/common/url.constants';
import { UtilityService } from '../core/services/utility.service';
import { LoggedInUser } from '../core/domain/loggedin.user';
import { AuthenService } from '../core/services/authen.service';
import { LoaderService } from '../shared/utils/spinner.service';

declare var $: any; //khai bao jquery

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

//co add them ham so so voi ban dau

export class MainComponent implements OnInit, AfterViewInit, DoCheck {
  public user: LoggedInUser;
  showLoader: boolean;

  constructor(private utilityService: UtilityService,
    private authenService: AuthenService, private loaderService: LoaderService, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
    this.loaderService.loaderStatus.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this.utilityService.navigate(UrlConstants.LOGIN);
  }

  //https://github.com/angular/angular/issues/17572
  public ngDoCheck(): void {
    this.changeDetectorRef.detectChanges();
  }
  gotoHome() {
    this.utilityService.navigate(UrlConstants.HOME);
  }
  //fix loi khong the toogle menu
  ngAfterViewInit() {
    console.log("Main.component.ts ngAfterViewInit");

    setTimeout(_ => {
      $.getScript("../assets/js/jquery.app.js", function () {
        //do some things  
        //console.log('Main component ex script');
      });
    },2000); 

  }


}
