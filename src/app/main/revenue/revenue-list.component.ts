import { Component, OnInit } from '@angular/core';
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
//import {DataTable} from 'primeng/components/datatable/datatable';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-revenue-list',
  templateUrl: './revenue-list.component.html',
  styleUrls: ['./revenue-list.component.css']
})
export class RevenueListComponent implements OnInit {

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

  sales: any[];
  stacked: boolean;

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _authenService: AuthenService,
    private _sessionService: SessionService) {

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

    this.loadAllCustomer();

    this.loadData();
    this.reportYearMonth = currentDate;
    this.loadAllRevenueByYearMonth();


    this.sales = [
      { brand: 'Apple', lastYearSale: '51%', thisYearSale: '40%', lastYearProfit: '$54,406.00', thisYearProfit: '$43,342' },
      { brand: 'Samsung', lastYearSale: '83%', thisYearSale: '96%', lastYearProfit: '$423,132', thisYearProfit: '$312,122' },
      { brand: 'Microsoft', lastYearSale: '38%', thisYearSale: '5%', lastYearProfit: '$12,321', thisYearProfit: '$8,500' },
      { brand: 'Philips', lastYearSale: '49%', thisYearSale: '22%', lastYearProfit: '$745,232', thisYearProfit: '$650,323,' },
      { brand: 'Song', lastYearSale: '17%', thisYearSale: '79%', lastYearProfit: '$643,242', thisYearProfit: '500,332' },
      { brand: 'LG', lastYearSale: '52%', thisYearSale: ' 65%', lastYearProfit: '$421,132', thisYearProfit: '$150,005' },
      { brand: 'Sharp', lastYearSale: '82%', thisYearSale: '12%', lastYearProfit: '$131,211', thisYearProfit: '$100,214' },
      { brand: 'Panasonic', lastYearSale: '44%', thisYearSale: '45%', lastYearProfit: '$66,442', thisYearProfit: '$53,322' },
      { brand: 'HTC', lastYearSale: '90%', thisYearSale: '56%', lastYearProfit: '$765,442', thisYearProfit: '$296,232' },
      { brand: 'Toshiba', lastYearSale: '75%', thisYearSale: '54%', lastYearProfit: '$21,212', thisYearProfit: '$12,533' }
    ];

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
        this.revenueAllYearMonths = response;
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
    //console.log(this.revenueSelectedYearMonths);
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
        console.log(this.customers);
      },
      error => {
        this._notificationService.printErrorMessage('Có lỗi xảy ra khi lấy danh sách khách hàng' + error);
      });
  }

  toggle() {
    this.stacked = !this.stacked;
  }

  calculateGroupTotal(customerID: any) {
    let total = 0;

    if (this.revenues) {
      for (let item of this.revenues) {
        if (item.CustomerID === customerID) {
          total += item.InMonthSumMM;
        }
      }
    }

    return total;
  }

  saveSearchModelToLocalStorage() {
    this._sessionService.setByKey(SystemConstants.SESSION_KEY_SEARCH_ITEM_MODEL, this.searchModel);
  }

  loadSearchModelFromLocalStorage() {
    //setting init dieu kien search dua vao session da luu
    this.searchModelSession = this._sessionService.getByKey(SystemConstants.SESSION_KEY_SEARCH_ITEM_MODEL);

    this.revenueSelectedYearMonths = Array.from(this.searchModelSession.DateTimeItems);
    this.selectCustomers = Array.from(this.searchModelSession.NumberItems);

  }

  onChange(event) {
    //console.log(event);
  }


}
