import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fab-toggle',
  template: `
    <a
      href="javascript:void(0)"
      class="fab-toggle"
      (click)="onClick.emit($event)">
      <span
        [class]="'icon-' + icon">
      </span>
      <ng-content></ng-content>
    </a>
  `
})
export class FabToggle {
  @Input() icon;
  @Output() onClick = new EventEmitter();
}
