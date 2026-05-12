import { Component, Directive, Renderer2, SecurityContext, ViewChild, inject } from '@angular/core';
import { AppConstants } from '@app/app-constants';
import { Subscription } from 'rxjs';
import { ProviderMappingBase } from '../provider-mapping.base.model';
import { environment } from '@env/environment';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppGlobalService } from '@baseapp/app-global.service';
import { ProviderMappingApiConstants } from '../provider-mapping.api-constants';
import { ProviderMappingBaseService } from '../provider-mapping.base.service';
import { BaseService } from '@baseapp/base.service';
import { GridComponent } from '@libsrc/grid/grid.component';
import { ProviderDetailComponent } from '../provider-detail/provider-detail.component';
import { BaseAppConstants } from '@baseapp/app-constants.base';

@Directive({

})
export class ProviderListBaseComponent {
  errId: any;
  quickFilter: any;
  hiddenFields: any = {};
  quickFilterFieldConfig: any = {}
  isSearchFocused: boolean = false;
  showBreadcrumb = AppConstants.showBreadcrumb;

  showAdvancedSearch: boolean = false;
  detPopupOpen: boolean = false;

  tableSearchFieldConfig: any = {};
  params: any;
  isMobile: boolean = AppConstants.isMobile;
  displayErrorDet: boolean = false;
  displayImport: boolean = false;
  popupOpen: boolean = false;


  gridData: ProviderMappingBase[] = [];
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
  complexAutoSuggestPageNo: number = 0
  localStorageStateKey = "provider-mapping";
  showMenu: boolean = false;
  conditionalActions: any = {
    disableActions: [],
    hideActions: []
  }
  actionBarConfig: any = [];
  updatedRecords: ProviderMappingBase[] = [];
  showPaginationOnTop = AppConstants.showPaginationonTop;
  showPaginationOnBottom = AppConstants.showPaginationonBottom;
  tableFieldConfig: any = {};
  dateFormat: string = AppConstants.calDateFormat;
  selectedRowId: any = '';
  showWorkflowSimulator: boolean = false;
  gridConfig: any = {};
  @ViewChild(GridComponent)
  private gridComponent: any = GridComponent;
  separator = ".";
  isChildPage: boolean = false;
  detailDisplay: boolean = false;


  leftActionBarConfig: any = {
    "children": [],
    "columns": "2",
    "type": "tableSearch",
    "showAdvancedSearch": true
  }
  quickFilterConfig: any = {}
  customRenderConfig: any = {
    "children": [
      {
        "fieldName": "clientId",
        render: (data: any, type: any, row: any, meta: any) => { return this.clientIdRender(data, row); }
      },
      {
        "fieldName": "clientSecret",
        render: (data: any, type: any, row: any, meta: any) => { return this.clientSecretRender(data, row); }
      },
      {
        "fieldName": "generatebtn",
        render: (data: any, type: any, row: any, meta: any) => { return this.editRender(data, row); }
      },
      {
        "fieldName": "authenticationMode",
        render: (data: any, type: any, row: any, meta: any) => { return this.authenticationModeRender(data, row); }
      },
      {
        "fieldName": "baseURL",
        render: (data: any, type: any, row: any, meta: any) => { return this.baseURLRender(data, row); }
      }
    ]
  }
  tableConfig: any = {
    "recordSelection": "none",
    "striped": true,
    "rightFreezeFromColumn": "0",
    "viewAs": "list",
    "hoverStyle": "box",
    "tableStyle": "style_2",
    "type": "grid",
    "showDetailPageAs": "navigate_to_new_page",
    "leftFreezeUptoColumn": "2",
    "pageLimit": "50",
    "children": [{
      "label": "Provider_Name",
      "data": "",
      "field": "providerName",
      "type": "gridColumn",
      "width": "150px",
      "showOnMobile": "true",
      "labelPosition": "top",
      "fieldType": "string",
      "multipleValues": false,
      "fieldId": "providerName",
      "timeOnly": false,
      "uiType": "text",
      "name": "providerName",
      "fieldName": "providerName"
    },
    {
      "label": "Authentication_Mode",
      "data": "",
      "field": "authenticationMode",
      "type": "gridColumn",
      "width": "134px",
      "showOnMobile": "true",
      "labelPosition": "top",
      "fieldType": "string",
      "multipleValues": false,
      "fieldId": "authenticationMode",
      "timeOnly": false,
      "uiType": "text",
      "name": "authenticationMode",
      "fieldName": "authenticationMode"
    },
    {
      "label": "Client_Id",
      "data": "",
      "field": "clientId",
      "type": "gridColumn",
      "width": "100px",
      "showOnMobile": "true",
      "labelPosition": "top",
      "fieldType": "string",
      "multipleValues": false,
      "fieldId": "clientId",
      "timeOnly": false,
      "uiType": "text",
      "name": "clientId",
      "fieldName": "clientId"
    },
    {
      "label": "Client_Secret",
      "data": "",
      "field": "clientSecret",
      "type": "gridColumn",
      "width": "100px",
      "showOnMobile": "true",
      "labelPosition": "top",
      "fieldType": "boolean",
      "multipleValues": false,
      "fieldId": "clientSecret",
      "timeOnly": false,
      "uiType": "text",
      "name": "clientSecret",
      "skipSanitize": true,
      "fieldName": "clientSecret"
    },
    {
      "label": "Base_URL",
      "data": "",
      "field": "baseURL",
      "type": "gridColumn",
      "width": "150px",
      "showOnMobile": "true",
      "labelPosition": "top",
      "fieldType": "boolean",
      "multipleValues": false,
      "fieldId": "baseURL",
      "timeOnly": false,
      "uiType": "link",
      "name": "baseURL",
      "skipSanitize": true,
      "fieldName": "baseURL"
    },
    {
      "label": " ",
      "data": "",
      "field": "generatebtn",
      "type": "gridColumn",
      "width": "60px",
      "showOnMobile": "true",
      "labelPosition": "top",
      "fieldType": "boolean",
      "multipleValues": false,
      "fieldId": "generatebtn",
      "timeOnly": false,
      "uiType": "text",
      "name": "generatebtn",
      "skipSanitize": true,
      "fieldName": "generatebtn"
    }
    ],
    "sorting": "single_column",
    "sortField": "createdDate",
    "sortOrder": "desc",
    "showSettingsIcon": "false",
    "detailPageNavigation": "click_of_the_row",
    "rowSpacing": "medium",
    "rowHeight": "medium"
  }

