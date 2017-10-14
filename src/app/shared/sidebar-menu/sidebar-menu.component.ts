import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { DataService } from './../../core/services/data.service';

declare var $: any;
@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit, AfterViewInit  {
  public functions: any[];
  public menuHtml: string;
  

  @ViewChild('menuHtml') menu: ElementRef;

  constructor(
    private dataService: DataService,
    private renderer: Renderer
  ) {

  }

  ngOnInit() {
    this.dataService.get('/api/function/getlisthierarchy').subscribe((response: any[]) => {
      this.functions = response.sort((n1, n2) => {
        if (n1.DisplayOrder > n2.DisplayOrder)
          return 1;
        else if (n1.DisplayOrder < n2.DisplayOrder)
          return -1;
        return 0;
      });
      
      console.log(this.functions);

    }, error => this.dataService.handleError(error));

    
  }
  //fix loi khong the toogle menu
  ngAfterViewInit() {
     /* setTimeout(_ => {
      $.getScript("assets/js/jquery.app.js", function () {
        //do some things  
        console.log("sidebar-menu.component.ts ngAfterViewInit");
      });
    });  */
    
  }


}