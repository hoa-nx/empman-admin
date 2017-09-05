import {
    Component, Input, Output, OnInit, ViewContainerRef, EventEmitter, ViewChild,

    Directive
} from '@angular/core';

import {
    trigger,
    state,
    style,
    animate,
    transition,
    group
} from '@angular/animations';
import { IEmp, ISchedule } from '../../core/interfaces/interfaces';
import { ItemsService } from '../../shared/utils/items.service';
import { HighlightDirective } from '../../shared/directives/highlight.directive';

import { ModalDirective } from 'ngx-bootstrap';
import { NotificationService } from '../../core/services/notification.service';
import { DataService } from '../../core/services/data.service';
import { MessageContstants } from '../../core/common/message.constants';
//import { FileUploader } from 'ng2-file-upload';
import { Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile } from 'ng2-file-drop';
import { UploadService } from '../../core/services/upload.service';
import { SystemConstants, DateRangePickerConfig } from '../../core/common/system.constants';
import { MdRadioButton, MdRadioGroup, MdRadioModule } from '@angular/material';
import { LoaderService } from '../../shared/utils/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '../../core/services/authen.service';
import { LoggedInUser } from '../../core/domain/loggedin.user';

declare var moment: any;

@Component({
    moduleId: module.id,
    selector: 'emp-card',
    templateUrl: 'emp-card.component.html',
    styleUrls: ['./emp-card.component.css'],
    animations: [
        trigger('flyInOut', [
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate(350)
            ]),
            transition(':leave', [
                group([
                    animate('0.2s ease', style({
                        transform: 'translate(150px,25px)'
                    })),
                    animate('0.5s 0.2s ease', style({
                        opacity: 0
                    }))
                ])
            ])
        ])
    ]

})

