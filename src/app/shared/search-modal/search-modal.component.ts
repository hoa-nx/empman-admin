import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { SystemConstants } from '../../core/common/system.constants';

declare var $ : any;
@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css']
})


export class SearchModalComponent implements OnInit {
  @ViewChild('childModal') public childModal: ModalDirective;
  @Input() title: string;
  @Input() searchTableName: string;
  @Input() searchWhereClause: string;
  @Input() searchOrderClause: string;


  public pageIndexModal: number = 1;
  public pageSizeModal: number = 10;
  public pageDisplayModal: number = 10;
  public totalRowModal: number;
  public filterModal: string = '';
  public datas: any[];
  public selected: any;
  public baseFolder: string = SystemConstants.BASE_API;

  public dateOptions: any = {
    locale: { format: 'YYYY/MM/DD' },
    showDropdowns: true,
    alwaysShowCalendars: false,
    autoUpdateInput: false,
    singleDatePicker: true
  };

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService) { }

  ngOnInit() {

    //load data cho table doi tuong
    this.loadDataModal(this.searchTableName.toLowerCase);

  }

  loadDataModal(tableName) {
    switch (tableName) {

      case 'company': {
        //search trong bang COMPANY
        this.loadCompanyModal();
        break;
      }

      case 'emp': {
        //search trong bang EMP
        this.loadEmpModal();
        break;
      }

      default: {
        //search trong bang EMP
        this.loadEmpModal();
        break;
      }
    }


  }

  loadCompanyModal() {
    this._dataService.get('/api/company/getallpaging?&keyword=' + this.filterModal + '&page=' + this.pageIndexModal + '&pageSize=' + this.pageSizeModal)
      .subscribe((response: any) => {
        this.datas = response.Items;
        this.pageIndexModal = response.PageIndex;
        this.pageSizeModal = response.PageSize;
        this.totalRowModal = response.TotalRows;
      },
      error => {
        this._notificationService.printErrorMessage('Có lỗi xảy ra khi lấy danh công ty' + error);
      });

  }

  loadEmpModal() {
    this._dataService.get('/api/emp/getallpaging?&keyword=' + this.filterModal + '&page=' + this.pageIndexModal + '&pageSize=' + this.pageSizeModal)
      .subscribe((response: any) => {
        this.datas = response.Items;
        this.pageIndexModal = response.PageIndex;
        this.pageSizeModal = response.PageSize;
        this.totalRowModal = response.TotalRows;
      },
      error => {
        this._notificationService.printErrorMessage('Có lỗi xảy ra khi lấy danh sách nhân viên' + error);
      });
  }

  pageChangedModal(event: any): void {
    this.pageIndexModal = event.page;
    this.loadDataModal(this.searchTableName.toLowerCase);
  }

  selectedRow(event: any) {
    $("tr").click(function () {
      $(this).addClass("selected").siblings().removeClass("selected");
    });
  }
  /* event child modal */

  hideChildModal() {
    this.childModal.hide();
  }
  show() {
    this.childModal.show();
  }

  ok() {
    //tra ve tri nguoi su dung da chon
    console.log(this.selected);
    this.childModal.hide();
  }

  cancel() {
    this.childModal.hide();
  }


}
