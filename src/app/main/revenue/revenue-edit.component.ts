import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { NumberHelper } from '../../shared/utils/number-helper';
import { routes } from '../../login/login.module';
import { DateTimeHelper } from '../../shared/utils/datetime-helper';
import { LoggedInUser } from '../../core/domain/loggedin.user';

@Component({
    selector: 'app-revenue-edit',
    host: { '(input-blur)': 'onInputBlur($event)' },
    templateUrl: './revenue-edit.component.html',
    styleUrls: ['./revenue.component.css']
})
export class RevenueEditComponent implements OnInit, OnDestroy {

    public apiHost: string;
    public id: number;
    public entity: any;
    public statuses: string[];
    public types: string[];
    private sub: any;
    public estimateTypes: any[];
    public customers: any[];
    public companys: any[];
    public depts: any[];
    public teams: any[];
    public exchangeRates: any[];
    public selectedExchangeRate: any;
    public emps: any[];
    public orderUnits: any[];
    public totalZenMonth: any[];
    public selectedCustomer: any = {};
    public customerUnitPrice: any;
    public customerUnitPrices: any[];
    public selectedCustomerUnitPrices: any[]; //đon giá của khách hàng đang chọn
    public baseInformation: any = {};
    public dateOptions: any = DateRangePickerConfig.dateOptions;
    private oldRevenueValue: any = {};
    public actionParam: any;
    public idParam: any;
    public user : LoggedInUser;
    
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
        this.user = this._authenService.getLoggedInUser();
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
        this.initBaseInformationItem(0, 0, 0, 0, 0, 0, 0);

        // (+) converts string 'id' to a number
        this.id = +this._route.snapshot.params['id'];
        //this.apiHost = this.configService.getApiHost();

