import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, AfterViewChecked, ViewContainerRef, NgZone } from '@angular/core';
import { jqxKnobComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxknob';
import { jqxNumberInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxnumberinput';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { AuthenService } from '../../core/services/authen.service';
import { UtilityService } from '../../core/services/utility.service';

import { MessageContstants } from '../../core/common/message.constants';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { MappingService } from '../../shared/utils/mapping.service';
import { jqxChartComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxchart';
import { element } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { LoaderService } from '../../shared/utils/spinner.service';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {

  devTargetMMTotal: number = 0;
  manTargetMMTotal: number = 0;
  onsiteTargetMMTotal: number = 0;
  sumaryTargetMMTotal: number = 0;

  devRevenueMMTotal: number = 0;
  manRevenueMMTotal: number = 0;
  onsiteRevenueMMTotal: number = 0;
  sumaryRevenueMMTotal: number = 0;
  restRevenueMMTotal: number = 0;
  restAvgByMonthRevenueMMTotal: number = 0;

  monthCount: number = 0;
  transInclude: any;
  onsiteInclude: any;

  dataStatistic: any;
  targetData: any[];
  StartDate : any;
  EndDate : any;

  @ViewChild('myKnobOne') myKnobOne: jqxKnobComponent;
  //tinh hinh nam hien tai
  @ViewChild('tab1RevenueChart') tab1RevenueChart: jqxChartComponent;
  //so sanh voi nam truoc 
  @ViewChild('tab1PrevYearRevenueCompareChart') tab1PrevYearRevenueCompareChart: jqxChartComponent;
  //chart theo tung khach hang
  @ViewChild('tab1CurrentYearRevenueByCustomerCompareChart') tab1CurrentYearRevenueByCustomerCompareChart: jqxChartComponent;
  //chart so nhan su theo tung nam thang chon tren man hinh
  @ViewChild('tab2EmpListByMonthlyChart') tab2EmpListByMonthlyChart: jqxChartComponent;

  public revenueValue: number;

  marks: any =
  {
    drawAboveProgressBar: false,
    colorRemaining: 'white',
    colorProgress: 'white',
    style: 'line',
    offset: '78%',
    thickness: 3,
    size: '18%',
    minorInterval: 5
  };

  progressBar: any =
  {
    style: { fill: '#407ec3', stroke: '#407ec3' },
    size: '18%',
    offset: '78%',
    background: { fill: '#cfd0d4', stroke: '#cfd0d4' }
  };

  pointer: any =
  {
    type: 'line', visible: false, style: { fill: '#407ec3' }, size: '10%', offset: '78%', thickness: 0
  };

  spinner: any =
  {
    style: { fill: '#66707e', stroke: '#66707e' },
    innerRadius: '0%', // specifies the inner Radius of the dial
    outerRadius: '58%', // specifies the outer Radius of the dial
    marks: {
      colorRemaining: '#a2da39',
      colorProgress: '#a2da39',
      type: 'circle',
      offset: '55%',
      thickness: 3,
      size: '1%',
      majorSize: '1%',
      majorInterval: 10,
      minorInterval: 10
    }
  };

  myKnobOneOnChange(event: any): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    let inputDiv = document.getElementsByClassName('inputField1')[0];
    inputDiv.children[1].innerHTML = event.args.value;
  }

  /**
   * Phần chart của từng loại doanh thu --START
   */
  revenueDataByType: any[];

  padding: any = { left: 5, top: 5, right: 5, bottom: 5 };

  titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };

  xAxis: any =
  {
    dataField: 'MonthToName',
    unitInterval: 1,
    axisSize: 'auto',
    tickMarks: {
      visible: true,
      interval: 1,
      color: '#BCBCBC'
    },
    gridLines: {
      visible: true,
      interval: 1,
      color: '#BCBCBC'
    }
  };

  valueAxis: any =
  {
    unitInterval: 5,
    minValue: 0,
    maxValue: 100,
    title: { text: 'Số MM' },
    labels: { horizontalAlignment: 'right' },
    tickMarks: { color: '#BCBCBC' }
  };

  fnLabelsClass: any = (value: any, itemIndex: any, serie: any, group: any) => {
    if (value > 100)
      return 'redLabel';
    return 'greenLabel';
  };

  fnLabelsBorderColor: any = (value: any, itemIndex: any, serie: any, group: any) => {
    if (value > 100)
      return '#FF0000';
    return 'dodgerblue';
  };

  fnFormatLabel: any = (value: any, itemIndex: any, serie: any, group: any) => {
    return value;
  };

  toolTipCustomFormatFn = (value: any, itemIndex: any, serie: any, group: any, categoryValue: any, categoryAxis: any): string => {
    let dataItem = this.revenueDataByType[itemIndex];

    return '';

  };

  seriesGroups: any[] =
  [

    {
      type: 'line',
      valueAxis:
      {
        unitInterval: 5,
        visible: true,
        minValue: 0,
        maxValue: 100,
        position: 'right',
        title: { text: 'Tổng MM - PD' },
        gridLines: { visible: false }/*,
                labels: {
                    horizontalAlignment: 'left',
                    formatSettings: { sufix: '%' }
                }*/
      },
      series:
      [
        {
          linesUnselectMode: 'click',
          dataField: 'InMonthSumIncludeOnsiteMM',
          displayText: 'Tổng MM-PD',
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(2);
            }
          },
          labels:
          {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: -20 },
            'class': this.fnLabelsClass,
            backgroundColor: 'white',
            padding: { left: 5, right: 5, top: 1, bottom: 1 },
            borderColor: this.fnLabelsBorderColor,
            backgroundOpacity: 0.7,
            borderOpacity: 0.7
          }
        }
      ],
      bands: [
        {
          minValue: 70, maxValue: 70, fillColor: 'red', lineWidth: 2, dashStyle: '2,2'
        }
      ]/*,
            annotations: [
                {
                    type: 'rect',
                    yValue: 100,
                    xValue: 12,
                    offset: { x: -45, y: -25 },
                    width: 90,
                    height: 20,
                    fillColor: '#EFEFEF',
                    lineColor: 'red',
                    text: {
                        value: 'Trị mục tiêu',
                        offset: {
                            x: 2,
                            y: 2
                        },
                        'class': 'redLabel',
                        angle: 0
                    }
                }
            ],*/
    },

    {
      type: 'stackedcolumn',
      toolTipFormatFunction: this.toolTipCustomFormatFn,
      columnsGapPercent: 50,
      seriesGapPercent: 0,
      series: [
        {
          dataField: 'InMonthDevMM',
          displayText: 'Lập trình',
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 20 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(2);
            }
          }
        },
        /*{ dataField: 'InMonthTransMM', 
              displayText: 'Phiên dịch' ,
              labels: {
                  visible: true,
                  verticalAlignment: 'top',
                  offset: { x: 0, y: 10 }
              },
              formatFunction: (value: any) => {
                  if(value===0 || value==undefined) {
                    return "";
                  }else{
                      return +(value).toFixed(2);
                  }
              }
        },*/
        {
          dataField: 'InMonthManagementMM',
          displayText: 'Quản lý',
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 5 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(2);
            }
          }
        },
        {
          dataField: 'InMonthOnsiteMM',
          displayText: 'Onsite',
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 5 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(2);
            }
          }
        }
      ]
    }
  ];

  chartEvent(event: any): any {
    let eventData;
    if (event) {
      /*if (event.args) {
          if (event.type == 'toggle') {
              eventData = '<div><b>Last Event: </b>' + event.type + '<b>, Serie DataField: </b>' + event.args.serie.dataField + '<b>, visible: </b>' + event.args.state + '</div>';
              return;
          }
          eventData = '<div><b>Last Event: </b>' + event.type + '<b>, Serie DataField: </b>' + event.args.serie.dataField + '<b>, Value: </b>' + event.args.elementValue + '</div>';
      } else {
          eventData = '<div><b>Last Event: </b>' + event.type + '';
      }*/
    }
  }

  //hiển thị hay không hiển thị chart số MM phiên dịch
  TransCheckedOnChange(event: any) {
    this.tab1RevenueChart.seriesGroups()[1].series[0].greyScale = !event.args.checked;
    this.tab1RevenueChart.refresh();
  };

  pngButtonOnClick() {
    this.tab1RevenueChart.saveAsPNG('Doanh so.png', 'http://www.jqwidgets.com/export_server/export.php');
  };

  btnPrintChartClick(): void {
    let content = this.tab1RevenueChart.host[0].outerHTML;
    let newWindow = window.open('', '', 'width=800, height=500'),
      document = newWindow.document.open(),
      pageContent =
        '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta charset="utf-8" />' +
        '<title>Doanh số theo từng tháng từng loại</title>' +
        '</head>' +
        '<body>' + content + '</body></html>';
    try {
      document.write(pageContent);
      document.close();
      newWindow.print();
      newWindow.close();

    }
    catch (error) {
    }
  }

  /**
   * Phần chart của từng loại doanh thu --END 
   */

  /**
   * Phan so sanh doanh thu voi nam truoc --START
   */
  revenuePrevYearRevenueCompareDataByType: any[];
  seriesPrevYearRevenueCompareGroups: any[] =
  [

    //phan nam truoc 
    {
      type: 'stackedcolumn',
      toolTipFormatFunction: this.toolTipCustomFormatFn,
      columnsGapPercent: 50,
      seriesGapPercent: 0,
      series: [
        {
          dataField: 'InMonthDevMM_Prev',
          displayText: 'Lập trình năm trước',
          color: "#25A0DA",
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 20 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          }
        },
        /*{ dataField: 'InMonthTransMM_Prev', 
              displayText: 'Phiên dịch năm trước' ,
              color: "#309B46" ,
              labels: {
                  visible: true,
                  verticalAlignment: 'top',
                  offset: { x: 0, y: 10 }
              },
              formatFunction: (value: any) => {
                  if(value===0 || value==undefined) {
                    return "";
                  }else{
                      return +(value).toFixed(2);
                  }
              }
        },*/
        {
          dataField: 'InMonthManagementMM_Prev',
          displayText: 'Quản lý năm trước',
          color: "#8EBC00",
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 5 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          }
        },
        {
          dataField: 'InMonthOnsiteMM_Prev',
          displayText: 'Onsite năm trước',
          color: "#FF7515",
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 0 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          }
        }
      ]
    }
    ,
    //phan nam hien tai
    {
      type: 'stackedcolumn',
      toolTipFormatFunction: this.toolTipCustomFormatFn,
      columnsGapPercent: 50,
      seriesGapPercent: 0,
      series: [
        {
          dataField: 'InMonthDevMM',
          displayText: 'Lập trình',
          color: "#25A0DA",
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 10 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          }
        },
        /*{ dataField: 'InMonthTransMM', 
              displayText: 'Phiên dịch' ,
              color: "#309B46" ,
              labels: {
                  visible: true,
                  verticalAlignment: 'top',
                  offset: { x: 0, y: 10 }
              },
              formatFunction: (value: any) => {
                  if(value===0 || value==undefined) {
                    return "";
                  }else{
                      return +(value).toFixed(2);
                  }
              }
        },*/
        {
          dataField: 'InMonthManagementMM',
          displayText: 'Quản lý',
          color: "#8EBC00",
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 5 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          }
        },
        {
          dataField: 'InMonthOnsiteMM',
          displayText: 'Onsite',
          color: "#FF7515",
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 0 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          }
        }
      ]
    }

  ];

  btnPrintPrevYearCompareChartClick(): void {
    let content = this.tab1PrevYearRevenueCompareChart.host[0].outerHTML;
    let newWindow = window.open('', '', 'width=800, height=500'),
      document = newWindow.document.open(),
      pageContent =
        '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta charset="utf-8" />' +
        '<title>So sánh doanh số với năm trước </title>' +
        '</head>' +
        '<body>' + content + '</body></html>';
    try {
      document.write(pageContent);
      document.close();
      newWindow.print();
      newWindow.close();

    }
    catch (error) {
    }
  }

  /** So sanh doanh so so voi nam truoc END */

  /**
   * Phần chart của từng loại doanh thu tung khach hang --START
   */
  revenueCurrentYearRevenueByCustomerCompareDataByType: any[];

  //padding: any = { left: 5, top: 5, right: 5, bottom: 5 };

  //titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };

  xAxisByCustomer: any =
  {
    dataField: 'CustomerName',
    unitInterval: 1,
    axisSize: 'auto',
    tickMarks: {
      visible: true,
      interval: 1,
      color: '#BCBCBC'
    },
    gridLines: {
      visible: true,
      interval: 1,
      color: '#BCBCBC'
    }
  };

  valueAxisByCustomer: any =
  {
    unitInterval: 5,
    minValue: 0,
    maxValue: 150,
    title: { text: 'Số MM' },
    labels: { horizontalAlignment: 'right' },
    tickMarks: { color: '#BCBCBC' }
  };

  fnLabelsClassByCustomer: any = (value: any, itemIndex: any, serie: any, group: any) => {
    if (value > 100)
      return 'redLabel';
    return 'greenLabel';
  };

  fnLabelsBorderColorByCustomer: any = (value: any, itemIndex: any, serie: any, group: any) => {
    if (value > 100)
      return '#FF0000';
    return 'dodgerblue';
  };

  fnFormatLabelByCustomer: any = (value: any, itemIndex: any, serie: any, group: any) => {
    return value;
  };

  toolTipCustomFormatFnByCustomer = (value: any, itemIndex: any, serie: any, group: any, categoryValue: any, categoryAxis: any): string => {
    let dataItem = this.revenueCurrentYearRevenueByCustomerCompareDataByType[itemIndex];

    return '';

  };

  seriesGroupsByCustomer: any[] =
  [

    {
      type: 'line',
      valueAxis:
      {
        unitInterval: 5,
        visible: true,
        minValue: 0,
        maxValue: 150,
        position: 'right',
        title: { text: 'Tổng MM - PD' },
        gridLines: { visible: false }/*,
                  labels: {
                      horizontalAlignment: 'left',
                      formatSettings: { sufix: '%' }
                  }*/
      },
      series:
      [
        {
          linesUnselectMode: 'click',
          dataField: 'InMonthSumIncludeOnsiteMM',
          displayText: 'Tổng MM-PD',
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          },
          labels:
          {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: -20 },
            'class': this.fnLabelsClass,
            backgroundColor: 'white',
            padding: { left: 5, right: 5, top: 1, bottom: 1 },
            borderColor: this.fnLabelsBorderColor,
            backgroundOpacity: 0.7,
            borderOpacity: 0.7
          }
        }
      ],
      bands: [
        {
          minValue: 100, maxValue: 100, fillColor: 'red', lineWidth: 2, dashStyle: '2,2'
        }
      ]/*,
              annotations: [
                  {
                      type: 'rect',
                      yValue: 100,
                      xValue: 12,
                      offset: { x: -45, y: -25 },
                      width: 90,
                      height: 20,
                      fillColor: '#EFEFEF',
                      lineColor: 'red',
                      text: {
                          value: 'Trị mục tiêu',
                          offset: {
                              x: 2,
                              y: 2
                          },
                          'class': 'redLabel',
                          angle: 0
                      }
                  }
              ],*/
    },

    {
      type: 'stackedcolumn',
      toolTipFormatFunction: this.toolTipCustomFormatFnByCustomer,
      columnsGapPercent: 50,
      seriesGapPercent: 0,
      series: [
        {
          dataField: 'InMonthDevMM',
          displayText: 'Lập trình',
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 0, y: 20 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          }
        },
        /*{ dataField: 'InMonthTransMM', 
              displayText: 'Phiên dịch' ,
              labels: {
                  visible: true,
                  verticalAlignment: 'top',
                  offset: { x: 0, y: 10 }
              },
              formatFunction: (value: any) => {
                  if(value===0 || value==undefined) {
                    return "";
                  }else{
                      return +(value).toFixed(1);
                  }
              }
        },*/
        {
          dataField: 'InMonthManagementMM',
          displayText: 'Quản lý',
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: 15, y: 0 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          }
        },
        {
          dataField: 'InMonthOnsiteMM',
          displayText: 'Onsite',
          labels: {
            visible: true,
            verticalAlignment: 'top',
            offset: { x: -10, y: 0 }
          },
          formatFunction: (value: any) => {
            if (value === 0 || value==undefined) {
              return "";
            } else {
              return +(value).toFixed(1);
            }
          }
        }
      ]
    }
  ];

  chartEventByCustomer(event: any): any {
    let eventData;
    if (event) {
      /*if (event.args) {
          if (event.type == 'toggle') {
              eventData = '<div><b>Last Event: </b>' + event.type + '<b>, Serie DataField: </b>' + event.args.serie.dataField + '<b>, visible: </b>' + event.args.state + '</div>';
              return;
          }
          eventData = '<div><b>Last Event: </b>' + event.type + '<b>, Serie DataField: </b>' + event.args.serie.dataField + '<b>, Value: </b>' + event.args.elementValue + '</div>';
      } else {
          eventData = '<div><b>Last Event: </b>' + event.type + '';
      }*/
    }
  }

  pngButtonOnClickByCustomer() {
    this.tab1CurrentYearRevenueByCustomerCompareChart.saveAsPNG('Doanh so.png', 'http://www.jqwidgets.com/export_server/export.php');
  };

  btnPrintChartClickByCustomer(): void {
    let content = this.tab1CurrentYearRevenueByCustomerCompareChart.host[0].outerHTML;
    let newWindow = window.open('', '', 'width=800, height=500'),
      document = newWindow.document.open(),
      pageContent =
        '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta charset="utf-8" />' +
        '<title>Doanh số theo từng khách hàng năm ' + this.processingYear + ' </title>' +
        '</head>' +
        '<body>' + content + '</body></html>';
    try {
      document.write(pageContent);
      document.close();
      newWindow.print();
      newWindow.close();

    }
    catch (error) {
    }
  }

  /**
   *  Phần chart của từng loại doanh thu tung khach hang  --END 
   */


   /**
   * Phần chart thong ke nhan su theo tung nam thang --START
   */
  empListByMonthly: any[];
  
    //padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
  
    //titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };
  
    xAxisByEmpListByMonthly: any =
    {
      dataField: 'YM',
      unitInterval: 1,
      axisSize: 'auto',
      tickMarks: {
        visible: true,
        interval: 1,
        color: '#BCBCBC'
      },
      gridLines: {
        visible: true,
        interval: 1,
        color: '#BCBCBC'
      }
    };
  
    valueAxisByEmpListByMonthly: any =
    {
      unitInterval: 5,
      minValue: 0,
      maxValue: 150,
      title: { text: 'Số nhân viên' },
      labels: { horizontalAlignment: 'right' },
      tickMarks: { color: '#BCBCBC' }
    };
  
    fnLabelsClassByEmpListByMonthly: any = (value: any, itemIndex: any, serie: any, group: any) => {
      if (value > 100)
        return 'redLabel';
      return 'greenLabel';
    };
  
    fnLabelsBorderColorByEmpListByMonthly: any = (value: any, itemIndex: any, serie: any, group: any) => {
      if (value > 100)
        return '#FF0000';
      return 'dodgerblue';
    };
  
    fnFormatLabelByEmpListByMonthly: any = (value: any, itemIndex: any, serie: any, group: any) => {
      return value;
    };
  
    toolTipCustomFormatFnByEmpListByMonthly = (value: any, itemIndex: any, serie: any, group: any, categoryValue: any, categoryAxis: any): string => {
      let dataItem = this.empListByMonthly[itemIndex];
  
      return '';
  
    };
  
    seriesGroupsByEmpListByMonthly: any[] =
    [
      /** TONG SO NHAN VIEN TRONG TUNG THANG*/
      {
        type: 'line',
        valueAxis:
        {
          unitInterval: 5,
          visible: true,
          minValue: 0,
          maxValue: 150,
          position: 'right',
          title: { text: 'Tổng NV đang làm việc' },
          gridLines: { visible: false }/*,
                    labels: {
                        horizontalAlignment: 'left',
                        formatSettings: { sufix: '%' }
                    }*/
        },
        series:
        [
          {
            linesUnselectMode: 'click',
            dataField: 'TotalEmpCount',
            displayText: 'Tổng NV',
            color: "#29DAB2",
            formatFunction: (value: any) => {
              if (value === 0 || value==undefined) {
                return "";
              } else {
                return +(value).toFixed(0);
              }
            },
            labels:
            {
              visible: true,
              verticalAlignment: 'top',
              offset: { x: 0, y: -20 },
              'class': this.fnLabelsClass,
              backgroundColor: 'white',
              padding: { left: 5, right: 5, top: 1, bottom: 1 },
              borderColor: this.fnLabelsBorderColor,
              backgroundOpacity: 0.7,
              borderOpacity: 0.7
            }
          }
        ],
        bands: [
          {
            minValue: 100, maxValue: 100, fillColor: 'red', lineWidth: 2, dashStyle: '2,2'
          }
        ]/*,
                annotations: [
                    {
                        type: 'rect',
                        yValue: 100,
                        xValue: 12,
                        offset: { x: -45, y: -25 },
                        width: 90,
                        height: 20,
                        fillColor: '#EFEFEF',
                        lineColor: 'red',
                        text: {
                            value: 'Trị mục tiêu',
                            offset: {
                                x: 2,
                                y: 2
                            },
                            'class': 'redLabel',
                            angle: 0
                        }
                    }
                ],*/
      },
      /** SO NHAN VIEN NGHI VIEC TRONG TUNG THANG*/
      {
        type: 'line',
        series:
        [
          {
            linesUnselectMode: 'click',
            dataField: 'ContractedJobLeavedEmpCount',
            displayText: 'Nghỉ việc',
            color: "#FF3333",
            formatFunction: (value: any) => {
              if (value === 0 || value==undefined) {
                return "0";
              } else {
                return +(value).toFixed(0);
              }
            },
            labels:
            {
              visible: true,
              verticalAlignment: 'top',
              offset: { x: 0, y: -5 },
              'class': 'redLabel',
              backgroundColor: 'white',
              padding: { left: 5, right: 5, top: 1, bottom: 1 },
              borderColor: this.fnLabelsBorderColor,
              backgroundOpacity: 0.7,
              borderOpacity: 0.7
            }
          }
        ]
      },
      /** DOANH SO TRONG TUNG THANG*/
      {
        type: 'line',
        series:
        [
          {
            linesUnselectMode: 'click',
            dataField: 'RevenueCount',
            displayText: 'Doanh số',
            color: "#35BF1D",
            formatFunction: (value: any) => {
              if (value === 0 || value==undefined) {
                return "";
              } else {
                return +(value).toFixed(0);
              }
            },
            labels:
            {
              visible: true,
              verticalAlignment: 'top',
              offset: { x: 0, y: 15 },
              'class': this.fnLabelsClass,
              backgroundColor: 'white',
              padding: { left: 5, right: 5, top: 1, bottom: 1 },
              borderColor: this.fnLabelsBorderColor,
              backgroundOpacity: 0.7,
              borderOpacity: 0.7
            }
          }
        ]
      },
      /** stackedcolumn */
      {
        type: 'stackedcolumn',
        toolTipFormatFunction: this.toolTipCustomFormatFnByCustomer,
        columnsGapPercent: 50,
        seriesGapPercent: 0,
        series: [

          {
            dataField: 'WorkingEmpCount',
            displayText: 'NV trong dept',
            color: "#1D86BF",
            labels: {
              visible: true,
              verticalAlignment: 'top',
              offset: { x: 0, y: 20 }
            },
            formatFunction: (value: any) => {
              if (value === 0 || value==undefined) {
                return "";
              } else {
                return +(value);
              }
            }
          },
          { dataField: 'FromOtherDeptEmpCount', 
                displayText: 'NV dept khác' ,
                color: "#FFC300",
                labels: {
                    visible: true,
                    verticalAlignment: 'top',
                    offset: { x: 0, y: 10 }
                },
                formatFunction: (value: any) => {
                    if(value===0 || value==undefined) {
                      return "";
                    }else{
                        return +(value);
                    }
                }
          },
          {
            dataField: 'ToOtherDeptEmpCount',
            displayText: 'NV sang dept khác',
            color: "#DA2984",
            labels: {
              visible: true,
              verticalAlignment: 'top',
              offset: { x: 0, y: 0 }
            },
            formatFunction: (value: any) => {
              if (value === 0 || value==undefined) {
                return "";
              } else {
                return +(value);
              }
            }
          },
          
          {
            dataField: 'OnsiteEmpCount',
            displayText: 'NV onsite',
            color: "#A4DA29",
            labels: {
              visible: true,
              verticalAlignment: 'top',
              offset: { x: 0, y: 0 }
            },
            formatFunction: (value: any) => {
              if (value === 0 || value==undefined) {
                return "";
              } else {
                return +(value);
              }
            }
          }
        ]
      }
    ];
  
    chartEventByEmpListByMonthly(event: any): any {
      let eventData;
      if (event) {
        /*if (event.args) {
            if (event.type == 'toggle') {
                eventData = '<div><b>Last Event: </b>' + event.type + '<b>, Serie DataField: </b>' + event.args.serie.dataField + '<b>, visible: </b>' + event.args.state + '</div>';
                return;
            }
            eventData = '<div><b>Last Event: </b>' + event.type + '<b>, Serie DataField: </b>' + event.args.serie.dataField + '<b>, Value: </b>' + event.args.elementValue + '</div>';
        } else {
            eventData = '<div><b>Last Event: </b>' + event.type + '';
        }*/
      }
    }
   
    pngButtonOnClickByEmpListByMonthly() {
      this.tab2EmpListByMonthlyChart.saveAsPNG('Thong ke nhan su doanh so.png', 'http://www.jqwidgets.com/export_server/export.php');
    };
  
    btnPrintChartClickByEmpListByMonthly(): void {
      let content = this.tab2EmpListByMonthlyChart.host[0].outerHTML;
      let newWindow = window.open('', '', 'width=800, height=500'),
        document = newWindow.document.open(),
        pageContent =
          '<!DOCTYPE html>' +
          '<html>' +
          '<head>' +
          '<meta charset="utf-8" />' +
          '<title>Thống kê nhân sự - doanh số từ ' + this.StartDate + ' ~ '+ this.EndDate + ' </title>' +
          '</head>' +
          '<body>' + content + '</body></html>';
      try {
        document.write(pageContent);
        document.close();
        newWindow.print();
        newWindow.close();
  
      }
      catch (error) {
      }
    }
  
    /**
     *  Phần chart thong ke nhan su theo tung nam thang --END 
     */
   
  public searchParams: any = {};
  public processingYear: any;
  public prevYear: any;
  public user: LoggedInUser;
  public sub: any;
  public paramId: any;
  public paramAction: any;

  constructor(private _route: ActivatedRoute,
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
    this.processingYear = this.user.processingyear;
    this.prevYear = this.processingYear - 1;
    //get params
    this.sub = this._route
      .params
      .subscribe(params => {
        this.paramId = params['id'];
        this.paramAction = params['action'];
      });

    moment.locale("jp");
    let currentDate: string = moment().format("YYYY/MM/DD");
    this.getCurrentMMData();
    this.initValue();  
  }

  ngAfterViewChecked() {

    $(".jqx-chart-legend-text").text(function () {
      return $(this).text().replace("www.jqwidgets.com", "");
    });

  }

  ngAfterViewInit(): void {
    // Create Second and Third Knobs
    /*let knobOneContainer = this.myKnobOne.elementRef.nativeElement;
    // Create Input Div's
    let inputDiv = document.createElement('div');
    inputDiv.className = 'inputField1';
    inputDiv.innerHTML = '<span style="font-size: 14px; width: 33%; display:inline-block; color: #407ec3">Mục tiêu</span><span style="width:33%; display:inline-block;">' + this.startValue1 + '</span><span style="width:33%; font-size: 14px; color: #00a4e1; display:inline-block;">Thực tích</span>'
    knobOneContainer.appendChild(inputDiv);*/
    this.getRevenueDataByType();
    //doanh so so sanh giua cac nam
    this.getPrevYearRevenueCompareDataByType();

    //Doanh so theo tung khach hang
    this.getCurrentYearRevenueByCustomerCompareDataByType();
  }

  getCurrentMMData() {
    this._dataService.get('/api/statistic/getcurmmandtargetmm')
      .subscribe((response: any) => {
        this.dataStatistic = response[0];
        this.targetData = response;
        this.revenueValue = +((this.dataStatistic.totalMMToCurrentActual / this.dataStatistic.totalMMTarget) * 100).toFixed(0);
        this.settingKnobOne();
        this.totalComputal();
      });
  }

  private settingKnobOne() {
    // Create Second and Third Knobs
    let knobOneContainer = this.myKnobOne.elementRef.nativeElement;
    // Create Input Div's
    let inputDiv = document.createElement('div');
    inputDiv.className = 'inputField1';
    inputDiv.innerHTML = '<span style="font-size: 14px; width: 33%; display:inline-block; color: #407ec3">' + this.dataStatistic.totalMMTarget + '</span><span style="width:33%; display:inline-block;">' + this.revenueValue + '%</span><span style="width:33%; font-size: 14px; color: #00a4e1; display:inline-block;">' + this.dataStatistic.totalMMToCurrentActual + '</span>'
    knobOneContainer.appendChild(inputDiv);
    this.myKnobOne.value(this.revenueValue);
    this.myKnobOne.allowValueChangeOnClick(false);
    this.myKnobOne.allowValueChangeOnDrag(false);
    this.myKnobOne.allowValueChangeOnMouseWheel(false);
  }

  getRevenueDataByType() {
    //this.searchParams.Keyword = this.filterKeyword;
    //this.searchModel.DateTimeItems = this.revenueSelectedYearMonths;
    //this.searchParams.StringItems = this.filterRecruitmentID;
    //this.searchParams.Page = this.pageIndex;
    //this.searchParams.PageSize = this.pageSize;
    this.searchParams.NumberItems = [this.processingYear];
    this.searchParams.BoolItems = [false];


    //this._dataService.get('/api/statistic/getmmbytypeandyearmonth?&years=' + JSON.stringify(years) +'&isUnpivotColumnToRows=false')
    this._dataService.post('/api/statistic/getmmbytypeandyearmonth', JSON.stringify(this.searchParams))
      .subscribe((response: any) => {
        this.revenueDataByType = response;
        this.totalComputal();
      });
  }

  getPrevYearRevenueCompareDataByType() {
    //this.searchParams.Keyword = this.filterKeyword;
    //this.searchModel.DateTimeItems = this.revenueSelectedYearMonths;
    //this.searchParams.StringItems = this.filterRecruitmentID;
    //this.searchParams.Page = this.pageIndex;
    //this.searchParams.PageSize = this.pageSize;
    this.searchParams.NumberItems = [this.prevYear, this.processingYear];
    //this.searchParams.BoolItems = [false];


    //this._dataService.get('/api/statistic/getmmbytypeandyearmonth?&years=' + JSON.stringify(years) +'&isUnpivotColumnToRows=false')
    this._dataService.post('/api/statistic/getmmbytypeandyearmonthcompare', JSON.stringify(this.searchParams))
      .subscribe((response: any) => {
        this.revenuePrevYearRevenueCompareDataByType = response;

      });
  }

  getCurrentYearRevenueByCustomerCompareDataByType() {
    //this.searchParams.Keyword = this.filterKeyword;
    //this.searchModel.DateTimeItems = this.revenueSelectedYearMonths;
    //this.searchParams.StringItems = this.filterRecruitmentID;
    //this.searchParams.Page = this.pageIndex;
    //this.searchParams.PageSize = this.pageSize;
    this.searchParams.NumberItems = [this.processingYear];
    //this.searchParams.BoolItems = [false];


    //this._dataService.get('/api/statistic/getmmbytypeandyearmonth?&years=' + JSON.stringify(years) +'&isUnpivotColumnToRows=false')
    this._dataService.post('/api/statistic/getmmbytypeandyearmonthcomparecustomer', JSON.stringify(this.searchParams))
      .subscribe((response: any) => {
        this.revenueCurrentYearRevenueByCustomerCompareDataByType = response;

      });
  }

  getEmpCountByMonthly(valid: boolean) {
    //this.searchParams.Keyword = this.filterKeyword;
    this.searchParams.DateTimeItems = [this.StartDate , this.EndDate];
    //this.searchParams.StringItems = this.filterRecruitmentID;
    //this.searchParams.Page = this.pageIndex;
    //this.searchParams.PageSize = this.pageSize;
    //this.searchParams.NumberItems = [this.processingYear];
    //this.searchParams.BoolItems = [false];


    //this._dataService.get('/api/statistic/getmmbytypeandyearmonth?&years=' + JSON.stringify(years) +'&isUnpivotColumnToRows=false')
    this._dataService.post('/api/statistic/getempcountbymonthly', JSON.stringify(this.searchParams))
      .subscribe((response: any) => {
        this.empListByMonthly = response;
      });
  }


  changeCheckbox(event) {

  }

  totalComputal() {
    this.devTargetMMTotal = 0;
    this.manTargetMMTotal = 0;
    this.onsiteTargetMMTotal = 0;
    this.sumaryTargetMMTotal = 0;

    this.devRevenueMMTotal = 0;
    this.manRevenueMMTotal = 0;
    this.onsiteRevenueMMTotal = 0;
    this.sumaryRevenueMMTotal = 0;

    //tính tong cua phan doanh số
    if (this.revenueDataByType) {
      this.revenueDataByType.forEach(element => {
        this.devRevenueMMTotal += element.InMonthDevMM;
        this.manRevenueMMTotal += element.InMonthManagementMM;
        this.onsiteRevenueMMTotal += element.InMonthOnsiteMM;

      });
    }

    this.devRevenueMMTotal = +(this.devRevenueMMTotal).toFixed(2);
    this.manRevenueMMTotal = +(this.manRevenueMMTotal).toFixed(2);
    this.onsiteRevenueMMTotal = +(this.onsiteRevenueMMTotal).toFixed(2);

    this.sumaryRevenueMMTotal = +(this.devRevenueMMTotal + this.manRevenueMMTotal + this.onsiteRevenueMMTotal).toFixed(2);
    //tinh tong cua muc tieu
    if (this.targetData) {
      this.targetData.forEach(element => {
        this.devTargetMMTotal += element.DevMMTarget;
        this.manTargetMMTotal += element.ManMMTarget;
        this.onsiteTargetMMTotal += element.OnsiteMMTarget;
      });

    }

    this.devTargetMMTotal = +(this.devTargetMMTotal).toFixed(2);
    this.manTargetMMTotal = +(this.manTargetMMTotal).toFixed(2);
    this.onsiteTargetMMTotal = +(this.onsiteTargetMMTotal).toFixed(2);
    this.sumaryTargetMMTotal = +(this.devTargetMMTotal + this.manTargetMMTotal + this.onsiteTargetMMTotal).toFixed(2);

    //tinh phan con lai 
    this.restRevenueMMTotal = +(this.sumaryTargetMMTotal - this.sumaryRevenueMMTotal).toFixed(2);
    this.monthCount = (12 - this.revenueDataByType.length);
    if (this.monthCount === 0) {
      this.restAvgByMonthRevenueMMTotal = 0;
    } else {
      this.restAvgByMonthRevenueMMTotal = +(this.restRevenueMMTotal / this.monthCount).toFixed(2);
    }

  }

  btnPrintReportClick() {
    /*this._dataService.get('/api/statistic/getmmbytypeandyearmonthreport')
      .subscribe((response: any) => {
        console.log(response);
      });*/

    this._dataService.getPdfFile('/api/statistic/getmmbytypeandyearmonthreport2?&year=' + this.processingYear)
      .subscribe((response: any) => {
        var fileURL = URL.createObjectURL(response);
        this._sanitizer.bypassSecurityTrustUrl(fileURL);
        window.open(fileURL);
      });
  }

  public selectedStartDate(value: any) {
    this.StartDate = moment(value).format('YYYY/MM/DD');
  }

  public selectedEndDate(value: any) {
    this.EndDate = moment(value).format('YYYY/MM/DD');
  }

  public initValue(){
    this.StartDate =  moment().format('YYYY/MM/01');
    this.EndDate =  moment().format('YYYY/MM/01');
  }
}

