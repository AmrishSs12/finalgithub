import { Directive, Input, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@libsrc/confirmation/confirmation-popup.component';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { GridComponent } from '@libsrc/grid/grid.component';
import { environment } from '@env/environment';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Filter } from '@baseapp/vs-models/filter.model';
import { AppLoaderService } from '@baseapp/app-loader.service';
import { TenantDomainConfigApiConstants } from '../tenant-domain-config.api-constants';
import { TenantDomainConfigService } from '../tenant-domain-config.service';

@Directive({
})
export class TenantDomainConfigListBaseComponent {

  showAdvancedSearch: boolean = false;
  advancedSearchValue: any;
  tableSearchFieldConfig: any = {};
  filtersApplied: boolean = false;
  selectedValues: any[] = [];
  filter: Filter = {
    globalSearch: '',
    advancedSearch: {},
    sortField: null,
    sortOrder: null,
    quickFilter: {}
  };
  isMobile: boolean = AppConstants.isMobile;
  deactivateRecords: boolean = AppConstants.deactivateRecords;
  displayFilterIn: string = AppConstants.displayFilterIn;
  combinedActionConfig: any = [];

  gridData: any[] = [];
  subscriptions: Subscription[] = [];
  selectedColumns: any = [];
  rightFreezeColums: any;
  total: number = 0;
  inValidFields: any = {};
  selectedItems: any = {};
  isRowSelected: boolean = false;
  isPrototype = environment.prototype;
  isList = true;
  isPageLoading: boolean = false;
  localStorageStateKey = "application-user-list";
  conditionalActions: any = {
    disableActions: [],
    hideActions: []
  }
  filterActions: any = {
    hideActions: []
  }

  tableFieldConfig: any = {};
  gridConfig: any = {};
  @ViewChild(GridComponent)
  public gridComponent: any = GridComponent;
  separator = "__";
  responseData: any = [];
  defaultActions = ['save', 'cancel', 'refresh', 'back', 'delete', 'activate', 'deactivate', 'new'];
  queryViewList: boolean = false; // dynamic Variable has to be updated here
  showonFilter: boolean = false;
  @Input() filters: any = {};
  @Input() componentId: string = '';
  @Input() mapData: any = {};
  @Input() dynamicDialogConfigFromDetailPage: any = {};
  priorGridParams: any = {};
  queryViewFiltersApplied: boolean = false;
  gridEmptyMsg: string = '';
  @Input() mapConfig: any = {};
  hasMappedParameters: boolean = false;
  @Input() fromDetailPage: boolean = false;
  currentPaginationStart: any = 0;
  @Input() standardGrid: boolean = false;
  @Input() childPageLimit: string = '10';
  isChildPage: boolean = false;
  hiddenFields: any = {};

  leftActionBarConfig: any = {
    "children": [{
      "visibility": "show",
      "buttonStyle": "curved",
      "icon": {
        "type": "icon",
        "icon": {
          "label": "fas fa-arrow-left",
          "value": "fas fa-arrow-left"
        }
      },
      "confirmationText": "confirm",
      "label": "Back",
      "type": "button",
      "beforeAction": "none",
      "detailPagePopupWidth": 70,
      "outline": false,
      "buttonType": "icon_on_left",
      "autoFillLookup": false,
      "showOn": "both",
      "displayAsToggleSwitch": false,
      "enableOnlyIfRecordSelected": false,
      "buttonId": "BackbuttonId0",
      "buttonEnabled": "yes",
      "action": "back",
      "confirmationTitle": "confirmation",
      "hideListPageTitle": false,
      "fields": [],
      "confirmationButtonText": "yes",
      "cancelButtonText": "no"
    }, {
      "defaultDetailPageEnabled": false,
      "visibility": "show",
      "buttonStyle": "curved",
      "confirmationText": "confirm",
      "label": "New",
      "type": "button",
      "beforeAction": "none",
      "detailPagePopupWidth": 70,
      "outline": false,
      "buttonType": "icon_on_left",
      "autoFillLookup": false,
      "showOn": "both",
      "displayAsToggleSwitch": false,
      "enableOnlyIfRecordSelected": false,
      "buttonId": "NewbuttonId1",
      "buttonEnabled": "yes",
      "action": "new",
      "confirmationTitle": "confirmation",
      "hideListPageTitle": false,
      "fields": [],
      "confirmationButtonText": "yes",
      "cancelButtonText": "no"
    }, {
      "defaultDetailPageEnabled": false,
      "visibility": "show",
      "buttonStyle": "curved",
      "icon": {
        "type": "icon",
        "icon": {
          "label": "fas fa-trash-alt",
          "value": "fas fa-trash-alt"
        },
        "iconColor": "#000000",
        "iconSize": "13px"
      },
      "confirmationText": "confirm",
      "label": "Delete",
      "type": "button",
      "beforeAction": "none",
      "detailPagePopupWidth": 70,
      "outline": false,
      "buttonType": "icon_only",
      "autoFillLookup": false,
      "showOn": "both",
      "displayAsToggleSwitch": false,
      "enableOnlyIfRecordSelected": false,
      "buttonId": "DeletebuttonId2",
      "buttonEnabled": "yes",
      "action": "delete",
      "confirmationTitle": "confirmation",
      "hideListPageTitle": false,
      "fields": [],
      "confirmationButtonText": "yes",
      "cancelButtonText": "no"
    }, {
      "visibility": "show",
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
      "confirmationText": "confirm",
      "label": "Refresh",
      "type": "button",
      "beforeAction": "none",
      "detailPagePopupWidth": 70,
      "outline": false,
      "buttonType": "icon_only",
      "autoFillLookup": false,
      "showOn": "both",
      "displayAsToggleSwitch": false,
      "enableOnlyIfRecordSelected": false,
      "buttonId": "RefreshbuttonId3",
      "buttonEnabled": "yes",
      "action": "refresh",
      "confirmationTitle": "confirmation",
      "hideListPageTitle": false,
      "fields": [],
      "confirmationButtonText": "yes",
      "cancelButtonText": "no"
    }],
    "type": "actionBar"
  }

