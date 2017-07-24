import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { MessageContstants } from '../../core/common/message.constants';
import * as moment from 'moment';
import { ISearchItemViewModel, IMasterDetailItemViewModel, PaginatedResult } from '../../core/interfaces/interfaces';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { MappingService } from '../../shared/utils/mapping.service';
import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';
import { jqxMenuComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxmenu';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TargetComponent implements OnInit {

  @ViewChild('dataGrid') dataGrid: jqxGridComponent;
    @ViewChild('myMenu') myMenu: jqxMenuComponent;

    public pageIndex: number = 1;
    public pageSize: number = 1000;
    public pageDisplay: number = 10;
    public totalRow: number;
    public filter: string = '';
    public targets: any[];
    public depts: IMultiSelectOption[] = [];
    public selectDepts: number[] = [];
    
    public entity: any;
    public baseFolder: string = SystemConstants.BASE_API;
    public dateOptions: any = DateRangePickerConfig.dateOptions;
    public reportYearMonth: any;
    public searchModel: any;
    public targetAllYearMonths: IMultiSelectOption[] = [];
    public targetSelectedYearMonths: string[] = [];
    public checkedItems: any[];

    /** Xử lý init cho jqxGrid  start */
    theme: any;
    editrow: number = -1;
    sourceGrid =
    {
        datatype: 'json',
        /*updaterow : (rowid: any, rowdata: any, commit: any): any => {
            // synchronize with the server - send update command   
            //commit(true);
        },*/
        datafields: [
            { name: 'ID', type: 'number' },
            { name: 'CompanyID', type: 'number' },
            { name: 'CompanyName', type: 'number' },
            { name: 'DeptID', type: 'number' },
            { name: 'DeptName', type: 'number' },
            { name: 'TeamID', type: 'number' },
            { name: 'TeamName', type: 'number' },
            { name: 'YearMonth', type: 'date' },
            { name: 'Name', type: 'string' },
            { name: 'CreatorBy', type: 'string' },

            { name: 'DevEmp', type: 'number' },
            { name: 'ActDevEmp', type: 'number' },
            { name: 'TransEmp', type: 'number' },
            { name: 'ActTransEmp', type: 'number' },
            { name: 'OtherEmp', type: 'number' },
            { name: 'ActOtherEmp', type: 'number' },

            { name: 'DevMM', type: 'number' },
            { name: 'ActDevMM', type: 'number' },
            { name: 'TransMM', type: 'number' },
            { name: 'ActTransMM', type: 'number' },
            { name: 'ManMM', type: 'number' },
            { name: 'ActManMM', type: 'number' },
            { name: 'TotalMM', type: 'number' },
            { name: 'ActTotalMM', type: 'number' },

            { name: 'N1', type: 'number' },
            { name: 'ActN1', type: 'number' },
            { name: 'N2', type: 'number' },
            { name: 'ActN2', type: 'number' },
            { name: 'N3', type: 'number' },
            { name: 'ActN3', type: 'number' },
            { name: 'N4', type: 'number' },
            { name: 'ActN4', type: 'number' },
            { name: 'N5', type: 'number' },
            { name: 'ActN5', type: 'number' },
            
            { name: 'LongOnsiterNumber', type: 'number' },
            { name: 'ActLongOnsiterNumber', type: 'number' },
            { name: 'ShortOnsiterNumber', type: 'number' },
            { name: 'ActShortOnsiterNumber', type: 'number' },
            { name: 'InterShipNumber', type: 'number' },
            { name: 'ActInterShipNumber', type: 'number' },


            { name: 'Reason1', type: 'string' },
            { name: 'Reason2', type: 'string' },
            { name: 'Reason3', type: 'string' },
            { name: 'Note', type: 'string' }
        ],
        localdata: '[{"text":"text"}]'
    };


    dataAdapterGrid = new jqx.dataAdapter(this.sourceGrid);

    cellClass = (row: number, columnfield: any, value: number): string => {
        let cssName: string = 'none';

        switch (columnfield) {
            case 'InMonthDevMM':
            case 'InMonthTransMM':
                cssName = 'green';
                break;

            case 'OrderProjectSumMM':
                 cssName = 'cyan';
                break;

            default:
                break;
        }
        /*
        if (value < 20) {
            return 'red';
        }
        else if (value >= 20 && value < 50) {
            return 'yellow';
        }
        else return 'green';
        */
        return cssName;
    }

    columnsGrid: any[] =
    [
        { text: 'Id', datafield: 'ID', width: 60, hidden: true },
        {
            text: 'Tháng năm', groupable: true, aggregates: ['count'], datafield: 'YearMonth', width: 180, cellsformat: 'yyyy/MM', pinned: true,
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }
        },
        {
            text: 'Công ty', groupable: true, aggregates: ['count'], datafield: 'CompanyName', width: 80, pinned: true,
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Count:') >= 0) {
                    return defaultRender.replace(value, '');
                }
            },
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }

        },
        {
            text: 'Bộ phận', groupable: true, aggregates: ['count'], datafield: 'DeptName', width: 100, pinned: true,
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Count:') >= 0) {
                    return defaultRender.replace(value, '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }
        },

        {
            text: 'Ngày tạo', groupable: false, datafield: 'OrderStartDate', width: 100, cellsformat: 'yyyy/MM/dd', hidden: true,
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }
        },

        //Item Tổng số LTV mục tiêu
        {
            text: 'Tổng LTV', datafield: 'DevEmp', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Tổng LTV<br>mục tiêu");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số LTV thực tế
        {
            text: 'Tổng LTV', datafield: 'ActDevEmp', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Tổng LTV<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số PD  mục tiêu
        {
            text: 'Tổng PD', datafield: 'TransEmp', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Tổng PD<br>mục tiêu");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số PD  thực tế
        {
            text: 'Tổng PD', datafield: 'ActTransEmp', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Tổng PD<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số NV khác  mục tiêu
        {
            text: 'Số NV khác', datafield: 'OtherEmp', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số NV<br>khác");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số NV khác thực tế
        {
            text: 'Số NV khác', datafield: 'ActOtherEmp', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số NV khác<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số MM mục tiêu
        {
            text: 'Số MM ', datafield: 'DevMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số MM<br>");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số MM thực tế
        {
            text: 'Số MM thực tế', datafield: 'ActDevMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số MM<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số MM PD mục tiêu
        {
            text: 'Số MM PD', datafield: 'TransMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số MM<br>PD");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng MM PD thực tế
        {
            text: 'Số MM PD thực tế', datafield: 'ActTransMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số MM PD<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số MM QL mục tiêu
        {
            text: 'Số MM QL', datafield: 'ManMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số MM<br>QL");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng MM PD thực tế
        {
            text: 'Số MM QL thực tế', datafield: 'ActManMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số MM QL<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng số MM mục tiêu
        {
            text: 'Số MM ', datafield: 'TotalMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số MM<br>");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Tổng MM thực tế
        {
            text: 'Số MM thực tế', datafield: 'ActTotalMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số MM<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N1 mục tiêu
        {
            text: 'Số N1', datafield: 'N1', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số NV<br>N1");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N1 thực tế
        {
            text: 'Số NV N1 thực tế', datafield: 'ActN1', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số N1<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N2 mục tiêu
        {
            text: 'Số N2', datafield: 'N2', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số NV<br>N2");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N2 thực tế
        {
            text: 'Số NV N2 thực tế', datafield: 'ActN2', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số N2<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N3 mục tiêu
        {
            text: 'Số N3', datafield: 'N3', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số NV<br>N3");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N1 thực tế
        {
            text: 'Số NV N3 thực tế', datafield: 'ActN3', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số N3<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N4 mục tiêu
        {
            text: 'Số N4', datafield: 'N4', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số NV<br>N4");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N4 thực tế
        {
            text: 'Số NV N4 thực tế', datafield: 'ActN4', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số N4<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N5 mục tiêu
        {
            text: 'Số N5', datafield: 'N5', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số NV<br>N5");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV có N5 thực tế
        {
            text: 'Số NV N5 thực tế', datafield: 'ActN5', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số N1<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV onsite dài hạn mục tiêu
        {
            text: 'Số oniste dài hạn', datafield: 'LongOnsiterNumber', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số onsite<br>dài hạn");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV onsite dài hạn thực tế
        {
            text: 'Số NV onsite dài hạn thực tế', datafield: 'ActLongOnsiterNumber', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Onsite DH<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV onsite ngắn hạn mục tiêu
        {
            text: 'Số oniste ngắn hạn', datafield: 'ShortOnsiterNumber', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số onsite<br>NH");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV onsite ngắn hạn thực tế
        {
            text: 'Số NV onsite ngắn hạn thực tế', datafield: 'ActShortOnsiterNumber', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Onsite NH<br>thục tế");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV intership mục tiêu
        {
            text: 'Số intership', datafield: 'InterShipNumber', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số inter<br>");
                header.css("font-style", "italic");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Số NV inter thực tế
        {
            text: 'Số NV inter thực tế', datafield: 'ActInterShipNumber', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Onsite<br>inter");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        },
        //Item Ly do
        {
            text: 'Lý do', datafield: 'Reason1', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Lý do");
            },
            cellsrenderer: (row, column, value, defaultRender, rowData) => {
                if (value.toString().indexOf('Sum:') >= 0) {
                    return defaultRender.replace('Sum:', '');
                }
            },

            aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;">';
                for (let obj in aggregates) {
                    let name = obj == 'sum' ? 'Sum' : 'Avg';
                    let color = 'green';
                    let value = aggregates[obj];

                    if (obj == 'sum' && summaryData['sum'] < 0) {
                        color = 'red';
                    }
                    if (obj == 'avg' && summaryData['avg'] < 0) {
                        color = 'red';
                    }

                    renderstring += '<div style="color: ' + color + '; position: relative; margin: 6px; text-align: right; overflow: hidden;">' + value + '</div>';
                }
                renderstring += '</div>';
                return renderstring;
            }
        }
        
        ,
        {
            text: 'Ghi chú', datafield: 'Note', cellsalign: 'left', width: 100,
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }
        }
        
    ];

    myGridOnContextMenu(): boolean {
        return false;
    }

    myGridOnRowClick(event: any): void | boolean {
        if (event.args.rightclick) {
            this.dataGrid.selectrow(event.args.rowindex);
            let scrollTop = window.scrollY;
            let scrollLeft = window.scrollX;
            this.myMenu.open(parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
            return false;
        }
    };

    myMenuOnItemClick(event: any): void {
        let args = event.args;
        let rowindex = this.dataGrid.getselectedrowindex();
        this.editrow = rowindex;
        let dataRecord = this.dataGrid.getrowdata(this.editrow);
        if (args.innerHTML == 'Chỉnh sửa') {
            // get the clicked row's data and initialize the input fields.
            //this.id.val(dataRecord.id);
            //this.quantity.decimal(dataRecord.quantity);

            //'../../revenue/edit',item.ID,'copy'
            this._router.navigate(['../main/target/edit', dataRecord.ID, 'edit']);
        } else if (args.innerHTML == 'Copy và tạo mới') {
            this._router.navigate(['../main/target/edit', dataRecord.ID, 'copy']);
        } else if (args.innerHTML == 'Tạo doanh số kỳ sau') {
            this._router.navigate(['../main/target/edit', dataRecord.ID, 'nextmonth']);
        }
        else {
            let rowid = this.dataGrid.getrowid(rowindex);
            //this.dataGrid.deleterow(rowid);

        }
    };
    /** Xử lý init cho jqxGrid  End */

    constructor(private _dataService: DataService,
        private _notificationService: NotificationService,
        private _utilityService: UtilityService,
        private _authenService: AuthenService,
        private _route: ActivatedRoute,
        private _router: Router, ) {

        this.searchModel = {
            Page: 1,
            PageSize: 1000
        };
    }

    /**
     * Init các xử lý
     */
    ngOnInit() {
        moment.locale("jp");
        let currentDate: string = moment().format("YYYY/MM/01");

        this.loadAllDept();

        this.loadData();
        this.reportYearMonth = currentDate;
        this.loadAllTargetByYearMonth();

    }

    /**
     * Lấy dữ liệu báo cáo doanh số
     */
    loadData() {
        this.searchModel.Keyword = this.filter;
        this.searchModel.DateTimeItems = this.targetSelectedYearMonths;
        this.searchModel.NumberItems = this.selectDepts;
        this.searchModel.Page = this.pageIndex;
        this.searchModel.PageSize = this.pageSize;
        //this._dataService.get('/api/revenue/getallpagingmasterdata?&bodyData=' + JSON.stringify(this.searchModel) + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
        this._dataService.post('/api/target/getallpagingmasterdata', JSON.stringify(this.searchModel))
            //this._dataService.get('/api/revenue/getallpaging?&keyword=' + this.filter + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
            .subscribe((response: any) => {
                this.targets = response.Items;
                this.pageIndex = response.PageIndex;
                this.pageSize = response.PageSize;
                this.totalRow = response.TotalRows;

                //this.gridConfig();
                this.bindDataToGrid();
            },
            error => {
                this._notificationService.printErrorMessage('Không thể đọc được dữ liệu. ' + error);
            });
    }
    /**
     * Lấy tất cả các tháng năm đã có trong bảng doanh số
     */
    loadAllTargetByYearMonth() {
        this.searchModel.Keyword = this.filter;
        this._dataService.get('/api/target/getalldatabyyearmonth')
            .subscribe((response: any) => {
                this.targetAllYearMonths = response;
            },
            error => {
                this._notificationService.printErrorMessage('Không thể đọc được dữ liệu. ' + error);
            });
    }
    
    /**
     * Tìm kiếm dữ liệu doanh số
     */
    search() {
        //console.log(this.revenueSelectedYearMonths);
        this.loadData();
    }
    /**
     * Page thay đổi thì get lại dữ liệu
     */
    pageChanged(event: any): void {
        this.pageIndex = event.page;
        this.loadData();
    }
    /**
     * Xóa nhiều dòng chọn trên list
     */
    public deleteMulti() {
        this.checkedItems = this.targets.filter(x => x.Checked);
        if (this.checkedItems.length > 0) {
            var checkedIds = [];
            for (var i = 0; i < this.checkedItems.length; ++i)
                checkedIds.push(this.checkedItems[i]["ID"]);

            this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
                this._dataService.delete('/api/target/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
                    this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
                    this.search();
                }, error => this._dataService.handleError(error));
            });
        }

    }
    /**
     * Format dữ liệu
     */
    public selectedReportYearMonthDate(value: any) {
        this.reportYearMonth = moment(value.end._d).format('YYYY/MM/01');
    }

    public onSelectedChange(event: any) {


    }

    loadAllDept() {
        this._dataService.get('/api/dept/getall')
            .subscribe((response: any) => {
                //map 
                this.depts = MappingService.mapIdNameToDropdownModel(response);
            },
            error => {
                this._notificationService.printErrorMessage('Có lỗi xảy ra khi lấy danh sách phòng ban' + error);
            });
    }

    ngAfterViewInit() {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    bindDataToGrid(): void {
        this.clearDataOnGrid();
        this.sourceGrid.localdata = JSON.stringify(this.targets);
        // passing 'cells' to the 'updatebounddata' method will refresh only the cells values when the new rows count is equal to the previous rows count.
        this.dataGrid.updatebounddata();
        this.autoResizeColumn();
    }

    clearDataOnGrid(): void {
        this.dataGrid.clear();
    }

    myGridOnColumnResized(event: any): void {
        let column = event.args.columntext;
        let newwidth = event.args.newwidth
        let oldwidth = event.args.oldwidth;
    }

    autoResizeColumn(): void {
        this.dataGrid.autoresizecolumns();
    }

}
