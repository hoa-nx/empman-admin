import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { MessageContstants } from '../../core/common/message.constants';
import * as moment from 'moment';
import { ISearchItemViewModel, IMasterDetailItemViewModel, PaginatedResult } from '../../core/interfaces/interfaces';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { MappingService } from '../../shared/utils/mapping.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit, AfterViewInit {

  // Settings configuration
  //https://github.com/softsimon/angular-2-dropdown-multiselect
  mySettings: IMultiSelectSettings = {
      enableSearch: true,
      checkedStyle: 'fontawesome',
      buttonClasses: 'btn btn-default btn-block',
      dynamicTitleMaxItems: 3,
      showCheckAll : true,
      showUncheckAll : true,
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
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public revenues: any[];
  public estimateType: any;
  public customers: IMultiSelectOption[] = [];
  public selectCustomers: any[] = [];
  public customer: any;
  public projectDetail: any;

  public entity: any;
  public baseFolder: string = SystemConstants.BASE_API;
  public dateOptions: any = DateRangePickerConfig.dateOptions;
  public reportYearMonth: any;
  public searchModel: any;
  public revenueAllYearMonths: IMultiSelectOption[] = [];
  public revenueSelectedYearMonths: any[] = [];
  public checkedItems: any[];
  public searchModelSession: any;

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _authenService: AuthenService,
    private _sessionService: SessionService
  ) {

    this.searchModel = {
      Page: 1,
      PageSize: 20
    };
  }

  /**
   * Init các xử lý
   */
  ngOnInit() {
    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/01");
    this.reportYearMonth = currentDate;
    
    this.revenueSelectedYearMonths =[];
    this.selectCustomers =[];

    this.loadAllCustomer();
    this.loadAllRevenueByYearMonth();

    //this.loadData();

  }

  ngAfterViewInit(): void {
    
  }

  /**
   * Lấy dữ liệu báo cáo doanh số
   */
  loadData() {
    this.searchModel.Keyword = this.filter;
    this.searchModel.DateTimeItems = this.revenueSelectedYearMonths;

    this.searchModel.NumberItems = this.selectCustomers;
    this.searchModel.Page = this.pageIndex;
    this.searchModel.PageSize = this.pageSize;

    //save dieu kien search vao session
    this.saveSearchModelToLocalStorage();

    //this._dataService.get('/api/revenue/getallpagingmasterdata?&bodyData=' + JSON.stringify(this.searchModel) + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
    this._dataService.post('/api/revenue/getallpagingmasterdata', JSON.stringify(this.searchModel))
      //this._dataService.get('/api/revenue/getallpaging?&keyword=' + this.filter + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.revenues = response.Items;
        this.estimateType = response.Items.EstimateType;
        this.customer = response.Items.Customer;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;

      },
      error => {
        this._notificationService.printErrorMessage('Không thể đọc được dữ liệu. ' + error);
      });
  }
  /**
   * Lấy tất cả các tháng năm đã có trong bảng doanh số
   */
  loadAllRevenueByYearMonth() {
    this.searchModel.Keyword = this.filter;
    this._dataService.get('/api/revenue/getalldatabyyearmonth')
      .subscribe((response: any) => {
        //map 
        this.revenueAllYearMonths = MappingService.mapYearMonhToDropdownModel(response);
        this.loadSearchModelFromLocalStorage();
      },
      error => {
        this._notificationService.printErrorMessage('Không thể đọc được dữ liệu. ' + error);
      });
  }
  /**
 *Lấy cấu trúc cây của dữ liệu doanh số 
 */
  getRevenueTreeview() {
    this._dataService.get('/api/revenue/getlisttreeview?&keyword=' + this.filter)
      .subscribe((response: any) => {
        //todo
      },
      error => {
        this._notificationService.printErrorMessage('Không thể đọc được dữ liệu. ' + error);
      });
  }
  /**
   * Tìm kiếm dữ liệu doanh số
   */
  search() {
    this.loadData();
  }
  /**
   * Page thay đổi thì get lại dữ liệu
   */
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
  /**
   * Xóa nhiều dòng chọn trên list
   */
  public deleteMulti() {
    this.checkedItems = this.revenues.filter(x => x.Checked);
    if (this.checkedItems.length > 0) {
      var checkedIds = [];
      for (var i = 0; i < this.checkedItems.length; ++i)
        checkedIds.push(this.checkedItems[i]["ID"]);

      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
        this._dataService.delete('/api/revenue/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
          this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
          this.search();
        }, error => this._dataService.handleError(error));
      });
    }

  }

  onChange(event) {
      //console.log(event);
  }

  /**
   * Format dữ liệu
   */
  public selectedReportYearMonthDate(value: any) {
    this.reportYearMonth = moment(value.end._d).format('YYYY/MM/01');
  }

  public onSelectedChange(event: any) {


  }

  loadAllCustomer() {
    this._dataService.get('/api/customer/getall')
      .subscribe((response: any) => {
        //map 
        this.customers = MappingService.mapIdNameToDropdownModel(response);
        this.loadSearchModelFromLocalStorage();
      },
      error => {
        this._notificationService.printErrorMessage('Có lỗi xảy ra khi lấy danh sách khách hàng' + error);
      });
  }

  saveSearchModelToLocalStorage() {
    this._sessionService.setByKey(SystemConstants.SESSION_KEY_SEARCH_ITEM_MODEL, this.searchModel);
  }

  loadSearchModelFromLocalStorage(){
    //setting init dieu kien search dua vao session da luu
    this.searchModelSession = this._sessionService.getByKey(SystemConstants.SESSION_KEY_SEARCH_ITEM_MODEL);
    
    this.revenueSelectedYearMonths = Array.from(this.searchModelSession.DateTimeItems);
    this.selectCustomers = Array.from(this.searchModelSession.NumberItems);

  }


}
