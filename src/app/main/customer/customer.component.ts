import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { AuthenService } from '../../core/services/authen.service';
import { UtilityService } from '../../core/services/utility.service';

import { MessageContstants } from '../../core/common/message.constants';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { NgForm } from '@angular/forms';

declare var moment: any;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  @ViewChild('avatar') avatar;

  //common modal
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public customers: any[];
  public entity: any;
  public baseFolder: string = SystemConstants.BASE_API;
  public orderUnits: any[];

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
    this._dataService.get('/api/customer/getallpaging?&keyword=' + this.filter + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.customers = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      }, error => this._dataService.handleError(error));
  }

  /**
 * Load các dữ liệu master
 */
  loadMultiTable() {
    let uri = [];
    uri.push('/api/masterdetail/getbykbn/25');

    this._dataService.getMulti(uri)
      .subscribe((response: any) => {
        this.orderUnits = response[0];   //đơn vị tính order
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  loadDetail(id: any, isCopy : boolean=false) {
    this._dataService.get('/api/customer/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this.entity.ContractDate = moment(new Date(this.entity.ContractDate)).format('YYYY/MM/DD');
        if(isCopy){
          this.entity.ID = undefined;
        }
      }, error => this._dataService.handleError(error));
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

  showCopyModal(id: any) {
    this.loadDetail(id, true);
    this.modalAddEdit.show();
  }
  
  saveChange(form: NgForm) {
    if (form.valid) {
      this.saveData(form);
    }
  }
  private saveData(form: NgForm) {
    this.entity.DefaultOrderUnitMasterID = 25;
    if (this.entity.No == undefined) {
      this._dataService.post('/api/customer/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/customer/update', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
  }
  deleteItem(id: any) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => this.deleteItemConfirm(id));
  }
  deleteItemConfirm(id: any) {
    this._dataService.delete('/api/customer/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.loadData();
    });
  }

  public selectedContractDate(value: any) {
    this.entity.ContractDate = moment(value).format('YYYY/MM/DD');
  }

  selectedData(value: any): void {
    this.entity.CeoID = value.value.ID;

  }

  public onChangeOrderUnit(value: any) {
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
