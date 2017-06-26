import { Component, OnInit } from '@angular/core';
import {LoggedInUser} from '../../core/domain/loggedin.user';
import {AuthenService} from '../../core/services/authen.service';
import { SystemConstants } from '../../core/common/system.constants';
import { UtilityService } from '../../core/services/utility.service';
import { UrlConstants } from '../../core/common/url.constants';
@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  public user : LoggedInUser;
  public baseFolder : string = SystemConstants.BASE_API;

  constructor(private _authenService: AuthenService,private _utilityService: UtilityService) { }

  ngOnInit() {
    this.user = this._authenService.getLoggedInUser();
  }

  gotoHome() {
    this._utilityService.navigate(UrlConstants.HOME);
  }

}