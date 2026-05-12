import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    WidgetsBaseModule,
    TranslateModule,
    ConfirmDialogModule,
    MessageModule,
    MessagesModule,
    SharedModule
  ],
  exports: [
	WidgetsBaseModule,
	TranslateModule,
	ConfirmDialogModule,
    MessageModule,
    MessagesModule,
  ],
  providers: [

  ]
})
export class CustomModule { }