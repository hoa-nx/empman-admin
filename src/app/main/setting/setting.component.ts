import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { MessageContstants } from '../../core/common/message.constants';
import * as moment from 'moment';
import { ISearchItemViewModel, IMasterDetailItemViewModel, PaginatedResult, IEmpFilterViewModel, ISystemValueViewModel } from '../../core/interfaces/interfaces';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { MappingService } from '../../shared/utils/mapping.service';
//import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';
//import { jqxMenuComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxmenu';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { LoaderService } from '../../shared/utils/spinner.service';
import { MasterKbnEnum } from '../../core/common/shared.enum';
import { SearchModalComponent } from '../../shared/search-modal/search-modal.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { DateTimeHelper } from '../../shared/utils/datetime-helper';
import { SharedComponentService } from '../../core/services/sharedcomponent.service';
import { ItemsService } from '../../shared/utils/items.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SettingComponent implements OnInit {

  //common modal
  @ViewChild('childModal') childModal: SearchModalComponent;

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

  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';

  public chkDept: boolean = false;
  public depts: any[] = [];
  public selectDepts: any[] = [];

  public chkTeam: boolean = false;
  public teams: any[] = [];
  public selectTeams: any[] = [];

  public chkPosition: boolean = false;
  public positions: any[] = [];
  public selectPositions: any[] = [];

  public chkJapaneseLevel: boolean = false;
  public japaneseLevels: any[] = [];
  public selectJapaneseLevels: any[] = [];

  public chkBussinessAllowanceLevel: boolean = false;
  public bussinessAllowanceLevels: any[] = [];
  public selectBussinessAllowanceLevels: any[] = [];

  public chkBseLevel: boolean = false;
  public bseLevels: any[] = [];
  public selectBseLevels: any[] = [];

  public chkEmpType: boolean = false;
  public empTypes: any[] = [];
  public selectEmpTypes: any[] = [];

  public chkEducationLevel: boolean = false;
  public educationLevels: any[] = [];
  public selectEducationLevels: any[] = [];

  public chkCollects: boolean = false;
  public collects: any[] = [];
  public selectCollects: any[] = [];

  public chkContractType: boolean = false;
  public contractTypes: any[] = [];
  public selectContractTypes: any[] = [];

  public chkStartWorkingDate: boolean = false;
  public startWorkingDateFrom: any;
  public startWorkingDateTo: any;

  public chkContractDate: boolean = false;
  public contractDateFrom: any;
  public contractDateTo: any;

  public chkTrialDate: boolean = false;
  public trialDateFrom: any;
  public trialDateTo: any;


  public chkJobLeaveDate: boolean = false;
  public jobLeaveDateFrom: any;
  public jobLeaveDateTo: any;

  public chkLearning: boolean = false;
  public chkTrainingInclude: boolean = false;
  public chkExperence: boolean = false;

  public selectDataTypes: any = 99;

  public entity: any = {};
  public baseFolder: string = SystemConstants.BASE_API;
  public dateOptions: any = DateRangePickerConfig.dateOptions;

  public searchModel: any;
  public checkedItems: any[];
  public allMasterDetails: any[];

  public filterViewModel: IEmpFilterViewModel;

  public listEmpItemSorts: Array<string> = ['Phòng ban', 'Team-nhóm', 'Ngạch bậc', 'Mã nhân viên', 'Họ và tên', 'Tên', 'Tài khoản', 'Ngày sinh', 'Ngày vào công ty', 'Ngày thử việc', 'Ngày ký HĐLĐ', 'Giới tính', 'Loại công việc', 'Hệ số đánh giá'];
  public listSelectedItemSorts: Array<string> = [];

  public user: LoggedInUser;
  public searchFilterEntity: any;
  public systemValueViewModel: any = {};
  private sub: any;
  private backUrl: any | '';
  private id: any | 0;
  public emps: any[];

  public sendValueToTopMenu: any = {
    empCount: 0,
    empContractedCount: 0,
    empTrialCount: 0,
    empOtherCount: 0,
    empContractedLTNMonthCount: 0,
    empOnsiteCount: 0,
    empTransCount: 0,
    empContractedJobLeavedCount: 0,
    empTrialJobLeavedCount: 0,
    empContractedJobLeavedInProcessingYearCount: 0,
    empTrialJobLeavedInProcessingYearCount: 0,
    processingYear: 0,
    expMonth: 4,
  }

  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _authenService: AuthenService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _sessionService: SessionService,
    private _loaderService: LoaderService,
    private _sharedComponentService: SharedComponentService,
    private _itemsService: ItemsService

  ) {

  }

  ngOnInit() {
    //get params
    this.sub = this._route
      .params
      .subscribe(params => {
        this.id = +params['id'] || 0;
        //back URL 
        this.backUrl = params['url'];
      });

    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/DD");
    //(+) converts string 'id' to a number
    //this.id = +this._route.snapshot.params['id'];

    this.user = this._authenService.getLoggedInUser();

    this.loadMultiTableCallBack();

    this.initSearchFilterModel();

    this.loadDataSearchFilter();

  }

  /**
   * Load các dữ liệu master
   */
  loadMultiTable() {
    let uri = [];
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
        //map 
        this.depts = MappingService.mapIdNameToDropdownModel(response[0]);
        this.teams = MappingService.mapIdNameToDropdownModel(response[1]);
        this.positions = MappingService.mapIdNameToDropdownModel(response[2]);

        this.allMasterDetails = response[3];

        this.japaneseLevels = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.JapaneseLevel));

        this.bussinessAllowanceLevels = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.BusinessAllowanceLevel));

        this.bseLevels = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.BseAllowanceLevel));

        this.empTypes = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.EmpType));

        this.educationLevels = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.EducationLevel));
        this.collects = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.CollectNameList));
        this.contractTypes = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.ContractType));

        //nhom mau 
        //this.bloodGroups = BloodGroup.BloodGroups;

        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  loadDataSearchFilter() {
    this._dataService.get('/api/setting/detailsearchfilterbyuser')
      .subscribe((response: any) => {
        this.searchFilterEntity = response;
        console.log(this.searchFilterEntity);
        console.log(this._itemsService.getSerialized(this.searchFilterEntity.systemValue));
        this.systemValueViewModel = this._itemsService.getSerialized(this.searchFilterEntity.systemValue);
        //this.setSystemValueUpdate();
        this.mapFilterToModel();

      });
  }

  mapFilterToModel() {
    this.chkDept = this.searchFilterEntity.chkDept;
    this.selectDepts = this.searchFilterEntity.selectDepts;

    this.chkTeam = this.searchFilterEntity.chkTeam;
    this.selectTeams = this.searchFilterEntity.selectTeams;

    this.chkPosition = this.searchFilterEntity.chkPosition;
    this.selectPositions = this.searchFilterEntity.selectPositions;

    this.chkEmpType = this.searchFilterEntity.chkEmpType;
    this.selectEmpTypes = this.searchFilterEntity.selectEmpTypes;

    this.chkJapaneseLevel = this.searchFilterEntity.chkJapaneseLevel;
    this.selectJapaneseLevels = this.searchFilterEntity.selectJapaneseLevels;

    this.chkBussinessAllowanceLevel = this.searchFilterEntity.chkBussinessAllowanceLevel;
    this.selectBussinessAllowanceLevels = this.searchFilterEntity.selectBussinessAllowanceLevels;

    this.chkBseLevel = this.searchFilterEntity.chkBseLevel;
    this.selectBseLevels = this.searchFilterEntity.selectBseLevels;

    this.chkStartWorkingDate = this.searchFilterEntity.chkStartWorkingDate;
    if (this.searchFilterEntity.startWorkingDateFrom) {
      this.startWorkingDateFrom = moment(this.searchFilterEntity.startWorkingDateFrom).format('YYYY/MM/DD');
    } else {
      this.startWorkingDateFrom = null;
    }

    if (this.searchFilterEntity.startWorkingDateTo) {
      this.startWorkingDateTo = moment(this.searchFilterEntity.startWorkingDateTo).format('YYYY/MM/DD');
    } else {
      this.startWorkingDateTo = null;
    }

    this.chkContractDate = this.searchFilterEntity.chkContractDate;
    if (this.searchFilterEntity.contractDateFrom) {
      this.contractDateFrom = moment(this.searchFilterEntity.contractDateFrom).format('YYYY/MM/DD');
    } else {
      this.contractDateFrom = null;
    }

    if (this.searchFilterEntity.contractDateTo) {
      this.contractDateTo = moment(this.searchFilterEntity.contractDateTo).format('YYYY/MM/DD');
    } else {
      this.contractDateTo = null;
    }

    this.chkTrialDate = this.searchFilterEntity.chkTrialDate;

    if (this.searchFilterEntity.trialDateFrom) {
      this.trialDateFrom = moment(this.searchFilterEntity.trialDateFrom).format('YYYY/MM/DD');
    } else {
      this.trialDateFrom = null;
    }

    if (this.searchFilterEntity.trialDateTo) {
      this.trialDateTo = moment(this.searchFilterEntity.trialDateTo).format('YYYY/MM/DD');
    } else {
      this.trialDateTo = null;
    }

    this.chkJobLeaveDate = this.searchFilterEntity.chkJobLeaveDate;
    if (this.searchFilterEntity.jobLeaveDateFrom) {
      this.jobLeaveDateFrom = moment(this.searchFilterEntity.jobLeaveDateFrom).format('YYYY/MM/DD');
    } else {
      this.jobLeaveDateFrom = null;
    }

    if (this.searchFilterEntity.jobLeaveDateTo) {
      this.jobLeaveDateTo = moment(this.searchFilterEntity.jobLeaveDateTo).format('YYYY/MM/DD');
    } else {
      this.jobLeaveDateTo = null;
    }

    this.chkExperence = this.searchFilterEntity.chkExperence;

    this.chkLearning = this.searchFilterEntity.chkLearning;

    this.chkTrainingInclude = this.searchFilterEntity.chkTrainingInclude;

    this.selectDataTypes = this.searchFilterEntity.selectDataTypes;

    //luu dieu kien search 
    //luu trinh tu sap xep
    if (this.searchFilterEntity.sort) {
      this.listSelectedItemSorts = this.searchFilterEntity.sort;
    }

    //check null
    if (this.listSelectedItemSorts) {
      let initItemSorts = this.listEmpItemSorts.filter(x => !this.listSelectedItemSorts.includes(x));
      this.listEmpItemSorts = initItemSorts;
    }
    //system value
    this.setSystemValueUpdate();
  }

  initSearchFilterModel() {
    this.filterViewModel = {
      chkDept: this.chkDept,
      selectDepts: this.selectDepts,

      chkTeam: this.chkTeam,
      selectTeams: this.selectTeams,

      chkPosition: this.chkPosition,
      selectPositions: this.selectPositions,

      chkEmpType: this.chkEmpType,
      selectEmpTypes: this.selectEmpTypes,

      chkJapaneseLevel: this.chkJapaneseLevel,
      selectJapaneseLevels: this.selectJapaneseLevels,

      chkBussinessAllowanceLevel: this.chkBussinessAllowanceLevel,
      selectBussinessAllowanceLevels: this.selectBussinessAllowanceLevels,

      chkBseLevel: this.chkBseLevel,
      selectBseLevels: this.selectBseLevels,

      chkStartWorkingDate: this.chkStartWorkingDate,
      startWorkingDateFrom: this.startWorkingDateFrom,
      startWorkingDateTo: this.startWorkingDateTo,

      chkContractDate: this.chkContractDate,
      contractDateFrom: this.contractDateFrom,
      contractDateTo: this.contractDateTo,

      chkTrialDate: this.chkTrialDate,
      trialDateFrom: this.trialDateFrom,
      trialDateTo: this.trialDateTo,

      chkJobLeaveDate: this.chkJobLeaveDate,
      jobLeaveDateFrom: this.jobLeaveDateFrom,
      jobLeaveDateTo: this.jobLeaveDateTo,

      chkExperence: this.chkExperence,

      chkLearning: this.chkLearning,

      chkTrainingInclude: this.chkTrainingInclude,

      selectDataTypes: this.selectDataTypes,

      //luu dieu kien search 

      //luu trinh tu sap xep
      sort: this.listSelectedItemSorts
    }
  }

  saveChange(val) {

    if (val) {
      this.filterViewModel.chkDept = this.chkDept;
      this.filterViewModel.selectDepts = this.selectDepts;

      this.filterViewModel.chkTeam = this.chkTeam;
      this.filterViewModel.selectTeams = this.selectTeams;

      this.filterViewModel.chkPosition = this.chkPosition;
      this.filterViewModel.selectPositions = this.selectPositions;

      this.filterViewModel.chkEmpType = this.chkEmpType;
      this.filterViewModel.selectEmpTypes = this.selectEmpTypes;

      this.filterViewModel.chkJapaneseLevel = this.chkJapaneseLevel;
      this.filterViewModel.selectJapaneseLevels = this.selectJapaneseLevels;

      this.filterViewModel.chkBussinessAllowanceLevel = this.chkBussinessAllowanceLevel;
      this.filterViewModel.selectBussinessAllowanceLevels = this.selectBussinessAllowanceLevels;

      this.filterViewModel.chkBseLevel = this.chkBseLevel;
      this.filterViewModel.selectBseLevels = this.selectBseLevels;

      this.filterViewModel.chkStartWorkingDate = this.chkStartWorkingDate;
      this.filterViewModel.startWorkingDateFrom = this.startWorkingDateFrom;
      this.filterViewModel.startWorkingDateTo = this.startWorkingDateTo;

      this.filterViewModel.chkContractDate = this.chkContractDate;
      this.filterViewModel.contractDateFrom = this.contractDateFrom;
      this.filterViewModel.contractDateTo = this.contractDateTo;

      this.filterViewModel.chkTrialDate = this.chkTrialDate;
      this.filterViewModel.trialDateFrom = this.trialDateFrom;
      this.filterViewModel.trialDateTo = this.trialDateTo;

      this.filterViewModel.chkJobLeaveDate = this.chkJobLeaveDate;
      this.filterViewModel.jobLeaveDateFrom = this.jobLeaveDateFrom;
      this.filterViewModel.jobLeaveDateTo = this.jobLeaveDateTo;

      this.filterViewModel.chkExperence = this.chkExperence;

      this.filterViewModel.chkLearning = this.chkLearning;

      this.filterViewModel.chkTrainingInclude = this.chkTrainingInclude;

      this.filterViewModel.selectDataTypes = this.selectDataTypes;

      //luu dieu kien search 

      //luu trinh tu sap xep
      this.filterViewModel.sort = this.listSelectedItemSorts;
      //thong tin setting chung
      this.getSystemValueUpdate();
      this.filterViewModel.systemValue = this.systemValueViewModel ;
      console.log(this.filterViewModel);

      this._dataService.put('/api/setting/updateempfilter', JSON.stringify(this.filterViewModel))
        .subscribe((response: any) => {
          this.reLoadDataEmp();
          this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));

    }

  }

  private getSystemValueUpdate() {
    this.systemValueViewModel = {};
    this.systemValueViewModel.Code = this.entity.Code;
    this.systemValueViewModel.Name = this.entity.Name;
    this.systemValueViewModel.ShortName = this.entity.ShortName;    
    this.systemValueViewModel.ProcessingYear = this.entity.ProcessingYear;
    this.systemValueViewModel.ExpMonth = this.entity.ExpMonth;
    this.systemValueViewModel.MailAccountName = this.entity.MailAccountName;
    this.systemValueViewModel.MailAccountPassword = this.entity.MailAccountPassword;
    this.systemValueViewModel.MailAccountHalt = this.entity.MailAccountHalt;
    this.systemValueViewModel.IsShowSalaryValue = this.entity.IsShowSalaryValue;
    this.systemValueViewModel.IsShowMoneyValue = this.entity.IsShowMoneyValue;
    this.systemValueViewModel.SidT = this.entity.SidT;
    this.systemValueViewModel.TokT = this.entity.TokT;
  }

  private setSystemValueUpdate() {
    this.entity.Code= this.systemValueViewModel.Code ;
    this.entity.Name = this.systemValueViewModel.Name;
    this.entity.ShortName =this.systemValueViewModel.ShortName ;    
    this.entity.ProcessingYear = this.systemValueViewModel.ProcessingYear ;
    this.entity.ExpMonth =this.systemValueViewModel.ExpMonth  ;
    this.entity.MailAccountName =this.systemValueViewModel.MailAccountName  ;
    this.entity.MailAccountPassword = this.systemValueViewModel.MailAccountPassword ;
    this.entity.MailAccountHalt =this.systemValueViewModel.MailAccountHalt ;
    this.entity.IsShowSalaryValue =this.systemValueViewModel.IsShowSalaryValue  ;
    this.entity.IsShowMoneyValue = this.systemValueViewModel.IsShowMoneyValue ;
    this.entity.SidT =this.systemValueViewModel.SidT ;
    this.entity.TokT =this.systemValueViewModel.TokT ;
  }

  
  selectDataTypeChange(event) {
    if (event.value == 3) {
      this.chkJobLeaveDate = false;
    }
  }

  public selectedStartWorkingDateFrom(value: any) {
    this.startWorkingDateFrom = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedStartWorkingDateTo(value: any) {
    this.startWorkingDateTo = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedTrialDateFrom(value: any) {
    this.trialDateFrom = moment(value.start).format('YYYY/MM/DD');
  }
  public selectedTrialDateTo(value: any) {
    this.trialDateTo = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedContractDateFrom(value: any) {
    this.contractDateFrom = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedContractDateTo(value: any) {
    this.contractDateTo = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedJobLeaveDateFrom(value: any) {
    this.jobLeaveDateFrom = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedJobLeaveDateTo(value: any) {
    this.jobLeaveDateTo = moment(value.start).format('YYYY/MM/DD');
  }

  public selectedProcessingYear(value: any) {
    this.entity.ProcessingYear = moment(value.start).format('YYYY/MM/DD');
  }


  changeCheckboxDept(event) {

  }

  changeCheckboxTeam(event) {

  }

  changeCheckboxPosition(event) {

  }

  changeCheckboxEmpType(event) {

  }

  changeCheckboxStartWorkingDate(event) {

  }

  changeCheckboxJapaneseLevel(event) {

  }

  changeCheckboxBussinessAllowanceLevel(event) {

  }

  changeCheckboxBseLevel(event) {

  }

  changeCheckboxJobLeaveDate(event) {

  }

  addToSortItems($event: any) {
    let data: any = $event.dragData;

  }

  public selectIsShowMoneyValue(event) {
    this.entity.IsShowMoneyValue = event.source._checked;
  }

  public selectIsShowSalaryValue(event) {
    this.entity.IsShowSalaryValue = event.source._checked;
  }


  back() {
    this._router.navigateByUrl(this.backUrl);
  }

  reLoadDataEmp() {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/emp/getallpagingfromview?&keyword=' + this.filter + '&page=1&pageSize=1')
      .subscribe((response: any) => {
        this.emps = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
        // send message to subscribers via observable subject
        if (this.emps.length > 0) {
          this.sendValueToTopMenu.empCount = this.emps[0].TotalRecords.toString();
          this.sendValueToTopMenu.empContractedCount = this.emps[0].ContractedCount.toString();
          this.sendValueToTopMenu.empTrialCount = this.emps[0].TrialCount.toString();
          this.sendValueToTopMenu.empOtherCount = this.emps[0].OtherCount.toString();
          this.sendValueToTopMenu.empContractedLTNMonthCount = this.emps[0].ContractedLTNMonthCount.toString();
          this.sendValueToTopMenu.empOnsiteCount = this.emps[0].OnsiteCount.toString();
          this.sendValueToTopMenu.empTransCount = this.emps[0].TransCount.toString();
          this.sendValueToTopMenu.expMonth = this.emps[0].ExpMonth.toString();
          this.sendValueToTopMenu.empContractedJobLeavedCount = this.emps[0].ContractedJobLeavedCount | 0;
          this.sendValueToTopMenu.empTrialJobLeavedCount = this.emps[0].TrialJobLeavedCount | 0;

          this.sendValueToTopMenu.empTrialJobLeavedInProcessingYearCount = this.emps[0].TrialJobLeavedInProcessingYearCount | 0;
          this.sendValueToTopMenu.empContractedJobLeavedInProcessingYearCount = this.emps[0].ContractedJobLeavedInProcessingYearCount | 0;
          this.sendValueToTopMenu.processingYear = this.emps[0].ProcessingYear | 0;
        }

        this._sharedComponentService.publishValue(this.sendValueToTopMenu);

        this._loaderService.displayLoader(false);

      },
      error => {
        this._notificationService.printErrorMessage('Có lỗi xảy ra khi lấy danh sách nhân viên' + error);
      });
  }

}
