import { OutboxService } from '../outbox.service';
import { OutboxBase } from '../outbox.base.model';
import { Directive, EventEmitter, Input, Output, SecurityContext, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OutboxApiConstants } from '../outbox.api-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ElementRef, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { fromEvent, Subscription, map } from 'rxjs';
import { environment } from '@env/environment';
import { Filter } from '@baseapp/vs-models/filter.model';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { GridComponent } from '@libsrc/grid/grid.component';

/** Number of hours to consider for recent failed entries */
const RECENT_FAILED_HOURS = 24;

@Directive({})
export class OutboxListBaseComponent {
  errId: any;
  quickFilter: any;
  hiddenFields: any = {};
  quickFilterFieldConfig: any = {};
  isSearchFocused: boolean = false;
  showBreadcrumb = AppConstants.showBreadcrumb;
  isInfiniteScroll: boolean = AppConstants.importInfiniteScroll === "true";

  showAdvancedSearch: boolean = false;
  detPopupOpen: boolean = false;
  displayPayloadDetail: boolean = false;
  selectedOutbox: OutboxBase | null = null;

  tableSearchFieldConfig: any = {};
  @ViewChild('toggleButton')
  toggleButton!: ElementRef;
  @ViewChild('menu')
  menu!: ElementRef;
  filter: Filter = {
    globalSearch: '',
    advancedSearch: {},
    sortField: null,
    sortOrder: null,
    quickFilter: {}
  };
  params: any;
  isMobile: boolean = AppConstants.isMobile;

  gridData: OutboxBase[] = [];
  totalRecords: number = 0;
  subscriptions: Subscription[] = [];
  subHeader: any;
  autoSuggest: any;
  query: any;

  rightFreezeColums: any;
  total: number = 0;
  inValidFields: any = {};
  selectedItems: any = {};
  scrollTop: number = 0;
  isRowSelected: boolean = false;
  isPrototype = environment.prototype;
  workFlowEnabled = false;
  isList = true;
  isPageLoading: boolean = false;
  autoSuggestPageNo: number = 0;
  complexAutoSuggestPageNo: number = 0;
  localStorageStateKey = "outbox-list";
  showMenu: boolean = false;
  conditionalActions: any = {
    disableActions: [],
    hideActions: []
  };
  actionBarConfig: any = [];
  updatedRecords: OutboxBase[] = [];
  showPaginationOnTop = AppConstants.showPaginationonTop;
  showPaginationOnBottom = AppConstants.showPaginationonBottom;
  tableFieldConfig: any = {};
  dateFormat: string = AppConstants.calDateFormat;
  selectedRowId: any = '';
  showWorkflowSimulator: boolean = false;
  gridConfig: any = {};
  @ViewChild(GridComponent)
  private gridComponent?: GridComponent;
  @ViewChild('errorCellTemplate', { static: true }) errorCellTemplate!: TemplateRef<any>;
  @ViewChild('errorEmptyCellTemplate', { static: true }) errorEmptyCellTemplate!: TemplateRef<any>;
  @ViewChild('statusCellTemplate', { static: true }) statusCellTemplate!: TemplateRef<any>;
  @ViewChild('entityIdCellTemplate', { static: true }) entityIdCellTemplate!: TemplateRef<any>;
  @ViewChild('entityIdEmptyCellTemplate', { static: true }) entityIdEmptyCellTemplate!: TemplateRef<any>;
  separator = ".";
  isChildPage: boolean = false;

  // Dashboard statistics
  dashboardStats: any = {
    statusCounts: {},
    targetCounts: {},
    recentFailedCount: 0
  };

  // Selected rows for bulk actions
  selectedOutboxIds: number[] = [];
  selectedRows: any[] = [];

  // Active status filter for dashboard cards
  activeStatusFilter: string | null = null;

  // Entity IDs popup for batch operations
  displayEntityIdsPopup: boolean = false;
  selectedEntityIds: string[] = [];

  // Entity types dropdown options
  entityTypeOptions: any[] = [];

  leftActionBarConfig: any = {
    "children": [
      {
        "visibility": "show",
        "buttonStyle": "curved",
        "label": "Sync_All",
        "buttonType": "icon_on_left",
        "showOn": "both",
        "icon": {
          "type": "icon",
          "icon": {
            "label": "fa fa-sync-alt",
            "value": "fa fa-sync-alt"
          },
          "iconColor": "#007bff",
          "iconSize": "13px"
        },
        "type": "button",
        "outline": false,
        "valueChange": true,
        "buttonEnabled": "yes",
        "buttonId": "syncAll",
        "action": "syncAll"
      },
      {
        "visibility": "show",
        "buttonStyle": "curved",
        "label": "Retry_Selected",
        "buttonType": "icon_on_left",
        "showOn": "both",
        "icon": {
          "type": "icon",
          "icon": {
            "label": "fa fa-redo",
            "value": "fa fa-redo"
          },
          "iconColor": "#000000",
          "iconSize": "13px"
        },
        "type": "button",
        "outline": true,
        "valueChange": true,
        "buttonEnabled": "yes",
        "enableOnlyIfRecordSelected": true,
        "buttonId": "retrySelected",
        "action": "retrySelected"
      },
      
      {
        "visibility": "show",
        "buttonStyle": "curved",
        "label": "Delete_Selected",
        "buttonType": "icon_on_left",
        "showOn": "both",
        "icon": {
          "type": "icon",
          "icon": {
            "label": "fa fa-trash",
            "value": "fa fa-trash"
          },
          "iconColor": "#ff0000",
          "iconSize": "13px"
        },
        "type": "button",
        "outline": true,
        "valueChange": true,
        "buttonEnabled": "yes",
        "enableOnlyIfRecordSelected": true,
        "buttonId": "deleteSelected",
        "action": "deleteSelected"
      },
      {
        "outline": "true",
        "buttonType": "icon_only",
        "visibility": "show",
        "showOn": "both",
        "buttonStyle": "curved",
        "icon": {
          "type": "icon",
          "icon": {
            "label": "fas fa-sync",
            "value": "fas fa-sync"
          },
          "iconColor": "#000000",
          "iconSize": "13px"
        },
        "buttonId": "refresh",
        "action": "refresh",
        "buttonEnabled": "yes",
        "label": "Refresh",
        "type": "button"
      }
     
    ]
  };

