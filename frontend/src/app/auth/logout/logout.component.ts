import { Component, Inject } from '@angular/core';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { LogoutBaseComponent } from '@baseapp/auth/logout/logout.base.component';

@Component({
  selector: 'app-logout',
  templateUrl: '../../../../base/app/auth/logout/logout.component.html',
  styleUrls: ['../../../../base/app/auth/logout/logout.base.component.scss']
})
export class LogoutComponent extends LogoutBaseComponent {


  ngOnInit() {
    super.onInit();

  }



}
