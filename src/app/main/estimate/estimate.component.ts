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
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.css']
})
export class EstimateComponent  implements OnInit, OnDestroy {

  @ViewChild('fileUpload') public fileUpload: any;
  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterKeyword: string = '';
  public filterCustomerID: any[] = [];
  public estimates: any[];
  public checkedItems: any[];
  public emps: any[];
  public depts: any[];
  public teams: any[];
  public user: LoggedInUser;
  public sub: any;
  public paramId: any;
  public paramAction: any;
  public primeModelCustomers: any[];
  public searchModelParam: any = {};
  public searchModel: any = {};
  public approvedStatus = ApprovedStatusEnum;
  public dataStatus = DataStatusEnum;
  public estimateResults : any[];
  public customers : any[];

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

    /*if(_authenService.checkAccess('USER')==false){
        _utilityService.navigateToLogin();
    }*/

  }

  ngOnInit() {
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

    this.loadMultiTableCallBack();
    if (this.paramId) {
      //hien thi init
      this.filterCustomerID = [this.paramId];
      this.search();
    }

    this.getEmpCodeNameList();

 
  }

  ngOnDestroy() {

  }

  /**
   * Load các dữ liệu master
   */
  loadMultiTable() {
    let uri = [];
    uri.push('/api/masterdetail/getbykbn/29');
    uri.push('/api/customer/getall');
    uri.push('/api/dept/getall');
    uri.push('/api/team/getall');
    uri.push('/api/emp/getall');

    return this._dataService.getMulti(uri);
  }

  loadMultiTableCallBack() {
    this._loaderService.displayLoader(true);
    this.loadMultiTable()
      .subscribe((response: any) => {
        this.estimateResults = response[0];          //ket qua bao gia
        this.customers = response[1];                //KH
        this.depts = response[2];                    //dept
        this.teams = response[3];                    //team
        this.emps = response[4];                     //staff

        this.primeModelCustomers = MappingService.mapIdNameToPrimeMultiSelectModel(this.customers);

        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  public search() {
    this.searchModel.Keyword = this.filterKeyword;
    //this.searchModel.DateTimeItems = this.revenueSelectedYearMonths;
    this.searchModel.StringItems = this.filterCustomerID;
    this.searchModel.Page = this.pageIndex;
    this.searchModel.PageSize = this.pageSize;
    //this.searchModel.BoolItems = [this.nextMonthInclude];
    this._loaderService.displayLoader(true);
    //this._dataService.get('/api/estimate/getallpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&keyword=' + this.filterKeyword + '&filterRecruitmentID=' + this.filterRecruitmentID)
    this._dataService.post('/api/estimate/getallpaging', JSON.stringify(this.searchModel))
      .subscribe((response: any) => {
        this.estimates = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
        this.addNameToEntity();
        this._loaderService.displayLoader(false);
      }, error => this._dataService.handleError(error));
  }

  private addNameToEntity(){
    this.estimates.forEach(element=>{
      console.log(element.EstimateResultMasterDetailID);
      if(element.EstimateResultMasterDetailID !=undefined || element.EstimateResultMasterDetailID!=null){
        element.EstimateResultName = this.estimateResults.find(x=> x.MasterDetailCode==element.EstimateResultMasterDetailID).Name;
      }
      if(element.EstimateEmpID!=undefined || element.EstimateEmpID!=null){
        element.EstimateEmpName = this.emps.find(x=> x.ID==element.EstimateEmpID).FullName;
      }
      
    });
  }
  public reset() {
    this.filterKeyword = '';
    this.filterCustomerID = null;
    this.search();
  }

  loadDetail(id: any) {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/estimate/detail/' + id)
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
    this._dataService.delete('/api/estimate/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.search();
    }, error => this._dataService.handleError(error));
  }

  public deleteMulti() {
    this.checkedItems = this.estimates.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; ++i)
      checkedIds.push(this.checkedItems[i]["ID"]);

    if (checkedIds.length > 0) {
      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
        this._dataService.delete('/api/estimate/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
          this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
          this.search();
        }, error => this._dataService.handleError(error));
      });
    }

  }

  public selectedInterviewDate(value: any) {
    this.entity.InterviewDate = moment(value).format('YYYY/MM/DD HH:mm');
  }

  public selectedWorkingConditionTalkDate(value: any) {
    this.entity.WorkingConditionTalkDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedTrialStartDate(value: any) {
    this.entity.TrialStartDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedResourceDeptMailNotificationDate(value: any) {
    this.entity.ResourceDeptMailNotificationDate = moment(value).format('YYYY/MM/DD');
  }

  public changeCheckboxIsFinished(event: any) {

  }

  public onChange(event: any) {

  }

  public onChangeCustomer(event: any) {
    //this.search();

  }

  getEmpCodeNameList() {
    let posGrp: any[] = [];
    this._dataService.get('/api/emp/getallcodenamemodel?posFrom=0&posTo=1000&posGrp=' + posGrp)
      .subscribe((response: any) => {
        //this.empInterviewOriginList = response;
        //this.empRegisterLists = MappingService.mapIdNameToDropdownModel(response);
      }
      , error => this._dataService.handleError(error));
  }


  /**
   * upload file to serve
   */
  public uploadFiles(item: any, event: any) {
    //let fi = this.fileUpload.nativeElement;
    let fi: any = document.getElementById(item.ID);
    if (fi.files.length > 0) {
      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_UPLOAD_MSG, () => {
        this._loaderService.displayLoader(true);

        let postData: any = {
          relatedTable: 'Estimates',
          relatedKey: item.RecruitmentStaffID,

        };

        //for (let i = 0; i < fi.files.length; i++) {
        //  postData.append('file[]', fi.files.item(i));
        //}

        this._uploadService.postWithFile('/api/upload/upload?type=estimate', postData, fi.files).then((data: any) => {
          this.search();
          fi.value = "";//xoa file
          this._loaderService.displayLoader(false);
          this._notificationService.printSuccessMessage(MessageContstants.UPLOADED_OK_MSG);
        });
      });
    } else {
      this._notificationService.printAlertDialog(MessageContstants.CONFIRM_NOT_SELECT_FILE_MSG, () => { });
    }
  }

  public downloadItemFile(file: any) {
    this._dataService.downloadFile('/api/filestorage/getfileusebacbyid/' + file.ID, file.ContentType)
      .subscribe((response: any) => {
        //ok download open file 
        if (file.ContentType == 'application/pdf') {
          var fileURL = URL.createObjectURL(response);
          this._sanitizer.bypassSecurityTrustUrl(fileURL);
          window.open(fileURL);
        } else {
          saveAs(response, file.FileName);
        }

      });
  }

  public deleteItemFile(file: any) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/filestorage/delete', 'id', file.ID).subscribe((response: Response) => {
        //xoa thanh cong
        this.search();
        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      });
    });
  }

  public createOrder(item: any) {
    //check xem đã đặt hàng chưa
    if (item.EstimateResultMasterDetailID== 100 ) {
      //tao thong tin cua order  de cap nhat 
      let data: any = {};
      data.No = null;
      data.ID = item.ID;
      data.Name = item.Name;
      data.ShortName = item.ShortName;
      data.EstimateID = item.ID;
      data.TotalOrderMM = item.TotalMM;
      data.SchedulePojectStartDate = item.SchedulePojectStartDate;
      data.SchedulePojectEndDate = item.SchedulePojectEndDate;
      data.CustomerKiboLastDeliveryDate = item.CustomerKiboLastDeliveryDate;
      data.OrderRequireMM = item.EstimateRequireMM;
      data.OrderBasicMM = item.EstimateBasicMM;
      data.OrderDetailMM = item.EstimateDetailMM;
      data.OrderDevMM = item.EstimateDevMM;
      data.OrderTransMM = item.EstimateTransMM;
      data.OrderManMM = item.EstimateManMM;
      data.OrderUtMM = item.EstimateUtMM;
      data.OrderCombineTestMM = item.EstimateCombineTestMM;
      data.OrderSystemTestMM = item.EstimateSystemTestMM;
      data.OrderUserTestMM = item.EstimateUserTestMM;
      data.OS = item.OS;
      data.Language = item.Language;
      data.OtherSofts = item.OtherSofts;
      data.WarrantyMonths = item.WarrantyMonths;
      data.WarrantyStartDate = item.WarrantyStartDate;
      data.Note = item.Note;

      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_CREATE_EMP_FROM_RECRUITMENT_MSG, () => {
        // tao nhan vien 
        this._dataService.post('/api/orderreceived/add', JSON.stringify(data))
          .subscribe((response: any) => {
            //cap nhat lai thong tin 
            if (response.ID) {
              item.OrderReceivedID = response.ID;
              this._dataService.put('/api/estimate/update', JSON.stringify(item))
                .subscribe((response: any) => {
                  this.search();

                  this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
                }, error => this._dataService.handleError(error));
            }
          }, error => this._dataService.handleError(error));
      });
    }
  }


}
