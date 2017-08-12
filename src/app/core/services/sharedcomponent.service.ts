import { Injectable, Output, EventEmitter, ApplicationRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedComponentService {
    //private subject = new Subject<any>();
    //@Output() fire: EventEmitter<any> = new EventEmitter();

    private text = new Subject<any>();
    public text$ = this.text.asObservable();

    constructor(private appRef: ApplicationRef) {
        
    }

    /* sendMessage(message: string) {
        this.subject.next({ text: message });
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    change(value: any) {
        console.log('change started ' + value);
        this.fire.emit(value);
    }

    getEmittedValue() {
        return this.fire;
    } */

    publishValue(value: any) {
        this.text.next(value);
    }

    getPublishValue() {
        return this.text;
    }


}