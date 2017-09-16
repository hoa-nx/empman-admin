import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { jqxTreeGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtreegrid';
import { LoaderService } from '../../shared/utils/spinner.service';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { MessageContstants } from '../../core/common/message.constants';
import { SystemConstants } from '../../core/common/system.constants';
import { PercentPipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { SharedComponentService } from '../../core/services/sharedcomponent.service';
declare var $: any;
@Component({
    selector: 'emp-expandable',
    templateUrl: './emp-expandable.component.html',
    styleUrls: ['./emp-expandable.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class EmpExpandableComponent implements OnInit {

    items: any;
    listAExpanded = false;
    listBExpanded = true;
    listCExpanded = false;
    public uriAvatarPath: string = SystemConstants.BASE_API;
    @ViewChild('TeamTreeGrid') teamTreeGrid: jqxTreeGridComponent;
    public teamExpData: any[];
    public dataDeptGroups: any[];
    public dataTeamGroups: any[];
    public dataPositionGroups: any[];
    public dataJapaneseLevelGroups: any[];
    public dataBseGroups: any[];
    public dataKeikenGroups: any[];
    public dataCollectGroups: any[];
    public dataEmpTypeGroups: any[];
    public dataContractTypeGroups: any[];
    public dataGenderGroups: any[];
    public dataBussinessAllowanceGroups: any[];
    public selectedTab: any;
    public dataGroups: any[];
    public sub: any;
    public paramGroup: any;
    public dataGroupName: any;
    private subscriber: Subscription;

    public imgJobLeave: string = SystemConstants.BASE_WEB + '/assets/images/danghiviec.png';
    public imgTrialStaff: string = SystemConstants.BASE_WEB + '/assets/images/thuviec.png';

    source: any =
    {
        datatype: 'json',
        dataFields: [
            { name: 'ID', type: 'number' },
            { name: 'FullName', type: 'string' },
            { name: 'Name', type: 'string' },
            { name: 'CompanyName', type: 'string' },
            { name: 'Avatar', type: 'string' },
            { name: 'DeptName', type: 'string' },
            { name: 'TeamName', type: 'string' },
            { name: 'PositionName', type: 'string' },
            { name: 'JapaneseLevelName', type: 'string' },
            { name: 'BseLevelName', type: 'string' },
            { name: 'PhoneNumber1', type: 'string' },
            { name: 'Age', type: 'string' },
            { name: 'StartTrialDate', type: 'date' },
            { name: 'ContractDate', type: 'date' },
            { name: 'JobLeaveDate', type: 'date' },
            { name: 'Note', type: 'string' }

        ],
        hierarchy:
        {
            //keyDataField: { name: 'EmployeeID' },
            //parentDataField: { name: 'ReportsTo' }
            groupingDataFields:
            [
                {
                    name: 'TeamName'
                }
            ]
        },
        id: 'ID',
        localData: this.teamExpData

    };

    dataAdapter: any = new jqx.dataAdapter(this.source);

    icons(rowKey: number | string, rowData: any): string | boolean {
        let level = rowData.level;
        if (level == 0) {
            // each group row has a label member that contains the information displayed on the group row.
            let country = rowData.label;
            //return '../images/' + $.trim(country.toLowerCase()) + '.png';
            return '';
        }
        return false;
    }

    columns: any[] = [

        { text: 'Tổ/nhóm', dataField: 'TeamName', width: 250, groupable: true, aggregates: ['count'] },
        { text: 'Mã', dataField: 'ID', width: 250, hidden: true },
        { text: 'Tên nhân viên', dataField: 'FullName', minWidth: 150, width: 200 },
        { text: 'Công ty', dataField: 'CompanyName', width: 150 },
        { text: 'Bộ phận', dataField: 'DeptName', width: 150 },
        { text: 'Chức vụ', dataField: 'PositionName', width: 150 },
        { text: 'Tiếng Nhật', dataField: 'JapaneseLevelName', width: 80 },
        { text: 'BSE', dataField: 'BseLevelName', width: 80 },
        { text: 'Điện thoại', dataField: 'PhoneNumber1', width: 150 },
        { text: 'Tuổi', dataField: 'Age', width: 70 },
        { text: 'Ngày thử việc', dataField: 'StartTrialDate', width: 70 },
        { text: 'Ngày ký HĐ', dataField: 'ContractDate', width: 70 },
        { text: 'Ngày nghỉ việc', dataField: 'JobLeaveDate', width: 70 },
        { text: 'Ghi chú', dataField: 'Note', width: 70 },

    ];

    ready(): void {
        //this.teamTreeGrid.expandRow(0);
    };


    constructor(private _dataService: DataService,
        private _notificationService: NotificationService,
        private _utilityService: UtilityService,
        private _authenService: AuthenService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _sessionService: SessionService,
        private _loaderService: LoaderService,
        private _sharedComponentService : SharedComponentService) { }

    ngOnInit() {

        //get params
        this.sub = this._route
            .params
            .subscribe(params => {
                //this.paramGroup = params['group'];
            });

        //subscribe
        this.subscriber = this._sharedComponentService.sendToEmpExpandable$.subscribe(data => {
            console.log(data);
            this.paramGroup = data.group;
            this.loadDataByGroup(this.paramGroup);
        });
       
        //this.loadDataByGroup('team');
        //this.loadDataByGroup('position');
        //this.loadDataByGroup('japanese');
        //this.loadDataByGroup('bussinessallowance');
        //this.loadDataByGroup('bse');
        //this.loadDataByGroup('keiken');
        //this.loadDataByGroup('gender');
        //this.loadDataByGroup('emptype');
        //this.loadDataByGroup('collect');

        //this.loadDataTeamTreeGrid();

    }

    /**
     * Lấy dữ liệu nhan vien
     */
    loadDataTeamTreeGrid() {
        this._loaderService.displayLoader(true);

        this._dataService.get('/api/emp/getexpandablebyteam')
            .subscribe((response: any) => {
                this._loaderService.displayLoader(true);
                this.teamExpData = response;

                this.bindDataToTeamTreeGrid();
                this._loaderService.displayLoader(false);
            },
            error => {
                this._notificationService.printErrorMessage(MessageContstants.CALL_API_ERROR);
            });

    }

    /**
     * Lấy dữ liệu nhan vien
     */
    loadDataByGroup(group: any) {
        this.dataGroupName = '';
        this.dataGroups = [];
        if (group == undefined || group == '') return;
        this._loaderService.displayLoader(true);
        this._dataService.get('/api/emp/getlistbycommongroup?group=' + group)
            .subscribe((response: any) => {
                this.dataGroups = response;
                switch (group) {

                    case 'dept':
                        this.dataDeptGroups = response;
                        this.dataGroupName = "Bộ phận";
                        break;

                    case 'team':
                        this.dataTeamGroups = response;
                        this.dataGroupName = "Team-Nhóm";
                        break;

                    case 'position':
                        this.dataPositionGroups = response;
                        this.dataGroupName = "Ngạch-Bậc";
                        break;

                    case 'japanese':
                        this.dataJapaneseLevelGroups = response;
                        this.dataGroupName = "Tiếng Nhật";
                        break;

                    case 'bussinessallowance':
                        this.dataBussinessAllowanceGroups = response;
                        this.dataGroupName = "PC Nghiệp Vụ";
                        break;

                    case 'bse':
                        this.dataBseGroups = response;
                        this.dataGroupName = "PC BSE";
                        break;

                    case 'keiken':
                        this.dataKeikenGroups = response;
                        this.dataGroupName = "Thâm niên";
                        break;

                    case 'gender':
                        this.dataGenderGroups = response;
                        this.dataGroupName = "Giới tính";
                        break;

                    case 'emptype':
                        this.dataEmpTypeGroups = response;
                        this.dataGroupName = "Loại công việc";
                        break;

                    case 'collect':
                        this.dataCollectGroups = response;
                        this.dataGroupName = "Trường ĐH";
                        break;

                }
                this._loaderService.displayLoader(false);
            },
            error => {
                this._notificationService.printErrorMessage(MessageContstants.CALL_API_ERROR);
            });

    }

    bindDataToTeamTreeGrid(): void {
        this.clearDataOnTeamTreeGrid();
        this.source.localdata = JSON.stringify(this.teamExpData);
        // passing 'cells' to the 'updatebounddata' method will refresh only the cells values when the new rows count is equal to the previous rows count.
        this.teamTreeGrid.updateBoundData();

    }

    clearDataOnTeamTreeGrid(): void {
        this.teamTreeGrid.clear();
    }

    trackByFn(index, item) {
        return index;
    }

    public loadGroupData(event: any, group: any[]): void {

        if (this.selectedTab != event.id) {
            group.forEach(element => {
                this.loadDataByGroup(element);
            });

            this.selectedTab = event.id;
        }
    }

}
