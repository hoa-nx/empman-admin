import { Directive, ElementRef, Input, HostListener } from '@angular/core';
@Directive({
    selector: '[onReturn]'
})
export class OnReturnDirective {
    private el: ElementRef;
    @Input() onReturn: string;
    constructor(private _el: ElementRef) {
        this.el = this._el;
    }
    @HostListener('keydown', ['$event']) onKeyDown(e) {
        if ((e.which == 13 || e.keyCode == 13)) {
            e.preventDefault();
            if (e.srcElement.parentNode.parentNode.nextElementSibling) {
                //let elementToFocus = e.srcElement.parentNode.parentNode.nextElementSibling.getElementsByClassName('form-control');
                //elementToFocus.focus();
                //e.srcElement.nextElementSibling.focus();               
            }
            else{
                //console.log('close keyboard');
            }
            return;
        }
    }
}