  rightActionBarConfig: any = {};

  tableSearchConfig: any = {
    "children": [
      {
        "label": "Entity_Type",
        "data": "",
        "field": "entityType",
        "type": "searchField",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "entityType",
        "timeOnly": false,
        "uiType": "select",
        "name": "entityType",
        "fieldName": "entityType",
        "allowedValues": {
          "values": [],
          "conditions": {
            "conditionType": "auto",
            "conditions": []
          }
        }
      },
      {
        "label": "Entity_ID",
        "data": "",
        "field": "entityId",
        "type": "searchField",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "entityId",
        "timeOnly": false,
        "uiType": "text",
        "name": "entityId",
        "fieldName": "entityId"
      },
      {
        "label": "Target",
        "data": "",
        "field": "target",
        "type": "searchField",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "target",
        "timeOnly": false,
        "uiType": "select",
        "name": "target",
        "fieldName": "target",
        "allowedValues": {
          "values": [
            { "label": "SEARCH", "value": "SEARCH" },
            { "label": "ANALYTICAL", "value": "ANALYTICAL" }
          ],
          "conditions": {
            "conditionType": "auto",
            "conditions": []
          }
        }
      },
      {
        "label": "Status",
        "data": "",
        "field": "status",
        "type": "searchField",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "status",
        "timeOnly": false,
        "uiType": "select",
        "name": "status",
        "fieldName": "status",
        "allowedValues": {
          "values": [
            { "label": "PENDING", "value": "PENDING" },
            { "label": "PROCESSING", "value": "PROCESSING" },
            { "label": "COMPLETED", "value": "COMPLETED" },
            { "label": "FAILED", "value": "FAILED" }
          ],
          "conditions": {
            "conditionType": "auto",
            "conditions": []
          }
        }
      },
      {
        "label": "Event_Type",
        "data": "",
        "field": "eventType",
        "type": "searchField",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "eventType",
        "timeOnly": false,
        "uiType": "select",
        "name": "eventType",
        "fieldName": "eventType",
        "allowedValues": {
          "values": [
            { "label": "INSERT", "value": "INSERT" },
            { "label": "UPDATE", "value": "UPDATE" },
            { "label": "DELETE", "value": "DELETE" }
          ],
          "conditions": {
            "conditionType": "auto",
            "conditions": []
          }
        }
      },
      {
        "label": "Created_At",
        "data": "",
        "field": "createdDate",
        "type": "searchField",
        "fieldType": "Date",
        "fieldId": "createdDate",
        "timeOnly": false,
        "uiType": "datetime",
        "name": "createdDate",
        "fieldName": "createdDate"
      },
      {
        "label": "Created_By",
        "data": "",
        "field": "createdBy",
        "type": "searchField",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "createdBy",
        "timeOnly": false,
        "uiType": "text",
        "name": "createdBy",
        "fieldName": "createdBy"
      }
    ],
    "columns": "2",
    "type": "tableSearch",
    "showAdvancedSearch": true
  };

  quickFilterConfig: any = {};

  customRenderConfig: any = {
    "children": [
      {
        "fieldName": "errorMessage",
        render: (data: any, type: any, row: any, meta: any) => { return this.customErrorField(data, row); }
      },
      {
        "fieldName": "status",
        render: (data: any, type: any, row: any, meta: any) => { return this.customStatusField(data, row); }
      },
      {
        "fieldName": "entityId",
        render: (data: any, type: any, row: any, meta: any) => { return this.customEntityIdField(data, row); }
      }
    ]
  };

