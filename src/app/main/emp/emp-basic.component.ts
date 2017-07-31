import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-emp-basic',
  host: { '(input-blur)': 'onInputBlur($event)' },

  templateUrl: './emp-basic.component.html',
  styleUrls: ['./emp-basic.component.css']
})
export class EmpBasicComponent implements OnInit, OnDestroy {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  @ViewChild('avatar') avatar;

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

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _itemsService: ItemsService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _mappingService: MappingService,
    private _authenService: AuthenService,
    private _loaderService: LoaderService
  ) {

  }

  ngOnInit() {
    this.entity = {};
    this.user = this._authenService.getLoggedInUser();
    //get params
    this.sub = this._route
      .params
      .subscribe(params => {
        this.id = +params['id'] || 0;
        this.actionParam = params['action'];

      });

    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/DD");
    // (+) converts string 'id' to a number
    this.id = +this._route.snapshot.params['id'];
    //this.apiHost = this.configService.getApiHost();

    //load master data va thuc thi cac xu ly load data chi tiet
    //this.loadMultiTableCallBack();

  }

  /**
   * Load các dữ liệu master
   */
  loadMultiTable() {
    let uri = [];
    uri.push('/api/masterdetail/getbykbn/20');
    uri.push('/api/customer/getall');
    uri.push('/api/emp/getall');
    uri.push('/api/masterdetail/getbykbn/25');
    uri.push('/api/exchangerate/getall');
    uri.push('/api/customerunitprice/getall');
    uri.push('/api/company/getall');
    uri.push('/api/dept/getall');
    uri.push('/api/team/getall');

    return this._dataService.getMulti(uri);
  }

  loadMultiTableCallBack() {
    this._loaderService.displayLoader(true);
    this.loadMultiTable()
      .subscribe((response: any) => {
        this.emps = response[0];                 //danh sách nhân viên (chỉ leader??)
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
    this.entity.BirthDay = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedMarriedDate(value: any) {
    this.entity.MarriedDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedIdentDate(value: any) {
    this.entity.IdentDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedStartIntershipDate(value: any) {
    this.entity.StartIntershipDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedEndIntershipDate(value: any) {
    this.entity.EndIntershipDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedStartWorkingDate(value: any) {
    this.entity.StartWorkingDate = moment(value.start).format('YYYY/MM/DD');
  }


  public selectedStartLearningDate(value: any) {
    this.entity.StartLearningDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedEndLearningDate(value: any) {
    this.entity.EndLearningDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedStartTrialDate(value: any) {
    this.entity.StartTrialDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedEndTrialDate(value: any) {
    this.entity.EndTrialDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedJobLeaveRequestDate(value: any) {
    this.entity.JobLeaveRequestDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedContractDate(value: any) {
    this.entity.ContractDate = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedJobLeaveDate(value: any) {
    this.entity.JobLeaveDate = moment(value.start).format('YYYY/MM/DD');
  }

  public calendarEventsHandler(e: any) {

  }
  public selectGender(event) {
    this.entity.Gender = event.source._checked;
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
   * Xử lý event di chuyển con trỏ ra khỏi các textbox có tính toán
   */
  onInputBlur(event) {

    let managementMM: number;
    switch (event.target.name) {

      case 'InMonthDevMM':

        break;
      case 'InMonthTransMM':

        break;

      case 'InMonthManagementMM':

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
    this._router.navigate(['../main/emp/grid']);
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

