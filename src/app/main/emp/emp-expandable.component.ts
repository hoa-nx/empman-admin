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

declare var $ : any;
@Component({
    selector: 'emp-expandable',
    templateUrl: './emp-expandable.component.html',
    styleUrls: ['./emp-expandable.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class EmpExpandableComponent implements OnInit {

    @ViewChild('TeamTreeGrid') teamTreeGrid: jqxTreeGridComponent;
    public teamExpData : any[];

    source: any =
    {
        datatype: 'json',
        dataFields: [
            { name: 'TeamName', type: 'string' },
            { name: 'ID', type: 'number' },
            { name: 'FullName', type: 'string' },
            { name: 'Name', type: 'string' },
            { name: 'CompanyName', type: 'string' },
            { name: 'DeptName', type: 'string' },
            { name: 'PositionName', type: 'string' }
            
        ],
        hierarchy:
        {
            //keyDataField: { name: 'EmployeeID' },
            //parentDataField: { name: 'ReportsTo' }
            groupingDataFields:
            [
                {
                    name: 'DeptName'
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
        { text: 'Tổ/nhóm', dataField: 'TeamName', width: 250 },
        { text: 'Mã', dataField: 'ID', width: 250 },
        { text: 'Tên nhân viên', dataField: 'FullName', minWidth: 100, width: 200 },
        { text: 'Công ty', dataField: 'CompanyName', width: 150 },
        { text: 'Bộ phận', dataField: 'DeptName', width: 300 },
        { text: 'Chức vụ', dataField: 'PositionName', width: 120 }
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
        private _loaderService: LoaderService) { }

    ngOnInit() {
        this.loadData();
    }

        /**
     * Lấy dữ liệu báo cáo doanh số
     */
    loadData() {
        this._loaderService.displayLoader(true);
        
        this._dataService.get('/api/emp/getexpandablebyteam')
            .subscribe((response: any) => {
                this._loaderService.displayLoader(true);
                this.teamExpData = response;

                console.log(response);
                this.bindDataToGrid();
                this._loaderService.displayLoader(false);
            },
            error => {
                this._notificationService.printErrorMessage(MessageContstants.CALL_API_ERROR);
            });

    }

    bindDataToGrid(): void {
        this.clearDataOnGrid();
        this.source.localdata = JSON.stringify(this.teamExpData);
        // passing 'cells' to the 'updatebounddata' method will refresh only the cells values when the new rows count is equal to the previous rows count.
        this.teamTreeGrid.updateBoundData();
        
    }

    clearDataOnGrid(): void {
        this.teamTreeGrid.clear();
    }

}
