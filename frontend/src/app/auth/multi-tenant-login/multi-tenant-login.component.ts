import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MultiTenantLoginBaseComponent } from '@baseapp/auth/multi-tenant-login/multi-tenant-login.base.component';

@Component({
  selector: 'app-multi-tenant-login',
  templateUrl: '../../../../base/app/auth/multi-tenant-login/multi-tenant-login.base.component.html',
  styleUrls: ['../../../../base/app/auth/multi-tenant-login/multi-tenant-login.base.component.scss']
})
export class MultiTenantLoginComponent extends MultiTenantLoginBaseComponent implements OnInit, OnDestroy, AfterViewInit {

  ngOnInit(): void {
    super.onInit();
  }

  ngOnDestroy() {
    super.onDestroy();
  }

  ngAfterViewInit(){
    super.onAfterViewInit();
  }

}
