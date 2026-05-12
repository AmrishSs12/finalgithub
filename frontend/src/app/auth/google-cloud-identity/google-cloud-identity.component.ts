import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { GoogleCloudIdentityBaseComponent } from '@baseapp/auth/google-cloud-identity/google-cloud-identity.base.component';

@Component({
  selector: 'app-google-cloud-identity',
  templateUrl: '../../../../base/app/auth/google-cloud-identity/google-cloud-identity.base.component.html',
  styleUrls: ['../../../../base/app/auth/google-cloud-identity/google-cloud-identity.base.component.scss']
})
export class GoogleCloudIdentityComponent extends GoogleCloudIdentityBaseComponent implements OnInit, OnDestroy, AfterViewInit {

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