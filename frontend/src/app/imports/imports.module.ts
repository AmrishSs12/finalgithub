import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsBaseModule } from '@baseapp/imports/imports.base.module';
import { ImportsRoutingModule } from './imports-routing.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ImportsBaseModule,
    ImportsRoutingModule

  ],
  exports: [ImportsBaseModule]
})
export class ImportsModule { }