  tableConfig: any = {
    "recordSelection": "multiple_records",
    "striped": true,
    "rightFreezeFromColumn": "0",
    "viewAs": "list",
    "hoverStyle": "box",
    "tableStyle": "style_2",
    "type": "grid",
    "showDetailPageAs": "navigate_to_new_page",
    "leftFreezeUptoColumn": "2",
    "infiniteScroll": this.isInfiniteScroll,
    "pageLimit": "50",
    "children": [
      {
        "label": "ID",
        "data": "",
        "field": "outboxId",
        "type": "gridColumn",
        "width": "80px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "number",
        "fieldId": "outboxId",
        "timeOnly": false,
        "uiType": "number",
        "name": "outboxId",
        "fieldName": "outboxId"
      },
      {
        "label": "Entity_Type",
        "data": "",
        "field": "entityType",
        "type": "gridColumn",
        "width": "150px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "entityType",
        "timeOnly": false,
        "uiType": "text",
        "name": "entityType",
        "fieldName": "entityType"
      },
      {
        "label": "Entity_ID",
        "data": "",
        "field": "entityId",
        "type": "gridColumn",
        "width": "120px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "entityId",
        "timeOnly": false,
        "uiType": "text",
        "name": "entityId",
        "fieldName": "entityId"
      },
      {
        "label": "Event_Type",
        "data": "",
        "field": "eventType",
        "type": "gridColumn",
        "width": "100px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "eventType",
        "timeOnly": false,
        "uiType": "text",
        "name": "eventType",
        "fieldName": "eventType"
      },
      {
        "label": "Target",
        "data": "",
        "field": "target",
        "type": "gridColumn",
        "width": "100px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "target",
        "timeOnly": false,
        "uiType": "text",
        "name": "target",
        "fieldName": "target"
      },
      {
        "label": "Status",
        "data": "",
        "field": "status",
        "type": "gridColumn",
        "width": "140px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "status",
        "timeOnly": false,
        "uiType": "select",
        "name": "status",
        "fieldName": "status",
        "allowedValues": {
          "values": [
            { "label": "Pending", "value": "PENDING" },
            { "label": "Processing", "value": "PROCESSING" },
            { "label": "Completed", "value": "COMPLETED" },
            { "label": "Failed", "value": "FAILED" }
          ],
          "conditions": {
            "conditionType": "Auto",
            "conditions": [
              {
                "id": "PENDING",
                "query": {
                  "condition": "and",
                  "rules": [{ "field": "dropdown1", "operator": "==", "value": "Pending" }]
                }
              },
              {
                "id": "PROCESSING",
                "query": {
                  "condition": "and",
                  "rules": [{ "field": "dropdown1", "operator": "==", "value": "Processing" }]
                }
              },
              {
                "id": "COMPLETED",
                "query": {
                  "condition": "and",
                  "rules": [{ "field": "dropdown1", "operator": "==", "value": "Completed" }]
                }
              },
              {
                "id": "FAILED",
                "query": {
                  "condition": "and",
                  "rules": [{ "field": "dropdown1", "operator": "==", "value": "Failed" }]
                }
              }
            ]
          }
        }
      },
      {
        "label": "Error_Message",
        "data": "",
        "field": "errorMessage",
        "type": "gridColumn",
        "width": "200px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "errorMessage",
        "timeOnly": false,
        "uiType": "text",
        "name": "errorMessage",
        "skipSanitize": true,
        "fieldName": "errorMessage"
      },
      {
        "label": "Created_At",
        "data": "",
        "field": "createdDate",
        "type": "gridColumn",
        "width": "160px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "Date",
        "fieldId": "createdDate",
        "timeOnly": false,
        "uiType": "datetime",
        "name": "createdDate",
        "fieldName": "createdDate"
      },
      {
        "label": "Processed_At",
        "data": "",
        "field": "processedDate",
        "type": "gridColumn",
        "width": "160px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "Date",
        "fieldId": "processedDate",
        "timeOnly": false,
        "uiType": "datetime",
        "name": "processedDate",
        "fieldName": "processedDate"
      },
      {
        "label": "Task_ID",
        "data": "",
        "field": "taskId",
        "type": "gridColumn",
        "width": "120px",
        "showOnMobile": "false",
        "labelPosition": "top",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "taskId",
        "timeOnly": false,
        "uiType": "text",
        "name": "taskId",
        "fieldName": "taskId"
      }
    ],
    "sorting": "single_column",
    "sortField": "createdDate",
    "sortOrder": "desc",
    "showSettingsIcon": "true",
    "detailPageNavigation": "click_of_the_row",
    "rowSpacing": "medium",
    "rowHeight": "medium"
  };

  pageViewTitle: string = 'Outbox_Messages';

  tableSearchControls: UntypedFormGroup = new UntypedFormGroup({
    entityType: new UntypedFormControl('', []),
    entityId: new UntypedFormControl('', []),
    target: new UntypedFormControl('', []),
    status: new UntypedFormControl('', []),
    eventType: new UntypedFormControl('', []),
    createdDate: new UntypedFormControl('', []),
    createdBy: new UntypedFormControl('', []),
    sid: new UntypedFormControl('', [])
  });

  quickFilterControls: UntypedFormGroup = new UntypedFormGroup({});

  public outboxService = inject(OutboxService);
  public appUtilBaseService = inject(AppUtilService);
  public translateService = inject(TranslateService);
  public messageService = inject(MessageService);
  public confirmationService = inject(ConfirmationService);
  public dialogService = inject(DialogService);
  public domSanitizer = inject(DomSanitizer);
  public activatedRoute = inject(ActivatedRoute);
  public renderer2 = inject(Renderer2);
  public router = inject(Router);
  public appGlobalService = inject(AppGlobalService);
  private viewContainerRef = inject(ViewContainerRef);


  getDisabled(formControl: FormGroup, ele: string) {
    const parent = ele.split('?.')[0];
    if (formControl.controls[parent] instanceof FormGroup) {
      return formControl.get(ele)?.disabled;
    }
    else
      return formControl.controls[parent].disabled;
  }

