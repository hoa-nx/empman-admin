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
import { DomSanitizer } from '@angular/platform-browser';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterKbnEnum } from '../../core/common/shared.enum';
import { MappingService } from '../../shared/utils/mapping.service';

declare var moment: any;


@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.css']
})
export class RecruitmentComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  @ViewChild("filePathRecruitment") filePathRecruitment;

  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterKeyword: string = '';
  public filterMasterID: number;
  public recruitments: any[];
  public recruitmentTypes: any[];
  public primeModelRecruitmentTypes :any[];
  public filterRecruitmentTypeID: any[] = [];
  public checkedItems: any[];
  public emps: any[];
  public fileStorages: any[];
  public fileModel: any;
  public user: LoggedInUser;
  public sub: any;
  public paramId: any;
  public paramAction: any;
  public searchModel: any = {};

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _uploadService: UploadService,
    public _authenService: AuthenService,
    private viewContainerRef: ViewContainerRef,
    private zone: NgZone,
    private _loaderService: LoaderService,
    private _sanitizer: DomSanitizer) {

    /*if(_authenService.checkAccess('USER')==false){
        _utilityService.navigateToLogin();
    }*/
  }

  ngOnInit() {

    this.user = this._authenService.getLoggedInUser();
    //get params
    this.sub = this._route
      .params
      .subscribe(params => {
        this.paramId = params['id'];
        this.paramAction = params['action'];
        
        if(this.paramId==undefined)
          this.paramId='';

        this.filterKeyword =  this.paramId ;

        this.search();
      });
    
    
    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/DD");

    this.loadMultiTableCallBack();
  }

  /**
   * Load các dữ liệu master
   */
  loadMultiTable() {
    let uri = [];
    uri.push('/api/masterdetail/getbykbn/30');
    uri.push('/api/emp/getall');

    return this._dataService.getMulti(uri);
  }

  loadMultiTableCallBack() {
    this._loaderService.displayLoader(true);
    this.loadMultiTable()
      .subscribe((response: any) => {
        this.recruitmentTypes = response[0];        //Loại tuyển dụng
        this.emps = response[1];                    //nhan vien

        this.primeModelRecruitmentTypes = MappingService.mapMasterDetailToPrimeMultiSelectModel(this.recruitmentTypes);

        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }


  formatDateDisplay() {

    if (this.entity.AnsRecruitDeptDeadlineDate) {
      this.entity.AnsRecruitDeptDeadlineDate = moment(this.entity.AnsRecruitDeptDeadlineDate).format('YYYY/MM/DD HH:mm');
    }
    if (this.entity.AnsLocalDeadlineDate) {
      this.entity.AnsLocalDeadlineDate = moment(this.entity.AnsLocalDeadlineDate).format('YYYY/MM/DD HH:mm');
    }
    if (this.entity.ExpireDate) {
      this.entity.ExpireDate = moment(this.entity.ExpireDate).format('YYYY/MM/DD HH:mm');
    }

  }

  public search() {
    this._loaderService.displayLoader(true);
    this.searchModel.Keyword = this.filterKeyword;
    //this.searchModel.DateTimeItems = this.revenueSelectedYearMonths;
    this.searchModel.NumberItems = this.filterRecruitmentTypeID;
    this.searchModel.Page = this.pageIndex;
    this.searchModel.PageSize = this.pageSize;
    //this.searchModel.BoolItems = [this.nextMonthInclude];
    this._loaderService.displayLoader(true);
    //this._dataService.get('/api/recruitmentstaff/getallpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&keyword=' + this.filterKeyword + '&filterRecruitmentID=' + this.filterRecruitmentID)
    this._dataService.post('/api/recruitment/getallpaging', JSON.stringify(this.searchModel))
      .subscribe((response: any) => {
        this.recruitments = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;

        this._loaderService.displayLoader(false);
      }, error => this._dataService.handleError(error));

    /*
    this._dataService.get('/api/recruitment/getallpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&keyword=' + this.filterKeyword)
      .subscribe((response: any) => {
        this.recruitments = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
        this._loaderService.displayLoader(false);
      }, error => this._dataService.handleError(error));
      */

  }

  public reset() {
    this.filterKeyword = '';
    this.filterMasterID = null;
    this.search();
  }

  loadDetail(id: any, isCopy : boolean=false) {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/recruitment/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this.formatDateDisplay();
        this._loaderService.displayLoader(false);
        if(isCopy){
          this.entity.No = undefined;
        }
      }, error => this._dataService.handleError(error));
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
      let fi = this.filePathRecruitment.nativeElement;
      if (fi.files.length > 0) {
        let postData: any = {
          relatedKey: this.entity.ID
        };
        this._uploadService.postWithFile('/api/upload/upload?type=recruitment', postData, fi.files).then((data: any) => {
          if (data) {
            this.entity.FileID = data.ID;
          }
          this.saveData(form);
        });
      } else {
        this.saveData(form);
      }

    }
  }
  private saveData(form: NgForm) {
    this.setMasterKbnId();
    if (this.entity.No == undefined) {
      this._dataService.post('/api/recruitment/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.search();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/recruitment/update', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.search();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
  }

  private setMasterKbnId(){
      this.entity.RecruitmentTypeMasterID  = MasterKbnEnum.RecruitmentType;
  }

  deleteItem(id: any) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => this.deleteItemConfirm(id));
  }

  deleteItemConfirm(id: any) {
    this._dataService.delete('/api/recruitment/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.search();
    }, error => this._dataService.handleError(error));
  }

  public deleteMulti() {
    this.checkedItems = this.recruitments.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; ++i)
      checkedIds.push(this.checkedItems[i]["ID"]);

    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/recruitment/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
        this.search();
      }, error => this._dataService.handleError(error));
    });
  }
  public selectedAnsRecruitDeptDeadlineDate(value: any) {
    this.entity.AnsRecruitDeptDeadlineDate = moment(value).format('YYYY/MM/DD HH:mm');
  }

  public selectedAnsLocalDeadlineDate(value: any) {
    this.entity.AnsLocalDeadlineDate = moment(value).format('YYYY/MM/DD HH:mm');
  }

  public selectedExpireDate(value: any) {
    this.entity.ExpireDate = moment(value).format('YYYY/MM/DD HH:mm');
  }

  public changeCheckboxIsNotification(event: any) {

  }

  public changeCheckboxIsFinished(event: any) {

  }

  public onChangeRecruitmentType(event:any){

  }

  /**
     * upload file ho so 
     */
  public uploadRecruitment() {
    let fi = this.filePathRecruitment.nativeElement;
    if (fi.files.length > 0) {
      let postData: any = {
        relatedKey: this.entity.ID
      };
      this._uploadService.postWithFile('/api/upload/upload?type=recruitment', postData, fi.files).then((data: any) => {

      });
    }
  }
  /**
   * get file đối tượng có liên quan
   */
  public loadDataFile(id: any) {
    this._dataService.get('/api/filestorage/getallbykey?&table=recruitments&key=' + id)
      .subscribe((response: any) => {
        this.fileStorages = response;
      });
  }

  public downloadItemFile(item: any) {
    console.log(item);
    this._dataService.get('/api/filestorage/getallbykey?&table=recruitments&key=' + item.ID)
      .subscribe((response: any) => {
        this.fileModel = response;
        let fileType: string = this.fileModel[0].ContentType;

        this._dataService.downloadFile('/api/filestorage/getfileusebacbyid/' + item.FileID, fileType)
          .subscribe((response: any) => {
            //ok download open file 
            if (fileType == 'application/pdf') {
              var fileURL = URL.createObjectURL(response);
              this._sanitizer.bypassSecurityTrustUrl(fileURL);
              window.open(fileURL);
            } else {
              saveAs(response,this.fileModel[0].FileName);
            }

          });
      });
  }



}
