import { Component, OnInit, Input, OnDestroy, ViewChild, enableProdMode } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
//import { IEmpBasicDetails, IEmpBasic } from '../../core/interfaces/interfaces';
import { ItemsService } from '../../shared/utils/items.service';
import { MappingService } from '../../shared/utils/mapping.service';
import { MessageContstants } from '../../core/common/message.constants';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DateRangePickerConfig, SystemConstants } from '../../core/common/system.constants';
import { Observable } from 'rxjs/Observable';
import { NumberHelper } from '../../shared/utils/number-helper';
import { routes } from '../../login/login.module';
import { DateTimeHelper } from '../../shared/utils/datetime-helper';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { LoaderService } from '../../shared/utils/spinner.service';
import { ModalDirective } from 'ngx-bootstrap';
import { SearchModalComponent } from '../../shared/search-modal/search-modal.component';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile } from 'ng2-file-drop';
import { UploadService } from '../../core/services/upload.service';
import { MasterKbnEnum } from '../../core/common/shared.enum';
import { BloodGroup } from '../../core/common/shared.class';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-emp-timeline',
  templateUrl: './emp-timeline.component.html',
  styleUrls: ['./emp-timeline.component.css']
})
export class EmpTimelineComponent implements OnInit {

    public apiHost: string;
    public id: number;
    public entity: any;
    public statuses: string[];
    public types: string[];
    private sub: any;
    public empDetailWorks: any[];
    public entityDetailWork : any;
    public actionParam: any;
    public idParam: any;
    public user: LoggedInUser;
    public uriApi: string = SystemConstants.BASE_API;
    public avatar : string ;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _itemsService: ItemsService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _mappingService: MappingService,
    private _authenService: AuthenService,
    private _loaderService: LoaderService,
    private _uploadService: UploadService,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.entity = {};
    this.entityDetailWork = {};
    this.user = this._authenService.getLoggedInUser();
    //load master data va thuc thi cac xu ly load data chi tiet
    //this.loadMultiTableCallBack();

    //load auto comple
    //this.loadAutoCompleteDataByCustomer();
    //get params
    this.sub = this._route
      .params
      .subscribe(params => {
        this.id = +params['id'] || 0;
        this.actionParam = params['action'];
        this.loadDetailWorkData(this.id);
      });

    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/DD");
    // (+) converts string 'id' to a number
    this.id = +this._route.snapshot.params['id'];
    //this.apiHost = this.configService.getApiHost();

  }

  loadDetailWorkData(id : any) {
    this._dataService.get('/api/empdetailwork/gettimelinebyemp?&emp=' + id)
      .subscribe((response: any) => {
        this.empDetailWorks = response;
        if(this.empDetailWorks && this.empDetailWorks.length>0){
            this.avatar = this.empDetailWorks[0].Avatar;
        }else{
            
        }
        

      }, error => this._dataService.handleError(error));
  }

}