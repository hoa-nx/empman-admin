import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

// hack - make sure that jQuery plugins can find
//        jquery reference
//import * as $ from 'jquery';
import { AuthGuard } from './core/guards/auth.guard';
import { CompComponent, MasterSearchModalComponent } from './shared/master-search-modal/master-search-modal.component';
import { SharedService } from './core/services/SharedService';
//declare var $:any;
//window["$"] = $;
//window["jQuery"] = $;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthGuard,SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