  softDeleteConfig: any = {
    "detailPagePopupWidth": 70,
    "defaultDetailPageEnabled": false,
    "outline": false,
    "children": [{
      "defaultDetailPageEnabled": false,
      "visibility": "auto",
      "buttonStyle": "curved",
      "label": "Activate",
      "type": "button",
      "detailPagePopupWidth": 70,
      "outline": false,
      "buttonType": "icon_on_left",
      "autoFillLookup": false,
      "showOn": "both",
      "displayAsToggleSwitch": false,
      "enableOnlyIfRecordSelected": false,
      "buttonId": "ActivatebuttonId0",
      "buttonEnabled": "auto",
      "action": "activate",
      "hideListPageTitle": false,
      "fields": []
    }, {
      "defaultDetailPageEnabled": false,
      "visibility": "auto",
      "buttonStyle": "curved",
      "label": "Deactivate",
      "type": "button",
      "detailPagePopupWidth": 70,
      "outline": false,
      "buttonType": "icon_on_left",
      "autoFillLookup": false,
      "showOn": "both",
      "displayAsToggleSwitch": false,
      "enableOnlyIfRecordSelected": false,
      "buttonId": "DeactivatebuttonId1",
      "buttonEnabled": "auto",
      "action": "deactivate",
      "hideListPageTitle": false,
      "fields": []
    }],
    "autoFillLookup": false,
    "displayAsToggleSwitch": false,
    "displayCount": "0",
    "hideListPageTitle": false,
    "label": "Activate_Button_Group",
    "type": "buttonGroup"
  }

  tableConfig: any = {
    "rightFreezeFromColumn": "0",
    "columnReorder": false,
    "type": "grid",
    "showDetailPageAs": "navigate_to_new_page",
    "rowGroup": "no",
    "outline": false,
    "children": [{
      "fieldName": "domain",
      "data": "",
      "formatDisplay": false,
      "isQueryView": false,
      "enableRecordCreation": false,
      "showOnMobile": false,
      "isPrimaryKey": true,
      "label": "Domain",
      "showDetailPageAs": "as_a_popup",
      "type": "gridColumn",
      "createButtonLabel": "New",
      "showLabel": false,
      "detailPagePopupWidth": 70,
      "field": "domain",
      "labelPosition": "top",
      "tooltipMessage": "",
      "name": "domain",
      "uiType": "text",
      "fieldType": "string",
      "fieldId": "domain"
    }, {
      "fieldName": "tenant",
      "data": "",
      "formatDisplay": false,
      "isQueryView": false,
      "enableRecordCreation": false,
      "showOnMobile": false,
      "isPrimaryKey": false,
      "label": "Tenant",
      "showDetailPageAs": "as_a_popup",
      "type": "gridColumn",
      "createButtonLabel": "New",
      "showLabel": false,
      "detailPagePopupWidth": 70,
      "field": "tenant",
      "labelPosition": "top",
      "tooltipMessage": "",
      "name": "tenant",
      "uiType": "text",
      "fieldType": "string",
      "fieldId": "tenant"
    }, {
      "fieldName": "orgname",
      "data": "",
      "formatDisplay": false,
      "isQueryView": false,
      "enableRecordCreation": false,
      "showOnMobile": false,
      "isPrimaryKey": false,
      "label": "Organization",
      "showDetailPageAs": "as_a_popup",
      "type": "gridColumn",
      "createButtonLabel": "New",
      "showLabel": false,
      "detailPagePopupWidth": 70,
      "field": "orgname",
      "labelPosition": "top",
      "tooltipMessage": "",
      "name": "orgname",
      "uiType": "text",
      "fieldType": "string",
      "fieldId": "orgname"
    }],
    "toggleColumns": false,
    "displayAsToggleSwitch": false,
    "sorting": "single_column",
    "rowSpacing": "medium",
    "rowHeight": "medium",
    "striped": true,
    "recordSelection": "multiple_records",
    "inlineEditing": false,
    "viewAs": "list",
    "hoverStyle": "box",
    "tableStyle": "style_2",
    "detailPagePopupWidth": 70,
    "pageLimit": "50",
    "leftFreezeUptoColumn": "0",
    "runtimeWorkflowEnabled": false,
    "rememberLastTableSettings": false,
    "columnResize": false,
    "autoFillLookup": false,
    "showGridlines": false,
    "sortOrder": "asc",
    "detailPage": {
      "sid": "",
      "name": "tenant domain configuration Detail",
      "url": "admin/tenant-domain-config-detail"
    },
    "detailPageNavigation": "click_of_the_row",
    "tableId": "",
    "hideListPageTitle": false
  }
  tableSearchConfig: any = {
    "detailPagePopupWidth": 70,
    "outline": false,
    "disabledFieldsByLookup": [],
    "children": [{
      "fieldName": "domain",
      "data": "",
      "field": "domain",
      "name": "domain",
      "uiType": "text",
      "isQueryView": false,
      "isPrimaryKey": true,
      "label": "domain",
      "type": "searchField",
      "fieldType": "string",
      "fieldId": "domain"
    }, {
      "fieldName": "tenant",
      "data": "",
      "field": "tenant",
      "name": "tenant",
      "uiType": "text",
      "isQueryView": false,
      "isPrimaryKey": true,
      "label": "Tenant",
      "type": "searchField",
      "fieldType": "string",
      "fieldId": "tenant"
    }, {
      "fieldName": "orgname",
      "data": "",
      "field": "orgname",
      "name": "orgname",
      "uiType": "text",
      "isQueryView": false,
      "isPrimaryKey": true,
      "label": "orgname",
      "type": "searchField",
      "fieldType": "string",
      "fieldId": "orgname"
    }],
    "columns": "1",
    "autoFillLookup": false,
    "displayAsToggleSwitch": false,
    "hideListPageTitle": false,
    "type": "tableSearch",
    "showAdvancedSearch": true,
    "queryViewMapping": {}
  }
  softDeleteFilterConfig: any = {
    "displayActiveFilterIn": "quickFilter",
    "showFilter": true,
    "inactiveReadPermission": {
      "read": {
        "App Admin": {
          "access": "yes"
        }
      }
    }
  }
  quickFilterConfig: any = {
    "detailPagePopupWidth": 70,
    "defaultDetailPageEnabled": false,
    "outline": false,
    "disabledFieldsByLookup": [],
    "children": [],
    "autoFillLookup": false,
    "displayAsToggleSwitch": false,
    "hideListPageTitle": false,
    "type": "quickFilter",
    "queryViewMapping": {}
  }
  selectedRows!: any;
  pageViewTitle: string = 'Tenant_Domain_Configuration';

