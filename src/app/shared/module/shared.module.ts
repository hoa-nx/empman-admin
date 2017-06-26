import { NgModule } from '@angular/core';
import { HighlightDirective } from '../directives/highlight.directive';
import { BlurForwarder } from '../directives/blur-forwarder.directive';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@NgModule({
    declarations: [HighlightDirective,
        BlurForwarder,
        DateFormatPipe
        
        ],

    exports: [
        HighlightDirective,
        BlurForwarder,
        DateFormatPipe
    ]
})
export class SharedModule { }