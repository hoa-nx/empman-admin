import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { ItemsService } from '../../shared/utils/items.service';
import { IEmp } from '../../core/interfaces/interfaces';
import { EmpCardComponent } from './emp-card.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { MdRadioModule, MdRadioButton, MdRadioGroup } from '@angular/material';

import * as moment from 'moment';
import { LoaderService } from '../../shared/utils/spinner.service';
import { UploadService } from '../../core/services/upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedComponentService } from '../../core/services/sharedcomponent.service';

@Component({
    moduleId: module.id,
    selector: 'emps',
    templateUrl: 'emp-list.component.html'
})
export class EmpListComponent implements OnInit {

    users: IEmp[];

    addingUser: boolean = false;

    public pageIndex: number = 1;
    public pageSize: number = 20;
    public pageDisplay: number = 10;
    public totalRow: number;
    public filter: string = '';
    public filterByType: string = '';
    public emps: any[];
    public empOriginals: any[]; //danh sach nhan vien day du luc dau search duoc
    public loading = true;
    public sub: any;
    public empContractedList: any[]=[];           //LTV chinh thuc
    public empTrialList: any[]=[];                //LTV thử việc 
    public empContractedLTNMonthList: any[]=[];   //LTV chính thức có thâm niên nhỏ hơn N tháng 
    public empOtherList: any[]=[];                //các nhan vien khác (tong vu - qui trình)
    public empOnsiteList: any[]=[];               //các nhan vien onsite
    public sendValueToTopMenu : any ={
        empCount : 0,
        empContractedCount : 0,
        empTrialCount : 0,
        empOtherCount : 0,
        empContractedLTNMonthCount : 0,
        empOnsiteCount : 0,
        empTransCount : 0,
        empContractedJobLeavedCount : 0,
        empTrialJobLeavedCount : 0,
        empContractedJobLeavedInProcessingYearCount : 0,
        empTrialJobLeavedInProcessingYearCount : 0,
        processingYear : 0,
        expMonth : 4,
    }

