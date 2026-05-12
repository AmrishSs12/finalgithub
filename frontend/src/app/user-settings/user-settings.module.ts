import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsBaseModule } from '@baseapp/user-settings/user-settings.base.module';
import { UserSettingsRoutingModule } from './user-settings-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserSettingsBaseModule,
    UserSettingsRoutingModule

  ],
  exports: [
    UserSettingsBaseModule,
  ]

})
export class UserSettingsModule { }