import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportsRoutingModule } from './exports-routing.base.module';
import { SharedModule } from '@app/shared/shared.module';
import { ExportPageComponent } from '@app/exports/export-page/export-page.component';
import { ExportHistoryComponent } from '@app/exports/export-history/export-history/export-history.component';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';

@NgModule({
  declarations: [
    ExportPageComponent,
    ExportHistoryComponent,
  ],
  imports: [
    CommonModule,
    WidgetsBaseModule,
    SharedModule,
    ExportsRoutingModule
  ],
  exports: [
    SharedModule,
    ExportPageComponent,
  ]
})
export class ExportsBaseModule { }