  pageViewTitle: string = 'Provider_Mapping';
  public showLoading = false;

  tableSearchControls: UntypedFormGroup = new UntypedFormGroup({
    providerName: new UntypedFormControl('', []),
    authenticationMode: new UntypedFormControl('', []),
    clientId: new UntypedFormControl('', []),
    clientSecret: new UntypedFormControl('', []),
    baseURL: new UntypedFormControl('', []),

  });

  public providerMappingService = inject(ProviderMappingBaseService);
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
  public baseService = inject(BaseService)
  filter: any;
  confirmationReference: any;
  displayMailEdit: boolean = false;
  OAuth2Exists: boolean = false;
  currentRowId: any;
  clientData: any[] = [];

  editRender(data: any, row: any) { //to display the configure button
    const index = this.clientData.findIndex(r => r.sid === row.sid);
    if (index !== -1) {
      // Update the existing row
      this.clientData[index] = row;
    } else {
      // Add new row if no duplicate
      this.clientData.push(row);
    }
    return ` <button class="p-button config-btn p-ripple p-element curved "> ${this.translateService.instant('Configure')}</button>`
  }

  clientIdRender(data: any, row: any) { //to display masked Client Id value

    if (data) {
      const maskedData = "*****";
      return `${maskedData} <i class="pi pi-copy clientId" title="Copy"></i>`
    }
    else {
      return data;
    }

  }
  clientSecretRender(data: any, row: any) { //to display masked Client Secret value

    if (data) {
      const maskedData = "*****";
      return `${maskedData} <i class="pi pi-copy clientSecret" title="Copy"></i>`
    }
    else {
      return data;
    }

  }
  authenticationModeRender(data: any, row: any) { //to translate and render Auth Mode
    if (data === "OAUTH2") {
      this.OAuth2Exists = true;
    }
    let renderData = this.translateService.instant(data);
    return `${renderData}`;

  }
  baseURLRender(data: any, row: any) {
    if (data)
      return `<a target='_blank' href="${data}" class="ellipsis white-space-nowrap">${data}</a>
      </span>`
    else
      return data;
  }

  loadGridData() {
    let gridSubscription: any;
    if (environment.prototype) {
      gridSubscription = this.providerMappingService.getProtoTypingData().subscribe((data: any) => {
        this.gridData = [...this.gridData, ...(data || [])];
        this.isPageLoading = false;
      });
    }
    else {
      this.gridData = []
    }
  }
  clearFilterValues() {
    this.tableSearchControls.reset();
    this.filter.advancedSearch = {};
    this.onRefresh();
  }
  onRefresh(): void {
    const params = this.assignTableParams();
    setTimeout(() => {
      this.gridComponent.refreshGrid(params, false);
    }, 500);
  }

