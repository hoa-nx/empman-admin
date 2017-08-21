import { Component, OnInit, ViewChild, ViewContainerRef, NgZone, Input, OnDestroy } from '@angular/core';
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
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewResult, RecruitConditionDisplay } from '../../core/common/shared.class';
import { element } from 'protractor';
import * as moment from 'moment';
import { ApprovedStatusEnum, DataStatusEnum } from '../../core/common/shared.enum';
import { MappingService } from '../../shared/utils/mapping.service';

@Component({
  selector: 'app-recruitment-interview',
  templateUrl: './recruitment-interview.component.html',
  styleUrls: ['./recruitment-interview.component.css']
})
export class RecruitmentInterviewComponent implements OnInit , OnDestroy{

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  @ViewChild('interviewModal') public interviewModal: ModalDirective;

  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterKeyword: string = '';
  public filterRecruitmentID: any[]=[];
  public recruitments: any[];
  public recruitmentStaffs: any[];
  public recruitmentIntreview: any;
  public recruitmentIntreviewList: any[];
  public recruitmentTypes: any[];
  public checkedItems: any[];
  public emps: any[];
  public depts: any[];
  public teams: any[];
  public user: LoggedInUser;
  public sub: any;
  public paramId: any;
  public paramAction: any;
  public recruitmentInterviewOfStaffs: any[];
  public interviewResults: any[] = InterviewResult.InterviewResults;
  public interviewStatusEvent: any;
  public interviewInterval: any;
  public searchModelParam: any = {};
  public searchModel: any = {};
  public approvedStatus = ApprovedStatusEnum;
  public currentStaffSelected: any;
  public autoGhostLists: any[]=[];
  public autoFilterGhostLists: any[]=[];
  public autoRoomLists: any[]=[];
  public primeModelRecruitments : any[];
  public filterConditionDisplay : any;
  public filterConditionDisplays : any[] = RecruitConditionDisplay.RecruitConditionDisplayLists;
  public dataStatus = DataStatusEnum;
  public InterviewUnRegister : any;
  public InterviewWaiting : any;
  public InterviewWaitingResult : any;
  public InterviewConditionWorkingTalk : any;
  public InterviewConditionFeedback : any;
  public InterviewTrialWaiting : any;
  public InterviewStartWorking : any;
  public primeModelRecruitmentStaffs : any[] ; //danh sach cac ung vien co dang ky phong van
  public recruitmentStaffSelecteds : any[]; 

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
    private _loaderService: LoaderService) {

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
      });

    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/DD");

    this.loadMultiTableCallBack();
    if (this.paramId) {
      //hien thi init
      this.filterRecruitmentID = [this.paramId];
      this.search();
    }

    this.getAutoCompleteLists();
    
    this.interviewInterval = setInterval(() => {
      this.updateInterviewStatusEvent();
    }, 5000);

  }

  ngOnDestroy() {
    if (this.interviewInterval) {
      clearInterval(this.interviewInterval);
    }
  }

  /**
   * Load các dữ liệu master
   */
  loadMultiTable() {
    let uri = [];
    uri.push('/api/masterdetail/getbykbn/30');
    uri.push('/api/recruitment/getall');
    uri.push('/api/dept/getall');
    uri.push('/api/team/getall');
    uri.push('/api/emp/getall');

    return this._dataService.getMulti(uri);
  }

  loadMultiTableCallBack() {
    this._loaderService.displayLoader(true);
    this.loadMultiTable()
      .subscribe((response: any) => {
        this.recruitmentTypes = response[0];        //Loại tuyển dụng
        this.recruitments = response[1];                    //ho so
        this.depts = response[2];                    //dept
        this.teams = response[3];                    //team
        this.emps = response[4];                    //staff

        this.primeModelRecruitments = MappingService.mapIdNameToPrimeMultiSelectModel(this.recruitments);

        this._loaderService.displayLoader(false);
      },
      error => {
        error => this._dataService.handleError(error);
      });
  }

  public search() {
    this.searchModel.Keyword = this.filterKeyword;
    //this.searchModel.DateTimeItems = this.revenueSelectedYearMonths;
    this.searchModel.StringItems = this.filterRecruitmentID;
    this.searchModel.Page = this.pageIndex;
    this.searchModel.PageSize = this.pageSize;
    //this.searchModel.BoolItems = [this.nextMonthInclude];
    this._loaderService.displayLoader(true);
    //this._dataService.get('/api/recruitmentstaff/getallpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&keyword=' + this.filterKeyword + '&filterRecruitmentID=' + this.filterRecruitmentID)
    this._dataService.post('/api/recruitmentstaff/getallpaging', JSON.stringify(this.searchModel))
      .subscribe((response: any) => {
        this.recruitmentStaffs = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
        //cap nhat trang thai dang ky 
        this.updateRegisterStatusIfNull();
        //cap nhat trang thai phong van 
        this._loaderService.displayLoader(false);
      }, error => this._dataService.handleError(error));
  }

  public reset() {
    this.filterKeyword = '';
    this.filterRecruitmentID = null;
    this.search();
  }

  loadDetail(id: any) {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/recruitmentstaff/detail/' + id)
      .subscribe((response: any) => {
        this.entity = response;
        this.formatDateDisplay();
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
    if (this.entity.ID == undefined) {
      this._dataService.post('/api/recruitmentstaff/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.search();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/recruitmentstaff/update', JSON.stringify(this.entity))
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
    this._dataService.delete('/api/recruitmentstaff/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.search();
    });
  }

  public deleteMulti() {
    this.checkedItems = this.recruitmentStaffs.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; ++i)
      checkedIds.push(this.checkedItems[i]["ID"]);

    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/recruitmentstaff/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
        this.search();
      }, error => this._dataService.handleError(error));
    });
  }
  public selectedInterviewDate(value: any) {
    this.entity.InterviewDate = moment(value).format('YYYY/MM/DD HH:mm');
  }

  public selectedWorkingConditionTalkDate(value: any) {
    this.entity.WorkingConditionTalkDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedTrialStartDate(value: any) {
    this.entity.TrialStartDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedResourceDeptMailNotificationDate(value: any) {
    this.entity.ResourceDeptMailNotificationDate = moment(value).format('YYYY/MM/DD');
  }

  public changeCheckboxIsFinished(event: any) {

  }
  public onChangeRecruitment(event: any) {
    //get lai danh sach cac nguoi phong van
    this.getRecruitmentInterviewStaffListByRecruitmentID();

  }

  formatDateDisplay() {

    if (this.entity.InterviewDate) {
      this.entity.InterviewDate = moment(this.entity.InterviewDate).format('YYYY/MM/DD HH:mm');
    }

    if (this.entity.WorkingConditionTalkDate) {
      this.entity.WorkingConditionTalkDate = moment(this.entity.WorkingConditionTalkDate).format('YYYY/MM/DD');
    }

    if (this.entity.TrialStartDate) {
      this.entity.TrialStartDate = moment(this.entity.TrialStartDate).format('YYYY/MM/DD');
    }

    if (this.entity.ResourceDeptMailNotificationDate) {
      this.entity.ResourceDeptMailNotificationDate = moment(this.entity.ResourceDeptMailNotificationDate).format('YYYY/MM/DD');
    }

  }

  public registerInterview(item: any) {
    //dang ky , huy phong van
    //find to model 
    this.recruitmentStaffs.find(x => (x.ID == item.ID)).IsRegister = !item.IsRegister;
    //cap nhat db
    this.updateRecruitmentInterview(item);
  }

  public updateRegisterStatusIfNull() {
    this.recruitmentStaffs.forEach(el => {
      if (el.IsRegister == null || el.IsRegister == 'undefined') {
        el.IsRegister = false;
      }
    });
  }

  public updateRecruitmentInterview(item: any) {
    //cap nhat vao bang phong van ( neu dang ky thi se insert / huy thi se xoa du lieu tuong ung)
    this._dataService.get('/api/recruitmentinterview/detailbyrecruitmentstaff?recruitmentID=' + item.RecruitmentID + '&recruitmentStaffID=' + item.RecruitmentStaffID + '&regInterviewEmpID=' + this.user.empid)
      .subscribe((response: any) => {
        this.recruitmentIntreview = response;

        if (this.recruitmentIntreview == null || this.recruitmentIntreview.RecruitmentID == null) {
          this.initRecruitmentInterviewRegisterDataByStaff(item);
        }

        if (item.IsRegister == true) {
          //insert 
          console.log("Add " + this.recruitmentIntreview);
          this._dataService.post('/api/recruitmentinterview/add', JSON.stringify(this.recruitmentIntreview))
            .subscribe((response: any) => {
              this.search();
              this.modalAddEdit.hide();
              this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
            }, error => this._dataService.handleError(error));
        } else {
          //delete 
          if (this.recruitmentIntreview.ID) {
            console.log("Delete " + this.recruitmentIntreview);
            this._dataService.delete('/api/recruitmentinterview/delete', 'id', this.recruitmentIntreview.ID)
              .subscribe((response: Response) => {
                this.search();
                this.modalAddEdit.hide();
                this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
              }, error => this._dataService.handleError(error));
          }

        }
      });


  }

  public initRecruitmentInterviewRegisterDataByStaff(recruitmentStaff: any) {
    if (this.recruitmentIntreview == 'undefined') {
      this.recruitmentIntreview = {};
    }
    this.recruitmentIntreview.RecruitmentID = recruitmentStaff.RecruitmentID;
    this.recruitmentIntreview.RecruitmentStaffID = recruitmentStaff.RecruitmentStaffID;
    this.recruitmentIntreview.Name = recruitmentStaff.Name;
    this.recruitmentIntreview.ShortName = recruitmentStaff.Name;
    this.recruitmentIntreview.RegInterviewEmpID = this.user.empid;
  }

  public getRecruitmentInterviewDataByStaff(data: any) {
    this._dataService.get('/api/recruitmentinterview/detailbyrecruitmentstaff?recruitmentID=' + data.RecruitmentID + '&recruitmentStaffID=' + data.RecruitmentStaffID)
      .subscribe((response: any) => {
        this.recruitmentIntreview = response;
      });
  }


  showInterviewStaffModal(id: any) {
    this.loadInterviewStaffs(id);
    this.interviewModal.show();
  }

  loadInterviewStaffs(data: any) {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/recruitmentinterview/getinterviewstaffbyrecruitmentstaff?recruitmentID=' + data.RecruitmentID + '&recruitmentStaffID=' + data.RecruitmentStaffID)
      .subscribe((response: any) => {
        this.recruitmentInterviewOfStaffs = response;
        this._loaderService.displayLoader(false);

      });
  }

  getRecruitmentInterviewStaffListByRecruitmentID() {

    this.searchModel.StringItems = this.filterRecruitmentID;

    this._dataService.put('/api/recruitmentinterview/getallinterviewerlist', JSON.stringify(this.searchModel))
      .subscribe((response: any) => {
        this.primeModelRecruitmentStaffs =response;      
      }, error => this._dataService.handleError(error));
  }

  approvedInterviewStaff(data: any, newStatus: number) {
    //cap nhật trạng thái cua du lieu tuong ung voi nguoi dang la da approved 
    //( khi đã approved thì tại màn hình đăng ký không thể hủy cho đến khi hủy approvrd)

    let ids: any[] = [];
    //push to array
    ids.push(data.ID);

    this.searchModelParam.NumberItems = ids;
    this.searchModelParam.ApprovedStatus = newStatus;
    //update
    this._dataService.put('/api/recruitmentinterview/approveddatastatus', JSON.stringify(this.searchModelParam))
      .subscribe((response: any) => {

        this.recruitmentInterviewOfStaffs.find(x => x.ID == data.ID).ApprovedStatus = newStatus;

        this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
      }, error => this._dataService.handleError(error));
  }

  public updateInterviewStatusEvent() {
    if (this.recruitmentStaffs) {
      this.recruitmentStaffs.forEach(element => {
        //kiem tra gian start phỏng vấn để quyết định trạng thái.
        element.interviewStatusEvent = null;
        if (element.InterviewDate) {
          let currentDateTime = moment();
          if (moment().isBefore(moment(element.InterviewDate))) {
            element.interviewStatusEvent = 'sắp diễn ra';
          } else {
            //kiem tra xem dang dien ra hay la da ket thuc 
            //cong them 30phut cho tri can kiem tra
            let interviewDated = moment(element.InterviewDate).add(30, 'minutes');
            //neu nhu tri sau khi add them 30 phut ma van lon hon tri hien tai thi co nghia la dang dien ra phong van
            if (moment().isBefore(interviewDated)) {
              element.interviewStatusEvent = 'đang diễn ra';
            } else {
              element.interviewStatusEvent = 'xong pv';
            }
          }
          //let intervalDiff =  interviewDate.diff(currentDateTime,'seconds') ;
        }

      });
    }
  }

  getAutoCompleteLists() {
    this._dataService.get('/api/recruitmentstaff/getallautocompletedata')
      .subscribe((response: any) => {
        let responeData: any[] = response;
        responeData.forEach(e => {
          if (e.ID == 1) {
            this.autoGhostLists.push(e.Name);
          } else if (e.ID == 2) {
            this.autoRoomLists.push(e.Name); 
          }
        });
      }, error => this._dataService.handleError(error));
  }

  filterGhostLists(event: any){
    let query = event.query;        
    this.autoFilterGhostLists = this.filterGhostPC(query, this.autoGhostLists);
  }

  filterGhostPC(query, ghosts: any[]):any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : any[] = [];
        for(let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if(ghost.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(ghost);
            }
        }
        return filtered;
    }

}
