import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { CaptionBarComponent } from './caption-bar/caption-bar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { UrlEditComponent } from './url-edit/url-edit.component';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { WorkflowActionBarComponent } from './workflow-action-bar/workflow-action-bar/workflow-action-bar.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { ChangeLogsComponent } from './change-logs/change-logs.component';
import { ChangeLogsGridComponent } from './change-logs-grid/change-logs-grid.component';
import { DatePipe } from '@angular/common';
import { ConfirmationPopupComponent } from './confirmation/confirmation-popup.component';
import { WorkflowSimulatorComponent } from './workflow-simulator/workflow-simulator.component';
import { TabsComponent } from './tabs/tabs.component';
import { SpeedDialComponent } from './speed-dial/speed-dial.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SharedModule } from '@app/shared/shared.module';
import { WorkflowHistoryComponent } from './workflow-history/workflow-history.component';
import { GridComponent } from './grid/grid.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxMaskModule } from 'ngx-mask';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OptionalFiltersComponent } from './optional-filters/optional-filters.component';

@NgModule({
  declarations: [
    ActionBarComponent,
    CaptionBarComponent,
    SearchBarComponent,
    SearchBarComponent,
    UrlEditComponent,
    WorkflowActionBarComponent,
    ChangeLogsComponent,
    ChangeLogsGridComponent,
    ConfirmationPopupComponent,
    WorkflowSimulatorComponent,
    TabsComponent,
    SpeedDialComponent,
    BreadcrumbComponent,
    WorkflowHistoryComponent,
    GridComponent,
    OptionalFiltersComponent,

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
    SharedModule,
    DataTablesModule,
    NgxMaskModule.forRoot({}),
    OverlayPanelModule
  ],
  exports: [
    ActionBarComponent,
    CaptionBarComponent,
    SearchBarComponent,
    UrlEditComponent,
    WorkflowActionBarComponent,
    ChangeLogsComponent,
    ChangeLogsGridComponent,
    SharedModule,
    TabsComponent,
    BreadcrumbComponent,
    WorkflowHistoryComponent,
    GridComponent,
    NgxMaskModule,
    OptionalFiltersComponent
  ],
  providers: [
    CaptionBarComponent,
    SearchBarComponent,
    UrlEditComponent,
    DatePipe
  ]
})
export class WidgetsBaseModule { }
