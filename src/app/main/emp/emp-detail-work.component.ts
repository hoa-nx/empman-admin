import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { MessageContstants } from '../../core/common/message.constants';
import * as moment from 'moment';
import { ISearchItemViewModel, IMasterDetailItemViewModel, PaginatedResult, IEmpFilterViewModel } from '../../core/interfaces/interfaces';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { MappingService } from '../../shared/utils/mapping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { LoaderService } from '../../shared/utils/spinner.service';
import { MasterKbnEnum } from '../../core/common/shared.enum';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { DateTimeHelper } from '../../shared/utils/datetime-helper';
import { SharedComponentService } from '../../core/services/sharedcomponent.service';
import { ItemsService } from '../../shared/utils/items.service';
import { UploadService } from '../../core/services/upload.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-emp-detail-work',
  templateUrl: './emp-detail-work.component.html',
  styleUrls: ['./emp-detail-work.component.css']
})
export class EmpDetailWorkComponent implements OnInit {

  public uriAvatarPath: string = SystemConstants.BASE_API;
  public sourceEmps: any[];
  public targetEmps: any[];

  // Settings configuration
  //https://github.com/softsimon/angular-2-dropdown-multiselect
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    showCheckAll: false,
    showUncheckAll: false,
    displayAllSelectedText: true,
    selectionLimit: 1
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

  public chkCustomer: boolean = false;
  public customers: any[] = [];
  public selectCustomers: any[] = [];
  
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

  public chkRoomWithInternetAllowanceLevel: boolean = false;
  public roomWithInternetAllowanceLevels: any[] = [];
  public selectRoomWithInternetAllowanceLevels: any[] = [];


  public chkRoomNoInternetAllowanceLevel: boolean = false;
  public roomNoInternetAllowanceLevels: any[] = [];
  public selectRoomNoInternetAllowanceLevels: any[] = [];

  public chkBseLevel: boolean = false;
  public bseLevels: any[] = [];
  public selectBseLevels: any[] = [];

  public chkEmpType: boolean = false;
  public empTypes: any[] = [];
  public selectEmpTypes: any[] = [];

  public chkEducationLevel: boolean = false;
  public educationLevels: any[] = [];
  public selectEducationLevels: any[] = [];

  public chkCollect: boolean = false;
  public collects: any[] = [];
  public selectCollects: any[] = [];

  public chkContractType: boolean = false;
  public contractTypes: any[] = [];
  public selectContractTypes: any[] = [];

  public chkWorkEmpType: boolean = false;
  public workEmpTypes: any[] = [];
  public selectWorkEmpTypes: any[] = [];

  public entity: any = {};
  public baseFolder: string = SystemConstants.BASE_API;
  public dateOptions: any = DateRangePickerConfig.dateOptions;

  public checkedItems: any[];
  public allMasterDetails: any[];

  public user: LoggedInUser;
  private sub: any;
  private backUrl: any | '';
  private id: any | 0;
  public actionParam: any;
  public emps: any[];

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
    private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.entity = {};
    this.entity.IsDetailWorkCreateData = false;
    this.user = this._authenService.getLoggedInUser();
    //load master data va thuc thi cac xu ly load data chi tiet
    this.loadMultiTableCallBack();

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
    this.targetEmps = [];
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
    uri.push('/api/emp/getall');
    uri.push('/api/customer/getall');

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

        this.emps = response[4];
        this.sourceEmps = response[4];
        this.customers = MappingService.mapIdNameToDropdownModel(response[5]);
        
