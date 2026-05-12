import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RwftaskRoutingModule } from './rwftask-routing.module';
import { RwftaskBaseModule } from '@baseapp/rwftask/rwftask.base.module';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RwftaskBaseModule,
    RwftaskRoutingModule
    
  ],
  exports: [
    RwftaskBaseModule,
  ]

})
export class RwftaskModule  { }