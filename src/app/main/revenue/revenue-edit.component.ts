import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { IRevenueDetails, IRevenue } from '../../core/interfaces/interfaces';
import { ItemsService } from '../../shared/utils/items.service';
import { MappingService } from '../../shared/utils/mapping.service';
import { MessageContstants } from '../../core/common/message.constants';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DateRangePickerConfig, SystemConstants } from '../../core/common/system.constants';
import { Observable } from 'rxjs/Observable';
@Component({
    selector: 'app-revenue-edit',
    host: { '(input-blur)': 'onInputBlur($event)' },
    templateUrl: './revenue-edit.component.html',
    styleUrls: ['./revenue.component.css']
})
export class RevenueEditComponent implements OnInit {

    public apiHost: string;
    public id: number;
    public entity: any;
    public statuses: string[];
    public types: string[];
    private sub: any;
    public estimateTypes: any[];
    public customers: any[];
    public exchangeRates: any[];
    public emps: any[];
    public orderUnits: any[];
    public totalZenMonth: any[];
    public selectedCustomer: any={};
    public customerUnitPrice: any;
    public dateOptions: any = DateRangePickerConfig.dateOptions;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _dataService: DataService,
        private _itemsService: ItemsService,
        private _notificationService: NotificationService,
        private _utilityService: UtilityService,
        private _mappingService: MappingService,
        public _authenService: AuthenService) {

    }

    ngOnInit() {
        moment.locale("jp");
        let currentDate: string = moment().format("YYYY/MM/DD");

        // (+) converts string 'id' to a number
        this.id = +this._route.snapshot.params['id'];
        //this.apiHost = this.configService.getApiHost();
        if (this.id > 0) {
            this.loadRenueveDetails();
        } else {
            this.loadInitRenueveDetails();
        }

        //load master data
        this.loadMultiTable();

    }

    /**
     * Load các dữ liệu master
     */
    loadMultiTable() {
        let uri = [];
        uri.push('/api/masterdetail/getbykbn/20');
        uri.push('/api/customer/getall');
        uri.push('/api/emp/getall');
        uri.push('/api/masterdetail/getbykbn/25');
        uri.push('/api/exchangerate/getall');

        this._dataService.getMulti(uri)
            .subscribe((response: any) => {
                this.estimateTypes = response[0];   //loại báo giá
                this.customers = response[1];       //khách hàng
                this.emps = response[2];            //danh sách nhân viên (chỉ leader??)
                this.orderUnits = response[3];      //đơn vị tính order
                this.exchangeRates = response[4];   //tỉ lệ chuyển đổi ngoại tệ
            },
            error => {
                error => this._dataService.handleError(error);
            });
    }

    loadInitRenueveDetails() {
        this._dataService.get('/api/revenue/new/' + this.id)
            .subscribe((response: any) => {
                this.entity = response;
                //this.entity = this._itemsService.getSerialized<IRevenueDetails>(response);
                this.entity.ReportYearMonth = moment(this.entity.ReportYearMonth).format('YYYY/MM/01');
                /*this.schedule.timeStart = new Date(this.schedule.timeStart.toString()); // new DateFormatPipe().transform(schedule.timeStart, ['local']);
                this.schedule.timeEnd = new Date(this.schedule.timeEnd.toString()); //new DateFormatPipe().transform(schedule.timeEnd, ['local']);
                this.statuses = this.schedule.statuses;
                this.types = this.schedule.types;*/
            },
            error => {
                error => this._dataService.handleError(error);
            });
    }

    loadRenueveDetails() {
        this._dataService.get('/api/revenue/detail/' + this.id)
            .subscribe((response: any) => {
                this.entity = response;
                this.selectedCustomer = this.entity.Customer;
                //this.entity = this._itemsService.getSerialized<IRevenueDetails>(response);
                this.entity.ReportYearMonth = moment(this.entity.ReportYearMonth).format('YYYY/MM/01');
                if (this.entity.OrderStartDate) {
                    this.entity.OrderStartDate = moment(this.entity.OrderStartDate).format('YYYY/MM/DD');
                }
                if (this.entity.OrderEndDate) {
                    this.entity.OrderEndDate = moment(this.entity.OrderEndDate).format('YYYY/MM/DD');
                }

                this.getTotalZenMonth().subscribe((response: any[]) => {
                    this.totalZenMonth = response;
                    this.calRelationZenMonthItem();
                    this.calRelationNextMonthItem();

                }, error => this._dataService.handleError(error));
                /*this.schedule.timeStart = new Date(this.schedule.timeStart.toString()); // new DateFormatPipe().transform(schedule.timeStart, ['local']);
                this.schedule.timeEnd = new Date(this.schedule.timeEnd.toString()); //new DateFormatPipe().transform(schedule.timeEnd, ['local']);
                this.statuses = this.schedule.statuses;
                this.types = this.schedule.types;*/
            },
            error => {
                error => this._dataService.handleError(error);
            });
    }

    updateRevenue(editRevenueForm: NgForm) {
        var revenueMapped = this._mappingService.mapRevenueDetailsToRevenue(this.entity);
        this.entity.EstimateTypeMasterID = 20;
        revenueMapped.EstimateTypeMasterID = 20;
        this.saveData(revenueMapped);

    }

    private saveData(revenueMapped: IRevenue) {
        if (revenueMapped.ID == 0) {
            this._dataService.post('/api/revenue/add', JSON.stringify(revenueMapped))
                .subscribe((response: any) => {
                    this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
                }, error => this._dataService.handleError(error));
        }
        else {
            this._dataService.put('/api/revenue/update', JSON.stringify(revenueMapped))
                .subscribe((response: any) => {
                    this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
                }, error => this._dataService.handleError(error));
        }
    }

    private loadCustomerUnitPrice() {
        if (this.entity.ReportYearMonth && this.entity.CustomerID > 0) {
            return this._dataService.get('/api/customerunitprice/getbycustomer?&customerID=' + this.entity.CustomerID + '&startDate=' + this.entity.ReportYearMonth);

        }
    }

    private getTotalZenMonth() {
        if (this.entity.ReportYearMonth) {
            return this._dataService.get('/api/revenue/gettotalzenmonth?&startDate=' + this.entity.ReportYearMonth);
        }
    }


    public updateOrderPriceToUsd(value, format) {
        //this.entity.OrderPriceToUsd = new CurrencyPipe().transform(value, format)
    }
    public selectedReportYearMonthDate(value: any) {
        this.entity.ReportYearMonth = moment(value.end._d).format('YYYY/MM/01');
    }

    public selectedOrderStartDate(value: any) {
        this.entity.OrderStartDate = moment(value.end._d).format('YYYY/MM/DD');
    }

    public selectedOrderEndDate(value: any) {
        this.entity.OrderEndDate = moment(value.end._d).format('YYYY/MM/DD');
    }

    public onChangeOrderUnit(value: any) {
        if (value) {
            this.calRelationOrderItem();
            this.calRelationInMonthItem();
        }
    }

    public onChangeExchangeRate(value: any) {
        if (value) {
            this.calRelationOrderItem();
            this.calRelationInMonthItem();
        }
    }

    public onChangeCustomer(value: any) {
        if (value) {
            this.entity.CustomerName = this.customers.find(x => x.ID == value).Name;
            //lay tri mac dinh don vi tinh voi khach hang
            this.selectedCustomer = this.customers.find(x => x.ID == value);
            if (this.selectedCustomer.DefaultOrderUnitMasterDetailID) {
                this.entity.OrderUnitMasterID = this.selectedCustomer.DefaultOrderUnitMasterID;
                this.entity.OrderUnitMasterDetailID = this.selectedCustomer.DefaultOrderUnitMasterDetailID;
            }
            this.loadCustomerUnitPrice().subscribe((response: any) => {
                this.customerUnitPrice = response;
                if (this.customerUnitPrice) {
                    this.entity.OrderPrice = this.customerUnitPrice.OrderPrice | 0;
                    this.calRelationOrderItem();
                }
            }, error => this._dataService.handleError(error));

        }
    }

    /**
     * Xử lý event di chuyển con trỏ ra khỏi các textbox có tính toán
     */
    onInputBlur(event) {
        switch (event.target.name) {
            case 'InMonthDevMM':
            case 'InMonthTransMM':
            case 'InMonthManagementMM':
                //get name from code
                let devMM = this.entity.InMonthDevMM | 0;
                //devMM = event.target.value | 0;
                //kiem tra xem co thay doi tri hay khong?
                /*if (devMM === this.entity.InMonthDevMM) {
                    return;
                }*/
                let transMM = this.entity.InMonthTransMM | 0;
                let manMM = this.entity.InMonthManagementMM | 0;

                let totalMM = devMM + transMM + manMM;
                this.entity.InMonthSumMM = totalMM;
                //tinh toan cac so lieu lien quan
                this.calRelationInMonthItem();
                break;

            default:

                break;
        }
    }

    /**
     * Tính toán các item có liên quan 
     */
    calRelationInMonthItem() {
        /**Tính số tiền qui đổi thành USD của tháng này (phần tạm tính) */

        if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_USD) {
            //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá 
            this.entity.InMonthToUsd = (this.entity.InMonthSumMM * this.entity.OrderPrice);
            /* chyển đối thành VND */
            //this.entity.InMonthToVnd = (this.entity.InMonthSumMM * this.entity.OrderPrice) * (this.exchangeRates.find(x => x.ID == this.entity.RateExchangeID).UsdToVnd);

        } else if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_YEN) {
            //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá * tỉ lệ USD/YEN
            this.entity.InMonthToUsd = (this.entity.InMonthSumMM * this.entity.OrderPrice) * (this.exchangeRates.find(x => x.ID == this.entity.RateExchangeID).UsdToYen);
            /* chyển đối thành VND */
            this.entity.InMonthToVnd = (this.entity.InMonthSumMM * this.entity.OrderPrice) * (this.exchangeRates.find(x => x.ID == this.entity.RateExchangeID).YenToVnd);
        }

    }

    /**
     * Tính toán các item có liên quan 
     */
    calRelationOrderItem() {
        /**Tính số tiền qui đổi thành USD của MM toàn bộ tháng này(cột quotation/order) */
        let orderPriceToUsd: number = 0;
        if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_USD) {
            //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá 
            orderPriceToUsd = (this.entity.OrderProjectSumMM * this.entity.OrderPrice);

        } else if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_YEN) {
            //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá * tỉ lệ USD/YEN
            orderPriceToUsd = (this.entity.OrderProjectSumMM * this.entity.OrderPrice) * (this.exchangeRates.find(x => x.ID == this.entity.RateExchangeID).UsdToYen);
        }
        /* chyển đối thành VND */

        this.entity.OrderPriceToUsd = orderPriceToUsd | 0;
    }

    calRelationZenMonthItem() {
        //this.entity.AccPreMonthSumMM = this.totalZenMonth.find(x => x.OrderNo == this.entity.OrderNo).ZenTotalMM;
        //this.entity.AccPreMonthSumToUsd = this.totalZenMonth.find(x => x.OrderNo == this.entity.OrderNo).ZenTotalUSD;
    }

    calRelationNextMonthItem() {
        //cap nhật lại số còn lại của kỳ sau 
        //this.entity.NextMonthMM = this.entity.OrderProjectSumMM - this.entity.NextMonthMM;
        //this.entity.NextMonthToUsd = this.entity.OrderPriceToUsd - this.entity.AccPreMonthSumToUsd;

    }

    back() {
        this._router.navigate(['../main/revenue']);
    }



}
