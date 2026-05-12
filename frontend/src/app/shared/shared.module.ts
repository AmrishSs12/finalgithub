import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedBaseModule } from '@baseapp/shared/shared.base.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedBaseModule,

  ],
  exports: [
    CommonModule,
    SharedBaseModule
  ]
})
export class SharedModule { }