  onRowClickEvent(id: any, event?: any) { //handles all the row clicks in the datatable
    if (event.target.classList[1] == 'config-btn') {
      this.confirmationReference = this.dialogService.open(ProviderDetailComponent, {
        header: this.translateService.instant('Provider_Service_Mapping_Detail'),
        ...(!BaseAppConstants.isMobile && {width: '30%'}),
        closable: false,
        contentStyle: { "padding-top": "0" },
        styleClass: "provider-mapping-detail confirm-popup-container",
        data: {
          id: id,
          event: event
        }
      });
      this.confirmationReference.onClose.subscribe((result: any) => {
        if (result == "saved") {
          this.onRefresh();
        }
      })
    }
    if (event.target.classList[2] == 'clientId') {
      const matchingRow = this.clientData.find((row: { sid: any; }) => row.sid === id);
      this.appUtilBaseService.copyValue(matchingRow.clientId)
      this.showToastMessage({ severity: 'info', summary: '', detail: this.translateService.instant('Client_Id_copied_successfully') });

    }
    if (event.target.classList[2] == 'clientSecret') {
      const matchingRow = this.clientData.find((row: { sid: any; }) => row.sid === id);
      this.appUtilBaseService.copyValue(matchingRow.clientSecret)
      this.showToastMessage({ severity: 'info', summary: '', detail: this.translateService.instant('Client_Secret_copied_successfully') });

    }
  }

  actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ProviderListBaseComponent, ' '> = methodName;
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
  }

  assignTableParams() {
    const params: any = {};
    params.order = null;
    params.search = {};
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
    })
  }
  validateActions(label: string, result: boolean, action: string) {
    if (action === 'view') {
      if (result && this.conditionalActions.hideActions.includes(label))
        this.conditionalActions.hideActions?.splice(this.conditionalActions.hideActions?.indexOf(label), 1)
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
    const self = this
    return {
      id: 'provider_mapping_list_datatable',
      data: this.gridData,
      columns: this.getColumns(),
      ajaxUrl: ProviderMappingApiConstants.getDatatableData,
      select: false,
      colReorder: (String(this.tableConfig?.columnReorder)?.toLowerCase() === 'true'),
      detailPageNavigation: (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_of_the_row' ? 'row_click' : (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_on_navigate_icon' ? 'row_edit' : '')),
      toggleColumns: (String(this.tableConfig?.toggleColumns)?.toLowerCase() === 'true'),
      paging: false,
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
      rowSpacing: this.tableConfig.rowSpacing,
      rowHeight: this.tableConfig.rowHeight,
      rowGrouping: jQuery.isEmptyObject(this.tableConfig?.groupOnColumn) ? '' : this.tableConfig?.groupOnColumn?.name,
      sortSeparator: this.separator,
      fixedColumns: {
        left: parseInt(String(this.tableConfig?.leftFreezeUptoColumn || '0')),
        right: parseInt(String(this.tableConfig?.rightFreezeFromColumn || '0'))
      },
      isChildPage: this.isChildPage,
      parentId: false,
      uniqueIdentifier: this.tableConfig?.uniqueIdentifier || null,
      onRowClick: (event: any, id: string) => {
        this.onRowClickEvent(id, event);

      },
    };

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

  clearGlobalSearch() {
    this.onRefresh();
  }

  onInit() {
    this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
    this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);

    this.updateActions();
    this.setupCall();

  }

  setupCall() {
    this.gridConfig = this.getGridConfig();
    if (environment.prototype) {
      return this.loadGridData();
    }
    this.providerMappingService.setupCall({}).subscribe((res: any) => {
      if (res) {
        this.loadGridData();
      }
    });
  }


  onDestroy() {
    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  }
  onAfterViewInit() {

    if(BaseAppConstants.isMobile)
      this.enableConfigBtnForPWA();

  }

  // Child Rows do not trigger onRowClick of Datatable so this method will
  // implement row click
  enableConfigBtnForPWA() {

    let that = this;

    $('#' + this.gridConfig.id).on('click','.config-btn', function (event: any) {

      event.stopPropagation();

      //@ts-ignore
      var table = $?.fn?.dataTable?.tables({ api: true }).table('#' + that.gridConfig.id);
      var childRow = $(this).closest('tr');

      // Find the parent row using DataTables API
      var parentRow = table?.row(childRow.prev('tr')).node();
      var data = table?.row(this).data();

      if (parentRow) {
        that.onRowClickEvent(data?.id, event); // Trigger row click on the parent row
      }

    });

  }

}
