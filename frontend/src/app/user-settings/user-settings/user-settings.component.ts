import { Component, OnInit, inject } from '@angular/core';
import { UserSettingsBaseComponent } from '@baseapp/user-settings/user-settings/user-settings.base.component';



@Component({
  selector: 'app-user-settings',
  templateUrl: '../../../../base/app/user-settings/user-settings/user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']

})
export class UserSettingsComponent extends UserSettingsBaseComponent implements OnInit {


  ngAfterViewInit(): void {
    this.onAfterViewInit()
  }

  ngOnInit(): void {
    super.onInit();
  }

}
