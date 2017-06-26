import { Component, OnInit, ViewChild, ViewContainerRef, NgZone, Input } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { AuthenService } from '../../core/services/authen.service';
import { UtilityService } from '../../core/services/utility.service';

import { MessageContstants } from '../../core/common/message.constants';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';

import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { SearchModalComponent } from '../../shared/search-modal/search-modal.component';

declare var moment: any;

@Component({
  selector: 'app-company',
  host: { '(input-blur)': 'onInputBlur($event)' },
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  @ViewChild('avatar') avatar;

  //common modal
  @ViewChild('childModal') childModal: SearchModalComponent;
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';
  public companys: any[];
  public entity: any;
  public baseFolder: string = SystemConstants.BASE_API;
  public roles: any[];
  public ceoFullName: string = '';
  private emp: any;

  public dateOptions: any = DateRangePickerConfig.dateOptions;

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _uploadService: UploadService,
    public _authenService: AuthenService,
    private viewContainerRef: ViewContainerRef,
    private zone: NgZone) {

    /*if(_authenService.checkAccess('USER')==false){
        _utilityService.navigateToLogin();
    }*/
  }

  ngOnInit() {
    this.ceoFullName = '';
    this.loadData();
  }

  loadData() {
    this._dataService.get('/api/company/getallpaging?&keyword=' + this.filter + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.companys = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      });
  }

  loadDetail(id: any) {
    this._dataService.get('/api/company/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this.entity.CreateDate = moment(new Date(this.entity.CreateDate)).format('YYYY/MM/DD');

      });
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
  showAddModal() {
    this.entity = {};
    this.ceoFullName = '';
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
    if (this.entity.No == undefined) {
      this._dataService.post('/api/company/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/company/update', JSON.stringify(this.entity))
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
    this._dataService.delete('/api/company/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.loadData();
    });
  }
  public selectDeleteFlag(event) {
    this.entity.DeleteFlag = event.target.value
  }

  public selectedDate(value: any) {
    this.entity.CreateDate = moment(value.end._d).format('YYYY/MM/DD');
  }

  selectedData(value: any): void {
    this.ceoFullName = value.value.FullName;
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
        //khởi tạo lại trị
        this.ceoFullName = '';
        //seach & display
        this.loadDetailEmp(id);
        break;

      default:

        break;
    }
  }

  loadDetailEmp(id: any) {
    this._dataService.get('/api/emp/detail/' + id)
      .subscribe((response: any) => {
        this.emp = response;
        this.ceoFullName = '';
        if (this.emp) {
          this.ceoFullName = this.emp.FullName;
        }
      });
  }

}
