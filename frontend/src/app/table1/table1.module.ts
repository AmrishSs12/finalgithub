import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Table1RoutingModule } from './table1-routing.module';
import { Table1BaseModule } from '@baseapp/table1/table1.base.module';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    Table1BaseModule,
    Table1RoutingModule
    
  ],
  exports: [
      Table1BaseModule,
  ]

})
export class Table1Module  { }