    public onsiteDatas : any[];
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _dataService: DataService,
        private _itemsService: ItemsService,
        private _notificationService: NotificationService,
        private _uploadService: UploadService,
        private _loaderService: LoaderService,
        private _sharedComponentService: SharedComponentService) {


    }

    ngOnInit() {
        moment.locale("jp");
        //get params
        this.sub = this._route
            .params
            .subscribe(params => {
                this.filter = params['filter'] || '';
                this.loadData();
            });
       //get data onsiet
       this.loadOnsiteData();
    }

    loadData() {
        this._loaderService.displayLoader(true);
        this.loading = true;
        this._dataService.get('/api/emp/getallpagingfromview?&keyword=' + this.filter + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
            .subscribe((response: any) => {
                this.emps = response.Items;
                this.empOriginals =  response.Items;
                this.pageIndex = response.PageIndex;
                this.pageSize = response.PageSize;
                this.totalRow = response.TotalRows;
                // send message to subscribers via observable subject
                this.sendValueToTopMenu.empCount = this.totalRow.toString();
                if(this.emps.length>0){
                    this.sendValueToTopMenu.empContractedCount = this.emps[0].ContractedCount.toString();
                    this.sendValueToTopMenu.empTrialCount = this.emps[0].TrialCount.toString();
                    this.sendValueToTopMenu.empOtherCount = this.emps[0].OtherCount.toString();
                    this.sendValueToTopMenu.empContractedLTNMonthCount = this.emps[0].ContractedLTNMonthCount.toString();
                    this.sendValueToTopMenu.empOnsiteCount = this.emps[0].OnsiteCount.toString();
                    this.sendValueToTopMenu.empTransCount = this.emps[0].TransCount.toString();
                    this.sendValueToTopMenu.expMonth = this.emps[0].ExpMonth.toString();
                    this.sendValueToTopMenu.empContractedJobLeavedCount = this.emps[0].ContractedJobLeavedCount | 0;
                    this.sendValueToTopMenu.empTrialJobLeavedCount = this.emps[0].TrialJobLeavedCount | 0;

                    this.sendValueToTopMenu.empTrialJobLeavedInProcessingYearCount = this.emps[0].TrialJobLeavedInProcessingYearCount | 0;
                    this.sendValueToTopMenu.empContractedJobLeavedInProcessingYearCount = this.emps[0].ContractedJobLeavedInProcessingYearCount | 0;
                    this.sendValueToTopMenu.processingYear = this.emps[0].ProcessingYear | 0;
                }

                this._sharedComponentService.publishValue(this.sendValueToTopMenu);
                
                this._loaderService.displayLoader(false);
                this.loading = false;

            },
            error => {
                this._dataService.handleError(error);
            });
    }

    empBunrui() {
        //lay so nhan vien chinh thuc
        this.empContractedList = this.empOriginals.filter(e => {
            if (e.ContractDate !=null && e.JobLeaveDate ==null ) return e;
        });

        //lay so nhan vien thu viec 
        this.empTrialList = this.empOriginals.filter(e => {
            if(e.ContractDate ==null && e.JobLeaveDate ==null && e.StartWorkingDate !=null) return e;
        });

        //lay so nhan vien chinh thuc co ngay ky hop dong nho hon N thang tu system cua he thong
        let dateLimit : any = moment().subtract(this.empOriginals[0].ExpMonth, 'months');
        
        this.empContractedLTNMonthList = this.empOriginals.filter(e => {
            if(e.ContractDate !=null && e.JobLeaveDate ==null && e.ContractDate >=dateLimit ) return e;
        });

    }
    
    removeUser(emp: any) {
        var _emp: IEmp = this._itemsService.getSerialized<IEmp>(emp.value);
        this._itemsService.removeItemFromArray<IEmp>(this.emps, _emp);
        // inform user
        //this.notificationService.printSuccessMessage(_emp.FullName + ' đã được xóa');
    }

    userCreated(emp: any) {
        var _emp: IEmp = this._itemsService.getSerialized<IEmp>(emp.value);
        this.addingUser = false;
        // inform emp 
        //this.notificationService.printSuccessMessage(_emp.FullName + ' đã được tạo');

        this._itemsService.setItem<IEmp>(this.emps, (u) => u.ID == -1, _emp);
        // todo fix user with id:-1
    }

    addUser() {
        this.addingUser = true;
        /*var newEmp = {
                    ID  : -1,
                    FullName  :  '' ,
                    Name  :  '' ,
                    Furigana  :  '' ,
                    Gender  : 0,
                    IdentNo  :  '' ,
                    IdentDate  :  '2017/07/12' ,
                    IdentPlace  :  '' ,
                    FJSID  :  '' ,
                    TrainingProfileID  :  '' ,
                    BornPlace  :  '' ,
                    Avatar  :  'avatar_05.png' ,
                    WorkingEmail  :  '' ,
                    PersonalEmail  :  '' ,
                    BirthDay  :  '2017/07/12' ,
                    AccountName  :  '' ,
                    PhoneNumber1  :  '' ,
                    PhoneNumber2  :  '' ,
                    PhoneNumber3  :  '' ,
                    Address1  :  '' ,
                    Address2  :  '' ,
                    CurrentDeptID  : 0,
                    CurrentTeamID  : 0,
                    CurrentPositionID  : 0,
                    StartWorkingDate  :  '2017/07/12' ,
                    StartLearingDate  :  '2017/07/12' ,
                    EndLearingDate  :  '2017/07/12' ,
                    StartTrialDate  :  '2017/07/12' ,
                    EndTrialDate  :  '2017/07/12' ,
                    ContractDate  :  '2017/07/12' ,
                    ContractTypeMasterID  : 0,
                    ContractTypeMasterDetailID  : 0,
                    JobLeaveDate  :  '2017/07/12' ,
                    IsJobLeave  : 0,
                    JobLeaveReason  :  '' ,
                    GoogleId  :  '' ,
                    MarriedDate  :  '2017/07/12' ,
                    ExperienceBeforeContent  :  '' ,
                    ExperienceBeforeConvert  :  '' ,
                    ExperienceConvert  :  '' ,
                    EmpTypeMasterID  : 0,
                    EmpTypeMasterDetailID  : 0,
                    IsBSE  : 0,
                    CollectMasterID  : 0,
                    CollectMasterDetailID  : 0,
                    EducationLevelMasterID  : 0,
                    EducationLevelMasterDetailID  : 0,
                    Temperament  :  '' ,
                    Introductor  :  '' ,
                    BloodGroup  :  '' ,
                    Hobby  :  '' ,
                    Objective  :  '' ,
                    FileID  : 0,
                    ProfileAttachmentID  : 0,
                    DisplayOrder  : 0,
                    AccountData  :  '' ,
                    Note  :  '' ,
                    DeleteFlag  : 0,
                    Status  : 0,
                    Yobi_Text1  :  '' ,
                    Yobi_Text2  :  '' ,
                    Yobi_Text3  :  '' ,
                    Yobi_Text4  :  '' ,
                    Yobi_Text5  :  '' ,
                    Yobi_Number1  : 0,
                    Yobi_Number2  : 0,
                    Yobi_Number3  : 0,
                    Yobi_Number4  : 0,
                    Yobi_Number5  : 0,
                    Yobi_Decimal1  :  '' ,
                    Yobi_Decimal2  :  '' ,
                    Yobi_Decimal3  :  '' ,
                    Yobi_Decimal4  :  '' ,
                    Yobi_Decimal5  :  '' ,
                    Yobi_Date1  :  '2017/07/12' ,
                    Yobi_Date2  :  '2017/07/12' ,
                    Yobi_Date3  :  '2017/07/12' ,
                    Yobi_Date4  :  '2017/07/12' ,
                    Yobi_Date5  :  '2017/07/12' ,
                    CreatedDate  :  '2017/07/12' ,
                    CreatedBy  :  '' ,
                    UpdatedDate  :  '2017/07/12' ,
                    UpdatedBy  :  '' ,
                    MetaKeyword  :  '' ,
                    MetaDescription  :  '' 


        };*/
        moment.locale("jp");
        let currentDate: string = moment().format("YYYY/MM/DD");

        let newEmp = {
            ID: -1,
            FullName: '',
            Gender: true,
            StartWorkingDate: currentDate,
            StartTrialDate: currentDate,
            ShowAvatar: false

        };
        this._itemsService.addItemToStart<IEmp>(this.emps, newEmp);
        //this.users.splice(0, 0, newUser);
    }

    cancelAddUser() {
        this.addingUser = false;
        this._itemsService.removeItems<IEmp>(this.emps, x => x.ID < 0);
    }

    trackByFn(index, item) {
        return index;
    }

    pageChanged(event: any): void {
        this.pageIndex = event.page;
        this.loadData();
    }

    loadOnsiteData() {
        this._dataService.get('/api/empdetailwork/getonistebyemp')
        .subscribe((response: any) => {
          this.onsiteDatas = response;
        }, error => this._dataService.handleError(error));
        
    }
    


}