  public tenantDomainConfigService = inject(TenantDomainConfigService);
  public appUtilBaseService = inject(AppUtilService);
  public translateService = inject(TranslateService);
  public messageService = inject(MessageService);
  public confirmationService = inject(ConfirmationService);
  public dialogService = inject(DialogService);
  public router = inject(Router);
  public appGlobalService = inject(AppGlobalService);
  public location = inject(Location);
  public appLoaderService = inject(AppLoaderService);

  tableSearchControls: UntypedFormGroup = new UntypedFormGroup({
    domain: new UntypedFormControl('', []),
    tenant: new UntypedFormControl(''),
    orgname: new UntypedFormControl('', []),
  });
  quickFilterControls: UntypedFormGroup = new UntypedFormGroup({
  });
  quickFilterFieldConfig: any = {};
  actionBarConfig: any = [];
  isActiveFilter: boolean | null = true;
  tenants: any;

  onRefresh(fromDelete?: boolean, fromFilters?: boolean): void {
    const fromDel = fromDelete || false;
    const params = this.assignTableParams();
    if (this.tableSearchControls.get('domain')?.getRawValue())
      params.search['domain'] = this.tableSearchControls.get('domain')?.getRawValue();
    this.toShowRecords(params);
    if (this.mapConfig[this.componentId]?.length > 0) {
      const NeedRefresh = this.hasMappedParameters || fromFilters;
      if (this.gridComponent && 'refreshGrid' in this.gridComponent) {
        this.gridComponent.refreshGrid(params, fromDel, NeedRefresh);
      }
    }
    else {
      if (this.gridComponent && 'refreshGrid' in this.gridComponent) {
        this.gridComponent.refreshGrid(params, fromDel);
      }
    }
    this.selectedValues = [];
    this.priorGridParams.search = params.search;
    this.priorGridParams.mapper = params.mapper;
  }

