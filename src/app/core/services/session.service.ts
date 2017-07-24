import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { SystemConstants } from '../../core/common/system.constants';
import { LoggedInUser } from '../domain/loggedin.user';
import 'rxjs/add/operator/map';
import { JsHelperService } from '../../shared/utils/js-helper';

@Injectable()
export class SessionService {

  constructor() { }

  setByKey(key : string , data : any){
    //delete truoc khi add
    this.removeByKey(key);

    /*var str = "";
    str = JsHelperService.recursiveObjStr(data, str);
    str = str.substring(0, str.length-1);*/
    
    localStorage.setItem(key, JSON.stringify(data));

  }

  getByKey(key : string) {
    var data = JSON.parse(localStorage.getItem(key));
    return data;
  }

  removeByKey(key : string) {
    localStorage.removeItem(key);
  }

  setSimpleByKey(key : string , data : any){
    //delete truoc khi add
    this.removeByKey(key);
    localStorage.setItem(key, data);

  }

  getSimpleByKey(key : string) {
    var data = localStorage.getItem(key);
    return data;
  }

}