import {
    Component, Input, Output, OnInit, ViewContainerRef, EventEmitter, ViewChild,
    trigger,
    state,
    style,
    animate,
    transition,
    Directive
} from '@angular/core';

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
import { SystemConstants } from '../../core/common/system.constants';
import { MdRadioButton, MdRadioGroup, MdRadioModule } from '@angular/material';

declare var moment: any;

@Component({
    moduleId: module.id,
    selector: 'emp-card',
    templateUrl: 'emp-card.component.html',
    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.5s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 10 ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]

})

export class EmpCardComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    @Input() user: IEmp;
    @Output() removeUser = new EventEmitter();
    @Output() userCreated = new EventEmitter();

    edittedUser: IEmp;
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
    /* tslint:disable:no-unused-variable */
    // Supported image types
    private supportedFileTypes: string[] = ['image/png', 'image/jpeg', 'image/gif'];
    /* tslint:enable:no-unused-variable */

    private currentProfileImage: string = 'http://localhost:4200/assets/images/profile-default.png';

    public dateOptions: any = {
        locale: { format: 'YYYY/MM/DD' },
        showDropdowns: true,
        alwaysShowCalendars: false,
        autoUpdateInput: false,
        singleDatePicker: true
    };

    public uriAvatarPath: string = SystemConstants.BASE_API;

    constructor(private itemsService: ItemsService,
        private _notificationService: NotificationService,
        private _dataService: DataService,
        private _uploadService: UploadService) { }

    ngOnInit() {
        //this.apiHost = this.configService.getApiHost();
        this.edittedUser = this.itemsService.getSerialized<IEmp>(this.user);
        
        if (this.user.ID < 0) {
            this.editUser();
        }
        //khoi tao gia tri cho co quan ly file co thay doi khong 
        this.isFileChanged = false;
    }

    editUser() {
        
        this.onEdit = !this.onEdit;
        //https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in
        if(this.onEdit && this.user.StartWorkingDate){
            this.user.StartWorkingDate = moment(this.user.StartWorkingDate).format('YYYY/MM/DD');
        }
        if(this.onEdit && this.user.StartTrialDate){
            this.user.StartTrialDate = moment(this.user.StartTrialDate).format('YYYY/MM/DD');
        }
        if(this.onEdit && this.user.EndTrialDate){
            this.user.EndTrialDate = moment(this.user.EndTrialDate).format('YYYY/MM/DD');
        }
        if(this.onEdit && this.user.ContractDate){
            this.user.ContractDate = moment(this.user.ContractDate).format('YYYY/MM/DD');
        }
        if(this.onEdit && this.user.JobLeaveDate){
            this.user.JobLeaveDate = moment(this.user.JobLeaveDate).format('YYYY/MM/DD');
        }

        this.edittedUser = this.itemsService.getSerialized<IEmp>(this.user);
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
        this._dataService.post('/api/emp/add', JSON.stringify(this.edittedUser))
            .subscribe((response: any) => {
                //this.loadData();
                this.user = this.itemsService.getSerialized<IEmp>(response);
                this.edittedUser = this.itemsService.getSerialized<IEmp>(this.user);
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

    public calendarCanceledStartTrialDate(e:any){

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

    public calendarEventsHandler(e:any) {
        console.log(e);
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
    private dragFileOverStart() {
    }
    // File being dragged has moved out of the drop region
    private dragFileOverEnd() {
    }

    private dragFileAccepted(acceptedFile: Ng2FileDropAcceptedFile) {
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
        console.log(this.avatarFile);
    }

    // File being dragged has been dropped and has been rejected
    private dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
    }


    /* Drag Drop File End*/

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