  onActivate() {
    if (this.selectedValues.length > AppConstants.threshold) {
      // Display an info message if the number of selected values exceeds the threshold
      this.translateService.get('Activation_is_limited_to_OPENBRACE_OPENBRACE_threshold_CLOSEBRACE_CLOSEBRACE_records_DOT_Please_choose_accordingly', { threshold: AppConstants.threshold })
        .subscribe((message: string) => {
          this.showInfoMessage(message);
        });
    } else {
      let requestedParams: any = { ids: this.selectedValues.toString() }
      this.confirmationService.confirm({
        message: this.translateService.instant('Are_you_sure_that_you_want_to_Activate_the_selected_records_QUESTION'),
        header: this.translateService.instant('Confirmation'),
        icon: 'pi pi-info-circle',
        accept: () => {
          const activateSubscription = this.tenantDomainConfigService.activate(requestedParams).subscribe((res: any) => {
            if (res?.message) {
              this.showToastMessage({ severity: 'success', summary: '', detail: this.translateService.instant(res.message) });
            } else {
              this.showToastMessage({ severity: 'success', summary: '', detail: this.translateService.instant('Record_OPENPARAN_s_CLOSEPARAN_Activated_Successfully') });
            }
            requestedParams = {};
            this.selectedRows = [];
            this.selectedValues = [];
            this.isRowSelected = false;
            this.actionButtonEnableDisable();
            this.onRefresh();
          });
          this.subscriptions.push(activateSubscription);
        },
        reject: () => {
          // Handle rejection if needed
        },
      });
    }
  }

  onDeactivate() {
    if (this.selectedValues.length > AppConstants.threshold) {
      // Display an info message if the number of selected values exceeds the threshold
      this.translateService.get('Deactivation_is_limited_to_OPENBRACE_OPENBRACE_threshold_CLOSEBRACE_CLOSEBRACE_records_DOT_Please_choose_accordingly', { threshold: AppConstants.threshold })
        .subscribe((message: string) => {
          this.showInfoMessage(message);
        });
    } else {
      let requestedParams: any = { ids: this.selectedValues.toString() }
      this.confirmationService.confirm({
        message: this.translateService.instant('Are_you_sure_that_you_want_to_Deactivate_the_selected_records_QUESTION'),
        header: this.translateService.instant('Confirmation'),
        icon: 'pi pi-info-circle',
        accept: () => {
          const deactivateSubscription = this.tenantDomainConfigService.deactivate(requestedParams).subscribe((res: any) => {
            if (res?.message) {
              this.showToastMessage({ severity: 'success', summary: '', detail: this.translateService.instant(res.message) });
            } else {
              this.showToastMessage({ severity: 'success', summary: '', detail: this.translateService.instant('Record_OPENPARAN_s_CLOSEPARAN_Deactivated_Successfully') });
            }
            requestedParams = {};
            this.selectedRows = [];
            this.selectedValues = [];
            this.isRowSelected = false;
            this.actionButtonEnableDisable();
            this.onRefresh();
          });
          this.subscriptions.push(deactivateSubscription);
        },
        reject: () => {
          // Handle rejection if needed
        },
      });
    }
  }

  showFilter(): boolean {
    const configValues = Object.values(this.quickFilterFieldConfig);

    // Check if quickFilterFieldConfig is empty
    if (configValues.length === 0) {
      return false;
    }
    // Check if at least one field's allowview property is true
    const result = configValues.some((field) => {
      const allowview = (field as { viewInPages?: boolean }).viewInPages;
      return allowview !== false;
    });

    return result;
  }

  checkIfScrollbarVisible() {
    const element: any = document.getElementById(this.localStorageStateKey);
    if (element) {
      const isScrollable = element.scrollWidth > element.clientWidth;
      if (!isScrollable) { return false }
    };
    return true;
  }

  onNew() {
    if (!this.tableConfig.detailPage?.url) return;

    let queryParams: any = {};
    // this.getDetailpageParameters(queryParams);
    localStorage.setItem('holdFilters', JSON.stringify(queryParams));

    const value: any = "parentId";
    let property: Exclude<keyof TenantDomainConfigListBaseComponent, ''> = value;

    if (this.isChildPage && this[property]) {
      const methodName: any = "onNewChild";
      let action: Exclude<keyof TenantDomainConfigListBaseComponent, ''> = methodName;

      if (typeof this[action] === "function") {
        this[action]({ 'isCreate': 'yes', ...queryParams });
      }
    } else {
      this.appUtilBaseService.navigateWithQueryParams({ 'isCreate': 'yes', ...queryParams }, this.tableConfig.detailPage?.url);
    }
  }

  onBack() {
    this.location.back();
  }
  actionBarAction(btn: any) {
    let methodName: any = btn.methodName ? btn.methodName : (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof TenantDomainConfigListBaseComponent, ' '> = methodName;
    const config = this.getButtonConfig(btn);
    this.appGlobalService.write('saveAndCloseClicked', false);

    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      if (btn?.navigationDataMapping?.length > 0) {
        const queryParams: any = {};
        this.appUtilBaseService.navigateWithQueryParams({ isCreate: 'yes', ...queryParams }, btn.pageName?.url);
      } else {
        this.router.navigateByUrl(btn.pageName?.url);
      }
    }
    else if (this.defaultActions.includes(btn.action) && btn.action === "save_and_close") {
      const onSave: Exclude<keyof TenantDomainConfigListBaseComponent, ' '> = methodName.split('_')[0];
      this.appGlobalService.write('saveAndCloseClicked', true);
      this[onSave](false, undefined);
    }
    else if (this.defaultActions.includes(btn.action) && typeof this[action] === "function") {
      this[action]();
    }
    else if (typeof this[action] === "function" && (btn.beforeAction === 'show_confirmation' || btn.beforeAction === 'get_additional_info')) {
      this.showConfirmationPopup(config, btn);
    }
    else if (typeof this[action] === "function") {
      this[action]();
    }
  }

