import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';
import { ITargetDetails, ITarget } from '../../core/interfaces/interfaces';
import { ItemsService } from '../../shared/utils/items.service';
import { MappingService } from '../../shared/utils/mapping.service';
import { MessageContstants } from '../../core/common/message.constants';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DateRangePickerConfig, SystemConstants } from '../../core/common/system.constants';
import { Observable } from 'rxjs/Observable';
import { NumberHelper } from '../../shared/utils/number-helper';
import { routes } from '../../login/login.module';
import { DateTimeHelper } from '../../shared/utils/datetime-helper';

@Component({
    selector: 'app-target-edit',
    host: { '(input-blur)': 'onInputBlur($event)' },
    templateUrl: './target-edit.component.html',
    styleUrls: ['./target-edit.component.css']
})
export class TargetEditComponent implements OnInit, OnDestroy {

    public apiHost: string;
    public id: number;
    public entity: any;
    public statuses: string[];
    public types: string[];
    private sub: any;
    public companys: any[];
    public depts: any[];
    public teams: any[];

    public selectedExchangeRate: any;
    public emps: any[];
    public orderUnits: any[];
    public totalZenMonth: any[];
    public selectedCompany: any = {};
    public customerUnitPrice: any;
    public customerUnitPrices: any[];
    public selectedCustomerUnitPrices: any[]; //đon giá của khách hàng đang chọn
    public baseInformation: any = {};
    public dateOptions: any = DateRangePickerConfig.dateOptions;
    private oldTargetValue: any = {};
    public actionParam: any;
    public idParam: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _dataService: DataService,
        private _itemsService: ItemsService,
        private _notificationService: NotificationService,
        private _utilityService: UtilityService,
        private _mappingService: MappingService,
        private _authenService: AuthenService
    ) {

    }

    ngOnInit() {

        //get params
        this.sub = this._route
            .params
            .subscribe(params => {
                this.id = +params['id'] || 0;
                this.actionParam = params['action'];

            });

        moment.locale("jp");
        let currentDate: string = moment().format("YYYY/MM/DD");
        //init item dung de tinh toan 
        this.initBaseInformationItem(10, 12.5, 0, 0, 0, 0, 0);

        // (+) converts string 'id' to a number
        this.id = +this._route.snapshot.params['id'];
        //this.apiHost = this.configService.getApiHost();

        //load master data va thuc thi cac xu ly load data chi tiet
        this.loadMultiTableCallBack();

    }

    initByActionParam() {
        switch (this.actionParam) {
            case 'new':

                break;

            case 'edit':

                break;

            case 'copy':
                this.entity.ID = 0;
                break;
            case 'nextmonth':
                this.entity.ID = 0;
                var futureMonth = moment(this.entity.YearMonth).add(1, 'M');
                var futureMonthEnd = moment(futureMonth).endOf('month');
                //this.entity.ReportYearMonth = moment(futureMonth).format('YYYY/MM/01');
                this.entity.YearMonth = DateTimeHelper.getNextYearMonth(this.entity.YearMonth);
                //this.entity.OrderStartDate = DateTimeHelper.getStartDateWithSime(this.entity.ReportYearMonth,this.selectedCustomer.Sime||31);
                //this.entity.OrderEndDate = DateTimeHelper.getEndDateWithSime(this.entity.ReportYearMonth,this.selectedCustomer.Sime||31);

                break;

            default:
                break;

        }
    }
    initBaseInformationItem(mangRate: number,
        transRate: number,
        orderPrice: number,
        orderUnit: any,
        usdToVnd: number,
        yenToVnd: number,
        usdToYen: number) {
        this.baseInformation.MangRate = mangRate;
        this.baseInformation.TransRate = transRate;
        this.baseInformation.OrderPrice = orderPrice;
        this.baseInformation.OrderUnit = orderUnit;
        this.baseInformation.UsdToVnd = usdToVnd;
        this.baseInformation.YenToVnd = yenToVnd;
        this.baseInformation.UsdToYen = usdToYen;
    }

    /**
     * Load các dữ liệu master
     */
    loadMultiTable() {
        let uri = [];
        uri.push('/api/company/getall');
        uri.push('/api/dept/getall');
        uri.push('/api/team/getall');

        return this._dataService.getMulti(uri);
    }

    loadMultiTableCallBack() {
        this.loadMultiTable()
            .subscribe((response: any) => {
                this.companys = response[0];         //co6ng ty
                this.depts = response[1];            //Dept
                this.teams = response[2];            //team

                if (this.id > 0) {
                    this.loadTargetDetails();
                } else {
                    this.loadInitTargetDetails();
                }
            },
            error => {
                error => this._dataService.handleError(error);
            });
    }

    loadInitTargetDetails() {
        this._dataService.get('/api/target/new/' + this.id)
            .subscribe((response: any) => {
                this.entity = response;
                //this.entity = this._itemsService.getSerialized<ITargetDetails>(response);
                this.entity.YearMonth = moment(this.entity.YearMonth).format('YYYY/MM/01');
                /*this.schedule.timeStart = new Date(this.schedule.timeStart.toString()); // new DateFormatPipe().transform(schedule.timeStart, ['local']);
                this.schedule.timeEnd = new Date(this.schedule.timeEnd.toString()); //new DateFormatPipe().transform(schedule.timeEnd, ['local']);
                this.statuses = this.schedule.statuses;
                this.types = this.schedule.types;*/
            },
            error => {
                error => this._dataService.handleError(error);
            });
    }

    loadTargetDetails() {
        this._dataService.get('/api/target/detail/' + this.id)
            .subscribe((response: any) => {
                this.entity = response;
                this.selectedCompany = this.entity.Company;
                //this.entity = this._itemsService.getSerialized<ITargetDetails>(response);
                this.entity.YearMonth = moment(this.entity.YearMonth).format('YYYY/MM/01');
                
            },
            error => {
                error => this._dataService.handleError(error);
            });
    }

    updateTarget(editTargetForm: NgForm) {

        //map thong tin
        var targetMapped = this._mappingService.mapTargetDetailsToTarget(this.entity);

        this.saveData(targetMapped);

    }


    private saveData(targetMapped: ITarget) {
        if (targetMapped.ID == 0) {
            this._dataService.post('/api/target/add', JSON.stringify(targetMapped))
                .subscribe((response: any) => {
                    this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
                }, error => this._dataService.handleError(error));
        }
        else {
            this._dataService.put('/api/target/update', JSON.stringify(targetMapped))
                .subscribe((response: any) => {
                    this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
                }, error => this._dataService.handleError(error));
        }
    }


    public onFocus(value: any) {

        switch (value.target.name) {
            case 'InMonthDevMM':
                this.oldTargetValue.InMonthDevMM = value.target.value;
                break;

            case 'InMonthTransMM':
                this.oldTargetValue.InMonthTransMM = value.target.value;
                break;

            case 'InMonthManagementMM':
                this.oldTargetValue.InMonthManagementMM = value.target.value;
                break;

            case 'InMonthSumMM':
                this.oldTargetValue.InMonthSumMM = value.target.value;
                break;

            case 'OrderProjectSumMM':
                this.oldTargetValue.OrderProjectSumMM = value.target.value;
                break;

            case 'OrderPrice':
                this.oldTargetValue.OrderPrice = value.target.value;
                break;

            case 'AccPreMonthSumMM':
                this.oldTargetValue.AccPreMonthSumMM = value.target.value;
                break;

            case 'NextMonthMM':
                this.oldTargetValue.NextMonthMM = value.target.value;
                break;
            case 'OrderNo':
                this.oldTargetValue.OrderNo = value.target.value;
                break;
            default:

                break;
        }

    }

    selectAllContent($event) {
        $event.target.select();
    }

    public selectedYearMonth(value: any) {
        this.entity.YearMonth = moment(value.end._d).format('YYYY/MM/01');

    }

    public onChangeCompnay(value: any) {
        if (value) {
        
        }
    }
    public onChangeDept(value: any) {
        if (value) {
        
        }
    }
    public onChangeTeam(value: any) {
        if (value) {
        
        }
    }

    /**
     * Xử lý event di chuyển con trỏ ra khỏi các textbox có tính toán
     */
    onInputBlur(event) {
        switch (event.target.name) {
            case 'InMonthDevMM':
                
                break;
            case 'InMonthTransMM':
                
                break;

            default:

                break;
        }
    }

    
    back() {
        this._router.navigate(['../main/target']);
    }
    
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    //https://angular-2-training-book.rangle.io/handout/routing/query_params.html
    nextPage() {
        this._router.navigate(['product-list'], { queryParams: { page: this.id + 1 } });
    }

}
