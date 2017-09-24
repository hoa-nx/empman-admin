import { Component, OnInit, NgZone, NgModule, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { LoggedInUser } from '../../core/domain/loggedin.user';
import { AuthenService } from '../../core/services/authen.service';
import { SystemConstants } from '../../core/common/system.constants';
import { UtilityService } from '../../core/services/utility.service';
import { UrlConstants } from '../../core/common/url.constants';
import { DataService } from '../../core/services/data.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { SharedComponentService } from '../../core/services/sharedcomponent.service';
import { LoaderService } from '../utils/spinner.service';
import { NotificationService } from '../../core/services/notification.service';


@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})

/*@NgModule({
  imports: [
    FormsModule
  ],
})*/

export class TopMenuComponent implements OnInit, OnDestroy {

  @ViewChild('searchtags') searchAreas: ElementRef;

  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public totalRow: number;
  public filter: string = '';

  public user: LoggedInUser;
  public baseFolder: string = SystemConstants.BASE_API;
  public empCount: any | 0;
  public empContractedCount: any | 0;
  public empTrialCount: any | 0;
  public empOtherCount: any | 0;
  public empContractedLTNMonthCount: any | 0;
  public empOnsiteCount: any | 0;
  public empTransCount: any | 0;
  public expMonth: any | 4;
  public empContractedJobLeavedCount: any | 0;
  public empTrialJobLeavedCount: any | 0;
  public empContractedJobLeavedInProcessingYearCount: any | 0;
  public empTrialJobLeavedInProcessingYearCount: any | 0;
  public empTrialInProcessingYearCount : any|0;
  public processingYear: any | 0;

  private text: string;
  private subscriber: Subscription;
  public currentUrl: string = '';

  public emps: any[];
  public tagName: any = '';

  public sendValueToExpandable: any = {
    group : ''
  }

  tags: any[] = [
    { title: 'Default' },
    { title: 'Primary', color: 'primary', pill: true, removable: true, value: 'Some great value' },
    { title: 'Info', color: 'info', pill: true, removable: true, value: false },
    { title: 'Success', color: 'success', pill: true, removable: true, value: 1234567890 }
  ];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenService: AuthenService,
    private _utilityService: UtilityService,
    private _dataService: DataService,
    private _ngZone: NgZone,
    private _sharedComponentService: SharedComponentService,
    private _loaderService: LoaderService,
    private _notificationService: NotificationService,
    private _eRef: ElementRef
  ) {

    // subscribe to home component messages
    //this.subscription = this._messageService.getMessage().subscribe(message => { this.message = message; });
    //this.subscription = this.msgService.getEmittedValue().subscribe(message => { this.message = message; });
  }

  ngOnInit() {
    this.user = this._authenService.getLoggedInUser();
    this.subscriber = this._sharedComponentService.text$.subscribe(data => {
      this.empCount = data.empCount;
      this.empContractedCount = data.empContractedCount;
      this.empTrialCount = data.empTrialCount;
      this.empOtherCount = data.empOtherCount;
      this.empContractedLTNMonthCount = data.empContractedLTNMonthCount;
      this.empOnsiteCount = data.empOnsiteCount;
      this.empTransCount = data.empTransCount;
      this.empContractedJobLeavedCount = data.empContractedJobLeavedCount | 0;
      this.empTrialJobLeavedCount = data.empTrialJobLeavedCount | 0;
      this.empTrialJobLeavedInProcessingYearCount = data.empTrialJobLeavedInProcessingYearCount | 0;
      this.empContractedJobLeavedInProcessingYearCount = data.empContractedJobLeavedInProcessingYearCount | 0;
      this.empTrialInProcessingYearCount = data.empTrialInProcessingYearCount|0;
      this.processingYear = data.processingYear | 0;
      this.expMonth = data.expMonth | 4;
    });
    this.reLoadDataEmp();
    this.currentUrl = this._router.url;
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }

  }

  gotoHome() {
    this._utilityService.navigate(UrlConstants.HOME);
  }

  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this._utilityService.navigate(UrlConstants.LOGIN);
  }

  searchEmp(data: any) {
    //goi toi man hinh list va truyen di tri filter
    this.filter = data.target.value || '';

    this._router.navigateByUrl("/main/emp/card-list/" + this.filter, { skipLocationChange: false });
  }

  gotoSetting() {
    this._router.navigateByUrl("/main/setting/index/" + this.currentUrl);
  }
  reLoadDataEmp() {
    this._loaderService.displayLoader(true);
    this._dataService.get('/api/emp/getallpagingfromview?&keyword=' + this.filter + '&page=1&pageSize=1')
      .subscribe((response: any) => {
        this.emps = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
        // send message to subscribers via observable subject

        if (this.emps.length > 0) {
          this.empCount = this.emps[0].TotalRecords.toString();
          this.empContractedCount = this.emps[0].ContractedCount.toString();
          this.empTrialCount = this.emps[0].TrialCount.toString();
          this.empOtherCount = this.emps[0].OtherCount.toString();
          this.empContractedLTNMonthCount = this.emps[0].ContractedLTNMonthCount.toString();
          this.empOnsiteCount = this.emps[0].OnsiteCount.toString();
          this.empTransCount = this.emps[0].TransCount.toString();
          this.expMonth = this.emps[0].ExpMonth.toString();
          this.empContractedJobLeavedCount = this.emps[0].ContractedJobLeavedCount | 0;
          this.empTrialJobLeavedCount = this.emps[0].TrialJobLeavedCount | 0;

          this.empTrialJobLeavedInProcessingYearCount = this.emps[0].TrialJobLeavedInProcessingYearCount | 0;
          this.empContractedJobLeavedInProcessingYearCount = this.emps[0].ContractedJobLeavedInProcessingYearCount | 0;
          this.empTrialInProcessingYearCount = this.emps[0].TrialInProcessingYearCount | 0;
          this.processingYear = this.emps[0].ProcessingYear | 0;
        }

        this._loaderService.displayLoader(false);

      }, error => this._dataService.handleError(error));
  }

  public addSearchTags(tag: any) {
    console.log(tag);
    this.tagName = tag;
    let htmlTag = `<span id={{tagName}} class="tag label label-info">
                    <span> LTV</span>
                    <a style="top:auto ; right:auto ; color:white; " href="javascript:void(0);" (click)="removeSearchTags(a)" ><i class="remove glyphicon glyphicon-remove-sign glyphicon-white"></i></a> 
                  </span>`;

    this.searchAreas.nativeElement.insertAdjacentHTML('beforeend', htmlTag);

  }

  removeSearchTags(tag: any) {

    console.log(tag);

  }

  displayEmpByType(data: any) {
    //goi toi man hinh list va truyen di tri filter
    //this._router.navigateByUrl("/main/emp/emp-expandable/" + data, { skipLocationChange: true });

    // send message to subscribers via observable 
    this._router.navigateByUrl("/main/emp/emp-expandable");
    this.sendValueToExpandable.group = data;
    this._sharedComponentService.publishValueToEmpExpandable(this.sendValueToExpandable);
    
    //console.log(this.sendValueToExpandable);
  }

}