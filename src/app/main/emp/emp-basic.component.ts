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
  selector: 'app-emp-basic',
  host: { '(input-blur)': 'onInputBlur($event)' },

  templateUrl: './emp-basic.component.html',
  styleUrls: ['./emp-basic.component.css']
})
export class EmpBasicComponent implements OnInit, OnDestroy {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  @ViewChild('avatar') avatar;

  @ViewChild("filePath") filePath;

  //common modal
  @ViewChild('childModal') childModal: SearchModalComponent;
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public apiHost: string;
  public id: number;
  public entity: any;
  public statuses: string[];
  public types: string[];
  private sub: any;
  public estimateTypes: any[];
  public customers: any[];
  public companys: any[];
  public depts: any[];
  public teams: any[];
  public positions: any[];
  public bloodGroups: any[];
  public empTypes: any[];
  public educationLevels: any[];
  public collects: any[];
  public bseLevels: any[];
  public contractTypes: any[];
  public empDetailWorks: any[];
  public japaneseLevels: any[];
  public bussinessAllowanceLevels: any[];
  public allMasterDetails: any[];
  public roomNoInternetAllowanceLevels : any[];
  public roomWithInternetAllowanceLevels : any[];

  public emps: any[];
  public orderUnits: any[];
  public totalZenMonth: any[];
  public selectedCustomer: any = {};
  public customerUnitPrice: any;
  public customerUnitPrices: any[];
  public selectedCustomerUnitPrices: any[]; //đon giá của khách hàng đang chọn
  public baseInformation: any = {};
  public dateOptions: any = DateRangePickerConfig.dateOptions;
  private oldEmpBasicValue: any = {};
  public actionParam: any;
  public idParam: any;
  public user: LoggedInUser;
  public isApproved: boolean = false;
  public isLoaded: boolean = false;
  public orderNos: any[] = [];
  public projectContents: any[] = [];

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
  public trialResults: any[];
  public jobLeaveReasons : any[];

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
    //load master data va thuc thi cac xu ly load data chi tiet
    this.loadMultiTableCallBack();

    //load auto comple
    this.loadAutoCompleteDataByCustomer();
    //get params
    this.sub = this._route
      .params
      .subscribe(params => {
        this.id = +params['id'] || 0;
        this.actionParam = params['action'];
        this.loadEnityDetails();
      });

    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/DD");
    // (+) converts string 'id' to a number
    this.id = +this._route.snapshot.params['id'];
    //this.apiHost = this.configService.getApiHost();



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

