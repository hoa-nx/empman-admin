import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { MessageContstants } from '../../core/common/message.constants';
import * as moment from 'moment';
import { ISearchItemViewModel, IMasterDetailItemViewModel, PaginatedResult } from '../../core/interfaces/interfaces';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { MappingService } from '../../shared/utils/mapping.service';
import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';
import { jqxMenuComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxmenu';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { LoaderService } from '../../shared/utils/spinner.service';


@Component({
    selector: 'app-revenue',
    templateUrl: './revenue-grid.component.html',
    styleUrls: ['./revenue-grid.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RevenueGridComponent implements OnInit, AfterViewInit {

    @ViewChild('dataGrid') dataGrid: jqxGridComponent;
    @ViewChild('myMenu') myMenu: jqxMenuComponent;

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

    public pageIndex: number = 1;
    public pageSize: number = 1000;
    public pageDisplay: number = 10;
    public totalRow: number;
    public filter: string = '';
    public revenues: any[]=[];
    public estimateType: any;
    public customers: IMultiSelectOption[] = [];
    public selectCustomers: any[] = [];
    public customer: any;
    public projectDetail: any;

    public entity: any;
    public baseFolder: string = SystemConstants.BASE_API;
    public dateOptions: any = DateRangePickerConfig.dateOptions;
    public reportYearMonth: any;
    public searchModel: any;
    public revenueAllYearMonths: IMultiSelectOption[] = [];
    public revenueSelectedYearMonths: any[] = [];
    public checkedItems: any[];
    public searchModelSession: any;

    public revenueMapped: any[];

    public nextMonthInclude: boolean=false;

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
            { name: 'ReportYearMonth', type: 'date' },
            { name: 'CustomerName', type: 'string' },
            { name: 'ProjectContent', type: 'string' },
            { name: 'OrderStartDate', type: 'date' },
            { name: 'OrderEndDate', type: 'date' },
            { name: 'OrderProjectSumMM', type: 'number' },
            { name: 'OrderUnitMasterDetailID', type: 'number' },
            { name: 'OrderPrice', type: 'number' },
            { name: 'OrderPriceToUsd', type: 'number' },
            { name: 'AccPreMonthSumMM', type: 'number' },
            { name: 'AccPreMonthSumToUsd', type: 'number' },
            { name: 'InMonthDevMM', type: 'number' },
            { name: 'InMonthTransMM', type: 'number' },
            { name: 'InMonthManagementMM', type: 'number' },
            { name: 'InMonthSumMM', type: 'number' },
            { name: 'InMonthToUsd', type: 'number' },
            { name: 'InMonthToVnd', type: 'number' },
            { name: 'NextMonthMM', type: 'number' },
            { name: 'NextMonthToUsd', type: 'number' },
            { name: 'PMID', type: 'string' },
            { name: 'Note', type: 'string' }
        ],
        localdata: '[{}]'
    };


    dataAdapterGrid = new jqx.dataAdapter(this.sourceGrid);

    cellClass = (row: number, columnfield: any, value: number): string => {
        let cssName: string = 'none';

        switch (columnfield) {
            case 'InMonthDevMM':
            case 'InMonthTransMM':
            case 'InMonthManagementMM':
            case 'InMonthSumMM':
            case 'InMonthToUsd':
            case 'InMonthToVnd':

                cssName = 'green';

                break;
            case 'OrderProjectSumMM':
            case 'OrderUnitMasterDetailID':
            case 'OrderPrice':
            case 'OrderPriceToUsd':
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
        { text: 'Id', groupable: false, aggregates: ['count'], datafield: 'ID', width: 60, hidden: true },
        {
            text: 'Tháng năm', groupable: true, aggregates: ['count'], datafield: 'ReportYearMonth', width: 180, cellsformat: 'yyyy/MM', pinned: true,
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            },
            cellsrenderer: (row: number, column: any, value: any, defaultRender: string, rowData: any): string => {
                let dataRecord = this.dataGrid.getrowdata(row);
                 if (dataRecord.NextMonthMM && dataRecord.NextMonthMM != 0) {
                    let doc = new DOMParser().parseFromString(defaultRender, 'text/html');
                    let firstDiv = doc.body.querySelector('div');
                    //[routerLink]="['../../revenue/edit',item.ID,'nextmonth']"
                    ///main/revenue/edit/16/nextmonth
                    //let aTagString = '<a class="btn btn-success" href="main/revenue/edit/'+ dataRecord.ID +'/nextmonth">Next</a>';

                    let atag = document.createElement("a");
                    atag.className = "btn btn-success";
                    atag.setAttribute("style", "font-size:8pt;padding:1px;");
                    atag.href = "main/revenue/edit/" + dataRecord.ID + "/nextmonth";
                    atag.innerText = "còn lại";
                    firstDiv.appendChild(atag);

                    return doc.documentElement.innerHTML;
                }
                if (value.toString().indexOf('Count:') >= 0) {
                    return defaultRender.replace(value, 'Tổng theo nhóm :');
                }

            }

        },
        {
            text: 'Khách hàng', groupable: true, aggregates: ['count'], datafield: 'CustomerName', width: 80, pinned: true,
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
            text: 'Nội dung công việc', groupable: true, aggregates: ['count'], datafield: 'ProjectContent', width: 100, pinned: true,
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
            text: 'Ngày start', groupable: false, datafield: 'OrderStartDate', width: 100, cellsformat: 'yyyy/MM/dd', hidden: true,
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }
        },
        {
            text: 'Ngày end', groupable: false, datafield: 'OrderEndDate', width: 100, cellsformat: 'yyyy/MM/dd', hidden: true,
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }
        },
        //Item Tổng số MM 
        {
            text: 'Tổng MM', datafield: 'OrderProjectSumMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Tổng MM <br> đặt hàng");
                //header.css("font-style", "italic");
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }

        },
        //Item Đơn giá
        {
            text: 'Đơn giá', datafield: 'OrderPrice', cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass,
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }
        },
        //Item Đơn vị tính giá 
        {
            text: 'Đơn vị tính', groupable: true, aggregates: ['count'], datafield: 'OrderUnitMasterDetailID', width: 100, cellclassname: this.cellClass,
            cellsrenderer: (row: number, column: any, value: any, defaultRender: string, rowData: any): string => {
                if (value.toString() == 2) {
                    return defaultRender.replace('2', 'USD');
                } else if (value.toString() == 3) {
                    return defaultRender.replace('3', 'YEN');
                } else if (value.toString() == 1) {
                    return defaultRender.replace('1', 'VND');
                } else if (value.toString().indexOf('Count:') >= 0) {
                    return defaultRender.replace(value, '');
                }

            },
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }

        },

        {
            text: 'Thành tiền($)', datafield: 'OrderPriceToUsd', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass,
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }
        },

        {
            text: 'MM trước', datafield: 'AccPreMonthSumMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f'
            , rendered: function (header) {
                header.html("Tổng MM<br> kỳ trước");
                //header.css("font-style", "italic");

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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }

        },
        {
            text: 'Thành tiền($)', datafield: 'AccPreMonthSumToUsd', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f',
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }

        },
        {
            text: 'Số công LTV', datafield: 'InMonthDevMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass
            , rendered: function (header) {
                header.html("Số công LTV <br> kỳ này");
                //header.css("font-style", "italic");

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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }
        },
        {
            text: 'Số công PD', datafield: 'InMonthTransMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass,
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }

        },
        {
            text: 'Số công QL', datafield: 'InMonthManagementMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass,
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }

        },
        {
            text: 'Tổng MM', datafield: 'InMonthSumMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass,
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }

        },
        {
            text: 'Thành tiền($)', datafield: 'InMonthToUsd', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass,
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }

        },
        {
            text: 'Thành tiền(VND)', datafield: 'InMonthToVnd', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f', cellclassname: this.cellClass,
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }
        },
        {
            text: 'Số MM kỳ tới', datafield: 'NextMonthMM', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f',
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }
        },
        {
            text: 'Thành tiền($)', datafield: 'NextMonthToUsd', aggregates: ['sum'], cellsalign: 'right', width: 100, cellsformat: 'f',
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


                //let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%;>"' + aggregates['sum'] + '</div>';
                return renderstring;
            }

        },
        {
            text: 'Ngưởi quản lý', datafield: 'PMID', cellsalign: 'left', width: 100,
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }
        },
        {
            text: 'Ghi chú', datafield: 'Note', cellsalign: 'left', width: 100,
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = '<div class="jqx-widget-content jqx-widget-content-' + this.theme + '" style="float: left; width: 100%; height: 100%; "/>';
                return renderstring;
            }
        }
        /*
        ,

        {
            
            text: 'Total', datafield: 'total', aggregates: ['sum'], cellsalign: 'right', cellsformat: 'c2',
            cellsrenderer: (row: number, column: any, value: any, defaultRender: string, rowData: any): string => {
                if (value.toString().indexOf('Sum') >= 0) {
                    return defaultRender.replace('Sum', 'Tổng');
                }
            },
            
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                var renderstring = '<div style="position: relative; margin-top: 4px; margin-right:5px; text-align: right; overflow: hidden;">' + 'Tổng' + ': ' + aggregates.sum + '</div>';
                return renderstring;
            }
        }*/
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
            this._router.navigate(['../main/revenue/edit', dataRecord.ID, 'edit']);
        } else if (args.innerHTML == 'Copy và tạo mới') {
            this._router.navigate(['../main/revenue/edit', dataRecord.ID, 'copy']);
        } else if (args.innerHTML == 'Tạo doanh số kỳ sau') {
            if ((dataRecord.NextMonthMM | 0) != 0) {
                this._router.navigate(['../main/revenue/edit', dataRecord.ID, 'nextmonth']);
            }
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
        private _router: Router,
        private _sessionService: SessionService,
        private _loaderService: LoaderService
    ) {

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
        this.reportYearMonth = currentDate;
        
    }

    /**
     * Lấy dữ liệu báo cáo doanh số
     */
    loadData() {
        this.searchModel.Keyword = this.filter;
        this.searchModel.DateTimeItems = this.revenueSelectedYearMonths;
        this.searchModel.NumberItems = this.selectCustomers;
        this.searchModel.Page = this.pageIndex;
        this.searchModel.PageSize = this.pageSize;
        this.searchModel.BoolItems = [this.nextMonthInclude];
        this._loaderService.displayLoader(true);
        //this._dataService.get('/api/revenue/getallpagingmasterdata?&bodyData=' + JSON.stringify(this.searchModel) + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
        this._dataService.post('/api/revenue/getallpagingmasterdata', JSON.stringify(this.searchModel))
            //this._dataService.get('/api/revenue/getallpaging?&keyword=' + this.filter + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
            .subscribe((response: any) => {
                this.revenues = response.Items;
                this.estimateType = response.Items.EstimateType;
                this.customer = response.Items.Customer;
                this.pageIndex = response.PageIndex;
                this.pageSize = response.PageSize;
                this.totalRow = response.TotalRows;

                this.revenueMapped = MappingService.mapToRevenueForJGrid(this.revenues);
                //this.gridConfig();
                this.bindDataToGrid();
                this._loaderService.displayLoader(false);
            },
            error => {
                this._notificationService.printErrorMessage(MessageContstants.CALL_API_ERROR);
            });
            
    }
    /**
     * Lấy tất cả các tháng năm đã có trong bảng doanh số
     */
    loadAllRevenueByYearMonth() {
        this.searchModel.Keyword = this.filter;
        this._dataService.get('/api/revenue/getalldatabyyearmonth')
            .subscribe((response: any) => {
                this.revenueAllYearMonths = response;
            },
            error => {
                this._notificationService.printErrorMessage(MessageContstants.CALL_API_ERROR);
            });
    }
    /**
   *Lấy cấu trúc cây của dữ liệu doanh số 
   */
    getRevenueTreeview() {
        this._dataService.get('/api/revenue/getlisttreeview?&keyword=' + this.filter)
            .subscribe((response: any) => {
                //todo
            },
            error => {
                this._notificationService.printErrorMessage(MessageContstants.CALL_API_ERROR);
            });
    }
    /**
     * Tìm kiếm dữ liệu doanh số
     */
    search() {
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
        this.checkedItems = this.revenues.filter(x => x.Checked);
        if (this.checkedItems.length > 0) {
            var checkedIds = [];
            for (var i = 0; i < this.checkedItems.length; ++i)
                checkedIds.push(this.checkedItems[i]["ID"]);

            this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => {
                this._dataService.delete('/api/revenue/deletemulti', 'checkedItems', JSON.stringify(checkedIds)).subscribe((response: any) => {
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

    loadAllCustomer() {
        this._dataService.get('/api/customer/getall')
            .subscribe((response: any) => {
                //map 
                this.customers = MappingService.mapIdNameToDropdownModel(response);
            },
            error => {
                this._notificationService.printErrorMessage(MessageContstants.CALL_API_ERROR);
            });
    }

    ngAfterViewInit() {
        this.loadAllCustomer();
        this.loadAllRevenueByYearMonth();
        this.loadData();
        document.addEventListener('contextmenu', event => event.preventDefault());

    }

    bindDataToGrid(): void {
        this.clearDataOnGrid();
        this.sourceGrid.localdata = JSON.stringify(this.revenues);
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

    saveSearchModelToLocalStorage() {
        this._sessionService.setByKey(SystemConstants.SESSION_KEY_SEARCH_ITEM_MODEL, this.searchModel);
    }

    loadSearchModelFromLocalStorage() {
        //setting init dieu kien search dua vao session da luu
        this.searchModelSession = this._sessionService.getByKey(SystemConstants.SESSION_KEY_SEARCH_ITEM_MODEL);

        this.revenueSelectedYearMonths = Array.from(this.searchModelSession.DateTimeItems);
        this.selectCustomers = Array.from(this.searchModelSession.NumberItems);

    }

    changeCheckbox(event) {

    }

    onChange(event) {
        //console.log(event);
    }


}
