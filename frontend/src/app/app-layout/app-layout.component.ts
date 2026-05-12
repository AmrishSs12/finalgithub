import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppLayoutBaseComponent } from '@baseapp/app-layout/app-layout.base.component';
// import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { AppLayoutService } from './app-layout.service';


@Component({
  selector: 'app-layout',
  templateUrl: '../../../base/app/app-layout/app-layout.component.html',
  styleUrls: ['../../../base/app/app-layout/app-layout.component.scss']
})
export class AppLayoutComponent extends AppLayoutBaseComponent {

  /** Please override/inject the dependencies to refer here, 
    * Example
       override public router = inject(Router); **/


  ngOnInit(): void {
    super.onInit();
  }
}
