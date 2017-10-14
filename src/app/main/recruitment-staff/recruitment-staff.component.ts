import { Component, OnInit, ViewChild, ViewContainerRef, NgZone, Input, OnDestroy, ElementRef, Renderer } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { AuthenService } from '../../core/services/authen.service';
import { UtilityService } from '../../core/services/utility.service';

import { MessageContstants } from '../../core/common/message.constants';
import { SystemConstants, ApllRoles, AccessRightFunctions , AccessRight} from '../../core/common/system.constants';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { LoaderService } from '../../shared/utils/spinner.service';
import { NgForm } from '@angular/forms';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewResult, RecruitConditionDisplay } from '../../core/common/shared.class';
import { element } from 'protractor';
import * as moment from 'moment';
import { ApprovedStatusEnum, DataStatusEnum, MasterKbnEnum, JobTypeEnum } from '../../core/common/shared.enum';
import { MappingService } from '../../shared/utils/mapping.service';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile } from 'ng2-file-drop';
import { DomSanitizer } from '@angular/platform-browser';

//declare var moment: any;
@Component({
  selector: 'app-recruitment-staff',
  templateUrl: './recruitment-staff.component.html',
  styleUrls: ['./recruitment-staff.component.css']
})
export class RecruitmentStaffComponent implements OnInit, OnDestroy {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  @ViewChild('interviewModal') public interviewModal: ModalDirective;
  @ViewChild('fileUpload') public fileUpload: any;

  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterKeyword: string = '';
  public filterRecruitmentID: any[] = [];
  public recruitments: any[];
  public recruitmentStaffs: any[];
  public recruitmentIntreview: any;
  public recruitmentIntreviewModel: any[];
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
  public autoGhostLists: any[] = [];
  public autoFilterGhostLists: any[] = [];
  public autoRoomLists: any[] = [];
  public primeModelRecruitments: any[];
  public filterConditionDisplay: any;
  public filterConditionDisplays: any[] = RecruitConditionDisplay.RecruitConditionDisplayLists;
  public dataStatus = DataStatusEnum;
  public showInterviewStaffModalSave: any; // luu giu ung vien duoc cho khi open dialog 
  public empOriginListSet: Set<any>;
  public empInterviewOriginList: any[];
  public empRegisterLists: IMultiSelectOption[] = [];
  public empRegisterSelectedLists: IMultiSelectOption[] = [];

