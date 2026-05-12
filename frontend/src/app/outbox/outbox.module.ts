import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutboxRoutingModule } from './outbox-routing.module';
import { OutboxBaseModule } from '@baseapp/outbox/outbox.base.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OutboxRoutingModule,
    OutboxBaseModule
  ]
})
export class OutboxModule { }
