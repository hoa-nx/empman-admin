import { Component, OnInit, Input, OnDestroy, ViewChild, enableProdMode } from '@angular/core';
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
import { MasterKbnEnum } from '../../core/common/shared.enum';
import { DomSanitizer } from '@angular/platform-browser';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { TagInputComponent, TagComponent, TagInputForm } from 'ngx-chips';

@Component({
  selector: 'app-order-edit',
  host: { '(input-blur)': 'onInputBlur($event)' },
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit, OnDestroy {

  @ViewChild("filePath") filePath;

  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public apiHost: string;
  public id: any;
  public entity: any = {};
  public statuses: string[];
  public types: string[];
  private sub: any;
  public estimateTypes: any[];
  public customers: any[];
  public estimates: any[];
  public companys: any[];
  public depts: any[];
  public teams: any[];
  public positions: any[];
  public allMasterDetails: any[];
  public dataStatus: any[];

  public emps: any[];
  public orderUnits: any[];
  public totalZenMonth: any[];
  public selectedCustomer: any = {};
  public dateOptions: any = DateRangePickerConfig.dateOptions;
  private oldEntityValue: any = {};
  public actionParam: any;
  public idParam: any;
  public user: LoggedInUser;
  public isApproved: boolean = false;
  public isLoaded: boolean = false;

  public fileStorages: any[];
  public checkedItems: any[];
  avatarFile: any;
  isFileChanged: boolean;
  /* tslint:disable:no-unused-variable */
  // Supported image types
  public supportedFileTypes: string[] = ['image/png', 'image/jpeg', 'image/gif'];
  /* tslint:enable:no-unused-variable */

  private currentProfileImage: string = SystemConstants.BASE_WEB + '/assets/images/profile-default.png';
  public uriAvatarPath: string = SystemConstants.BASE_API;

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
  ) {

  }

  ngOnInit() {
    this.entity = {};
    this.user = this._authenService.getLoggedInUser();


    //load auto comple
    //this.loadAutoCompleteDataByCustomer();

    //get params
    this.sub = this._route
      .params
      .subscribe(params => {
        this.id = params['id'];
        this.actionParam = params['action'];

      });

    //load master data va thuc thi cac xu ly load data chi tiet
    this.loadMultiTableCallBack();

    this.initByActionParam();

    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/DD");
    // (+) converts string 'id' to a number
    this.id = this._route.snapshot.params['id'];
    //this.apiHost = this.configService.getApiHost();



  }

  initByActionParam() {
    switch (this.actionParam) {
      case 'new':
        this.isApproved = false;

        break;

      case 'edit':
        this.isApproved = false;
        break;

      case 'copy':
        this.entity.ID = '';
        this.isApproved = false;
        break;

      default:
        break;

    }
  }

  /**
   * Load các dữ liệu master
   */
  loadMultiTable() {
    let uri = [];
    uri.push('/api/company/getall');
    uri.push('/api/dept/getall');
    uri.push('/api/team/getall');
    uri.push('/api/position/getall');
    uri.push('/api/masterdetail/getall');
    uri.push('/api/customer/getall');
    uri.push('/api/estimate/getall');

    return this._dataService.getMulti(uri);
  }

  loadMultiTableCallBack() {
    this._loaderService.displayLoader(true);
    this.loadMultiTable()
      .subscribe((response: any) => {
        this.companys = response[0];
        this.depts = response[1];
        this.teams = response[2];
        this.positions = response[3];
        this.allMasterDetails = response[4];
        this.customers = response[5];
        this.estimates = response[6];

        this.getEmpCodeNameList();

        this.dataStatus = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.EstimateResult);

        if (this.actionParam != 'new') {
          this.loadEnityDetail();
        }
        this.initByActionParam();

        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  getEmpCodeNameList() {
    let posGrp: any[] = [];
    this._dataService.get('/api/emp/getallcodenamemodel?posFrom=0&posTo=140&posGrp=' + posGrp)
      .subscribe((response: any) => {
        this.emps = response;
        //this.empRegisterLists = MappingService.mapIdNameToDropdownModel(response);
      }
      , error => this._dataService.handleError(error));
  }

  loadEnityDetail() {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/orderreceived/detail/' + this.id)
      .subscribe((response: any) => {
        this.entity = response;
        /* if(response.OtherSofts && response.OtherSofts.length>0){
          this.entity.OtherSofts =response.OtherSofts.toString().split(",");
        }else{
          this.entity.OtherSofts ="";
        } */

        console.log(this.entity);
        this.formatDateDisplay();
        this.loadDataFile();
        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  private loadAutoCompleteDataByCustomer() {
    return this._dataService.get('/api/orderreceived/getallautocompletedata')
      .subscribe((response: any) => {
        let responeData: any[] = response;
        responeData.forEach(e => {
          if (e.ID == 1) {
            //this.trialResults.push(e.Name);
          } else {
            //this.jobLeaveReasons.push(e.Name);
          }
        });
      }, error => this._dataService.handleError(error));


  }


  formatDateDisplay() {

    if (this.entity.OrderDate) {
      this.entity.OrderDate = moment(this.entity.OrderDate).format('YYYY/MM/DD');
    }
    if (this.entity.SchedulePojectStartDate) {
      this.entity.SchedulePojectStartDate = moment(this.entity.SchedulePojectStartDate).format('YYYY/MM/DD');
    }

    if (this.entity.SchedulePojectEndDate) {
      this.entity.SchedulePojectEndDate = moment(this.entity.SchedulePojectEndDate).format('YYYY/MM/DD');
    }

    if (this.entity.CustomerKiboLastDeliveryDate) {
      this.entity.CustomerKiboLastDeliveryDate = moment(this.entity.CustomerKiboLastDeliveryDate).format('YYYY/MM/DD');
    }

    if (this.entity.WarrantyStartDate) {
      this.entity.WarrantyStartDate = moment(this.entity.WarrantyStartDate).format('YYYY/MM/DD');
    }

    if (this.entity.CustomerConfirmDate) {
      this.entity.CustomerConfirmDate = moment(this.entity.CustomerConfirmDate).format('YYYY/MM/DD');
    }

  }

  saveChange(valid: boolean) {
    if (valid) {

      let messageConfirm: string = MessageContstants.CONFIRM_UPDATE_MSG;
      if (this.entity.No == undefined)
        messageConfirm = MessageContstants.CONFIRM_REGISTER_MSG;

      this._notificationService.printConfirmationDialog(messageConfirm, () => this.saveData());
    }
  }

  private saveData() {

    if (this.entity.No == undefined) {
      this._dataService.post('/api/orderreceived/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {

          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {

      this._dataService.put('/api/orderreceived/update', JSON.stringify(this.entity))
        .subscribe((response: any) => {

          this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
  }

  private setMasterKbnId() {

    this.entity.EstimateResultMasterID = MasterKbnEnum.EstimateResult;
  }


  public onFocus(value: any) {

    switch (value.target.name) {
      case 'InMonthDevMM':
        this.oldEntityValue.InMonthDevMM = value.target.value;
        break;

      default:

        break;
    }

  }

  selectAllContent($event) {
    $event.target.select();
  }

  public selectedOrderDate(value: any) {
    this.entity.OrderDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedSchedulePojectStartDate(value: any) {
    this.entity.SchedulePojectStartDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedSchedulePojectEndDate(value: any) {
    this.entity.SchedulePojectEndDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedCustomerKiboLastDeliveryDate(value: any) {
    this.entity.CustomerKiboLastDeliveryDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedWarrantyStartDate(value: any) {
    this.entity.WarrantyStartDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedCustomerConfirmDate(value: any) {
    this.entity.CustomerConfirmDate = moment(value).format('YYYY/MM/DD');
  }

  public calendarEventsHandler(e: any) {

  }

  pageChanged(event: any): void {
    this.pageIndex = event.page;
  }

  /**
   * upload file to serve
   */
  uploadFile() {
    let fi = this.filePath.nativeElement;
    if (fi.files.length > 0) {
      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_UPLOAD_MSG, () => {
        this._loaderService.displayLoader(true);

        let postData: any = {
          relatedKey: this.entity.ID,
          relatedTable: 'OrderReceiveds'
        };
        this._uploadService.postWithFile('/api/upload/upload?type=OrderReceived', postData, fi.files).then((data: any) => {
          this.loadDataFile();
          this._loaderService.displayLoader(false);
          this._notificationService.printSuccessMessage(MessageContstants.UPLOADED_OK_MSG);
        });
      });
    } else {
      this._notificationService.printAlertDialog(MessageContstants.CONFIRM_NOT_SELECT_FILE_MSG, () => { });
    }
  }


  loadDataFile() {
    this._dataService.get('/api/filestorage/getallbykey?&table=OrderReceiveds&key=' + this.entity.ID)
      .subscribe((response: any) => {
        this.fileStorages = response;

      });
  }

  loadDetailFile(id: any) {
    this._dataService.get('/api/filestorage/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this.entity.CreateDate = moment(new Date(this.entity.CreateDate)).format('YYYY/MM/DD');

      });
  }

  downloadItemFile(id: any) {
    /* this._dataService.getPdfFile('/api/filestorage/getfileusebacbyid/' + id)
      .subscribe((response: any) => {
        console.log(response);
        //ok download open file 
        var fileURL = URL.createObjectURL(response);
        this._sanitizer.bypassSecurityTrustUrl(fileURL);
        window.open(fileURL);
      }); */
    let fileType: string = this.fileStorages.find(i => i.ID == id).ContentType;
    this._dataService.downloadFile('/api/filestorage/getfileusebacbyid/' + id, fileType)
      .subscribe((response: any) => {
        //ok download open file 
        if (fileType == 'application/pdf') {
          var fileURL = URL.createObjectURL(response);
          this._sanitizer.bypassSecurityTrustUrl(fileURL);
          window.open(fileURL);
        } else {
          saveAs(response);
        }

      });
  }

  downloadMultiFile() {
    this.checkedItems = this.fileStorages.filter(x => x.Checked);
    if (this.checkedItems.length > 0) {
      var checkedIds = [];
      for (var i = 0; i < this.checkedItems.length; ++i)
        checkedIds.push(this.checkedItems[i]["ID"]);

      this._dataService.downloadFileWithParams('/api/filestorage/downloadmulti', 'application/octet-stream', JSON.stringify(checkedIds))
        .subscribe((response: any) => {
          //ok download open file 
          console.log(response);
          saveAs(response, "emp-download.zip");
        });
    } else {
      this._notificationService.printAlertDialog(MessageContstants.CONFIRM_DOWNLOAD_NO_DATA_MSG, () => { });
    }
  }

  downloadFile(data: Response) {
    var blob = new Blob([data], { type: 'application/pdf' });
    var url = window.URL.createObjectURL(blob);
    this._sanitizer.bypassSecurityTrustUrl(url);
    window.open(url);
  }


  deleteItemFile(id: any) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/filestorage/delete/', 'id', id).subscribe((response: any) => {
        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
        this.loadDataFile();
      });
    });
  }

  public deleteMultiFile() {
    this.checkedItems = this.fileStorages.filter(x => x.Checked);
    if (this.checkedItems.length > 0) {
      var checkedIds = [];
      for (var i = 0; i < this.checkedItems.length; ++i)
        checkedIds.push(this.checkedItems[i]["ID"]);

      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
        this._dataService.delete('/api/filestorage/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
          this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
          this.loadDataFile();
        }, error => this._dataService.handleError(error));
      });
    } else {
      this._notificationService.printAlertDialog(MessageContstants.CONFIRM_DELETE_NO_DATA_MSG, () => { });
    }

  }

  onInputBlurred(event) {

  }

  onInputFocused(event) {

  }

  onSelected(event) {

  }

  onItemRemoved(event) {

  }

  onTextChange(event) {

  }

  onItemAdded(event) {

  }

  /**
   * Xử lý event di chuyển con trỏ ra khỏi các textbox có tính toán
   */
  onInputBlur(event) {

    switch (event.target.name) {

      case 'StartTrialDate':

        break;
      case 'JobLeaveRequestDate':

        break;

      case 'BabyBornStartDate':

        break;

      case 'OrderProjectSumMM':

        break;

      case 'OrderPrice':

        break;

      case 'AccPreMonthSumMM':

        break;

      case 'NextMonthMM':

        break;

      case 'InMonthToUsd':

        break;

      default:

        break;
    }

    //lam tron cac so lieu 
    //this.entityRoundNumber();
  }


  back() {
    //this._router.navigate(['../main/emp']);
    this._router.navigateByUrl("/main/order/index" + '', {});
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  //https://angular-2-training-book.rangle.io/handout/routing/query_params.html
  nextPage() {
    this._router.navigate(['product-list'], { queryParams: { page: this.id + 1 } });
  }

}

