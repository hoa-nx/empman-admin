import { Component, ElementRef, AfterViewInit, OnInit,ViewContainerRef } from '@angular/core';
//declare var $ : any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    private runCount: number = 0;

    constructor(private elementRef: ElementRef,private viewContainerRef: ViewContainerRef ) {
        this.runCount = 0;
        // You need this small hack in order to catch application root view container ref
        this.viewContainerRef = viewContainerRef;
    }

    ngOnInit() {
        //load external lib
        /*$.getScript('../assets/js/jquery.min.js');
        $.getScript('../assets/js/bootstrap.min.js');
        $.getScript('../assets/js/detect.js');
        $.getScript('../assets/js/fastclick.js');
        $.getScript('../assets/js/jquery.slimscroll.js');
        $.getScript('../assets/js/jquery.blockUI.js');
        $.getScript('../assets/js/waves.js');
        $.getScript('../assets/js/wow.min.js');
    
        $.getScript('../assets/js/jquery.nicescroll.js');
        $.getScript('../assets/js/jquery.scrollTo.min.js');
        $.getScript('../assets/js/jquery.core.js');
        $.getScript('../assets/js/jquery.app.js');*/
    }

    ngAfterViewInit() {
        //stuff that doesn't do view changes
        //setTimeout(_ => this.addScript());

    }

    ngAfterViewChecked() {
        /*if (this.runCount == 0) {
          this.addScript();
          this.runCount++;
        }*/
    }

    /**Add ext lib */
    addScript() {
        var script = document.createElement("script");

        script.textContent = "var resizefunc = [];";
        this.elementRef.nativeElement.appendChild(script);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/modernizr.min.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/jquery.min.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/bootstrap.min.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/detect.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/fastclick.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/jquery.slimscroll.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/jquery.blockUI.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/waves.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/wow.min.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/jquery.nicescroll.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/jquery.scrollTo.min.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/jquery.core.js";
        this.elementRef.nativeElement.appendChild(externalScript);

        var externalScript = document.createElement("script");
        externalScript.src = "../assets/js/jquery.app.js";
        this.elementRef.nativeElement.appendChild(externalScript);

    }
    
}
