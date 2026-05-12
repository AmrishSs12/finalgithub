import { Component, OnInit, OnDestroy } from '@angular/core';
import { RedirectAuthPageBaseComponent } from '@baseapp/auth/redirect-auth-page/redirect-auth-page.base.component';

@Component({
  selector: 'app-redirect-auth-page',
  templateUrl: '../../../../base/app/auth/redirect-auth-page/redirect-auth-page.base.component.html',
  styleUrls: ['../../../../base/app/auth/redirect-auth-page/redirect-auth-page.base.component.scss']
})
export class RedirectAuthPageComponent extends RedirectAuthPageBaseComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    super.onInit();
  }

  ngOnDestroy() {
    super.onDestroy();
  }

}
