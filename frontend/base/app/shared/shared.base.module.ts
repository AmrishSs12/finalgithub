import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { InputTextModule } from 'primeng/inputtext';
import { SaveChangesDialogComponent } from './save-changes-dialog/save-changes-dialog.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { DirectiveModule } from '@baseapp/directive/directive.module';
import { ChipsModule } from 'primeng/chips';
import { TagInputModule } from 'ngx-chips';
import { AccordionModule } from 'primeng/accordion';


@NgModule({
  declarations: [SaveChangesDialogComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    TableModule,
    TagModule,
    CalendarModule,
    AutoCompleteModule,
    InputSwitchModule,
    MultiSelectModule,
    InputNumberModule,
    RadioButtonModule,
    CheckboxModule,
    DropdownModule,
    ConfirmDialogModule,
    MessageModule,
    TieredMenuModule,
    TabViewModule,
    InputTextareaModule,
    PasswordModule,
    ChipModule,
    ChipsModule,
    ImageModule,
    FileUploadModule,
    GalleriaModule,
    ProgressSpinnerModule,
    BlockUIModule,
    DialogModule,
    AvatarModule,
    MessagesModule,
    ToastModule,
    TooltipModule,
    DynamicDialogModule,
    BreadcrumbModule,
    MenuModule,
    DirectiveModule,
    TagInputModule,
    AccordionModule,
    ButtonModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    TableModule,
    TagModule,
    CalendarModule,
    AutoCompleteModule,
    InputSwitchModule,
    MultiSelectModule,
    InputNumberModule,
    RadioButtonModule,
    CheckboxModule,
    DropdownModule,
    ConfirmDialogModule,
    MessageModule,
    TieredMenuModule,
    TabViewModule,
    InputTextareaModule,
    PasswordModule,
    ChipModule,
    ChipsModule,
    ImageModule,
    FileUploadModule,
    GalleriaModule,
    ProgressSpinnerModule,
    BlockUIModule,
    DialogModule,
    AvatarModule,
    MessagesModule,
    ToastModule,
    TooltipModule,
    DynamicDialogModule,
    BreadcrumbModule,
    MenuModule,
    DirectiveModule,
    TagInputModule,
    AccordionModule,
    SaveChangesDialogComponent
  ]
})
export class SharedBaseModule { }