        this.japaneseLevels = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.JapaneseLevel));

        this.bussinessAllowanceLevels = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.BusinessAllowanceLevel));

        this.bseLevels = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.BseAllowanceLevel));

        this.empTypes = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.EmpType));

        this.educationLevels = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.EducationLevel));
        this.collects = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.CollectNameList));
        this.contractTypes = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.ContractType));
        this.workEmpTypes = MappingService.mapMasterDetailToDropdownModel(this.allMasterDetails.filter(x => x.MasterID == MasterKbnEnum.WorkEmpType));
        //nhom mau 
        //this.bloodGroups = BloodGroup.BloodGroups;

        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  public saveChange(val) {
    this.setMasterKbnId();
    let hasItemUpdate : boolean = false;

    if (val) {
      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_REGISTER_MSG, () => {

        this.entity.CompanyID = this.user.companyid;

        if (this.chkDept) {
          this.entity.DeptID = this.selectDepts[0];
          hasItemUpdate = true;
        }

        if (this.chkTeam) {
          this.entity.TeamID = this.selectTeams[0];
          hasItemUpdate = true;
        }

        if (this.chkPosition) {
          this.entity.PositionID = this.selectPositions[0];
          hasItemUpdate = true;
        }
        /*
        this.entity.CompanyID2 = this.user.companyid;
        
        if(this.chkDept){
          this.entity.DeptID2 = this.selectDepts[0];
          hasItemUpdate = true;
        }

        if(this.chkTeam){
          this.entity.TeamID2 = this.selectTeams[0];
          hasItemUpdate = true;
        }

        if(this.chkPosition){
          this.entity.PositionID2 = this.selectPositions[0];
          hasItemUpdate = true;
        }
        */
        if (this.chkWorkEmpType) {
          this.entity.WorkEmpTypeMasterDetailID = this.selectWorkEmpTypes[0];
          this.entity.OnsiteCustomerID = this.selectCustomers[0];
          hasItemUpdate = true;
        }
        if (this.chkEmpType) {
          this.entity.EmpTypeMasterDetailID = this.selectEmpTypes[0];
          hasItemUpdate = true;
        }
        if (this.chkJapaneseLevel) {
          this.entity.JapaneseLevelMasterDetailID = this.selectJapaneseLevels[0];
          hasItemUpdate = true;
        }
        if (this.chkBussinessAllowanceLevel) {
          this.entity.BusinessAllowanceLevelMasterDetailID = this.selectBussinessAllowanceLevels[0];
          hasItemUpdate = true;
        }
        if (this.chkRoomWithInternetAllowanceLevel) {
          this.entity.RoomWithInternetAllowanceLevelMasterDetailID = this.selectRoomWithInternetAllowanceLevels[0];
          hasItemUpdate = true;
        }
        if (this.chkRoomNoInternetAllowanceLevel) {
          this.entity.RoomNoInternetAllowanceLevelMasterDetailID = this.selectRoomNoInternetAllowanceLevels[0];
          hasItemUpdate = true;
        }
        if (this.chkBseLevel) {
          this.entity.BseAllowanceLevelMasterDetailID = this.selectBseLevels[0];
          hasItemUpdate = true;
        }
        if (this.chkCollect) {
          this.entity.CollectMasterDetailID = this.selectCollects[0];
          hasItemUpdate = true;
        }
        if (this.chkEducationLevel) {
          this.entity.EducationLevelMasterDetailID = this.selectEducationLevels[0];
          hasItemUpdate = true;
        }
        if (this.chkContractType) {
          this.entity.ContractTypeMasterDetailID = this.selectContractTypes[0];
          hasItemUpdate = true;
        }

        this.entity.ListEmpID = this.targetEmps.map(x => x.ID);
        if(this.targetEmps.length==0){
          hasItemUpdate = false;
        }

        if(hasItemUpdate==false){
          this._notificationService.printAlertDialog(MessageContstants.ALERT_NOT_HAS_ITEM_UPDATE_MSG,()=>{});
          return;
        }

        this._dataService.put('/api/empdetailwork/add', JSON.stringify(this.entity))
          .subscribe((response: any) => {
            this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
          }, error => this._dataService.handleError(error));
      });

    }

  }

  private setMasterKbnId() {
    this.entity.WorkEmpTypeMasterID = MasterKbnEnum.WorkEmpType;
    this.entity.EmpTypeMasterID = MasterKbnEnum.EmpType;
    this.entity.ContractTypeMasterID = MasterKbnEnum.ContractType;
    this.entity.JapaneseLevelMasterID = MasterKbnEnum.JapaneseLevel;
    this.entity.BusinessAllowanceLevelMasterID = MasterKbnEnum.BusinessAllowanceLevel;
    this.entity.RoomWithInternetAllowanceLevelMasterID = MasterKbnEnum.RoomWithInternetAllowanceLevel;
    this.entity.RoomNoInternetAllowanceLevelMasterID = MasterKbnEnum.RoomNoInternetAllowanceLevel;
    this.entity.BseAllowanceLevelMasterID = MasterKbnEnum.BseAllowanceLevel;
    this.entity.CollectMasterID = MasterKbnEnum.CollectNameList;
    this.entity.EducationLevelMasterID = MasterKbnEnum.EducationLevel;

  }

  public selectedStartDate(value: any) {
    this.entity.StartDate = moment(value).format('YYYY/MM/DD');
  }

  
  public selectedEndDate(value: any) {
    this.entity.EndDate = moment(value).format('YYYY/MM/DD');
  }


  changeCheckboxDept(event:any) {

  }

  changeCheckboxTeam(event:any) {

  }

  changeCheckboxPosition(event:any) {

  }

  changeCheckboxEmpType(event:any) {

  }


  changeCheckboxJapaneseLevel(event:any) {

  }

  changeCheckboxBussinessAllowanceLevel(event:any) {

  }

  changeCheckboxBseLevel(event:any) {

  }

  changeCheckboxWorkEmpTypes(event:any) {

  }

  onChangeWorkEmpTypes(event:any){
    
  }

  changeCheckboxDetailWorkCreateData(event : any){

  }

  changeCheckboxEducationLevel(event : any){
    
  }

  changeCheckboxCollect(event : any){
    
  }

  changeCheckboxContractType(event : any){
    
  }

  changeCheckboxRoomWithInternetAllowanceLevel(event : any){

  }

  changeCheckboxRoomNoInternetAllowanceLevel(event : any){
    
  }
  
  back() {
    this._router.navigateByUrl(this.backUrl);
  }

}
