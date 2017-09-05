import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { AuthenService } from '../../core/services/authen.service';
import { UtilityService } from '../../core/services/utility.service';

import { MessageContstants } from '../../core/common/message.constants';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { Fab } from '../../shared/components/fab-button/fab';
import { FabButton } from '../../shared/components/fab-button/fabbutton';
import { FabToggle } from '../../shared/components/fab-button/fabtoggle';
import { NgForm } from '@angular/forms';

declare var moment: any;

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.css']
})
export class ExchangeRateComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  @ViewChild('avatar') avatar;

  //common modal
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public exchangeRates: any[];
  public entity: any;
  public baseFolder: string = SystemConstants.BASE_API;
  private emp: any;

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
  }

  loadData() {
    this._dataService.get('/api/exchangerate/getallpaging?&keyword=' + this.filter + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.exchangeRates = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      }, error => this._dataService.handleError(error));
  }

  loadDetail(id: any , isCopy : boolean=false) {
    this._dataService.get('/api/exchangerate/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this.entity.StartDate = moment(new Date(this.entity.StartDate)).format('YYYY/MM/DD');
        this.entity.EndDate = moment(new Date(this.entity.EndDate)).format('YYYY/MM/DD');
        if(isCopy){
          this.entity.ID = 0;
          this.entity.No = undefined;
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
    if (this.entity.No == undefined) {
      this._dataService.post('/api/exchangerate/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/exchangerate/update', JSON.stringify(this.entity))
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
    this._dataService.delete('/api/exchangerate/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.loadData();
    }, error => this._dataService.handleError(error));
  }
  
  public selectedStartDate(value: any) {
    this.entity.StartDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedEndDate(value: any) {
    this.entity.EndDate = moment(value).format('YYYY/MM/DD');
  }

  selectedData(value: any): void {
    this.entity.CeoID = value.value.ID;

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
