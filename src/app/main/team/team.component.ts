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
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;

  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterKeyword: string = '';
  public filterDeptID: number;
  public emps: any[];
  public depts: any[];
  public teams: any[];
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
    this.loadDataDepts();
    this.loadDataEmps();

  }

  private loadDataDepts() {
    this._dataService.get('/api/dept/getall').subscribe((response: any[]) => {
      this.depts = response;
    }, error => this._dataService.handleError(error));
  }

  private loadDataEmps() {
    this._dataService.get('/api/emp/getall').subscribe((response: any[]) => {
      this.emps = response;
    }, error => this._dataService.handleError(error));
  }

  public search() {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/team/getall?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&keyword=' + this.filterKeyword + '&filterDeptID=' + this.filterDeptID)
      .subscribe((response: any) => {
        this.teams = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
        this._loaderService.displayLoader(false);

      }, error => this._dataService.handleError(error));
  }

  public reset() {
    this.filterKeyword = '';
    this.filterDeptID = null;
    this.search();
  }

  loadDetail(id: any, isCopy : boolean=false) {
    this._dataService.get('/api/team/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
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
      this._dataService.post('/api/team/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.search();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/team/update', JSON.stringify(this.entity))
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
    this._dataService.delete('/api/team/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.search();
    });
  }

  public deleteMulti() {
    this.checkedItems = this.depts.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; ++i)
      checkedIds.push(this.checkedItems[i]["ID"]);

    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/team/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
        this.search();
      }, error => this._dataService.handleError(error));
    });
  }


  public selectedCreateDate(value: any) {
    this.entity.CreateDate = moment(value).format('YYYY/MM/DD');
  }

  public onChangeDept(event: any) {

  }

}
