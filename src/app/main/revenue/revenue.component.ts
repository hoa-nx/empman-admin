import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { MessageContstants } from '../../core/common/message.constants';
import * as moment from 'moment';
import { ISearchItemViewModel, IMasterDetailItemViewModel, PaginatedResult } from '../../core/interfaces/interfaces';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {

  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public revenues: any[];
  public estimateType: any;
  public customer: any;
  public projectDetail: any;

  public entity: any;
  public baseFolder: string = SystemConstants.BASE_API;
  public dateOptions: any = DateRangePickerConfig.dateOptions;
  public reportYearMonth: any;
  public searchModel: any;
  public revenueAllYearMonths: IMultiSelectOption[] = [];
  public revenueSelectedYearMonths: string[] = [];
  public checkedItems: any[];

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _authenService: AuthenService) {

    this.searchModel = {
      Page : 1,
      PageSize : 20
    };
  }

  /**
   * Init các xử lý
   */
  ngOnInit() {
    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/01");
    
    this.loadData();
    this.reportYearMonth = currentDate ;
    this.loadAllRevenueByYearMonth();

  }

  /**
   * Lấy dữ liệu báo cáo doanh số
   */
  loadData() {
    this.searchModel.Keyword = this.filter;
    this.searchModel.DateItems = this.revenueSelectedYearMonths;
    this.searchModel.Page  = this.pageIndex;
    this.searchModel.PageSize  = this.pageSize;
    //this._dataService.get('/api/revenue/getallpagingmasterdata?&bodyData=' + JSON.stringify(this.searchModel) + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
    this._dataService.post('/api/revenue/getallpagingmasterdata',JSON.stringify(this.searchModel))
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
}
