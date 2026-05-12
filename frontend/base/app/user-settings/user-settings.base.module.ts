import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsComponent } from '@app/user-settings/user-settings/user-settings.component';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { SharedModule } from 'primeng/api';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WidgetsBaseModule,
    ButtonModule
  ],
  exports: [SharedModule,
    WidgetsBaseModule],
  providers: [
    CanDeactivateGuard]

})
export class UserSettingsBaseModule { }
