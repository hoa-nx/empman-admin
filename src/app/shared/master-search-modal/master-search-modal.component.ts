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
import { SharedService } from '../../core/services/SharedService';

declare var $: any;

@Component({
  selector: 'comp-comp',
  template: `MyComponent Modal`
})
export class CompComponent { }

@Component({
  selector: 'app-master-search-modal',
  template: './master-search-modal.component.html',
  styleUrls: ['./master-search-modal.component.css']
})
export class MasterSearchModalComponent {

  @ViewChild('theBody', { read: ViewContainerRef }) theBody;
  cmpRef: ComponentRef<any>;
  data;

  constructor(
    private sharedService: SharedService,
    private componentFactoryResolver: ComponentFactoryResolver,
    injector: Injector) {

      console.log("CONS");
    sharedService.modalEvents.subscribe(data => {
      this.data = data.data;
      if (data.cmd == "show") {
        if (this.cmpRef) {
          this.cmpRef.destroy();
        }
        let factory = this.componentFactoryResolver.resolveComponentFactory(data.component);
        this.cmpRef = this.theBody.createComponent(factory)
        $('#theModal').modal('show');
      } else {
        this.dispose();
      }

    });
  }

  close() {
    this.sharedService.hideModal(false, this.data);
  }

  dispose() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
    this.cmpRef = null;
    $('#theModal').modal('hide');
  }
  edit() {
    this.sharedService.hideModal(true, this.data);
  }

  submit() {
    this.sharedService.hideModal(true, this.data);
  }
}