        this.japaneseLevels = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.JapaneseLevel);
        this.bussinessAllowanceLevels = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.BusinessAllowanceLevel);
        this.roomNoInternetAllowanceLevels = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.RoomNoInternetAllowanceLevel);
        this.roomWithInternetAllowanceLevels = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.RoomWithInternetAllowanceLevel);
        this.empTypes = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.EmpType);
        this.educationLevels = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.EducationLevel);
        this.collects = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.CollectNameList);
        this.bseLevels = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.BseAllowanceLevel);
        this.contractTypes = this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.ContractType);

        //nhom mau 
        this.bloodGroups = BloodGroup.BloodGroups;

        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  setInitValue() {
    if (this.entity) {
      if (!(this.entity.CompanyID && this.entity.CompanyID > 0))
        this.entity.CompanyID = this.user.companyid | 0;
      if (!(this.entity.DeptID && this.entity.DeptID > 0))
        this.entity.DeptID = this.user.deptid | 0;
      if (!(this.entity.TeamID && this.entity.TeamID > 0))
        this.entity.TeamID = this.user.teamid | 0;
    }
  }

  loadEnityDetails() {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/emp/detail/' + this.id)
      .subscribe((response: any) => {
        this.entity = response;
        this.formatDateDisplay();
        this.loadDataFile();
        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  private loadAutoCompleteDataByCustomer() {
    this.trialResults = [];
    this.jobLeaveReasons =[];

    return this._dataService.get('/api/emp/getallautocompletedata')
      .subscribe((response: any) => {
        let responeData: any[] = response;
        responeData.forEach(e => {
          if (e.ID == 1) {
            this.trialResults.push(e.Name);
          } else {
            this.jobLeaveReasons.push(e.Name);
          }
        });
      }, error => this._dataService.handleError(error));


  }


  formatDateDisplay() {

    if (this.entity.BirthDay) {
      this.entity.BirthDay = moment(this.entity.BirthDay).format('YYYY/MM/DD');
    }

    if (this.entity.StartIntershipDate) {
      this.entity.StartIntershipDate = moment(this.entity.StartIntershipDate).format('YYYY/MM/DD');
    }

    if (this.entity.EndIntershipDate) {
      this.entity.EndIntershipDate = moment(this.entity.EndIntershipDate).format('YYYY/MM/DD');
    }

    if (this.entity.StartWorkingDate) {
      this.entity.StartWorkingDate = moment(this.entity.StartWorkingDate).format('YYYY/MM/DD');
    }

    if (this.entity.StartLearningDate) {
      this.entity.StartLearningDate = moment(this.entity.StartLearningDate).format('YYYY/MM/DD');
    }

    if (this.entity.EndLearningDate) {
      this.entity.EndLearningDate = moment(this.entity.EndLearningDate).format('YYYY/MM/DD');
    }


    if (this.entity.StartTrialDate) {
      this.entity.StartTrialDate = moment(this.entity.StartTrialDate).format('YYYY/MM/DD');
    }

    if (this.entity.EndTrialDate) {
      this.entity.EndTrialDate = moment(this.entity.EndTrialDate).format('YYYY/MM/DD');
    }

    if (this.entity.ContractDate) {
      this.entity.ContractDate = moment(this.entity.ContractDate).format('YYYY/MM/DD');
    }

    if (this.entity.JobLeaveRequestDate) {
      this.entity.JobLeaveRequestDate = moment(this.entity.JobLeaveRequestDate).format('YYYY/MM/DD');
    }

    if (this.entity.JobLeaveDate) {
      this.entity.JobLeaveDate = moment(this.entity.JobLeaveDate).format('YYYY/MM/DD');
    }

    if (this.entity.MarriedDate) {
      this.entity.MarriedDate = moment(this.entity.MarriedDate).format('YYYY/MM/DD');
    }

  }

  saveChange(valid: boolean) {
    if (valid) {
      let messageConfirm: string = MessageContstants.CONFIRM_UPDATE_MSG;
      this._notificationService.printConfirmationDialog(messageConfirm, () => this.saveData());
    }
  }

  private saveData() {
    this.setMasterKbnId();
    if (this.entity.No == undefined) {
      this._dataService.post('/api/emp/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {

          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/emp/update', JSON.stringify(this.entity))
        .subscribe((response: any) => {

          this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
  }

  private setMasterKbnId(){

    this.entity.ContractTypeMasterID  = MasterKbnEnum.ContractType;
    this.entity.EmpTypeMasterID  = MasterKbnEnum.EmpType;
    this.entity.JapaneseLevelMasterID  = MasterKbnEnum.JapaneseLevel;
    this.entity.BusinessAllowanceLevelMasterID  = MasterKbnEnum.BusinessAllowanceLevel;
    this.entity.RoomWithInternetAllowanceLevelMasterID  = MasterKbnEnum.RoomWithInternetAllowanceLevel;
    this.entity.RoomNoInternetAllowanceLevelMasterID  = MasterKbnEnum.RoomNoInternetAllowanceLevel;
    this.entity.BseAllowanceLevelMasterID  = MasterKbnEnum.BseAllowanceLevel;
    this.entity.CollectMasterID  = MasterKbnEnum.CollectNameList;
    this.entity.EducationLevelMasterID  = MasterKbnEnum.EducationLevel;

  }
  public onFocus(value: any) {

    switch (value.target.name) {
      case 'InMonthDevMM':
        this.oldEmpBasicValue.InMonthDevMM = value.target.value;
        break;

      case 'InMonthTransMM':
        this.oldEmpBasicValue.InMonthTransMM = value.target.value;
        break;

      case 'InMonthManagementMM':
        this.oldEmpBasicValue.InMonthManagementMM = value.target.value;
        break;

      case 'InMonthSumMM':
        this.oldEmpBasicValue.InMonthSumMM = value.target.value;
        break;

      case 'OrderProjectSumMM':
        this.oldEmpBasicValue.OrderProjectSumMM = value.target.value;
        break;

      case 'OrderPrice':
        this.oldEmpBasicValue.OrderPrice = value.target.value;
        break;

      case 'AccPreMonthSumMM':
        this.oldEmpBasicValue.AccPreMonthSumMM = value.target.value;
        break;

      case 'NextMonthMM':
        this.oldEmpBasicValue.NextMonthMM = value.target.value;
        break;
      case 'OrderNo':
        this.oldEmpBasicValue.OrderNo = value.target.value;
        break;
      default:

        break;
    }

  }

  selectAllContent($event) {
    $event.target.select();
  }

  public selectedBirthDayDate(value: any) {
    this.entity.BirthDay = moment(value).format('YYYY/MM/DD');
  }

  public selectedMarriedDate(value: any) {
    this.entity.MarriedDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedIdentDate(value: any) {
    this.entity.IdentDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedStartIntershipDate(value: any) {
    this.entity.StartIntershipDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedEndIntershipDate(value: any) {
    this.entity.EndIntershipDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedStartWorkingDate(value: any) {
    this.entity.StartWorkingDate = moment(value).format('YYYY/MM/DD');
  }


  public selectedStartLearningDate(value: any) {
    this.entity.StartLearningDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedEndLearningDate(value: any) {
    this.entity.EndLearningDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedStartTrialDate(value: any) {
    this.entity.StartTrialDate = moment(value).format('YYYY/MM/DD');
    //tinh ra ngay ket thuc thu viec
    if(this.entity.StartTrialDate){
      this.entity.EndTrialDate = moment(this.calTrialEndDate(this.entity.StartTrialDate)).format('YYYY/MM/DD');
    }else{
      this.entity.EndTrialDate =null;
    }
  }

  public selectedEndTrialDate(value: any) {
    this.entity.EndTrialDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedJobLeaveRequestDate(value: any) {
    this.entity.JobLeaveRequestDate = moment(value).format('YYYY/MM/DD');
    //tinh ra ngay lam viec cuoi cung
    if(this.entity.JobLeaveRequestDate){
      this.entity.JobLeaveDate = moment(this.calJobLeaveDate(this.entity.JobLeaveRequestDate)).format('YYYY/MM/DD');
    }else{
      this.entity.JobLeaveDate =null;
    }
  }

  public selectedContractDate(value: any) {
    this.entity.ContractDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedJobLeaveDate(value: any) {
    this.entity.JobLeaveDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedInterviewDate(value: any) {
    this.entity.InterviewDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedWorkingConditionTalkDate(value: any) {
    this.entity.WorkingConditionTalkDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedBabyBornStartDate(value: any) {
    this.entity.BabyBornStartDate = moment(value).format('YYYY/MM/DD');
    //tinh ra ngay nghi thai san 
    if(this.entity.BabyBornStartDate){
      this.entity.BabyBornScheduleEndDate = moment(this.calBabyScheduleEndDate(this.entity.BabyBornStartDate)).format('YYYY/MM/DD');
    }else{
      this.entity.BabyBornScheduleEndDate =null;
    }
  }

  public selectedBabyBornScheduleEndDate(value: any) {
    this.entity.BabyBornScheduleEndDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedBabyBornActualEndDate(value: any) {
    this.entity.BabyBornActualEndDate = moment(value).format('YYYY/MM/DD');
  }

  private calJobLeaveDate(requestDate : Date){
    if(requestDate){
      return DateTimeHelper.addDays(requestDate,45); 
    }
  }

  private calBabyScheduleEndDate(startDate : Date){
    if(startDate){
      return DateTimeHelper.addMonths(startDate,6); 
    }
  }

  private calTrialEndDate(startDate : Date){
    if(startDate){
      return DateTimeHelper.addMonths(startDate,2); 
    }
  }

  public calendarEventsHandler(e: any) {

  }
  public selectGender(event) {
    this.entity.Gender = event.source._checked;
  }

  /* Drag Drop File Begin*/
  // File being dragged has moved into the drop region
  public dragFileOverStart() {
  }
  // File being dragged has moved out of the drop region
  public dragFileOverEnd() {
  }

  public dragFileAccepted(acceptedFile: Ng2FileDropAcceptedFile) {
    // Load the image in
    let fileReader = new FileReader();
    fileReader.onload = () => {
      // Set and show the image
      this.currentProfileImage = fileReader.result;
      this.entity.ShowAvatar = true;
      this.isFileChanged = true;
    };
    // Read in the file
    fileReader.readAsDataURL(acceptedFile.file);
    //Luu lai file da chon de cap nhat sau nay 
    this.avatarFile = acceptedFile.file;

  }

  // File being dragged has been dropped and has been rejected
  public dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
  }


  pageChanged(event: any): void {
    this.pageIndex = event.page;
  }
  showAddModal() {
    this.entity = {};
    this.modalAddEdit.show();
  }
  showEditModal(id: any) {
    this.modalAddEdit.show();
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
          relatedKey: this.entity.ID
        };
        this._uploadService.postWithFile('/api/upload/upload?type=emp', postData, fi.files).then((data: any) => {
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
    this._dataService.get('/api/filestorage/getallbykey?&table=emps&key=' + this.entity.ID)
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
    let file: any = this.fileStorages.find(i => i.ID == id);

    this._dataService.downloadFile('/api/filestorage/getfileusebacbyid/' + id, file.ContentType)
      .subscribe((response: any) => {
        //ok download open file 
        if (file.ContentType == 'application/pdf') {
          var fileURL = URL.createObjectURL(response);
          this._sanitizer.bypassSecurityTrustUrl(fileURL);
          window.open(fileURL);
        } else {
          saveAs(response , file.FileName);
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

  /**
   * Xử lý event di chuyển con trỏ ra khỏi các textbox có tính toán
   */
  onInputBlur(event) {

    switch (event.target.name) {

      case 'StartTrialDate':
          //tinh ra ngay end thu viec
          if(this.entity.JobLeaveRequestDate){
            this.entity.EndTrialDate = moment(this.calTrialEndDate(this.entity.StartTrialDate)).format('YYYY/MM/DD');
          }else{
            this.entity.EndTrialDate =null;
          }
        break;
      case 'JobLeaveRequestDate': 
          //tinh ra ngay lam viec cuoi cung
          if(this.entity.JobLeaveRequestDate){
            this.entity.JobLeaveDate = moment(this.calJobLeaveDate(this.entity.JobLeaveRequestDate)).format('YYYY/MM/DD');
          }else{
            this.entity.JobLeaveDate =null;
          } 
        break;

      case 'BabyBornStartDate':
          //tinh ra ngay nghi thai san 
          if(this.entity.BabyBornStartDate){
            this.entity.BabyBornScheduleEndDate = moment(this.calBabyScheduleEndDate(this.entity.BabyBornStartDate)).format('YYYY/MM/DD');
          }else{
            this.entity.BabyBornScheduleEndDate =null;
          }
        break;

      case 'OrderProjectSumMM':

        break;

      case 'OrderPrice':
        //gan lai don gia trong truong hop thay doi bang tay ( do dang tinh theo this.baseInformation.OrderPrice)
        this.baseInformation.OrderPrice = this.entity.OrderPrice;
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
    this._router.navigateByUrl("/main/emp/card-list/" + '', {});
  }

  setDateRangeValueDefault() {
    this.entity.OrderStartDate = DateTimeHelper.getStartDateWithSime(this.entity.ReportYearMonth, this.selectedCustomer.Sime || 31);
    this.entity.OrderEndDate = DateTimeHelper.getEndDateWithSime(this.entity.ReportYearMonth, this.selectedCustomer.Sime || 31);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  //https://angular-2-training-book.rangle.io/handout/routing/query_params.html
  nextPage() {
    this._router.navigate(['product-list'], { queryParams: { page: this.id + 1 } });
  }
}

