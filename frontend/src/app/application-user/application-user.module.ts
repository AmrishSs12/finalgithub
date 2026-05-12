import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationUserRoutingModule } from './application-user-routing.module';
import { ApplicationUserBaseModule } from '@baseapp/application-user/application-user.base.module';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ApplicationUserBaseModule,
    ApplicationUserRoutingModule
    
  ],
  exports: [
      ApplicationUserBaseModule,
  ]

})
export class ApplicationUserModule  { }