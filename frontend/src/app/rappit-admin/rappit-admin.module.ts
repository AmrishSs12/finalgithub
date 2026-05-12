import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RappitAdminBaseModule } from '@baseapp/rappit-admin/rappit-admin.base.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RappitAdminBaseModule
  ],
  exports: [RappitAdminBaseModule]
})
export class RappitAdminModule { }

