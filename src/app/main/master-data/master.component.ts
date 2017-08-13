import { Component, OnInit, ViewChild, ViewContainerRef, NgZone, Input } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { AuthenService } from '../../core/services/authen.service';
import { UtilityService } from '../../core/services/utility.service';

import { MessageContstants } from '../../core/common/message.constants';
import { SystemConstants } from '../../core/common/system.constants';

import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { LoaderService } from '../../shared/utils/spinner.service';
import { NgForm } from '@angular/forms';

declare var moment: any;

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterKeyword: string = '';
  public filterMasterID: number;
  public masters: any[];
  public checkedItems: any[];

  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _uploadService: UploadService,
    public _authenService: AuthenService,
    private viewContainerRef: ViewContainerRef,
    private zone: NgZone,
    private _loaderService: LoaderService) {

    /*if(_authenService.checkAccess('USER')==false){
        _utilityService.navigateToLogin();
    }*/
  }

  ngOnInit() {
  
  }

  public search() {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/master/getallpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&keyword=' + this.filterKeyword)
      .subscribe((response: any) => {
        this.masters = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
        this._loaderService.displayLoader(false);
      }, error => this._dataService.handleError(error));
  }
  public reset() {
    this.filterKeyword = '';
    this.filterMasterID = null;
    this.search();
  }

  loadDetail(id: any) {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/master/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this._loaderService.displayLoader(false);

      });
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }
  showAddModal() {
    this.entity = {};
    this.modalAddEdit.show();
  }
  showEditModal(id: any) {
    this.loadDetail(id);
    this.modalAddEdit.show();
  }
  saveChange(form: NgForm) {
    if (form.valid) {
      this.saveData(form);
    }
  }
  private saveData(form: NgForm) {
    if (this.entity.No == undefined) {
      this._dataService.post('/api/master/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.search();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/master/update', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.search();
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
    this._dataService.delete('/api/master/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.search();
    });
  }

  public deleteMulti() {
    this.checkedItems = this.masters.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; ++i)
      checkedIds.push(this.checkedItems[i]["ID"]);

    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/master/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
        this.search();
      }, error => this._dataService.handleError(error));
    });
  }

  changeCheckboxIsAllowanceType(event) {

  }
}
