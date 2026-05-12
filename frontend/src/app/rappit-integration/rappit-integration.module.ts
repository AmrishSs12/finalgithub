import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RappitIntegrationBaseModule } from '@baseapp/rappit-integration/rappit-integration.base.module'


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RappitIntegrationBaseModule

  ],
  exports: [RappitIntegrationBaseModule]
})
export class RappitIntegrationModule { }