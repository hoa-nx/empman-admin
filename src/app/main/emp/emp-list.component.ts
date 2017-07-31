import { Component, OnInit } from '@angular/core';

import { ItemsService } from '../../shared/utils/items.service';
import { IEmp } from '../../core/interfaces/interfaces';
import { EmpCardComponent } from './emp-card.component';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { MdRadioModule, MdRadioButton, MdRadioGroup } from '@angular/material';

import * as moment from 'moment';
import { LoaderService } from '../../shared/utils/spinner.service';

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
    public emps: any[];
    public loading = true;

    constructor(private _dataService: DataService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private _loaderService: LoaderService) {


    }

    ngOnInit() {
        this.loadData();

    }

    loadData() {
        this._loaderService.displayLoader(true);
        this.loading = true;
        this._dataService.get('/api/emp/getallpaging?&keyword=' + this.filter + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
            .subscribe((response: any) => {
                this.emps = response.Items;
                this.pageIndex = response.PageIndex;
                this.pageSize = response.PageSize;
                this.totalRow = response.TotalRows;
                this._loaderService.displayLoader(false);
                this.loading = false;
            },
            error => {
                this.notificationService.printErrorMessage('Có lỗi xảy ra khi lấy danh sách nhân viên' + error);
            });
    }

    removeUser(emp: any) {
        var _emp: IEmp = this.itemsService.getSerialized<IEmp>(emp.value);
        this.itemsService.removeItemFromArray<IEmp>(this.emps, _emp);
        // inform user
        //this.notificationService.printSuccessMessage(_emp.FullName + ' đã được xóa');
    }

    userCreated(emp: any) {
        var _emp: IEmp = this.itemsService.getSerialized<IEmp>(emp.value);
        this.addingUser = false;
        // inform emp 
        //this.notificationService.printSuccessMessage(_emp.FullName + ' đã được tạo');

        this.itemsService.setItem<IEmp>(this.emps, (u) => u.ID == -1, _emp);
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
        this.itemsService.addItemToStart<IEmp>(this.emps, newEmp);
        console.log(this.emps);

        //this.users.splice(0, 0, newUser);
    }

    cancelAddUser() {
        this.addingUser = false;
        this.itemsService.removeItems<IEmp>(this.emps, x => x.ID < 0);
    }

    trackByFn(index, item) {
        return index;
    }

    pageChanged(event: any): void {
        this.pageIndex = event.page;
        this.loadData();
    }

}