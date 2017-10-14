import { Component, OnInit, Input, OnDestroy, ViewChild, enableProdMode, ViewContainerRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
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
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile } from 'ng2-file-drop';
import { UploadService } from '../../core/services/upload.service';
import { MasterKbnEnum, ApprovedStatusEnum, DataStatusEnum } from '../../core/common/shared.enum';
import { DomSanitizer } from '@angular/platform-browser';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { element } from 'protractor';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterKeyword: string = '';
  public jobs: any[];
  public checkedItems: any[];
  public emps: any[];
  public user: LoggedInUser;
  public sub: any;
  public paramId: any;
  public paramAction: any;
  public primeModelCustomers: any[];
  public searchModelParam: any = {};
  public searchModel: any = {};
  public approvedStatus = ApprovedStatusEnum;
  public dataStatus = DataStatusEnum;
  public jobStatus: any[];
  
  // Settings configuration
  //https://github.com/softsimon/angular-2-dropdown-multiselect
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    showCheckAll: true,
    showUncheckAll: true,
    displayAllSelectedText: true
  };

  // Text configuration
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };
  /* tslint:disable:no-unused-variable */
  // Supported image types
  public supportedFileTypes: string[] = ['image/png', 'image/jpeg', 'image/gif'];
  /* tslint:enable:no-unused-variable */

  private currentProfileImage: string = SystemConstants.BASE_WEB + '/assets/images/profile-default.png';
  private imgJobLeave: string = SystemConstants.BASE_WEB + '/assets/images/IsJobLeave2.png';

  public uriAvatarPath: string = SystemConstants.BASE_API;
  public imageShown: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _uploadService: UploadService,
    public _authenService: AuthenService,
    private viewContainerRef: ViewContainerRef,
    private zone: NgZone,
    private _loaderService: LoaderService,
    //    private _renderer: Renderer,
    private _sanitizer: DomSanitizer
  ) {

    /*if(_authenService.checkAccess('JOB_SCHEDULER')==false){
        _utilityService.navigateToLogin();
    }*/

  }

  ngOnInit() {
    //get thong tin nguoi login
    this.user = this._authenService.getLoggedInUser();
    //get params
    this.sub = this._route
      .params
      .subscribe(params => {
        this.paramId = params['id'];
        this.paramAction = params['action'];
      });

    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/DD");

    //get data chung
    this.loadMultiTableCallBack();

    if (this.paramId) {
      //hien thi init
      //this.filterCustomerID = [this.paramId];
      this.search();
    }


  }

  ngOnDestroy() {

  }

  /**
   * Load các dữ liệu master
   */
  loadMultiTable() {
    let uri = [];
    uri.push('/api/emp/getall');

    return this._dataService.getMulti(uri);
  }

  loadMultiTableCallBack() {
    this._loaderService.displayLoader(true);
    this.loadMultiTable()
      .subscribe((response: any) => {
        this.emps = response[0];                     //staff

        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  public search() {
    this.searchModel.Keyword = this.filterKeyword;
    //this.searchModel.DateTimeItems = this.revenueSelectedYearMonths;
    //this.searchModel.StringItems = this.filterCustomerID;
    this.searchModel.Page = this.pageIndex;
    this.searchModel.PageSize = this.pageSize;
    //this.searchModel.BoolItems = [this.nextMonthInclude];
    this._loaderService.displayLoader(true);
    //this._dataService.get('/api/estimate/getallpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&keyword=' + this.filterKeyword + '&filterRecruitmentID=' + this.filterRecruitmentID)
    this._dataService.post('/api/jobscheduler/getallpaging', JSON.stringify(this.searchModel))
      .subscribe((response: any) => {
        this.jobs = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;

        this._loaderService.displayLoader(false);
      }, error => this._dataService.handleError(error));
  }
  
  public reset() {
    this.filterKeyword = '';
    //this.filterCustomerID = null;
    this.search();
  }

  loadDetail(id: any) {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/jobscheduler/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this._loaderService.displayLoader(false);

      }, error => this._dataService.handleError(error));
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }

  deleteItem(id: any) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => this.deleteItemConfirm(id));
  }
  deleteItemConfirm(id: any) {
    this._dataService.delete('/api/jobscheduler/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.search();
    }, error => this._dataService.handleError(error));
  }

  public deleteMulti() {
    this.checkedItems = this.jobs.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; ++i)
      checkedIds.push(this.checkedItems[i]["ID"]);

    if (checkedIds.length > 0) {
      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
        this._dataService.delete('/api/jobscheduler/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
          this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
          this.search();
        }, error => this._dataService.handleError(error));
      });
    }

  }

  public runJob() {
    this.checkedItems = this.jobs.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; ++i)
      checkedIds.push(this.checkedItems[i]["ID"]);

    if (checkedIds.length > 0) {
      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_RUN_JOB_MSG, () => {
        this.searchModel.NumerItems = checkedIds;
        this._loaderService.displayLoader(true);
        this._dataService.post('/api/jobscheduler/runjob', JSON.stringify(this.searchModel))
          .subscribe((response: any) => {
            this.search();
            this._loaderService.displayLoader(false);
          }, error => this._dataService.handleError(error));

      });
    }

  }


  public selectedInterviewDate(value: any) {
    //this.entity.InterviewDate = moment(value).format('YYYY/MM/DD HH:mm');
  }

  
  public changeCheckboxIsFinished(event: any) {

  }

  public onChange(event: any) {

  }

  public onChangeCustomer(event: any) {
    //this.search();

  }


}
