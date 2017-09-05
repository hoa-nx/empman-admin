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
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.css']
})
export class MasterDataComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterKeyword: string = '';
  public filterMasterID: number;
  public masterDetails: any[];
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
    this.loadDataMasters();
  }

  private loadDataMasters() {
    this._dataService.get('/api/master/getall').subscribe((response: any[]) => {
      this.masters = response;
    }, error => this._dataService.handleError(error));
  }

  public search() {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/masterdetail/getall?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&keyword=' + this.filterKeyword + '&filterMasterID=' + this.filterMasterID)
      .subscribe((response: any) => {
        this.masterDetails = response.Items;
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

  loadDetail(masterID: any, masterDetailID: any, isCopy : boolean=false) {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/masterdetail/detailpk?masterID=' + masterID + '&masterDetailID=' + masterDetailID)
      .subscribe((response: any) => {
        this.entity = response;
        this._loaderService.displayLoader(false);
        if(isCopy){
          this.entity.ID = undefined;
        }
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
  showEditModal(masterID: any, masterDetailID: any) {
    this.loadDetail(masterID, masterDetailID);
    this.modalAddEdit.show();
  }
  showCopyModal(masterID: any, masterDetailID: any) {
    this.loadDetail(masterID,masterDetailID, true);
    this.modalAddEdit.show();
  }
  saveChange(form: NgForm) {
    if (form.valid) {
      this.saveData(form);
    }
  }
  private saveData(form: NgForm) {
    if (this.entity.ID == undefined) {
      this._dataService.post('/api/masterdetail/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.search();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/masterdetail/update', JSON.stringify(this.entity))
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
    this._dataService.delete('/api/masterdetail/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.search();
    });
  }

  public deleteMulti() {
    this.checkedItems = this.masterDetails.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; ++i)
      checkedIds.push(this.checkedItems[i]["ID"]);

    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/masterdetail/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
        this.search();
      }, error => this._dataService.handleError(error));
    });
  }


  public selectedStartDate(value: any) {
    this.entity.StartDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedEndDate(value: any) {
    this.entity.EndDate = moment(value).format('YYYY/MM/DD');
  }

  public onChangeMaster(event: any) {
    this.search();
  }

  changeCheckboxIsAllowanceType(event) {

  }
}
