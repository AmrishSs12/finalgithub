import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SharedModule,
    WidgetsBaseModule,

  ],
  exports: [SharedModule,
    WidgetsBaseModule,
  ],
  providers: [
    CanDeactivateGuard]

})
export class RappitIntegrationBaseModule { }
