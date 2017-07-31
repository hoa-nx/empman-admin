import { Component, OnInit, NgZone } from '@angular/core';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { AuthenService } from '../../core/services/authen.service';
import { SystemConstants } from '../../core/common/system.constants';
import { UtilityService } from '../../core/services/utility.service';
import { UrlConstants } from '../../core/common/url.constants';
import { DataService } from '../../core/services/data.service';
@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  public user: LoggedInUser;
  public baseFolder: string = SystemConstants.BASE_API;

  constructor(private _authenService: AuthenService, 
              private _utilityService: UtilityService,
              private _dataService: DataService,
              private _ngZone: NgZone) { }

  ngOnInit() {
    this.user = this._authenService.getLoggedInUser();
  }

  gotoHome() {
    this._utilityService.navigate(UrlConstants.HOME);
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this._utilityService.navigate(UrlConstants.LOGIN);
  }

}