  private renderTemplate(template: TemplateRef<any>, context: any = {}): string {
    const viewRef = this.viewContainerRef.createEmbeddedView(template, context);
    viewRef.detectChanges();
    const html = viewRef.rootNodes.map((node: any) => node.outerHTML || node.textContent || '').join('');
    viewRef.destroy();
    return html;
  }

  customErrorField(data: any, row: any) {
    if (data && data.length > 0) {
      const sanitized = this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, data) || '';
      const truncated = sanitized.length > 50 ? sanitized.substring(0, 50) + '...' : sanitized;
      return this.renderTemplate(this.errorCellTemplate, { $implicit: { fullText: sanitized, truncated } });
    }
    return this.renderTemplate(this.errorEmptyCellTemplate);
  }

  customEntityIdField(data: any, row: any) {
    if (data && data.length > 0) {
      const sanitized = this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, data) || '';
      const truncated = sanitized.length > 15 ? sanitized.substring(0, 15) + '...' : sanitized;
      return this.renderTemplate(this.entityIdCellTemplate, { $implicit: { truncated } });
    }
    return this.renderTemplate(this.entityIdEmptyCellTemplate);
  }

  customStatusField(data: any, row: any) {
    const label = this.translateService.instant(data || 'Unknown');
    return this.renderTemplate(this.statusCellTemplate, { $implicit: { status: data, label } });
  }

  /**
   * Generic bulk action handler to reduce code duplication
   */
  private executeBulkAction(config: {
    requiresSelection?: boolean;
    emptySelectionMessage?: string;
    confirmMessage: string;
    confirmHeader: string;
    confirmIcon?: string;
    acceptButtonStyleClass?: string;
    serviceMethod: () => any;
    successMessage: string;
    errorMessage: string;
    onSuccess?: (response: any) => void;
    refreshDelay?: number;
  }) {
    // Check selection if required
    if (config.requiresSelection && this.selectedOutboxIds.length === 0) {
      this.showToastMessage({
        severity: 'warn',
        summary: this.translateService.instant('Warning'),
        detail: this.translateService.instant(config.emptySelectionMessage || 'Please_select_at_least_one_entry')
      });
      return;
    }

    // Show confirmation dialog
    this.confirmationService.confirm({
      message: this.translateService.instant(config.confirmMessage),
      header: this.translateService.instant(config.confirmHeader),
      icon: config.confirmIcon || 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: config.acceptButtonStyleClass,
      accept: () => {
        this.confirmationService.close();
        this.isPageLoading = true;

        config.serviceMethod().subscribe({
          next: (response: any) => {
            this.isPageLoading = false;
            this.showToastMessage({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: response.message || this.translateService.instant(config.successMessage)
            });

            // Execute custom success handler if provided
            config.onSuccess?.(response);

            // Clear selection and refresh
            this.selectedOutboxIds = [];
            this.selectedRows = [];

            if (config.refreshDelay) {
              setTimeout(() => this.onRefresh(), config.refreshDelay);
            } else {
              this.onRefresh();
            }
          },
          error: (err: any) => {
            this.isPageLoading = false;
            this.showToastMessage({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: err?.error?.message || err?.message || this.translateService.instant(config.errorMessage)
            });
          }
        });
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  // Action handlers
  onRetrySelected() {
    // Check if any selected entry has COMPLETED status
    const hasCompletedEntries = this.selectedRows.some((row: any) => row.status === 'COMPLETED');
    if (hasCompletedEntries) {
      this.showToastMessage({
        severity: 'warn',
        summary: this.translateService.instant('Warning'),
        detail: this.translateService.instant('Cannot_retry_completed_entries_Please_select_only_failed_or_pending_entries')
      });
      return;
    }

    this.executeBulkAction({
      requiresSelection: true,
      emptySelectionMessage: 'Please_select_at_least_one_entry_to_retry',
      confirmMessage: 'Are_you_sure_you_want_to_retry_selected_entries',
      confirmHeader: 'Confirm_Retry',
      serviceMethod: () => this.outboxService.bulkRetry(this.selectedOutboxIds),
      successMessage: 'Retry_tasks_created_successfully',
      errorMessage: 'Failed_to_create_retry_tasks'
    });
  }

  onSyncAll() {
    const failedCount = this.dashboardStats?.statusCounts?.FAILED || 0;
    
    if (failedCount === 0) {
      this.showToastMessage({
        severity: 'info',
        summary: this.translateService.instant('Info'),
        detail: this.translateService.instant('No_failed_entries_to_sync')
      });
      return;
    }

    this.confirmationService.confirm({
      message: this.translateService.instant('Are_you_sure_you_want_to_retry_all_failed_entries', { count: failedCount }),
      header: this.translateService.instant('Confirm_Sync_All'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translateService.instant('Yes'),
      rejectLabel: this.translateService.instant('No'),
      accept: () => {
        this.outboxService.triggerRetryAll().subscribe({
          next: (response: any) => {
            if (response.status === 'TRIGGERED' || response.status === 'EXISTING_TASK_RESUBMITTED') {
              this.showToastMessage({
                severity: 'success',
                summary: this.translateService.instant('Success'),
                detail: this.translateService.instant('Sync_task_triggered_successfully_Task_ID', { taskSid: response.taskSid })
              });
              // Refresh dashboard stats after a short delay
              setTimeout(() => {
                this.loadDashboardStats();
                this.onRefresh();
              }, 2000);
            } else {
              this.showToastMessage({
                severity: 'info',
                summary: this.translateService.instant('Info'),
                detail: this.translateService.instant(response.message || 'Sync_task_status_unknown')
              });
            }
          },
          error: (err: any) => {
            this.showToastMessage({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: this.translateService.instant('Failed_to_trigger_sync_task')
            });
          }
        });
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }


  onDeleteSelected() {
    this.executeBulkAction({
      requiresSelection: true,
      emptySelectionMessage: 'Please_select_at_least_one_entry_to_delete',
      confirmMessage: 'Are_you_sure_you_want_to_delete_selected_entries_Only_COMPLETED_or_FAILED_entries_can_be_deleted',
      confirmHeader: 'Confirm_Delete',
      acceptButtonStyleClass: 'p-button-danger',
      serviceMethod: () => this.outboxService.bulkDelete(this.selectedOutboxIds),
      successMessage: 'Entries_deleted_successfully',
      errorMessage: 'Failed_to_delete_entries',
      onSuccess: (response: any) => {
        if (response.skippedCount > 0) {
          this.showToastMessage({
            severity: 'info',
            summary: this.translateService.instant('Info'),
            detail: this.translateService.instant('Skipped_entries_with_PENDING_or_PROCESSING_status', { count: response.skippedCount })
          });
        }
      }
    });
  }



  loadGridData() {
    let gridSubscription: any;
    if (environment.prototype) {
      gridSubscription = this.outboxService.getProtoTypingData().subscribe((data: any) => {
        this.gridData = [...this.gridData, ...data];
        this.isPageLoading = false;
      });
    }
    else {
      this.gridData = [];
    }
  }

  loadDashboardStats() {
    this.outboxService.getDashboard().subscribe({
      next: (response: any) => {
        this.dashboardStats = response;
      },
      error: (err: any) => {
        console.error('Failed to load dashboard stats', err);
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('Failed_to_load_dashboard_stats')
        });
      }
    });
  }

  /**
   * Load entity types for dropdown filter
   */
  loadEntityTypes() {
    this.outboxService.getEntityTypes().subscribe({
      next: (response: any) => {
        // Convert string array to options format
        const options = (response || []).map((type: string) => ({
          label: type,
          value: type
        }));
        this.entityTypeOptions = options;
        // Update the tableSearchFieldConfig with the loaded options
        if (this.tableSearchFieldConfig.entityType) {
          this.tableSearchFieldConfig.entityType.options = options;
        }
      },
      error: (err: any) => {
        console.error('Failed to load entity types', err);
      }
    });
  }

  /**
   * Set default filter to FAILED status
   */
  setDefaultFailedFilter() {
    this.activeStatusFilter = 'FAILED';
    this.filter.advancedSearch = { status: ['FAILED'] };
    this.tableSearchControls.patchValue({ status: ['FAILED'] });
    // Refresh grid with the default filter
    setTimeout(() => {
      this.onRefresh();
    }, 100);
  }

  /**
   * Show entity IDs popup for selected batch operations
   * Called when clicking on entityId column in batch context
   */
  showEntityIdsPopup() {
    if (this.selectedRows && this.selectedRows.length > 0) {
      this.selectedEntityIds = this.selectedRows.map((row: any) => row.entityId).filter((id: string) => id);
      this.displayEntityIdsPopup = true;
    }
  }

  /**
   * Close entity IDs popup
   */
  closeEntityIdsPopup() {
    this.displayEntityIdsPopup = false;
    this.selectedEntityIds = [];
  }

  /**
   * Copy entity IDs to clipboard
   */
  copyEntityIdsToClipboard() {
    if (this.selectedEntityIds && this.selectedEntityIds.length > 0) {
      const text = this.selectedEntityIds.join('\n');
      navigator.clipboard.writeText(text).then(() => {
        this.showToastMessage({
          severity: 'success',
          summary: this.translateService.instant('Success'),
          detail: this.translateService.instant('Entity_IDs_copied_to_clipboard')
        });
      }).catch(() => {
        this.showToastMessage({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('Failed_to_copy_to_clipboard')
        });
      });
    }
  }

  clearFilterValues() {
    this.tableSearchControls.reset();
    this.filter.advancedSearch = {};
    this.activeStatusFilter = null;
    this.onRefresh();
  }

  /**
   * Filter grid by status when dashboard card is clicked
   * @param status The status to filter by (PENDING, PROCESSING, COMPLETED, FAILED)
   */
  filterByStatus(status: string) {
    if (this.activeStatusFilter === status) {
      // If clicking the same filter, clear it
      this.activeStatusFilter = null;
      this.filter.advancedSearch = {};
      this.tableSearchControls.reset();
    } else {
      this.activeStatusFilter = status;
      this.filter.advancedSearch = { status: [status] };
      this.tableSearchControls.patchValue({ status: [status] });
    }
    this.onRefresh();
  }

  /**
   * Filter grid by recent failed entries (last 24 hours)
   */
  filterByRecentFailed() {
    if (this.activeStatusFilter === 'RECENT_FAILED') {
      // If clicking the same filter, clear it
      this.activeStatusFilter = null;
      this.filter.advancedSearch = {};
      this.tableSearchControls.reset();
    } else {
      this.activeStatusFilter = 'RECENT_FAILED';
      const now = new Date();
      const last24h = new Date(now.getTime() - RECENT_FAILED_HOURS * 60 * 60 * 1000);
      this.filter.advancedSearch = {
        status: ['FAILED'],
        processedDate: {
          lLimit: last24h.getTime(),
          uLimit: now.getTime(),
          type: 'Date'
        }
      };
      this.tableSearchControls.patchValue({ status: ['FAILED'] });
    }
    this.onRefresh();
  }

  /**
   * Get contextual empty table message based on active filter
   */
  getEmptyTableMessage(): string {
    switch (this.activeStatusFilter) {
      case 'FAILED':
        return 'No_failed_entries_found';
      case 'PENDING':
        return 'No_pending_entries_found';
      case 'PROCESSING':
        return 'No_processing_entries_found';
      case 'COMPLETED':
        return 'No_completed_entries_found';
      case 'RECENT_FAILED':
        return 'No_recent_failed_entries_found';
      default:
        return 'No_data_available_in_table';
    }
  }

  /**
   * Update the empty table message in the grid after filter changes.
   * DataTables language is static after init, so we update the DOM directly.
   */
  updateEmptyTableMessage() {
    const key = this.getEmptyTableMessage();
    const msg = this.translateService.instant(key);
    if (this.gridConfig) {
      this.gridConfig.emptyTableMsg = msg;
    }
    // Update existing DOM element rendered by DataTables
    setTimeout(() => {
      const emptyEl = document.querySelector('.dataTables_empty');
      if (emptyEl) {
        emptyEl.textContent = msg;
      }
    }, 300);
  }

  onRefresh(): void {
    const params = this.assignTableParams();
    this.updateEmptyTableMessage();
    this.gridComponent?.refreshGrid(params);
    this.loadDashboardStats();
    this.selectedRows = [];
    this.isRowSelected = false;
    this.conditionalActions.disableActions = [];
    this.selectedOutboxIds = [];
  }

  onRowClickEvent(id: any, event?: any) {
    if (event.target.textContent === 'View') {
      // Find the row data and show payload detail
      const row = this.gridData.find((r: any) => r.outboxId === id);
      if (row) {
        this.selectedOutbox = row;
        this.displayPayloadDetail = true;
        this.detPopupOpen = true;
      }
    }
  }

  getSelectedvalues(selectedRows: any, id: string) {
    let rawData: any = selectedRows?.data();
    // Filter out properties that are not functions
    this.selectedRows = [];
    // Iterate through the properties of the response object
    for (const key in rawData) {
      // Check if the property is a numeric index (data objects)
      if (!isNaN(parseInt(key))) {
        // Add the data object to the array
        this.selectedRows.push(rawData[key]);
      }
    }

    this.selectedOutboxIds = [];
    rawData?.map((obj: any) => {
      this.selectedOutboxIds.push(Number(obj.outboxId));
    });
    if (this.selectedOutboxIds.length > 0) {
      this.isRowSelected = true;
    } else {
      this.isRowSelected = false;
    }

    this.updateRetryButtonState();
  }

   /**
   * Update Retry Selected button's enabled/disabled state
   * Disables the button if any selected row has COMPLETED status
   */
  updateRetryButtonState() {
    const hasCompletedEntries = this.selectedRows.some((row: any) => row.status === 'COMPLETED');
    const retryAction = 'retrySelected';
    
    if (hasCompletedEntries) {
      // Disable Retry Selected if any COMPLETED entry is selected
      if (!this.conditionalActions.disableActions.includes(retryAction)) {
        this.conditionalActions.disableActions.push(retryAction);
      }
    } else {
      // Enable Retry Selected if no COMPLETED entries are selected
      const index = this.conditionalActions.disableActions.indexOf(retryAction);
      if (index > -1) {
        this.conditionalActions.disableActions.splice(index, 1);
      }
    }
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  clearAllFilters() {
    this.filter.globalSearch = '';
    this.clearFilterValues();
  }

  initFilterForm() {
    this.quickFilterFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.quickFilterConfig);
    this.filterSearch();
  }

  actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof OutboxListBaseComponent, ' '> = methodName;
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
    else if (typeof this[action] === "function") {
      (this as any)[action]();
    }
  }

  advancedSearch() {
    const formValues = this.tableSearchControls.value;
    const processedSearch: any = {};
    
    // Copy all non-date values first
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key) && formValues[key] !== null && formValues[key] !== '' && formValues[key] !== undefined) {
        processedSearch[key] = formValues[key];
      }
    }
    
    // Process date fields - convert to timestamps
    let hasDates = this.tableSearchConfig.children.filter((e: any) => (e.fieldType.toLowerCase() == "date" || e.fieldType.toLowerCase() == "datetime") && e.uiType?.toLowerCase() !== "autosuggest");
    if (hasDates.length > 0) {
      hasDates.forEach((f: any) => {
        let field = f.name;
        let value = formValues[field];
        
        if (value && Array.isArray(value) && value[0]) {
          const startDate = value[0] instanceof Date ? value[0] : new Date(value[0]);
          let endDate: Date;
          
          if (value[1]) {
            endDate = value[1] instanceof Date ? value[1] : new Date(value[1]);
          } else {
            // Single date selected - use end of day
            endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999);
          }
          
          const lLimit = startDate.getTime();
          const uLimit = endDate.getTime();
          
          processedSearch[field] = {
            lLimit: lLimit,
            uLimit: uLimit,
            type: "Date"
          };
        } else if (value && typeof value == 'object' && !Array.isArray(value) && (value.min || value.max)) {
          // Handle min/max object format
          const minDate = value.min ? (value.min instanceof Date ? value.min : new Date(value.min)) : null;
          const maxDate = value.max ? (value.max instanceof Date ? value.max : new Date(value.max)) : null;
          
          processedSearch[field] = {
            lLimit: minDate ? minDate.getTime() : null,
            uLimit: maxDate ? maxDate.getTime() : null,
            type: "Date"
          };
        } else {
          // Remove empty date fields
          delete processedSearch[field];
        }
      });
    }
    
    this.filter.advancedSearch = processedSearch;
    this.onRefresh();
    this.toggleAdvancedSearch();
  }

  initSearchForm() {
    this.tableSearchFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.tableSearchConfig);
  }

  filterSearch() {
    const subscription = this.quickFilterControls.valueChanges.subscribe((value) => {
      let dateRangeNotChoosen: boolean = false;
      for (let control of this.quickFilterConfig.children || []) {
        if (control.fieldType === 'Date') {
          if (value[control.field][0] && !value[control.field][1]) {
            dateRangeNotChoosen = true;
            break;
          }
        }
      }
      if (!dateRangeNotChoosen) {
        this.filter.quickFilter = value;
        this.onRefresh();
      }
    });
    this.subscriptions.push(subscription);
  }

  getSearchData(searchFields: any, config: any) {
    let searchData: any = {};
    for (const key in searchFields) {
      if (searchFields.hasOwnProperty(key) && searchFields[key]?.toString().length) {
        if (this.selectedItems.hasOwnProperty(key)) {
          let lookupObj: any = [];
          if (config[key].multiple) {
            this.selectedItems[key].map((o: any) => lookupObj.push(o.id));
          }
          searchData[`${key}.id`] = config[key].multiple ? lookupObj : this.selectedItems[key][0].id;
        }
        else if (config[key]?.uiType === 'datetime' || config[key]?.uiType === 'date') {
          // Ensure date values are in the correct format for backend
          const dateValue = searchFields[key];
          
          // If already in {lLimit, uLimit, type} format with numeric values, pass through
          if (dateValue && typeof dateValue === 'object' && !Array.isArray(dateValue) && 'lLimit' in dateValue && typeof dateValue.lLimit === 'number') {
            searchData[key] = dateValue;
          }
          // If it's an array (Date objects or ISO strings from p-calendar), convert to proper format
          else if (Array.isArray(dateValue) && dateValue.length >= 1 && dateValue[0]) {
            const startDate = dateValue[0] instanceof Date ? dateValue[0] : new Date(dateValue[0]);
            let endDate: Date;
            if (dateValue[1]) {
              endDate = dateValue[1] instanceof Date ? dateValue[1] : new Date(dateValue[1]);
            } else {
              // Single date selected - use end of day
              endDate = new Date(startDate);
              endDate.setHours(23, 59, 59, 999);
            }
            searchData[key] = { lLimit: startDate.getTime(), uLimit: endDate.getTime(), type: "Date" };
          }
          // If it's a single Date object
          else if (dateValue instanceof Date) {
            const endDate = new Date(dateValue);
            endDate.setHours(23, 59, 59, 999);
            searchData[key] = { lLimit: dateValue.getTime(), uLimit: endDate.getTime(), type: "Date" };
          }
          // Skip invalid date values
        }
        else {
          searchData[key] = searchFields[key];
        }
      }
    }
    return searchData;
  }

  assignTableParams() {
    const params: any = {};
    this.filter.sortField = this.tableConfig.groupOnColumn ? this.tableConfig.groupOnColumn?.name : this.filter.sortField;
    const searchData = { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig), ...this.getSearchData(this.filter.quickFilter, this.quickFilterFieldConfig) };
    if (this.filter.globalSearch)
      searchData['_global'] = this.filter.globalSearch;

    if (this.filter.sortField && this.filter.sortOrder) {
      let columnName: any = null;
      this.tableConfig.children.map((ele: any) => {
        if (ele.uiType === "autosuggest" && this.filter.sortField === ele.name) {
          columnName = (ele.name + ".value." + ele.displayField);
        }
        else if (this.filter.sortField === ele.name) {
          columnName = this.filter.sortField;
        }
        if (columnName) {
          params.order = [{
            column: columnName,
            dir: this.filter.sortOrder
          }];
        }
        else {
          params.order = null;
        }
      });
    }
    else {
      params.order = null;
    }
    params.search = searchData;

    return params;
  }

  updateActions() {
    this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children);
    this.actionBarConfig.forEach((actionConfig: any) => {
      if (actionConfig.visibility === 'conditional' && actionConfig.conditionForButtonVisiblity) {
        const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonVisiblity?.query?.rules, actionConfig.conditionForButtonVisiblity?.query?.condition);
        this.validateActions(actionConfig.action, conResult, 'view');
      }
      if (actionConfig.buttonEnabled === 'conditional' && actionConfig.conditionForButtonEnable) {
        const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonEnable?.query?.rules, actionConfig.conditionForButtonEnable?.query?.condition);
        this.validateActions(actionConfig.action, conResult, 'edit');
      }
    });
  }

  validateActions(label: string, result: boolean, action: string) {
    if (action === 'view') {
      if (result && this.conditionalActions.hideActions.includes(label))
        this.conditionalActions.hideActions?.splice(this.conditionalActions.hideActions?.indexOf(label), 1);
      else if (!result && !this.conditionalActions.hideActions.includes(label))
        this.conditionalActions.hideActions.push(label);
    }
    else if (action === 'edit') {
      if (result && this.conditionalActions.disableActions.includes(label))
        this.conditionalActions.disableActions.splice(this.conditionalActions.disableActions?.indexOf(label), 1);
      else if (!result && !this.conditionalActions.disableActions.includes(label))
        this.conditionalActions.disableActions.push(label);
    }
  }

  getGridConfig() {
    const self = this;
    this.tableConfig.tableStyle = this.appUtilBaseService.getTableView(this.tableConfig.tableStyle, this.tableConfig.rowSpacing, this.tableConfig.rowHeight)?.tableStyle;
    const gridConfigData: any = {
      data: this.gridData,
      columns: this.getColumns(),
      ajaxUrl: OutboxApiConstants.getDatatableData,
      select: true,
      colReorder: (String(this.tableConfig?.columnReorder)?.toLowerCase() === 'true'),
      detailPageNavigation: (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_of_the_row' ? 'row_click' : (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_on_navigate_icon' ? 'row_edit' : '')),
      toggleColumns: (String(this.tableConfig?.toggleColumns)?.toLowerCase() === 'true'),
      paging: !(String(this.tableConfig?.infiniteScroll)?.toLowerCase() === 'true'),
      scrollX: true,
      showSettingsIcon: false,
      scrollCollapse: true,
      pageLength: parseInt(String(this.tableConfig?.pageLimit)),
      deferRender: true,
      ordering: true,
      sortField: this.tableConfig.sortField,
      sortOrder: this.tableConfig.sortOrder,
      countRequired: true,
      colResize: (String(this.tableConfig?.columnResize)?.toLowerCase() === 'true'),
      disableSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'none' ? true : false),
      recordSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' ? 'multi' : (this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only' ? 'single' : '')),
      bFilter: false,
      enterKeytoSearch: false,
      showGridlines: this.tableConfig.showGridlines,
      striped: this.tableConfig.striped,
      rowSpacing: this.appUtilBaseService.getTableView(this.tableConfig.tableStyle, this.tableConfig.rowSpacing, this.tableConfig.rowHeight)?.rowSpacing,
      rowHeight: this.appUtilBaseService.getTableView(this.tableConfig.tableStyle, this.tableConfig.rowSpacing, this.tableConfig.rowHeight)?.rowHeight,
      rowGrouping: Object.keys(this.tableConfig?.groupOnColumn || {}).length === 0 ? '' : this.tableConfig?.groupOnColumn?.name,
      sortSeparator: this.separator,
      fixedColumns: {
        left: parseInt(String(this.tableConfig?.leftFreezeUptoColumn || '0')),
        right: parseInt(String(this.tableConfig?.rightFreezeFromColumn || '0'))
      },
      isChildPage: this.isChildPage,
      parentId: false,
      uniqueIdentifier: ['outboxId'],
      emptyTableMsg: this.getEmptyTableMessage(),
      onRowClick: (event: any, id: string) => {
        this.onRowClickEvent(id, event);
      },
      onRowSelect: (selectedRows: any, id: any) => {
        this.getSelectedvalues(selectedRows, id);
      },
      onRowDeselect: (selectedRows: any) => {
        this.getSelectedvalues(selectedRows, '');
      }
    };
    return gridConfigData;
  }

  getColumns() {
    const json1 = this.tableConfig.children || [];
    const json2 = this.customRenderConfig.children || [];
    let merged = [];
    for (let i = 0; i < json1.length; i++) {
      merged.push({
        ...json1[i],
        ...(json2.find((itmInner: any) => itmInner.fieldName === json1[i].fieldName))
      });
    }
    return merged;
  }

  showToastMessage(config: object) {
    this.messageService.add(config);
  }

  onKeydown(event: any) {
    if (event.which === 13 || event.keyCode === 13) {
      this.onRefresh();
    }
  }

  clearGlobalSearch() {
    this.filter.globalSearch = '';
    this.onRefresh();
  }

  onClosePayloadDetail() {
    this.displayPayloadDetail = false;
    this.detPopupOpen = false;
    this.selectedOutbox = null;
  }

  onInit() {
    this.initSearchForm();
    this.initFilterForm();
    this.loadEntityTypes();
    this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
    this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
    this.loadGridData();
    this.updateActions();
    this.gridConfig = this.getGridConfig();
    
    // Set default filter to FAILED
    this.setDefaultFailedFilter();
  }

  onDestroy() {
    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  }

  onAfterViewInit() {
  }

}
