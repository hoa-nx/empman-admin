import { NgModule } from '@angular/core';
import { HighlightDirective } from '../directives/highlight.directive';
import { BlurForwarder } from '../directives/blur-forwarder.directive';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { jqxMenuComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxmenu';
import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';
import { jqxKnobComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxknob';
import { jqxNumberInputComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxnumberinput';
import { jqxChartComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxchart';
import { jqxTreeGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxtreegrid';

@NgModule({
    declarations: [HighlightDirective,
        BlurForwarder,
        DateFormatPipe,
        jqxGridComponent,
        jqxMenuComponent,
        jqxKnobComponent,
        jqxChartComponent,
        jqxNumberInputComponent,
        jqxTreeGridComponent

    ],

    exports: [
        HighlightDirective,
        BlurForwarder,
        DateFormatPipe,
        jqxGridComponent,
        jqxMenuComponent,
        jqxKnobComponent,
        jqxChartComponent,
        jqxNumberInputComponent,
        jqxTreeGridComponent
    ]
})
export class SharedModule { }