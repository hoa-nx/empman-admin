import {
    NgModule,
    ComponentRef,
    Injectable,
    Component,
    Injector,
    ViewContainerRef,
    ViewChild, ComponentFactoryResolver,
    Output,
    EventEmitter
} from "@angular/core";
import { BrowserModule } from '@angular/platform-browser'
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {

    modalEvents: Subject<any> = new Subject();

    popupData;
    hasModalShown;

    showModal(component: any, data?: any, callback?: any, cancelCallback?: any) {
        //this.showModal.next(component);

        var innerFunc = () => {
            this.popupData = {
                cmd: "show", component: component, data: data,
                callback: callback, cancelCallback: cancelCallback
            };
            this.modalEvents.next(this.popupData);
            this.hasModalShown = true;
        }

        if (this.hasModalShown) {
            this.hideModal();
            //setTimeout(innerFunc,600);
        } else {
            innerFunc();
        }
    }

    hideModal(isSubmit: boolean = false, data?: any) {
        if (this.hasModalShown) {
            this.modalEvents.next({ cmd: "hide" });
            if (isSubmit && this.popupData.callback) {
                //give some time for the closing animation before calling the parent
                setTimeout(() => {
                    this.popupData.callback(data);
                }, 5000);
            } else if (this.popupData.cancelCallback) {
                this.popupData.cancelCallback(data);

            }

            this.hasModalShown = false;
        }
    }
}