  // Settings configuration
  //https://github.com/softsimon/angular-2-dropdown-multiselect
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    showCheckAll: true,
    showUncheckAll: true,
    displayAllSelectedText: true
  };

  // Text configuration
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };
  /* tslint:disable:no-unused-variable */
  // Supported image types
  public supportedFileTypes: string[] = ['image/png', 'image/jpeg', 'image/gif'];
  /* tslint:enable:no-unused-variable */

  private currentProfileImage: string = SystemConstants.BASE_WEB + '/assets/images/profile-default.png';
  private imgJobLeave: string = SystemConstants.BASE_WEB + '/assets/images/IsJobLeave2.png';

  public uriAvatarPath: string = SystemConstants.BASE_API;
  public imageShown: boolean = false;

  public isApprovedDataPermission : boolean = false ;  

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
    //    private _renderer: Renderer,
    private _sanitizer: DomSanitizer
  ) {

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
    this.getEmpCodeNameList();

    this.interviewInterval = setInterval(() => {
      this.updateInterviewStatusEvent();
    }, 5000);

    this.settingUsableItemPermission(this.user);
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
  saveChange(form: NgForm) {
    if (form.valid) {
      this.saveData(form);
    }
  }

  private saveData(form: NgForm) {
    if (this.entity.ID == undefined) {
      this._dataService.post('/api/recruitmentstaff/add', JSON.stringify(this.entity))
        .subscribe((response: any) => {
          //xy ly tao job ney nhu thong itn ngay gio phong van da co 
          /* if (+response.ID > 0 && response.InterviewDate && response.InterviewRoom != '') {
            this._dataService.get('/api/recruitmentinterview/getinterviewstaffbyrecruitmentstaffforjob?recruitmentID=' + response.RecruitmentID + '&recruitmentStaffID=' + response.RecruitmentStaffID)
              .subscribe((interviewStaffLists: any) => {
                this.registerAlertInterviewJob('RecruitmentStaffs', response.RecruitmentStaffID, response.ID, interviewStaffLists);
              });
          } */

          this.search();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/api/recruitmentstaff/update', JSON.stringify(this.entity))
        .subscribe((response: any) => {

          //xy ly tao job ney nhu thong itn ngay gio phong van da co 
          /* if (+response.ID > 0 && response.InterviewDate && response.InterviewRoom != '') {
            this._dataService.get('/api/recruitmentinterview/getinterviewstaffbyrecruitmentstaffforjob?recruitmentID=' + response.RecruitmentID + '&recruitmentStaffID=' + response.RecruitmentStaffID)
              .subscribe((interviewStaffLists: any) => {
                console.log(interviewStaffLists);
                this.registerAlertInterviewJob('RecruitmentStaffs', response.RecruitmentStaffID, response.ID, interviewStaffLists);
              });
          } */

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

    if (checkedIds.length > 0) {
      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
        this._dataService.delete('/api/recruitmentstaff/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
          this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
          this.search();
        }, error => this._dataService.handleError(error));
      });
    }

  }

  settingUsableItemPermission(user : LoggedInUser){
    let userRoles : any[] = user.roles;

    let isAdminRole = userRoles.includes(ApllRoles.ADMIN) ;
    let isLeaderRole = userRoles.includes(ApllRoles.LEADER) ;

    if(isAdminRole){
      //co quyen han admin
      this.isApprovedDataPermission = true;
    }

    if(isLeaderRole){
      this.isApprovedDataPermission = false;
      
    }

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

  public onChange(event: any) {

  }

  public onChangeRecruitment(event: any) {
    //this.search();
    console.log(this.filterRecruitmentID);
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
          this.recruitmentIntreview = this.initRecruitmentInterviewRegisterDataByStaff(item, undefined);
        }

        if (item.IsRegister == true) {
          //insert 
          console.log( this.recruitmentIntreview);
          this._dataService.post('/api/recruitmentinterview/add', JSON.stringify(this.recruitmentIntreview))
            .subscribe((response: any) => {
              //dang ky job
              /* if (response.ScheduleInterviewDate && (response.ScheduleInterviewRoom != '' || response.ScheduleInterviewRoom != undefined)) {
                this._dataService.get('/api/recruitmentinterview/getinterviewstaffbyrecruitmentstaffforjob?recruitmentID=' + response.RecruitmentID + '&recruitmentStaffID=' + response.RecruitmentStaffID)
                .subscribe((interviewStaffLists: any) => {
                  this.registerAlertInterviewJob('RecruitmentStaffs', response.RecruitmentStaffID, response.ID, interviewStaffLists);
                });
              } */

              this.search();
              this.modalAddEdit.hide();
              this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
            }, error => this._dataService.handleError(error));
        } else {
          //delete 
          if (this.recruitmentIntreview.ID) {
            console.log("Delete " + this.recruitmentIntreview);
            this._dataService.delete('/api/recruitmentinterview/delete', 'id', this.recruitmentIntreview.ID)
              .subscribe((response: any) => {
                //delete thong tin job 
                /* var parameters = { "table": 'RecruitmentStaffs', "tableKey": this.recruitmentIntreview.RecruitmentStaffID , "tableKeyId": this.recruitmentIntreview.RegInterviewEmpID };
                this._dataService.deleteWithMultiParams('/api/jobscheduler/deletebytablekey', parameters )
                .subscribe((response : any) =>{

                }
                ,error => this._dataService.handleError(error)); */

                //hien thi lai du lieu
                this.search();
                this.modalAddEdit.hide();
                this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
              }, error => this._dataService.handleError(error));
          }

        }
      });


  }

  public initRecruitmentInterviewRegisterDataByStaff(recruitmentStaff: any, regInterviewEmpID: any): any {
    //su ding bien so noi bo 
    let modelRegister: any = {};

    /* if (this.recruitmentIntreview == undefined) {
      this.recruitmentIntreview = {};
    }
    this.recruitmentIntreview.RecruitmentID = recruitmentStaff.RecruitmentID;
    this.recruitmentIntreview.RecruitmentStaffID = recruitmentStaff.RecruitmentStaffID;
    this.recruitmentIntreview.Name = recruitmentStaff.Name;
    this.recruitmentIntreview.ShortName = recruitmentStaff.Name;
    if(regInterviewEmpID==undefined){
      this.recruitmentIntreview.RegInterviewEmpID = this.user.empid;
    }else{
      this.recruitmentIntreview.RegInterviewEmpID = regInterviewEmpID;
    } */

    modelRegister.RecruitmentID = recruitmentStaff.RecruitmentID;
    modelRegister.RecruitmentStaffID = recruitmentStaff.RecruitmentStaffID;
    modelRegister.Name = recruitmentStaff.Name;
    modelRegister.ShortName = recruitmentStaff.Name;
    if (recruitmentStaff.InterviewDate) {
      modelRegister.ScheduleInterviewDate = recruitmentStaff.InterviewDate;
    }
    if (recruitmentStaff.InterviewRoom) {
      modelRegister.ScheduleInterviewRoom = recruitmentStaff.InterviewRoom;
    }

    if (regInterviewEmpID == undefined) {
      modelRegister.RegInterviewEmpID = this.user.empid;
    } else {
      modelRegister.RegInterviewEmpID = regInterviewEmpID;
    }

    return modelRegister;
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
        this.showInterviewStaffModalSave = data; //lưu lai model 
        this.getSelectableEmpList();
        this._loaderService.displayLoader(false);

      });
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
    this._notificationService.printConfirmationDialog(MessageContstants.CHANGE_STAUTUS_APPROVED_DATA, () => {

      this._dataService.put('/api/recruitmentinterview/approveddatastatus', JSON.stringify(this.searchModelParam))
        .subscribe((response: any) => {

          this.recruitmentInterviewOfStaffs.find(x => x.ID == data.ID).ApprovedStatus = newStatus;

          this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));

    });

  }

  deleteItemInterviewStaff(id: any) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => this.deleteInterviewStaff(id));
  }
  deleteInterviewStaff(id: any) {
    this._dataService.delete('/api/recruitmentinterview/delete', 'id', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.loadInterviewStaffs(this.showInterviewStaffModalSave);
    });
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

  getEmpCodeNameList() {
    let posGrp: any[] = [];
    this._dataService.get('/api/emp/getallcodenamemodel?posFrom=0&posTo=100&posGrp=' + posGrp)
      .subscribe((response: any) => {
        this.empInterviewOriginList = response;
        this.empRegisterLists = MappingService.mapIdNameToDropdownModel(response);
      }
      , error => this._dataService.handleError(error));
  }

  filterGhostLists(event: any) {
    let query = event.query;
    this.autoFilterGhostLists = this.filterGhostPC(query, this.autoGhostLists);
  }

  filterGhostPC(query, ghosts: any[]): any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    for (let i = 0; i < ghosts.length; i++) {
      let ghost = ghosts[i];
      if (ghost.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(ghost);
      }
    }
    return filtered;
  }

  /**
   * Lấy danh sách có thể chọn đưa vào list phỏng vấn
   */
  getSelectableEmpList() {

    //lấy danh sách nhân viên đã đăng ký phỏng vấn hiện tại
    let empInterviewRegister = this.recruitmentInterviewOfStaffs.map(x => x.RegInterviewEmpID);
    //lay chi empID cua list nhan vien 
    let empIdLists = this.empInterviewOriginList.map(x => x.ID);

    let diff = empIdLists.map((id, index) => {
      if (empInterviewRegister.indexOf(id) < 0) {
        return this.empInterviewOriginList[index];
      }
    }).filter(item => item != undefined);

    this.empRegisterLists = MappingService.mapIdNameToDropdownModel(diff);
    this.empRegisterSelectedLists = [];
  }

  /**
   * Add multi 
   */
  addEmpToInterviewRegister() {
    this.recruitmentIntreviewModel = [];
    if (this.empRegisterSelectedLists) {
      this.empRegisterSelectedLists.forEach(element => {
        //tao model 
        this.recruitmentIntreviewModel.push(this.initRecruitmentInterviewRegisterDataByStaff(this.showInterviewStaffModalSave, element));
      });
      if (this.recruitmentIntreviewModel) {
        this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_REGISTER_MSG, () => {
          this._dataService.post('/api/recruitmentinterview/addmulti', JSON.stringify(this.recruitmentIntreviewModel))
            .subscribe((response: any) => {
              //load lai data
              this.loadInterviewStaffs(this.showInterviewStaffModalSave);
              this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
            }, error => this._dataService.handleError(error));
        });

      }
    }
  }

  /* Drag Drop File Begin*/
  // File being dragged has moved into the drop region
  public dragFileOverStart() {
  }
  // File being dragged has moved out of the drop region
  public dragFileOverEnd() {
  }

  public dragFileAccepted(item: any, acceptedFile: Ng2FileDropAcceptedFile) {
    // Load the image in
    let fileReader = new FileReader();
    fileReader.onload = () => {
      // Set and show the image
      this.currentProfileImage = fileReader.result;
      this.imageShown = true;
    };
    // Read in the file
    fileReader.readAsDataURL(acceptedFile.file);
    //co ton tai file upload
    this._uploadService.postWithFile('/api/upload/saveImage?type=avatar', null, [acceptedFile.file])
      .then((imageUrl: string) => {
        //capt nhat avartar cho nhan vien 
        this.recruitmentStaffs.find(x => x.ID == item.ID).Avatar = imageUrl;
        this._dataService.put('/api/recruitmentstaff/update', JSON.stringify(item))
          .subscribe((response: any) => {
            //nothing
          }, error => this._dataService.handleError(error));

      }).then(() => {
        //todo something
      });

  }

  // File being dragged has been dropped and has been rejected
  public dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
  }

  /**
   * upload file to serve
   */
  public uploadFiles(item: any, event: any) {
    //let fi = this.fileUpload.nativeElement;
    let fi: any = document.getElementById(item.ID);
    if (fi.files.length > 0) {
      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_UPLOAD_MSG, () => {
        this._loaderService.displayLoader(true);

        let postData: any = {
          relatedTable: 'RecruitmentStaffs',
          relatedKey: item.RecruitmentStaffID,


        };

        //for (let i = 0; i < fi.files.length; i++) {
        //  postData.append('file[]', fi.files.item(i));
        //}

        this._uploadService.postWithFile('/api/upload/upload?type=recruitmentStaff', postData, fi.files).then((data: any) => {
          this.search();
          fi.value = "";//xoa file
          this._loaderService.displayLoader(false);
          this._notificationService.printSuccessMessage(MessageContstants.UPLOADED_OK_MSG);
        });
      });
    } else {
      this._notificationService.printAlertDialog(MessageContstants.CONFIRM_NOT_SELECT_FILE_MSG, () => { });
    }
  }

  /* public showImageBrowseDlg() {
    // from http://stackoverflow.com/a/32010791/217408
    let event = new MouseEvent('click', { bubbles: true });
    this._renderer.invokeElementMethod(
      this.fileUpload.nativeElement, 'dispatchEvent', [event]);
  } */

  public downloadItemFile(file: any) {
    this._dataService.downloadFile('/api/filestorage/getfileusebacbyid/' + file.ID, file.ContentType)
      .subscribe((response: any) => {
        //ok download open file 
        if (file.ContentType == 'application/pdf') {
          var fileURL = URL.createObjectURL(response);
          this._sanitizer.bypassSecurityTrustUrl(fileURL);
          window.open(fileURL);
        } else {
          saveAs(response, file.FileName);
        }

      });
  }

  public deleteItemFile(file: any) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/filestorage/delete', 'id', file.ID).subscribe((response: Response) => {
        //xoa thanh cong
        this.search();
        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      });
    });
  }

  public createEmp(item: any) {
    //check lai lan nua thong tin co the tao Emp
    if (item.TrialStartDate && (!item.SystemEmpID)) {
      //tao thong tin cua user de cap nhat 
      let empData: any = {};
      empData.ID = 0;
      empData.FullName = item.Name;
      empData.Gender = item.Gender;
      empData.BirthDay = item.BirthDay;
      empData.IdentNo = item.IdentNo;
      empData.ExtLinkNo = item.RecruitmentStaffID;
      empData.TrainingProfileNo = item.CompanyCvNo;
      empData.Avatar = item.Avatar;
      empData.PersonalEmail = item.Email;
      empData.PhoneNumber1 = item.PhoneNumber;
      empData.Address1 = item.AdddressPlace;
      empData.CurrentCompanyID = this.user.companyid;
      empData.CurrentDeptID = item.DeptReceived;
      empData.CurrentTeamID = item.TeamReceived;
      empData.CurrentPositionID = 210; // trial staff
      empData.EmpTypeMasterID = MasterKbnEnum.EmpType;
      empData.EmpTypeMasterDetailID = 1; //LTV

      empData.InterviewDate = item.InterviewDate;
      empData.WorkingConditionTalkDate = item.WorkingConditionTalkDate;
      empData.StartWorkingDate = item.TrialStartDate;
      empData.StartTrialDate = item.TrialStartDate;
      empData.Hobby = item.Hobby;
      empData.Objective = item.Objective;
      empData.Note = item.Note;

      if (item.RecruitmentTypeMasterDetailID == 2) {
        //loai nhan vien huan luyen
        empData.Note = empData.Note + 'Chuyển qua từ huấn luyện';
      }

      this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_CREATE_EMP_FROM_RECRUITMENT_MSG, () => {
        // tao nhan vien 
        this._dataService.post('/api/emp/add', JSON.stringify(empData))
          .subscribe((response: any) => {
            //cap nhat lai thong tin empID
            if (response.ID) {
              item.SystemEmpID = response.ID;
              this._dataService.put('/api/recruitmentstaff/update', JSON.stringify(item))
                .subscribe((response: any) => {
                  this.search();

                  this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
                }, error => this._dataService.handleError(error));
            }
          }, error => this._dataService.handleError(error));
      });
    }
  }

  /**
   * Dang ky alert sms job ve thoi gian phong van ung vien
   */
  public registerAlertInterviewJob(table: string, tableKey: string, tableKeyId: string, interviewStaffLists: any) {

    let alertJob: any = {};
    //loop qua danh sach cac nhan vien dang ky phong van ung vien
    for (let item of interviewStaffLists) {
      if (item.ScheduleInterviewDate && (item.ScheduleInterviewRoom != '' || item.ScheduleInterviewRoom != undefined)) {
        tableKeyId = item.RegInterviewEmpID;
        //tim xem data co ton tai chua 
        this._dataService.get('/api/jobscheduler/detailbytablekey?jobType=&table=' + table + '&tableKey=' + tableKey + '&tableKeyId=' + tableKeyId)
          .subscribe((response: any) => {

            alertJob = response;

            if (alertJob.ID) {
              //neu ton tai du lieu 
              alertJob.ScheduleRunJobDate = item.ScheduleInterviewDate;
              alertJob.EventDate = item.ScheduleInterviewDate;
              alertJob.EventUser = item.Name;
              alertJob.ToNotiEmailList = item.WorkingEmail;
              alertJob.SMSToNumber = item.PhoneNumber1;
              alertJob.LocationEvent = item.ScheduleInterviewRoom;
            } else {
              alertJob = {};
              alertJob.JobType =  JobTypeEnum.DevInterviewDateNotify;//Lich phong van 
              alertJob.Name = 'Thông báo lịch phỏng vấn';
              alertJob.TableNameRelation = table;
              alertJob.TableKey = tableKey;
              alertJob.TableKeyID = tableKeyId;
              alertJob.ScheduleRunJobDate = item.ScheduleInterviewDate;
              alertJob.EventDate = item.ScheduleInterviewDate;
              alertJob.EventUser = item.Name;
              alertJob.FromEmail = '';
              alertJob.ToNotiEmailList = item.WorkingEmail;
              alertJob.CcNotiEmailList = '';
              alertJob.BccNotiEmailList = '';
              alertJob.SMSFromNumber = '';
              alertJob.SMSToNumber = item.PhoneNumber1;
              //alertJob.SMSContent = '';
              //alertJob.JobContent = '';.
              alertJob.JobStatus = 0;
              //alertJob.ActualRunJobDate='';
              alertJob.TemplateID = JobTypeEnum.DevInterviewDateNotify;//Lich phong van 
              alertJob.LocationEvent = item.ScheduleInterviewRoom;
              alertJob.Note = 'Tạo tự động';

            }
            //dang ky job 
            this._dataService.post('/api/jobscheduler/findregister', JSON.stringify(alertJob))
              .subscribe((response: any) => {
                //this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
              }, error => this._dataService.handleError(error));
          }, error => this._dataService.handleError(error));

      }//if
    }//for
  }//function


}
