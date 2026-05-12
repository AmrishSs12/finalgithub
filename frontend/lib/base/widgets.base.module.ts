import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { SpeedDialModule } from 'primeng/speeddial';
import { DatePipe } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { NgxMaskModule } from 'ngx-mask';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ActionBarComponent } from '@libsrc/action-bar/action-bar.component';
import { CaptionBarComponent } from '@libsrc/caption-bar/caption-bar.component';
import { UrlEditComponent } from '@libsrc/url-edit/url-edit.component';
import { WorkflowActionBarComponent } from '@libsrc/workflow-action-bar/workflow-action-bar.component';
import { ChangeLogsComponent } from '@libsrc/change-logs/change-logs.component';
import { ChangeLogsGridComponent } from '@libsrc/change-logs-grid/change-logs-grid.component';
import { ConfirmationPopupComponent } from '@libsrc/confirmation/confirmation-popup.component';
import { WorkflowSimulatorComponent } from '@libsrc/workflow-simulator/workflow-simulator.component';
import { TabsComponent } from '@libsrc/tabs/tabs.component';
import { SpeedDialComponent } from '@libsrc/speed-dial/speed-dial.component';
import { BreadcrumbComponent } from '@libsrc/breadcrumb/breadcrumb.component';
import { WorkflowHistoryComponent } from '@libsrc/workflow-history/workflow-history.component';
import { GridComponent } from '@libsrc/grid/grid.component';
import { OptionalFiltersComponent } from '@libsrc/optional-filters/optional-filters.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { WorkflowConfirmationPopupComponent } from '@libsrc/confirmation/workflow-confirmation-popup.component';
import { DragDropModule } from 'primeng/dragdrop';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SvgIconComponent } from '@libsrc/svg-icon/svg-icon.component';
import { TabViewModule } from 'primeng/tabview';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import { SoftDeleteFilterComponent } from "@libsrc/soft-delete-filter/soft-delete-filter.component";
import { MenubarModule } from 'primeng/menubar';
import { MegaMenuModule } from 'primeng/megamenu';
import { WorkflowStatusComponent } from '@libsrc/workflow-status/workflow-status.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IframeComponent } from '@libsrc/iframe/iframe.component';

@NgModule({
  declarations: [
    ActionBarComponent,
    CaptionBarComponent,
    UrlEditComponent,
    WorkflowActionBarComponent,
    ChangeLogsComponent,
    ChangeLogsGridComponent,
    ConfirmationPopupComponent,
    WorkflowConfirmationPopupComponent,
    WorkflowSimulatorComponent,
    TabsComponent,
    SpeedDialComponent,
    BreadcrumbComponent,
    WorkflowHistoryComponent,
    GridComponent,
    OptionalFiltersComponent,
    SvgIconComponent,
    SoftDeleteFilterComponent,
    WorkflowStatusComponent,
    IframeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    ProgressBarModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    RippleModule,
    SplitButtonModule,
    TooltipModule,
    MenuModule,
    SpeedDialModule,
    TableModule,
    DataTablesModule,
    NgxMaskModule.forRoot({}),
    OverlayPanelModule,
    MultiSelectModule,
    DropdownModule,
    BreadcrumbModule,
    MessagesModule,
    DragDropModule,
    DialogModule,
    CheckboxModule,
    RadioButtonModule,
    TabViewModule,
    AutoCompleteModule,
    CalendarModule,
    ChipModule,
    MenubarModule,
    MegaMenuModule,
    ProgressSpinnerModule

  ],
  exports: [
    ActionBarComponent,
    CaptionBarComponent,
    UrlEditComponent,
    WorkflowActionBarComponent,
    ChangeLogsComponent,
    ChangeLogsGridComponent,
    ConfirmationPopupComponent,
    WorkflowConfirmationPopupComponent,
    TableModule,
    TabsComponent,
    BreadcrumbComponent,
    WorkflowHistoryComponent,
    GridComponent,
    NgxMaskModule,
    OptionalFiltersComponent,
    MultiSelectModule,
    DropdownModule,
    BreadcrumbModule,
    MessagesModule,
    SvgIconComponent,
    ButtonModule,
    FormsModule,
    SoftDeleteFilterComponent,
    WorkflowStatusComponent,
    IframeComponent
  ],
  providers: [
    CaptionBarComponent,
    UrlEditComponent,
    DatePipe
  ]
})
export class WidgetsBaseModule { }
