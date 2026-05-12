import { Component, OnInit } from '@angular/core';
import { AppHeaderBaseComponent } from '@baseapp/app-layout/app-header/app-header.base.component';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { TranslateService } from '@ngx-translate/core';
import { AppUtilService } from '@app/app.util.service';
import { AppLayoutService } from '../app-layout.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: '../../../../base/app/app-layout/app-header/app-header.component.html',
  styleUrls: ['../../../../base/app/app-layout/app-header/app-header.component.scss']
})
export class AppHeaderComponent extends AppHeaderBaseComponent implements OnInit {

  /** Please override/inject the dependencies to refer here, 
   * Example
      override public router = inject(Router); **/


  ngOnInit(): void {
    super.onInit();
  }


}
