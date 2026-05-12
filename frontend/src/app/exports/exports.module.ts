import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportPageComponent } from './export-page/export-page.component';
import { ExportHistoryComponent } from './export-history/export-history/export-history.component';
import { ExportsBaseModule } from '@baseapp/exports/exports.base.module';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ExportsBaseModule
  ],
  exports: [ExportsBaseModule]

})
export class ExportsModule { }
