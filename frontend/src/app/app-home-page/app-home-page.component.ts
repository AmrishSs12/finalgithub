import { Component, inject, OnInit } from '@angular/core';
import { AppHomePageBaseComponent } from "@baseapp/app-home-page/app-home-page-base.component";
import { AppHomeBaseService } from '@baseapp/app-home-page/app-home.service.base';
import { AppUtilService } from '@app/app.util.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: '../../../base/app/app-home-page/app-home-page-base.component.html',
  styleUrls: ['../../../base/app/app-home-page/app-home-page-base.component.scss']
})
export class AppHomePageComponent extends AppHomePageBaseComponent {

  /** Please override/inject the dependencies to refer here, 
   * Example
      override public router = inject(Router);
      public router = inject(Router); **/



  override displayMenus: boolean = false;

  ngOnInit(): void {
    super.onInit();
  }

}