        //load master data va thuc thi cac xu ly load data chi tiet
        this.loadMultiTableCallBack();

    }

    initByActionParam(){
        switch (this.actionParam){
            case 'new' :

            break;

            case 'edit' :

            break;

            case 'copy' :
                this.entity.ID  = 0;
            break;
            case 'nextmonth' :
                //Khởi tạo mặc định các ngày tháng
                var futureMonth = moment(this.entity.ReportYearMonth).add(1, 'M');
                var futureMonthEnd = moment(futureMonth).endOf('month');
                this.entity.ReportYearMonth = DateTimeHelper.getNextYearMonth(this.entity.ReportYearMonth);
                this.setDateRangeValueDefault();
                //kiểm tra xem đã có dữ liệu hay chưa?
                this.loadRevenueDetailByMultiJoken().subscribe((response: any[]) => {
                    if(response.length>0){
                        //có tồn tại dữ liệu
                        this.entity = response[0];
                        this.actionParam ='edit';
                        this.bindingRevenueDetail();
                    }else{
                        this.entity.ID  = 0;
                    }
                    
                }, error => this._dataService.handleError(error));

            break;

            default :
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
        uri.push('/api/masterdetail/getbykbn/20');
        uri.push('/api/customer/getall');
        uri.push('/api/emp/getall');
        uri.push('/api/masterdetail/getbykbn/25');
        uri.push('/api/exchangerate/getall');
        uri.push('/api/customerunitprice/getall');
        uri.push('/api/company/getall');
        uri.push('/api/dept/getall');
        uri.push('/api/team/getall');

        return this._dataService.getMulti(uri);
    }
    
    setInitValue(){
        if(this.entity){
            if (!(this.entity.CompanyID && this.entity.CompanyID > 0))
                this.entity.CompanyID = this.user.companyid|0;
            if (!(this.entity.DeptID && this.entity.DeptID > 0))
                this.entity.DeptID = this.user.deptid|0;
            if (!(this.entity.TeamID && this.entity.TeamID > 0))
                this.entity.TeamID = this.user.teamid|0;
        }
    }

    loadMultiTableCallBack() {
        this.loadMultiTable()
            .subscribe((response: any) => {
                this.estimateTypes = response[0];        //loại báo giá
                this.customers = response[1];            //khách hàng
                this.emps = response[2];                 //danh sách nhân viên (chỉ leader??)
                this.orderUnits = response[3];           //đơn vị tính order
                this.exchangeRates = response[4];        //tỉ lệ chuyển đổi ngoại tệ
                this.customerUnitPrices = response[5];   //đon giá áp dụng cho từng khách hàng
                this.companys = response[6];   //công ty
                this.depts = response[7];   //phòng ban
                this.teams = response[8];   //team

                if (this.id > 0) {
                    this.loadRenueveDetails();
                } else {
                    this.loadInitRenueveDetails();
                }
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
                this.setInitValue();
            },
            error => {
                error => this._dataService.handleError(error);
            });
    }
    
    loadRenueveDetails() {
        this._dataService.get('/api/revenue/detail/' + this.id)
            .subscribe((response: any) => {
                this.entity = response;
                this.bindingRevenueDetail();
                
                this.setInitValue();
                /*this.schedule.timeStart = new Date(this.schedule.timeStart.toString()); // new DateFormatPipe().transform(schedule.timeStart, ['local']);
                this.schedule.timeEnd = new Date(this.schedule.timeEnd.toString()); //new DateFormatPipe().transform(schedule.timeEnd, ['local']);
                this.statuses = this.schedule.statuses;
                this.types = this.schedule.types;*/
            },
            error => {
                error => this._dataService.handleError(error);
            });
    }

    bindingRevenueDetail(){
        this.selectedCustomer = this.entity.Customer;
        //this.entity = this._itemsService.getSerialized<IRevenueDetails>(response);
        this.entity.ReportYearMonth = moment(this.entity.ReportYearMonth).format('YYYY/MM/01');
        if (this.entity.OrderStartDate) {
            this.entity.OrderStartDate = moment(this.entity.OrderStartDate).format('YYYY/MM/DD');
        }
        if (this.entity.OrderEndDate) {
            this.entity.OrderEndDate = moment(this.entity.OrderEndDate).format('YYYY/MM/DD');
        }

        //xu ly so lieu cho thao tac tu man hinh main 
        this.initByActionParam();

        //load data cho don gia tung khach hang
        this.loadMultiCustomerUnitPriceByCustomerID();

        this.getTotalZenMonth().subscribe((response: any[]) => {
            this.totalZenMonth = response;
            this.calRelationZenMonthItem();
            this.calRelationNextMonthItem();
        }, error => this._dataService.handleError(error));

        //xu ly init cac so lieu de tinh toan cac so tien
        this.onChangeCustomerUnitPrice(this.entity.CustomerUnitPriceID, false);

        //lấy thông tin tỉ giá
        this.selectedExchangeRate = this.exchangeRates.find(p => p.ID == this.entity.ExchangeRateID);

        this.baseInformation.UsdToVnd = this.selectedExchangeRate.UsdToVnd;
        this.baseInformation.YenToVnd = this.selectedExchangeRate.YenToVnd;
        this.baseInformation.UsdToYen = this.selectedExchangeRate.UsdToVnd / this.selectedExchangeRate.YenToVnd;
    }
    loadRevenueDetailByMultiJoken(){
        if (this.entity.ReportYearMonth 
            && this.entity.CustomerID > 0 
            && this.entity.CustomerUnitPriceID > 0
            && this.entity.EstimateTypeMasterDetailID > 0
            && this.entity.OrderNo
            ) {
            return this._dataService.get('/api/revenue/detailbymultijoken?&ReportYearMonth=' + this.entity.ReportYearMonth +
                                            '&CustomerID=' + this.entity.CustomerID + 
                                            '&CustomerUnitPriceID=' + this.entity.CustomerUnitPriceID + 
                                            '&EstimateTypeID=' + this.entity.EstimateTypeMasterDetailID + 
                                            '&OrderNo=' + this.entity.OrderNo 
                                            );
        }

    }
    updateRevenue(editRevenueForm: NgForm) {

        let messageConfirm : string = MessageContstants.CONFIRM_REGISTER_MSG;;

        this.entity.EstimateTypeMasterID = 20;

        this.entityRoundNumber();
        //kiểm tra xem đã có dữ liệu hay chưa?
        this.loadRevenueDetailByMultiJoken().subscribe((response: any[]) => {
            if(response.length>0){
                //có tồn tại dữ liệu
                this.entity.ID = response[0].ID;
                this.actionParam ='edit';
                messageConfirm = MessageContstants.CONFIRM_UPDATE_MSG;
            }

            //map thong tin
            var revenueMapped = this._mappingService.mapRevenueDetailsToRevenue(this.entity);

            this._notificationService.printConfirmationDialog(messageConfirm, () => this.saveData(revenueMapped));
            
        }, error => this._dataService.handleError(error));
        //this.saveData(revenueMapped);
    }

    private entityRoundNumber() {
        //lam tron so tien
        this.entity.OrderPriceToUsd = Math.round(this.entity.OrderPriceToUsd);
        this.entity.AccPreMonthSumToUsd = Math.round(this.entity.AccPreMonthSumToUsd);
        this.entity.InMonthToUsd = Math.round(this.entity.InMonthToUsd);
        this.entity.InMonthToVnd = Math.round(this.entity.InMonthToVnd);
        this.entity.NextMonthToUsd = Math.round(this.entity.NextMonthToUsd);

        //lam tron so MM 
        this.entity.OrderProjectSumMM = NumberHelper.roundTo(this.entity.OrderProjectSumMM, 10);
        this.entity.AccPreMonthSumMM = NumberHelper.roundTo(this.entity.AccPreMonthSumMM, 10);
        this.entity.InMonthDevMM = NumberHelper.roundTo(this.entity.InMonthDevMM, 10);
        this.entity.InMonthTransMM = NumberHelper.roundTo(this.entity.InMonthTransMM, 10);
        this.entity.InMonthManagementMM = NumberHelper.roundTo(this.entity.InMonthManagementMM, 10);
        this.entity.InMonthSumMM = NumberHelper.roundTo(this.entity.InMonthSumMM, 10);
        this.entity.NextMonthMM = NumberHelper.roundTo(this.entity.NextMonthMM, 10);

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

    private loadCustomerUnitPriceLasted() {
        if (this.entity.ReportYearMonth && this.entity.CustomerID > 0) {
            return this._dataService.get('/api/customerunitprice/getbycustomer?&customerID=' + this.entity.CustomerID + '&startDate=' + this.entity.ReportYearMonth);

        }
    }

    private loadMultiCustomerUnitPriceByCustomerID() {
        this.selectedCustomerUnitPrices = [];
        if (this.entity.ReportYearMonth && this.entity.CustomerID > 0) {
            this.selectedCustomerUnitPrices = this.customerUnitPrices.filter(x => (x.CustomerID === this.entity.CustomerID && x.StartDate <= this.entity.ReportYearMonth)) || [];
        }
    }

    private getTotalZenMonth() {
        //lay luy ke cac thang truoc
        if (this.entity.ReportYearMonth) {
            return this._dataService.get('/api/revenue/gettotalzenmonth?&startDate=' + this.entity.ReportYearMonth);
        }
    }


    public updateOrderPriceToUsd(value, format) {
        //this.entity.OrderPriceToUsd = new CurrencyPipe().transform(value, format)
    }

    public onFocus(value: any) {

        switch (value.target.name) {
            case 'InMonthDevMM':
                this.oldRevenueValue.InMonthDevMM = value.target.value;
                break;

            case 'InMonthTransMM':
                this.oldRevenueValue.InMonthTransMM = value.target.value;
                break;

            case 'InMonthManagementMM':
                this.oldRevenueValue.InMonthManagementMM = value.target.value;
                break;

            case 'InMonthSumMM':
                this.oldRevenueValue.InMonthSumMM = value.target.value;
                break;

            case 'OrderProjectSumMM':
                this.oldRevenueValue.OrderProjectSumMM = value.target.value;
                break;

            case 'OrderPrice':
                this.oldRevenueValue.OrderPrice = value.target.value;
                break;

            case 'AccPreMonthSumMM':
                this.oldRevenueValue.AccPreMonthSumMM = value.target.value;
                break;

            case 'NextMonthMM':
                this.oldRevenueValue.NextMonthMM = value.target.value;
                break;
            case 'OrderNo':
                this.oldRevenueValue.OrderNo = value.target.value;
                break;
            default:

                break;
        }

    }

    selectAllContent($event) {
        $event.target.select();
    }

    public selectedReportYearMonthDate(value: any) {
        this.entity.ReportYearMonth = moment(value.end._d).format('YYYY/MM/01');
        //get lai cac so lieu de tinh toan cac so tien , so MM
        this.loadMultiCustomerUnitPriceByCustomerID();
        //setting trị mặc định cho ngày tháng năm
        this.setDateRangeValueDefault();
    }

    public selectedOrderStartDate(value: any) {
        this.entity.OrderStartDate = moment(value.end._d).format('YYYY/MM/DD');
    }

    public selectedOrderEndDate(value: any) {
        this.entity.OrderEndDate = moment(value.end._d).format('YYYY/MM/DD');
    }

    public onChangeOrderUnit(value: any) {
        if (value) {
            this.baseInformation.OrderUnit = this.entity.EstimateTypeMasterDetailID;

            this.calRelationOrderItem();
            this.calRelationInMonthItem();
        }
    }

    public onChangeCustomerUnitPrice(value: any, isAutoRecal: boolean) {
        if (value) {
            this.customerUnitPrice = this.customerUnitPrices.find(x => x.ID == value);
            if (this.customerUnitPrice) {
                //lay cac thong tin co ban de tinh toan so tien
                this.baseInformation.MangRate = this.customerUnitPrice.MangRate;
                this.baseInformation.TransRate = this.customerUnitPrice.TransRate;
                this.baseInformation.OrderPrice = this.customerUnitPrice.OrderPrice;
                this.baseInformation.OrderUnitPrice = this.customerUnitPrice.OrderUnitMasterDetailID;

                this.entity.OrderPrice = this.customerUnitPrice.OrderPrice | 0;

                //truong hop tu dong tinh toan lai cac item so tien
                if (isAutoRecal) {
                    this.calRelationOrderItem();
                    this.calRelationInMonthItem();
                    this.calRelationNextMonthItem();
                }
            }
        }
    }

    public onChangeExchangeRate(value: any) {
        if (value) {
            //lấy thông tin tỉ giá
            this.selectedExchangeRate = this.exchangeRates.find(p => p.ID == this.entity.ExchangeRateID);

            this.baseInformation.UsdToVnd = this.selectedExchangeRate.UsdToVnd;
            this.baseInformation.YenToVnd = this.selectedExchangeRate.YenToVnd;
            this.baseInformation.UsdToYen = this.selectedExchangeRate.UsdToVnd / this.selectedExchangeRate.YenToVnd;

            this.calRelationOrderItem();
            this.calRelationInMonthItem();
        }
    }

    public onChangeOrderNo(value: any) {
        if (value && (this.oldRevenueValue.OrderNo !== (this.entity.OrderNo || '').toString())) {
            //Tính lại lũy kế trong trường hợp có tồn tại số tiền của tháng sau
            if(this.entity.NextMonthMM !=0 ){
                this.getTotalZenMonth().subscribe((response: any[]) => {
                    this.totalZenMonth = response;
                    this.calRelationZenMonthItem();
                    this.calRelationNextMonthItem();
                }, error => this._dataService.handleError(error));
            }
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
                this.baseInformation.OrderUnit = this.entity.EstimateTypeMasterDetailID;
                //seting init cua ngay start va end
                this.setDateRangeValueDefault();
            }
            //lay so lieu luy ke 
            this.getTotalZenMonth().subscribe((response: any[]) => {
                this.totalZenMonth = response;
                //this.entity.AccPreMonthSumMM = this.totalZenMonth.find(x => x.OrderNo == this.entity.OrderNo).ZenTotalMM||0;
                this.calRelationZenMonthItem();
                this.calRelationNextMonthItem();
            }, error => this._dataService.handleError(error));
            //get cac don gia cua khach hang da chon
            this.loadMultiCustomerUnitPriceByCustomerID();
        }
    }

    /**
     * Xử lý event di chuyển con trỏ ra khỏi các textbox có tính toán
     */
    onInputBlur(event) {

        let managementMM: number;
        switch (event.target.name) {

            case 'InMonthDevMM':
                if (this.oldRevenueValue.InMonthDevMM !== (this.entity.InMonthDevMM || 0).toString()) {
                    //tinh so cong quan ly va so cong phien dich tu dong
                    this.entity.InMonthTransMM = this.entity.InMonthDevMM * (this.baseInformation.TransRate / 100);
                    //this.entity.InMonthManagementMM = (this.entity.InMonthDevMM * (this.baseInformation.MangRate / 100)).toFixed(2) ;
                    //this.entity.InMonthManagementMM =  +managementMM.toFixed(2);

                    this.entity.InMonthManagementMM = +(this.entity.InMonthDevMM * (this.baseInformation.MangRate / 100)).toFixed(10);
                    this.entity.InMonthTransMM = +(this.entity.InMonthDevMM * (this.baseInformation.TransRate / 100)).toFixed(10);

                    this.entity.InMonthSumMM = this.entity.InMonthDevMM + this.entity.InMonthTransMM + this.entity.InMonthManagementMM;

                    //tinh lai so tong MM trong thang trong trường hợp trị chưa được setting 
                    //nếu đã setting trị rồi thì không cập nhật lại.
                    if((this.entity.OrderProjectSumMM|0)==0){
                        this.entity.OrderProjectSumMM = +(this.entity.InMonthSumMM).toFixed(10);
                    }
                    //tinh toan cac so lieu lien quan
                    this.calRelationInMonthItem();
                    this.calRelationNextMonthItem();
                    this.calRelationOrderItem();
                }
                break;
            case 'InMonthTransMM':
                if (this.oldRevenueValue.InMonthTransMM !== (this.entity.InMonthTransMM || 0).toString()) {
                    this.entity.InMonthSumMM = +(this.entity.InMonthDevMM + this.entity.InMonthTransMM + this.entity.InMonthManagementMM).toFixed(10);
                    //tinh lai so tong MM trong thang trong trường hợp trị chưa được setting 
                    //nếu đã setting trị rồi thì không cập nhật lại.
                    if((this.entity.OrderProjectSumMM|0)==0){
                        this.entity.OrderProjectSumMM = +(this.entity.InMonthSumMM).toFixed(10);
                    }
                    //tinh toan cac so lieu lien quan
                    this.calRelationInMonthItem();
                    this.calRelationNextMonthItem();
                    this.calRelationOrderItem();
                }
                break;

            case 'InMonthManagementMM':
                if (this.oldRevenueValue.InMonthManagementMM !== (this.entity.InMonthManagementMM || 0).toString()) {
                    //devMM = event.target.value | 0;
                    this.entity.InMonthSumMM = +(this.entity.InMonthDevMM + this.entity.InMonthTransMM + this.entity.InMonthManagementMM).toFixed(10);
                    //tinh lai so tong MM trong thang trong trường hợp trị chưa được setting 
                    //nếu đã setting trị rồi thì không cập nhật lại.
                    if((this.entity.OrderProjectSumMM|0)==0){
                        this.entity.OrderProjectSumMM = +(this.entity.InMonthSumMM).toFixed(10);
                    }
                    //tinh toan cac so lieu lien quan
                    this.calRelationInMonthItem();
                    this.calRelationNextMonthItem();
                    this.calRelationOrderItem();
                }
                break;

            case 'OrderProjectSumMM':
                //tinh cac so tien co lien quan
                this.calRelationOrderItem();
                this.calRelationNextMonthItem();
                break;

            case 'OrderPrice':
                //gan lai don gia trong truong hop thay doi bang tay ( do dang tinh theo this.baseInformation.OrderPrice)
                this.baseInformation.OrderPrice  = this.entity.OrderPrice ;
                break;    

            case 'AccPreMonthSumMM':
                //this.calRelationAccItem();
                this.calRelationNextMonthItem();
                break;

            case 'NextMonthMM':
                this.calRelationNextItem();
                break;

            case 'InMonthToUsd':
                if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_USD) {
                    /* chyển đối thành VND */
                    this.entity.InMonthToVnd = this.entity.InMonthToUsd * this.baseInformation.UsdToVnd;

                } else if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_YEN) {
                    /* chyển đối thành VND */
                    this.entity.InMonthToVnd = this.entity.InMonthToUsd * this.baseInformation.UsdToVnd;
                }
                break;

            default:

                break;
        }

        //lam tron cac so lieu 
        //this.entityRoundNumber();
    }

    /**
     * Tính toán các item có liên quan 
     */
    calRelationInMonthItem() {
        /**Tính số tiền qui đổi thành USD của tháng này (phần tạm tính) */

        if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_USD) {
            //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá 
            this.entity.InMonthToUsd = +(this.entity.InMonthSumMM * this.baseInformation.OrderPrice).toFixed(10);
            /* chyển đối thành VND */
            this.entity.InMonthToVnd = +(this.entity.InMonthToUsd * this.baseInformation.UsdToVnd).toFixed(10);

        } else if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_YEN) {
            //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá * tỉ lệ USD/YEN
            if (this.baseInformation.UsdToYen == undefined || this.baseInformation.UsdToYen == 0) {
                this.entity.InMonthToUsd = 0;
            } else {
                this.entity.InMonthToUsd = +((this.entity.InMonthSumMM * this.baseInformation.OrderPrice) / this.baseInformation.UsdToYen).toFixed(10);
            }

            /* chyển đối thành VND */
            this.entity.InMonthToVnd = +(this.entity.InMonthToUsd * this.baseInformation.UsdToVnd).toFixed(10);
        }

    }

    /**
     * Tính toán các item có liên quan đến Order
     */
    calRelationOrderItem() {
        //Nếu tổng MM khac 0 va khac so voi tri lan truoc
        if(this.entity.OrderProjectSumMM != 0 
            && (this.oldRevenueValue.OrderProjectSumMM !== (this.entity.OrderProjectSumMM || 0).toString())){
            /**Tính số tiền qui đổi thành USD của MM toàn bộ tháng này(cột quotation/order) */
            let orderPriceToUsd: number = 0;
            if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_USD) {
                //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá 
                orderPriceToUsd = (this.entity.OrderProjectSumMM * this.baseInformation.OrderPrice);

            } else if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_YEN) {
                //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá * tỉ lệ USD/YEN
                if (this.baseInformation.UsdToYen == undefined || this.baseInformation.UsdToYen == 0) {
                    orderPriceToUsd = 0;
                } else {
                    orderPriceToUsd = (this.entity.OrderProjectSumMM * this.baseInformation.OrderPrice) / this.baseInformation.UsdToYen;
                }

            }
            /* chyển đối thành USD */

            this.entity.OrderPriceToUsd = +(orderPriceToUsd).toFixed(10);
        }else if(this.entity.OrderProjectSumMM === 0 ){
            //gan tien va don gia nhu nhau ( dung trong giam gia)
            this.entity.OrderPriceToUsd =  +(this.entity.OrderPrice).toFixed(10);
        }
    }

    /**
     * Tính toán các item có liên quan toi luy ke thang truoc 
     * ( sẽ lấy từ DB mà không tính tự động do là số liệu tháng trước)
     */
    // calRelationAccItem() {
    //     /**Tính số tiền qui đổi thành USD của MM toàn bộ tháng này(cột quotation/order) */
    //     let accPriceToUsd: number = 0;
    //     if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_USD) {
    //         //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá 
    //         accPriceToUsd = (this.entity.AccPreMonthSumMM * this.baseInformation.OrderPrice);

    //     } else if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_YEN) {
    //         //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá * tỉ lệ USD/YEN
    //         if (this.baseInformation.UsdToYen == undefined || this.baseInformation.UsdToYen == 0) {
    //             accPriceToUsd = 0;
    //         } else {
    //             accPriceToUsd = (this.entity.AccPreMonthSumMM * this.baseInformation.OrderPrice) / this.baseInformation.UsdToYen;
    //         }

    //     }
    //     /* chyển đối thành VND */

    //     this.entity.AccPreMonthSumToUsd = accPriceToUsd;
    // }

    /**
      * Tính toán các item có liên quan toi luy ke thang truoc
      */
    calRelationNextItem() {
        /**Tính số tiền qui đổi thành USD của MM toàn bộ tháng này(cột quotation/order) */
        let nextPriceToUsd: number = 0;
        if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_USD) {
            //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá 
            nextPriceToUsd = (this.entity.NextMonthMM * this.baseInformation.OrderPrice);

        } else if (this.entity.OrderUnitMasterDetailID == SystemConstants.ORDER_UNIT_YEN) {
            //trường hợp đơn vị tính là USD thì lấy số MM * đơn giá * tỉ lệ USD/YEN
            if (this.baseInformation.UsdToYen == undefined || this.baseInformation.UsdToYen == 0) {
                nextPriceToUsd = 0;
            } else {
                nextPriceToUsd = (this.entity.NextMonthMM * this.baseInformation.OrderPrice) / this.baseInformation.UsdToYen;
            }

        }
        /* chyển đối thành VND */

        this.entity.NextMonthToUsd = nextPriceToUsd;
    }

    calRelationZenMonthItem() {
        if(this.totalZenMonth.length>0){
            let zenMonthRecord = this.totalZenMonth.find(x => (x.OrderNo == this.entity.OrderNo 
                                                                        && x.CustomerID==this.entity.CustomerID 
                                                                        && x.CustomerUnitPriceID == this.entity.CustomerUnitPriceID));
            this.entity.AccPreMonthSumMM = zenMonthRecord.ZenTotalMM;
            this.entity.AccPreMonthSumToUsd = zenMonthRecord.ZenTotalUSD;

            //this.calRelationAccItem();
        }
    }

    calRelationNextMonthItem() {
        //cap nhật lại số còn lại của kỳ sau 
        this.entity.NextMonthMM = +(this.entity.OrderProjectSumMM - this.entity.InMonthSumMM - this.entity.AccPreMonthSumMM).toFixed(10);
        this.calRelationNextItem();
        //this.entity.NextMonthToUsd = this.entity.OrderPriceToUsd - this.entity.AccPreMonthSumToUsd;

    }

    back() {
        this._router.navigate(['../main/revenue']);
    }

    setDateRangeValueDefault(){
        this.entity.OrderStartDate = DateTimeHelper.getStartDateWithSime(this.entity.ReportYearMonth,this.selectedCustomer.Sime||31);
        this.entity.OrderEndDate = DateTimeHelper.getEndDateWithSime(this.entity.ReportYearMonth,this.selectedCustomer.Sime||31);
    }

    ngOnDestroy(){
        this.sub.unsubscribe();
    }
    //https://angular-2-training-book.rangle.io/handout/routing/query_params.html
    nextPage() {
    this._router.navigate(['product-list'], { queryParams: { page: this.id + 1 } });
    }
}
