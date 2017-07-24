//https://techmaster.vn/posts/33959/khai-niem-ve-json-web-token

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';
import { SystemConstants } from './../common/system.constants';
import { AuthenService } from './authen.service';
import { NotificationService } from './notification.service';
import { UtilityService } from './utility.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { MessageContstants } from './../common/message.constants';

@Injectable()
export class DataService {
  private headers: Headers;
  constructor(private _http: Http, private _router: Router, private _authenService: AuthenService,
    private _notificationService: NotificationService, private _utilityService: UtilityService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  get(uri: string) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer " + this._authenService.getLoggedInUser().access_token);
    return this._http.get(SystemConstants.BASE_API + uri, { headers: this.headers }).map(this.extractData);
  }

  post(uri: string, data?: any) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer " + this._authenService.getLoggedInUser().access_token);
    return this._http.post(SystemConstants.BASE_API + uri, data, { headers: this.headers }).map(this.extractData);
  }
  put(uri: string, data?: any) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer " + this._authenService.getLoggedInUser().access_token);
    return this._http.put(SystemConstants.BASE_API + uri, data, { headers: this.headers }).map(this.extractData);
  }
  delete(uri: string, key: string, id: string) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", "Bearer " + this._authenService.getLoggedInUser().access_token);
    return this._http.delete(SystemConstants.BASE_API + uri + "/?" + key + "=" + id, { headers: this.headers })
      .map(this.extractData);
  }
  postFile(uri: string, data?: any) {
    let newHeader = new Headers();
    newHeader.append("Authorization", "Bearer " + this._authenService.getLoggedInUser().access_token);
    return this._http.post(SystemConstants.BASE_API + uri, data, { headers: newHeader })
      .map(this.extractData);
  }

  getPdfFile(uri: string) {
    let newHeader = new Headers();
    newHeader.append("Authorization", "Bearer " + this._authenService.getLoggedInUser().access_token);
    newHeader.append('Content-Type', 'application/json');
    newHeader.append('Accept', 'application/pdf');

    let options = new RequestOptions({ headers: newHeader });
    options.responseType = ResponseContentType.Blob;
    //options.responseType = ResponseContentType.ArrayBuffer;
    return this._http.get(SystemConstants.BASE_API + uri,   options)
      .map((res) => {
            return new Blob([res.blob()], { type: 'application/pdf' })
            //return new Blob([res.arrayBuffer()], { type: 'application/pdf' })
            //return new Blob([(<any>res)._body], { type: 'application/pdf' })
            //return new Blob([(<any>res.blob)], { type: 'application/pdf' })
        });
  }

  /**
   * Thực hiện get nhiều data từ web api  
   */
  getMulti(uri: string[]) {

    let observableBatch = [];
    uri.forEach(element => {
      this.headers.delete("Authorization");
      this.headers.append("Authorization", "Bearer " + this._authenService.getLoggedInUser().access_token);
      observableBatch.push(this._http.get(SystemConstants.BASE_API + element, { headers: this.headers }).map(this.extractData));

    });

    return Observable.forkJoin(observableBatch);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  public handleError(error: any) {
    if (error.status == 401) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this._notificationService.printErrorMessage(MessageContstants.LOGIN_AGAIN_MSG);
      this._utilityService.navigateToLogin();
    }
    else {
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Lỗi hệ thống';
      this._notificationService.printErrorMessage(errMsg);

      return Observable.throw(errMsg);
    }

  }
}