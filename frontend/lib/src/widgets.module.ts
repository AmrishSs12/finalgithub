import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    WidgetsBaseModule

  ],
  exports: [],
  providers: []
})
export class WidgetsModule { }