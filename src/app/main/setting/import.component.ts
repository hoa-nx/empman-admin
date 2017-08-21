import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { ItemsService } from '../../shared/utils/items.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { LoaderService } from '../../shared/utils/spinner.service';
import { SystemConstants } from '../../core/common/system.constants';
import { MessageContstants } from '../../core/common/message.constants';

@Component({
    selector: 'app-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

    @ViewChild("filePath") filePath;
    @ViewChild("filePathRevenue") filePathRevenue;
    @ViewChild("filePathRecruitment") filePathRecruitment;
    public recruitments : any[];
    public recruitmentID : any;

    constructor(private _dataService: DataService,
        private _itemsService: ItemsService,
        private _notificationService: NotificationService,
        private _uploadService: UploadService,
        private _loaderService: LoaderService) {


    }

    ngOnInit() {
        this.loadDataRecruitments();
    }   


    private loadDataRecruitments() {
        this._dataService.get('/api/recruitment/getall').subscribe((response: any[]) => {
            this.recruitments = response;
        }, error => this._dataService.handleError(error));
    }
    /**
     * Import thông tin nhân viên
     */
    importEmp() {
        let fi = this.filePath.nativeElement;
        if (fi.files.length > 0) {
            this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_IMPORT_NO_DELETE_DATA_MSG, () => {
                this._loaderService.displayLoader(true);
                this._uploadService.postWithFile('/api/emp/import', null, fi.files).then((message: string) => {
                    this._loaderService.displayLoader(false);
                    this._notificationService.printSuccessMessage(message);
                });
            });
        } else {
            this._notificationService.printAlertDialog(MessageContstants.CONFIRM_NOT_SELECT_FILE_MSG, () => { });
        }
    }

    /**
     * Import doanh số
     */

    importRevenue() {
        let fi = this.filePathRevenue.nativeElement;
        if (fi.files.length > 0) {
            this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_IMPORT_NO_DELETE_DATA_MSG, () => {
                this._loaderService.displayLoader(true);
                this._uploadService.postWithFile('/api/emp/importrevenue', null, fi.files).then((message: string) => {
                    this._loaderService.displayLoader(false);
                    this._notificationService.printSuccessMessage(message);
                });
            });
        } else {
            this._notificationService.printAlertDialog(MessageContstants.CONFIRM_NOT_SELECT_FILE_MSG, () => { });
        }
    }

    /**
     * Import thông tin nhân viên
     */
    importRecruitment() {
        let fi = this.filePathRecruitment.nativeElement;
        if (fi.files.length > 0) {
            this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_IMPORT_NO_DELETE_DATA_MSG, () => {
                this._loaderService.displayLoader(true);

                let postData: any = {
                    recruitmentID: this.recruitmentID,
                    
                    recruitmentType: this.recruitments.find(x => x.ID == this.recruitmentID).RecruitmentTypeMasterDetailID

                };
                this._uploadService.postWithFile('/api/recruitmentstaff/import', postData, fi.files).then((message: string) => {
                    this._loaderService.displayLoader(false);
                    this._notificationService.printSuccessMessage(message);
                });
            });
        } else {
            this._notificationService.printAlertDialog(MessageContstants.CONFIRM_NOT_SELECT_FILE_MSG, () => { });
        }
    }


}