  showConfirmationPopup(config: any, btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof TenantDomainConfigListBaseComponent, ' '> = methodName;
    const confirmationReference = this.dialogService.open(ConfirmationPopupComponent, {
      header: config.confirmationTitle,
      width: AppConstants.isMobile ? '90%' : '30%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      styleClass: "confirm-popup-modal",
      showHeader: true,
      closable: true,
      data: {
        config: config,
      }
    });
    confirmationReference.onClose.subscribe((result: any) => {
      if (result) {
        if (typeof this[action] === "function") {
          this[action](result);
        }
      }
    })
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  clearAllFilters() {
    this.filter.globalSearch = '';
    this.clearFilterValues();
  }

  clearFilterValues() {
    this.tableSearchControls.reset();
    this.tenants = [];
    this.filter.advancedSearch = {};
    // this.fromResetFilter = 'searchReset';
    // this.storeFilters('advancedSearch');
    this.onRefresh();
    this.filtersApplied = false;
    // this.readonlyOnSearch();
  }

  resetQuickFilterValues() {
    this.setSoftDeleteFilterValue();
    this.resetNestedFormGroupDeep(this.quickFilterControls);
    this.onRefresh();
  }

  setSoftDeleteFilterValue(defaultValue: string = AppConstants.softDeleteFilterDefaultValue): void {
    if (!this.softDeleteFilterConfig.showFilter) {
      return;
    }
    this.softDeleteFilterConfig.defaultValue = '';
    setTimeout(() => {
      this.softDeleteFilterConfig.defaultValue = defaultValue;
    }, 0);
  }

  resetNestedFormGroupDeep(formGroup: FormGroup) {
    if (!formGroup || !(formGroup instanceof FormGroup)) return;

    const resetValues = Object.keys(formGroup.controls).reduce((acc, key) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        // Recursively reset nested FormGroup
        this.resetNestedFormGroupDeep(control);
      } else if (control instanceof FormControl) {
        if (this.quickFilterFieldConfig?.[key]?.fieldType == 'Boolean' && this.queryViewList) {
          acc[key] = false;
        }
        else if (this.fromDetailPage && this.queryViewList) {
          acc[key] = null;
        }
      }

      return acc;
    }, {} as any);