export class EmpCardComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    @Input() user: IEmp | undefined;  /* add | undefined to fix warning khen build */
    @Output() removeUser = new EventEmitter();
    @Output() userCreated = new EventEmitter();

    edittedUser: IEmp | undefined; /* add | undefined to fix warning khen build */
    onEdit: boolean = false;
    apiHost: string;
    // Modal properties
    @ViewChild('modal')
    modal: any;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    userSchedules: ISchedule[];
    userSchedulesLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    avatarFile: any;
    isFileChanged: boolean;
    empInfo1: string = "";

    /* tslint:disable:no-unused-variable */
    // Supported image types
    public supportedFileTypes: string[] = ['image/png', 'image/jpeg', 'image/gif'];
    /* tslint:enable:no-unused-variable */

    private currentProfileImage: string = SystemConstants.BASE_WEB + '/assets/images/profile-default.png';
    private imgJobLeave: string = SystemConstants.BASE_WEB + '/assets/images/IsJobLeave2.png';
    public dateOptions: any = DateRangePickerConfig.dateOptions;

    public uriAvatarPath: string = SystemConstants.BASE_API;
    public userLogin: LoggedInUser;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _itemsService: ItemsService,
        private _notificationService: NotificationService,
        private _dataService: DataService,
        private _uploadService: UploadService,
        private _loaderService: LoaderService,
        private _authenService: AuthenService) { }

    ngOnInit() {
        this.userLogin = this._authenService.getLoggedInUser();

        //this.apiHost = this.configService.getApiHost();
        this.edittedUser = this._itemsService.getSerialized<IEmp>(this.user);
        if (this.edittedUser) {
            //thong tin phong ban
            if (this.edittedUser.DeptName) {
                this.empInfo1 += this.edittedUser.DeptName || "";
            }
            //thong tin team nhom
            if (this.edittedUser.TeamName) {
                if (this.empInfo1.length > 0) {
                    this.empInfo1 += " - " + this.edittedUser.TeamName || "";
                } else {
                    this.empInfo1 += this.edittedUser.TeamName || "";
                }

            }
            //thong tin chuc vu
            if (this.edittedUser.PositionName) {
                if (this.empInfo1.length > 0) {
                    this.empInfo1 += " - " + this.edittedUser.PositionName || "";
                } else {
                    this.empInfo1 += this.edittedUser.PositionName || "";
                }
            }
            if (this.empInfo1.length === 0) {
                this.empInfo1 += "Chưa chỉ định thông tin";
            }
        }
        //console.log(this.edittedUser);
        if (this.user.ID < 0) {
            this.editUser();
        }
        //khoi tao gia tri cho co quan ly file co thay doi khong 
        this.isFileChanged = false;
    }

    editUser() {

        this.onEdit = !this.onEdit;
        //https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in
        if (this.onEdit && this.user.StartWorkingDate) {
            this.user.StartWorkingDate = moment(this.user.StartWorkingDate).format('YYYY/MM/DD');
        }
        if (this.onEdit && this.user.StartTrialDate) {
            this.user.StartTrialDate = moment(this.user.StartTrialDate).format('YYYY/MM/DD');
        }
        if (this.onEdit && this.user.EndTrialDate) {
            this.user.EndTrialDate = moment(this.user.EndTrialDate).format('YYYY/MM/DD');
        }
        if (this.onEdit && this.user.ContractDate) {
            this.user.ContractDate = moment(this.user.ContractDate).format('YYYY/MM/DD');
        }
        if (this.onEdit && this.user.JobLeaveDate) {
            this.user.JobLeaveDate = moment(this.user.JobLeaveDate).format('YYYY/MM/DD');
        }

        this.edittedUser = this._itemsService.getSerialized<IEmp>(this.user);
        // <IUser>JSON.parse(JSON.stringify(this.user)); // todo Utils..
    }

    createUser() {
        if ((typeof (this.avatarFile) == 'undefined')) {
            //tao hinh mac dinh
            this.getDefaultProfileFile();
        }
        //co ton tai file upload
        this._uploadService.postWithFile('/api/upload/saveImage?type=avatar', null, [this.avatarFile])
            .then((imageUrl: string) => {
                this.edittedUser.Avatar = imageUrl;
            }).then(() => {
                this.insertData();
            });
    }

    /*
    Tao moi 
    */
    insertData() {
        this.edittedUser.CurrentCompanyID = this.userLogin.companyid;
        this.edittedUser.CurrentDeptID = this.userLogin.deptid;

        this._dataService.post('/api/emp/add', JSON.stringify(this.edittedUser))
            .subscribe((response: any) => {
                //this.loadData();
                this.user = this._itemsService.getSerialized<IEmp>(response);
                this.edittedUser = this._itemsService.getSerialized<IEmp>(this.user);
                this.onEdit = false;

                this.userCreated.emit({ value: response });

                this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
            }, error => this._dataService.handleError(error));
    }

    updateUser() {
        if ((typeof (this.avatarFile) !== 'undefined')) {
            //co ton tai file upload
            this._uploadService.postWithFile('/api/upload/saveImage?type=avatar', null, [this.avatarFile])
                .then((imageUrl: string) => {
                    this.edittedUser.Avatar = imageUrl;
                }).then(() => {
                    this.updateData();
                });
        } else {
            this.updateData();
        }
    }

    updateData() {
        this._dataService.put('/api/emp/update', JSON.stringify(this.edittedUser))
            .subscribe((response: any) => {
                //this.loadData();
                this.user = this.edittedUser;
                this.onEdit = !this.onEdit;
                this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
            }, error => this._dataService.handleError(error));
    }


    openRemoveModal() {
        this._notificationService.printConfirmationDialog('Bạn có muốn xóa ' + this.user.FullName + '?',
            () => {
                this._dataService.delete('/api/emp/delete', 'id', this.user.ID.toString())
                    .subscribe((response: Response) => {
                        this.removeUser.emit({
                            value: this.user
                        });
                        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
                        //this.loadData();
                    });

            });
    }

    isUserValid(): boolean {
        return !(this.edittedUser.FullName.trim() === "");
    }

    public selectedStartTrialDate(value: any) {
        this.edittedUser.StartTrialDate = moment(value.end._d).format('YYYY/MM/DD');
    }

    public calendarCanceledStartTrialDate(e: any) {

    }

    public selectedEndTrialDate(value: any) {
        this.edittedUser.EndTrialDate = moment(value.end._d).format('YYYY/MM/DD');
    }

    public selectedContractDate(value: any) {
        this.edittedUser.ContractDate = moment(value.end._d).format('YYYY/MM/DD');
    }

    public selectedJobLeaveDate(value: any) {
        this.edittedUser.JobLeaveDate = moment(value.end._d).format('YYYY/MM/DD');
    }

    public calendarEventsHandler(e: any) {

    }
    public selectGender(event) {
        this.edittedUser.Gender = event.source._checked;
    }
    private getDefaultProfileFile() {
        let file = new File([this.avatarFile], "profile-default.png");
        this.avatarFile = file;
        /*
        var xhr = new XMLHttpRequest();
        xhr.open('GET',  this.currentProfileImage, true);
        xhr.responseType = 'blob';
        let _this = this;
        xhr.onload = function (e) {
            if (xhr.status == 200) {
                var myBlob = xhr.response;
                console.log(myBlob);

                let reader = new FileReader();
                reader.onload = () => {
                    // Set and show the image
                    _this.edittedUser.ShowAvatar = true;
                    _this.isFileChanged = true;
                };
                // Read in the file
                console.log(reader.readAsDataURL(myBlob));
                //Luu lai file da chon de cap nhat sau nay 
                _this.avatarFile = "profile-default.png";
            }
        };
        xhr.send();
        */
    }

    /* Drag Drop File Begin*/
    // File being dragged has moved into the drop region
    public dragFileOverStart() {
    }
    // File being dragged has moved out of the drop region
    public dragFileOverEnd() {
    }

    public dragFileAccepted(acceptedFile: Ng2FileDropAcceptedFile) {
        // Load the image in
        let fileReader = new FileReader();
        fileReader.onload = () => {
            // Set and show the image
            this.currentProfileImage = fileReader.result;
            this.edittedUser.ShowAvatar = true;
            this.isFileChanged = true;
        };
        // Read in the file
        fileReader.readAsDataURL(acceptedFile.file);
        //Luu lai file da chon de cap nhat sau nay 
        this.avatarFile = acceptedFile.file;

    }

    // File being dragged has been dropped and has been rejected
    public dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
    }


    /* Drag Drop File End*/

    public editDetailUser(user: any) {
        this._router.navigate(['../../emp/edit', user.ID, 'edit']);
    }

    /*viewSchedules(user: IUser) {
    console.log(user);
    this.dataService.getUserSchedules(this.edittedUser.id)
        .subscribe((schedules: ISchedule[]) => {
            this.userSchedules = schedules;
            console.log(this.userSchedules);
            this.userSchedulesLoaded = true;
            this.childModal.show();
            //this.slimLoader.complete();
        },
        error => {
            //this.slimLoader.complete();
            this.notificationService.printErrorMessage('Failed to load users. ' + error);
        });

}

public hideChildModal(): void {
    this.childModal.hide();
}

opened() {
    //this.slimLoader.start();
    this.dataService.getUserSchedules(this.edittedUser.id)
        .subscribe((schedules: ISchedule[]) => {
            this.userSchedules = schedules;
            console.log(this.userSchedules);
            this.userSchedulesLoaded = true;
            //this.slimLoader.complete();
        },
        error => {
            //this.slimLoader.complete();
            this.notificationService.printErrorMessage('Failed to load users. ' + error);
        });
    this.output = '(opened)';
}
*/

}