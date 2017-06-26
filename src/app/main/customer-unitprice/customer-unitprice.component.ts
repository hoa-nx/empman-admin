import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { AuthenService } from '../../core/services/authen.service';
import { UtilityService } from '../../core/services/utility.service';

import { MessageContstants } from '../../core/common/message.constants';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';

declare var moment: any;

@Component({
  selector: 'app-customer-unitprice',
  templateUrl: './customer-unitprice.component.html',
  styleUrls: ['./customer-unitprice.component.css']
})
export class CustomerUnitpriceComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  @ViewChild('avatar') avatar;

  //common modal
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public customerUnitPrices: any[];
  public entity: any;
  public baseFolder: string = SystemConstants.BASE_API;
  public orderUnits: any[];
  public customers: any[];
  public customerName : any;
  public dateOptions: any = DateRangePickerConfig.dateOptions;

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _uploadService: UploadService,
    public _authenService: AuthenService) {

    /*if(_authenService.checkAccess('USER')==false){
        _utilityService.navigateToLogin();
    }*/
  }

  ngOnInit() {
    this.loadData();
    this.loadMultiTable();
  }

  loadData() {
    this._dataService.get('/api/customerunitprice/getallpaging?&keyword=' + this.filter + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.customerUnitPrices = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      });
  }

  /**
 * Load các dữ liệu master
 */
  loadMultiTable() {
    let uri = [];
    uri.push('/api/masterdetail/getbykbn/25');
    uri.push('/api/customer/getall');

    this._dataService.getMulti(uri)
      .subscribe((response: any) => {
        this.orderUnits = response[0];   //đơn vị tính order
        this.customers = response[1];   //KH
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  loadDetail(id: any) {
    this._dataService.get('/api/customerunitprice/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this.entity.StartDate = moment(new Date(this.entity.StartDate)).format('YYYY/MM/DD');
        this.entity.EndDate = moment(new Date(this.entity.EndDate)).format('YYYY/MM/DD');
      });
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
  showAddModal() {
    this.entity = {};
    this.modalAddEdit.show();
  }
  showEditModal(id: any) {
    this.loadDetail(id);
    this.modalAddEdit.show();
  }
  saveChange(valid: boolean) {
    if (valid) {
      this.saveData();
    }
  }
  private saveData() {
    this.entity.OrderUnitMasterID = 25;
    if (this.entity.ID == undefined) {
      this._dataService.post('/api/customerunitprice/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/customerunitprice/update', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
  }
  deleteItem(id: any) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => this.deleteItemConfirm(id));
  }
  deleteItemConfirm(id: any) {
    this._dataService.delete('/api/customerunitprice/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.loadData();
    });
  }

  public selectedStartDate(value: any) {
    this.entity.StartDate = moment(value.end._d).format('YYYY/MM/DD');
  }

  public selectedEndDate(value: any) {
    this.entity.EndDate = moment(value.end._d).format('YYYY/MM/DD');
  }

  selectedData(value: any): void {
    this.entity.CeoID = value.value.ID;

  }

  public onChangeOrderUnit(value: any) {
    if (value) {

    }
  }

  public onChangeCustomer(value: any) {
    if (value) {

    }
  }

  onInputBlur(event) {
    switch (event.target.name) {
      case 'ceoid':

        //get name from code
        let id: any = 0;
        id = event.target.value | 0;
        //kiem tra xem co thay doi tri hay khong?
        if (id === this.entity.CeoID) {
          return;
        }
        //seach & display

        break;

      default:

        break;
    }
  }


}