    formGroup.reset(resetValues, { emitEvent: false });
  }

  advancedSearch() {
    this.filter.advancedSearch = this.tableSearchControls.value;
    this.formatSearchString(this.filter.advancedSearch);
    this.onRefresh(false, true);
    this.toggleAdvancedSearch();
    this.filtersApplied = Object.values(this.filter.advancedSearch).some(value => value !== null);
    this.readonlyOnSearch();
  }

  readonlyOnSearch() {
    const inputField = document.getElementById('inputField') as HTMLInputElement | null;
    if (inputField) {
      if (this.filtersApplied) {
        inputField.setAttribute('readonly', 'true'); // Make input read-only
      } else {
        inputField.removeAttribute('readonly'); // Remove read-only state
      }
    }

  }

  formatSearchString(obj: any) {
    let formattedStringArray: string[] = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value !== null && value !== undefined && value !== "") {
          const translatedValue = ['dropdown', 'select', 'radiobutton'].includes(this.tableSearchFieldConfig[key]?.uiType) && value ? this.translateService.instant(value) : value;
          formattedStringArray.push(`${key}: ${translatedValue}`);
        }
      }
    }
    // if(formattedStringArray.length != 0){
    //   this.filter.globalSearch = "";
    //   this.storeFilters('globalSearch');
    // }
    this.advancedSearchValue = formattedStringArray
  }

  populateFields(data: any, searchFields: any, config: any, filterKeys: boolean): void {
    for (const key in searchFields) {
      if (searchFields.hasOwnProperty(key) && (searchFields[key]?.toString().length || this.queryViewList)) {
        data[key] = searchFields[key];
      }
    }
  }

  getSearchData(searchFields?: any, config?: any): any {
    let searchData: any = {};
    if (searchFields) {
      this.populateFields(searchData, searchFields, config, false);
    }
    return searchData;
  }

  getSelectedvalues(selectedRows: any, id: string) {
    let rawData: any = selectedRows?.data();
    // Filter out properties that are not functions
    this.selectedRows = []
    // Iterate through the properties of the response object
    for (const key in rawData) {
      // Check if the property is a numeric index (data objects)
      if (!isNaN(parseInt(key))) {
        // Add the data object to the array
        this.selectedRows.push(rawData[key]);
      }
    }

    this.selectedValues = [];
    rawData?.map((obj: any) => {
      this.selectedValues.push(obj.sid)
    })
    if (this.selectedValues.length > 0) {
      this.isRowSelected = true;
    } else if (this.selectedValues.length <= 0) {
      this.isRowSelected = false;
    }
    this.actionButtonEnableDisable();
  }

  onDelete() {
    this.deleteRecord();
  }

  deleteRecord() {
    if (this.selectedValues.length > AppConstants.threshold) {
      // Display an info message if the number of selected values exceeds the threshold
      this.translateService.get('Deletion_is_limited_to_OPENBRACE_OPENBRACE_threshold_CLOSEBRACE_CLOSEBRACE_records_DOT_Please_choose_accordingly', { threshold: AppConstants.threshold })
        .subscribe((message: string) => {
          this.showInfoMessage(message);
        });
    } else {
      // Proceed with deletion
      if (this.selectedValues.length > 0) {
        let requestedParams: any = { ids: this.selectedValues.toString() }
        this.confirmationService.confirm({
          message: this.translateService.instant('Are_you_sure_that_you_want_to_delete_the_selected_records_QUESTION'),
          header: this.translateService.instant('Confirmation'),
          icon: 'pi pi-info-circle',
          accept: () => {
            const deleteSubscription = this.tenantDomainConfigService.delete(requestedParams).subscribe((res: any) => {
              this.showToastMessage({ severity: 'success', summary: '', detail: this.translateService.instant('Record_OPENPARAN_s_CLOSEPARAN_Deleted_Successfully') });
              requestedParams = {};
              this.selectedValues = [];
              this.isRowSelected = false;
              this.actionButtonEnableDisable();
              this.onRefresh(true);

            });
            this.subscriptions.push(deleteSubscription);

          },
          reject: () => {

          },
        });
      }
    }
  }

  actionButtonEnableDisable() {
    this.leftActionBarConfig?.children?.map((ele: any) => {
      if (ele.type?.toLowerCase() == 'buttongroup' && ele.children?.length > 0) {
        ele?.children?.map((gButtonEle: any) => {
          this.disableButtons(gButtonEle)
        })
      } else {
        this.disableButtons(ele)
      }
    })
  }

  disableButtons(ele: any) {
    if ((ele?.action === 'delete' || ele?.action === 'activate' || ele?.action === 'deactivate') && ele.buttonEnabled != 'conditional') {
      if (this.selectedValues?.length > 0) {
        ele.buttonEnabled = 'yes';
      } else {
        ele.buttonEnabled = 'no';
      }
    }
  }

  showInfoMessage(message: string) {
    // Display an info message
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }

  showToastMessage(config: object) {
    this.messageService.add(config);
  }

  assignTableParams() {
    const params: any = {};
    this.filter.sortField = this.tableConfig.groupOnColumn ? this.tableConfig.groupOnColumn?.name : this.filter.sortField;
    const searchData = { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig) };
    if (this.deactivateRecords && this.displayFilterIn && this.isActiveFilter !== null) {
      searchData.isactive = this.isActiveFilter;
    }
    const mapper = {};
    if (this.filter.sortField && this.filter.sortOrder) {
      let columnName: any = null;
      this.tableConfig.children.map((ele: any) => {
        if (this.filter.sortField === ele.name) {
          columnName = this.filter.sortField
        }
        if (columnName) {
          params.order = [{
            column: columnName,
            dir: this.filter.sortOrder
          }]
        }
        else {
          params.order = null;
        }
      })
    }
    else {
      params.order = null;
    }
    params.search = searchData;
    params.mapper = mapper;

    return params;
  }

  getGridConfig() {
    this.tableConfig.tableStyle = this.appUtilBaseService.getTableView(this.tableConfig.tableStyle, this.tableConfig.rowSpacing, this.tableConfig.rowHeight)?.tableStyle;
    const gridConfigData: any = {
      data: this.gridData,
      columns: this.getColumns(),
      ajaxUrl: TenantDomainConfigApiConstants.getDatatableData,
      select: true,
      colReorder: (String(this.tableConfig?.columnReorder)?.toLowerCase() === 'true'),
      detailPageNavigation: (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_of_the_row' ? 'row_click' : (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_on_navigate_icon' ? 'row_edit' : '')),
      toggleColumns: (String(this.tableConfig?.toggleColumns)?.toLowerCase() === 'true'),
      paging: !(String(this.tableConfig?.infiniteScroll)?.toLowerCase() === 'true'),
      scrollX: true,
      quickfilterConfigured: false,
      scrollCollapse: true,
      pageLength: parseInt(String(this.tableConfig?.pageLimit)),
      deferRender: true,
      ordering: true,
      sortField: this.tableConfig.sortField,
      sortOrder: this.tableConfig.sortOrder,
      countRequired: true,
      colResize: (String(this.tableConfig?.columnResize)?.toLowerCase() === 'true'),
      disableSelection: ((this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' || this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only') ? false : true),
      recordSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' ? 'multi' : (this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only' ? 'single' : '')),
      bFilter: false,
      enterKeytoSearch: false,
      showGridlines: this.tableConfig.showGridlines,
      striped: this.tableConfig.striped,
      rowSpacing: this.appUtilBaseService.getTableView(this.tableConfig.tableStyle, this.tableConfig.rowSpacing, this.tableConfig.rowHeight)?.rowSpacing,
      rowHeight: this.appUtilBaseService.getTableView(this.tableConfig.tableStyle, this.tableConfig.rowSpacing, this.tableConfig.rowHeight)?.rowHeight,
      sortSeparator: this.separator,
      rowGrouping: jQuery.isEmptyObject(this.tableConfig?.groupOnColumn) ? '' : this.tableConfig?.groupOnColumn?.name,
      rowGroupColumns: this.tableConfig?.rowGroupColumns,
      rowGroup: (String(this.tableConfig?.rowGroup)?.toLowerCase() === 'yes'),
      currentPageName: this.pageViewTitle,
      fixedColumns: {
        left: parseInt(String(this.tableConfig?.leftFreezeUptoColumn || '0')),
        right: parseInt(String(this.tableConfig?.rightFreezeFromColumn || '0'))
      },
      isChildPage: this.isChildPage,
      childPageLength: this.childPageLimit || 10,
      parentId: '',
      uniqueIdentifier: this.tableConfig?.uniqueIdentifier || null,
      defaultSearch: true,
      mapper: {},
      emptyTableMsg: this.gridEmptyMsg,
      displayActiveFilter: this.deactivateRecords && (this.displayFilterIn === 'TABLE_SETTINGS' || this.displayFilterIn === 'HIDE_FILTER'),
      fromDetailPage: this.fromDetailPage,
      restoredpage: this.currentPaginationStart,
      isChildIsInDetailPopup: this.dynamicDialogConfigFromDetailPage?.popup,
      onRowMenuClick: () => {
      },
      onRowSelect: (selectedRows: any, id: any) => {
        this.getSelectedvalues(selectedRows, id);
      },
      onRowDeselect: (selectedRows: any) => {
        this.getSelectedvalues(selectedRows, '');
      },
      onRowClick: (event: any, id: string, data: any) => {
        this.onUpdate(id, event, data);
      },
      drawCallback: (settings: any, apiScope: any, gridProps: any) => {
        if (this.currentPaginationStart != gridProps?.params.start) {
          this.currentPaginationStart = gridProps?.params.start;
        }
        this.onDrawCallback(settings, apiScope);
      },
      onAfterServiceRequest: (data: any) => {
        this.onAfterServiceRequest(data)
      },
      onHyperLinkClick: () => {
        //  this.openHyperLink(event,col,rowdata)
      },
      onActiveFilterSelection: (data: any) => {
        this.onFilterSelectionClick(data);
      }
    };
    if (this.deactivateRecords && this.displayFilterIn) {
      gridConfigData.searchParams = { isactive: true };
    }
    return gridConfigData;
  }

  onAfterServiceRequest(data: any) {
    this.clearSelectedValues();
    // Callback function for getting Datatable data 
    // console.log(data)
  }

  onDrawCallback(settings: any, apiScope: any) {
    // Callback function, which is called every time DataTables performs a draw
  }

  onFilterSelectionClick(event: any = AppConstants.softDeleteFilterDefaultValue, onPageLoad: Boolean = false) {
    this.filterActions = [];
    this.filterActions['hideActions'] = [];
    this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children) || [];
    this.actionBarConfig?.forEach((actionConfig: any) => {
      if ((event == 'ACTIVE_RECORDS_ONLY' && actionConfig?.action == 'activate') || (event == 'INACTIVE_RECORDS_ONLY' && actionConfig?.action == 'deactivate') || (!this.softDeleteFilterConfig.showFilter && (actionConfig?.action == 'activate' || actionConfig?.action == 'deactivate'))) {
        this.filterActions.hideActions.push(actionConfig.buttonId);
      }
    })
    if (!onPageLoad) {
      this.gridConfig.ajaxUrl = TenantDomainConfigApiConstants.getDatatableData;
      if (event == "INACTIVE_RECORDS_ONLY") {
        this.isActiveFilter = false;
      } else if (event == "ALL_RECORDS") {
        this.isActiveFilter = null;
      } else {
        this.isActiveFilter = true;
      }
      if (!environment.prototype) {
        this.onRefresh()
      }
    }
    this.softDeleteFilterConfig['softDeleteFilterValue'] = event;
  }

  clearSelectedValues() {
    this.selectedValues = [];
    this.actionButtonEnableDisable();
  }

  getColumns() {
    const json1 = this.tableConfig.children || [];
    let merged = [];
    for (let i = 0; i < json1.length; i++) {
      if (json1[i].mapping?.length > 0) {
        json1[i].orderable = false;
      }
      merged.push({
        ...json1[i]
      });
    }
    return merged;
  }

  getButtonConfig(btn: any) {
    return {
      action: btn.action,
      confirmationTitle: btn.confirmationTitle || this.translateService.instant('Confirmation'),
      confirmationText: btn.confirmationText || 'Do you want to perform the action?',
      fields: btn.fields || { "children": [] },
      confirmButton: btn.confirmationButtonText,
      rejectButton: btn.cancelButtonText,
      values: (this.responseData?.filter((o: any) => o.sid == this.selectedValues[0]))[0]
    }
  }

  toShowRecords(params?: any) {
    let searchDataValues = Object.keys(params?.search || {});
    let mapFields = Object.keys(params?.mapper || {});

    const mapConfigFields = this.mapConfig[this.componentId]?.map((config: { listField: any, listType: string }) => {
      if (config.listType?.toLowerCase() !== 'pagevariable') {
        return config.listField;
      }
      return null;
    }).filter((field: any) => field !== null) || [];
    const missingMapConfigFields = mapConfigFields.filter((field: string) => !mapFields.includes(field));

    this.showonFilter = this.queryViewList || (this.standardGrid && mapConfigFields.length > 0 && this.fromDetailPage);

    // Set the grid empty message based on the filter checks
    this.setGridEmptyMessage(searchDataValues, missingMapConfigFields, mapFields);

    // Update gridConfig with the appropriate empty table message
    this.gridConfig['emptyTableMsg'] = this.gridEmptyMsg;
  }

  setGridEmptyMessage(searchDataValues: string[], missingMapConfigFields: string[], mapFields: any) {
    // Check for missing map config fields first
    if (this.mapConfig[this.componentId]?.length > 0) {
      if (missingMapConfigFields.length > 0)
        this.gridEmptyMsg = `${this.translateService.instant("To_view_the_records_COM_please_fill_in_the_field_OPENPARAN_s_CLOSEPARAN__COLON")}
         ${missingMapConfigFields.join(', ').replace(/,(?=[^,]*$)/, ', and')}.`;
      else
        this.gridEmptyMsg = this.translateService.instant('No_Data_Available')
    }
    // Default message if no data is available
    else {
      this.gridEmptyMsg = this.translateService.instant('No_Data_Available')
    }
  }

  /**
     * Retrieves a list of services to be fired based on the configuration and data.
     * @returns {Observable<any[]>} An observable that emits an array of responses from the services.
     */
  getListofServicesTobeFired(): Observable<any[]> {
    return new Observable(observer => {
      let autosuggestConfig: any = {};
      const observables: Observable<any>[] = [];
      // Assign responses to the respective controls
      this.assignReponseToControls(observables, autosuggestConfig, observer);
    });
  }

  /**
   * Assigns responses from the observables to the respective form controls.
   * @param observables - Array of observables for the services.
   * @param autosuggestConfig - Object containing autosuggest configurations.
   * @param observer - Observer to emit the responses.
   */
  assignReponseToControls(observables: Observable<any>[], autosuggestConfig: any, observer: any) {
    if (observables.length > 0) {
      const sub = forkJoin(observables).subscribe((responses: any[]) => {
        responses.forEach((res: any, index: number) => {
          const property = Object.keys(autosuggestConfig)[index];
          const con = autosuggestConfig[property];
          if (!res || res.length <= 0) return; // Skip processing if there was an error
          const tempDisplay: any[] = [];
          if (res.length === 1) {
            const filteredResponse = res[0] || {};
            con.displayFields?.forEach((obj: any) => tempDisplay.push(filteredResponse[obj.name]));
            filteredResponse['displayField'] = tempDisplay.join('_');
            this.tableSearchControls.get(property)?.patchValue(filteredResponse);
            this.filter.advancedSearch = { ...this.tableSearchControls.getRawValue() };
          }
        });
        observer.next(responses); // Emit the responses
        observer.complete(); // Complete the observable
      });
      this.subscriptions.push(sub);
    } else {
      observer.next([]);
      observer.complete();
    }
  }

  loadGridData() {
    let gridSubscription: any;
    if (environment.prototype && this.tableConfig.children?.length > 0) {
      gridSubscription = this.tenantDomainConfigService.getProtoTypingData().subscribe((data: any) => {
        this.gridData = [...this.gridData, ...data];
        this.isPageLoading = false;
      });
    }
    else {
      this.gridData = []
    }
  }

  onUpdate(id: any, event?: any, data?: any) {
    let qparams: any = {};
    if (!this.tableConfig.detailPage?.url) return;
    qparams['id'] = id;
    this.appUtilBaseService.navigateWithQueryParams(qparams, this.tableConfig.detailPage.url)
  }

  onTenantDropdownShow(event: any){
    this.tenantDomainConfigService.getTenants().subscribe((response: any) => {
      this.tenants = response;
      this.appLoaderService.hide();
    });
  }

  onInit() {
    if (this.deactivateRecords && this.displayFilterIn) {
      this.leftActionBarConfig.children.push(this.softDeleteConfig);
    }
    this.getListofServicesTobeFired().subscribe(() => {
      this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
      this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
      this.loadGridData();
      const params = this.assignTableParams();
      this.toShowRecords(params);
      this.gridConfig = this.getGridConfig();
      this.selectedColumns = this.gridConfig.columns;
      this.combinedActionConfig = this.leftActionBarConfig?.children ?? [];
      if (this.deactivateRecords && this.displayFilterIn) {
        this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children) || [];
        this.actionBarConfig?.forEach((actionConfig: any) => {
          if ((actionConfig?.action == 'activate') || (!this.softDeleteFilterConfig.showFilter && (actionConfig?.action == 'activate' || actionConfig?.action == 'deactivate'))) {
            this.filterActions.hideActions.push(actionConfig.buttonId);
          }
        })
        this.actionButtonEnableDisable();
      }
      this.appLoaderService.hide();
    });
    setTimeout(() => {
      this.appLoaderService.hide();
    }, 2000);
  }

  onDestroy() {
    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());

  }

  onChanges() { }

}

