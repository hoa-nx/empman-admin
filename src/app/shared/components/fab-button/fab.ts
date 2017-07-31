//https://embed.plnkr.co/gist/00de5ab564446dcb8be067d44e67a692
import {
  Component,
  Input,
  ContentChildren,
  ContentChild,
  ElementRef,
  HostListener
} from '@angular/core';

import { FabButton } from './fabbutton';
import { FabToggle } from './fabtoggle';
//import { FabModule} from './fabmodule' ;

@Component({
  selector: 'app-fab',
  
  template: `
    <nav
      class="fab-menu"
      [class.active]="active">
      <ng-content></ng-content>
    </nav>
  `
})
export class Fab {
    element: any;
    _active: any;

  @Input() dir = 'right';
  @ContentChild(FabToggle) toggle;
  @ContentChildren(FabButton) buttons;

  get active() {
    return this._active;
  }

  set active(val) {
    this.updateButtons(val);
    this._active = val;
  }

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngAfterContentInit() {
    this.toggle.onClick.subscribe(() => {
      this.active = !this.active;
    });
  }

  getTranslate(idx) {
    if(this.dir === 'right') {
      return `translate3d(${ 60 * idx }px,0,0)`;
    } else if(this.dir === 'down') {
      return `translate3d(0,${ 60 * idx }px,0)`;
    } else {
      console.error(`Unsupported direction for Fab; ${this.dir}`);
    }
  }

  updateButtons(active) {
    let idx = 1;
    for(let btn of this.buttons.toArray()) {
      let style = btn.element.nativeElement.style;
      style['transition-duration'] = active ? `${ 90 + (100 * idx) }ms` : '';
      style['transform'] = active ? this.getTranslate(idx) : '';
      idx++;
    }
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target) {
    if(this.active && !this.element.contains(target)) {
      this.active = false;
    }
  }

}

export const FAB_COMPONENTS = [
  FabToggle,
  FabButton,
  Fab
];
