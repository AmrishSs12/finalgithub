import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';
import { OutboxListComponent } from '@app/outbox/outbox-list/outbox-list.component';

@NgModule({
  declarations: [
    OutboxListComponent
  ],
  imports: [
    CommonModule,
    WidgetsBaseModule,
    SharedModule
  ],
  exports: [
    SharedModule,
    WidgetsBaseModule,
    OutboxListComponent
  ]
})
export class OutboxBaseModule { }
