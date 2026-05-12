import { Component } from '@angular/core';
import { Directive, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TenantDomainConfigService } from '../tenant-domain-config.service';

import { Location } from '@angular/common';
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { AppLoaderService } from '@baseapp/app-loader.service';
import { AppBaseService } from '@baseapp/app.base.service';
import { BaseService } from '@baseapp/base.service';
import { UploaderService } from '@baseapp/upload-attachment.service';
import { environment } from '@env/environment';
import { ActionItem } from '@libsrc/action-bar/action-bar.component';
import { BreadcrumbService } from '@libsrc/breadcrumb/breadcrumb.service';
import { ConfirmationPopupComponent } from '@libsrc/confirmation/confirmation-popup.component';
import { CustomValidatorService } from '@libsrc/validators/customValidator.service';
import { Observable, Subscription, debounceTime, distinctUntilChanged, forkJoin, fromEvent, map, of } from 'rxjs';


@Directive({})
export class TenantDomainConfigDetailBaseComponent {

  isSearchFocused: boolean = false;
  showBreadcrumb = AppConstants.showBreadcrumb;
  confirmationReference: any;

  id: any;
  isMobile: boolean = AppConstants.isMobile;
  combinedActionConfig: any = [];
  errorfields: any = {};
  backupData: any = {};
  data: any = {};
  formErrors: any = {};
  inValidFields: any = {};
  formFieldConfig: any = {};
  securityJson: any = {
  }
  formConfig = {};
  actionButtons: ActionItem[] = [];
  wizardItems: any = [];
  currentUserData: any;
  selectedItems: any = {};
  isFormValueChanged: boolean = false;
  mandatoryFields: any = {};
  validatorsRetained: any = {};
  isSaveResponseReceived: boolean = false;
  formSecurityConfig: any = {};
  enableReadOnly = AppConstants.enableReadOnly;
  showScrollSpy = AppConstants.showScrollSpy;
  isRowSelected: boolean = true;
  isPrototype = environment.prototype;
  isList = false;
  detailPageIgnoreFields: any = [];
  autoSuggestPageNo: number = 0;
  complexAutoSuggestPageNo: number = 0
  fieldEditMode: any = {};
  conditionalActions: any = {
    disableActions: [],
    hideActions: []
  }
  actionBarConfig: any = [];
  subscriptions: Subscription[] = [];
  isComponentInitiated: boolean = false;
  currency = AppConstants.currency;
  currencyDisplay = AppConstants.currencyDisplay;
  defaultLocale: string = AppConstants.defaultLocale;
  calculationError: any = {};
  public validators: any = {};
  public errorMessages: any = {};
  fileErrorMessages: any = {}
  inputText: any = '';
  defaultActions = ['save', 'cancel', 'refresh', 'back', 'save_and_close'];
  referenceData: any = {};
  displayDataDetails: any = {};
  queryParams: any = {};
  showForm: boolean = true;
  filtersEmptyMsg: string = '';
  tableaccess: boolean = true;
  filterActions: any = {
    hideActions: []
  }
  hideListPageTitle: boolean = false;
  saveTriggered: boolean = false;
  isChildPage: boolean = false;
  tenants: any[] = [];

  public domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  public domainMaxLength = 253;
  public domainLabelMaxLength = 63;

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
      "detailPagePopupWidth": 70,
      "outline": false,
      "children": [{
        "visibility": "show",
        "buttonStyle": "curved",
        "confirmationText": "confirm",
        "label": "Save",
        "type": "button",
        "visiblity": "show",
        "beforeAction": "none",
        "detailPagePopupWidth": 70,
        "outline": false,
        "buttonType": "icon_on_left",
        "autoFillLookup": false,
        "showOn": "both",
        "displayAsToggleSwitch": false,
        "enableOnlyIfRecordSelected": false,
        "buttonId": "SavebuttonId0",
        "buttonEnabled": "yes",
        "action": "save",
        "confirmationTitle": "confirmation",
        "hideListPageTitle": false,
        "conditionForButtonEnable": "",
        "fields": [],
        "confirmationButtonText": "yes",
        "cancelButtonText": "no"
      }, {
        "visibility": "show",
        "buttonStyle": "curved",
        "confirmationText": "confirm",
        "label": "Cancel",
        "type": "button",
        "visiblity": "show",
        "beforeAction": "none",
        "detailPagePopupWidth": 70,
        "outline": false,
        "buttonType": "icon_on_left",
        "autoFillLookup": false,
        "showOn": "both",
        "displayAsToggleSwitch": false,
        "enableOnlyIfRecordSelected": false,
        "buttonId": "CancelbuttonId1",
        "buttonEnabled": "yes",
        "action": "cancel",
        "confirmationTitle": "confirmation",
        "hideListPageTitle": false,
        "conditionForButtonEnable": "",
        "fields": [],
        "confirmationButtonText": "yes",
        "cancelButtonText": "no"
      }],
      "autoFillLookup": false,
      "displayAsToggleSwitch": false,
      "displayCount": "2",
      "hideListPageTitle": false,
      "label": "Button_Group",
      "type": "buttonGroup"
    }],
    "type": "actionBar"
  }

  detailFormConfig: any = {
    "disabledFieldsByLookup": [],
    "columns": "2",
    "type": "form",
    "detailPagePopupWidth": 70,
    "outline": false,
    "children": [{
      "allowEditing": "no",
      "fieldName": "domain",
      "data": "",
      "isQueryView": false,
      "isPrimaryKey": true,
      "label": "domain",
      "type": "formField",
      "mandatory": "yes",
      "field": "domain",
      "transient": false,
      "uiType": "text",
      "name": "domain",
      "fieldType": "string",
      "allowViewing": "yes",
      "maxLength": 253,
      "fieldId": "domain"
    }, {
      "allowEditing": "no",
      "fieldName": "organization",
      "data": "",
      "isQueryView": false,
      "isPrimaryKey": true,
      "label": "organization",
      "type": "formField",
      "mandatory": "no",
      "field": "organization",
      "transient": false,
      "uiType": "text",
      "name": "organization",
      "fieldType": "string",
      "allowViewing": "yes",
      "maxLength": 50,
      "fieldId": "organization"
    }, {
      "allowEditing": "yes",
      "fieldName": "tenants",
      "data": "",
      "isQueryView": false,
      "isPrimaryKey": false,
      "label": "tenants",
      "type": "formField",
      "mandatory": "yes",
      "field": "tenants",
      "transient": false,
      "uiType": "checkbox",
      "name": "tenants",
      "fieldType": "string",
      "allowViewing": "yes",
      "maxLength": 50,
      "fieldId": "tenants"
    }],
    "autoFillLookup": false,
    "displayAsToggleSwitch": false,
    "tableId": "",
    "hideListPageTitle": false,
    "actions": {
      "read": {
        "App Admin": {
          "access": "yes"
        }
      },
      "activate": {
        "App Admin": {
          "access": "yes"
        }
      },
      "changelog": {
        "App Admin": {
          "access": "yes"
        }
      },
      "update": {
        "App Admin": {
          "access": "yes"
        }
      },
      "create": {
        "App Admin": {
          "access": "yes"
        }
      },
      "delete": {
        "App Admin": {
          "access": "yes"
        }
      },
      "deactivate": {
        "App Admin": {
          "access": "yes"
        }
      }
    },
    "accordionOnFormSection": "no",
  }

  pageViewTitle: string = 'Tenant_Domain_Configuration_Detail';

  public tenantDomainConfigService = inject(TenantDomainConfigService);
  public appUtilBaseService = inject(AppUtilService);
  public translateService = inject(TranslateService);
  public messageService = inject(MessageService);
  public confirmationService = inject(ConfirmationService);
  public dialogService = inject(DialogService);
  public domSanitizer = inject(DomSanitizer);
  public activatedRoute = inject(ActivatedRoute);
  public breadcrumbService = inject(BreadcrumbService);
  public appBaseService = inject(AppBaseService);
  public appLoaderService = inject(AppLoaderService);
  public router = inject(Router);
  public appGlobalService = inject(AppGlobalService);
  public customValidatorService = inject(CustomValidatorService);
  public uploaderService = inject(UploaderService);
  public baseService = inject(BaseService);
  public location = inject(Location);
  public dynamicDialogConfig = inject(DynamicDialogConfig, { optional: true });
  public dynamicDialogRef = inject(DynamicDialogRef, { optional: true });

  detailFormControls: UntypedFormGroup = new UntypedFormGroup({
    domain: new UntypedFormControl('', [Validators.maxLength(63)]),
    orgname: new UntypedFormControl('', [Validators.maxLength(255)]),
    tenant: new UntypedFormControl('')
  });

  onSave(isToastNotNeeded?: boolean, actionName?: string) {
    this.detailFormControls.get('domain')?.setValue(this.detailFormControls.get('domain')?.value.trim().toLowerCase());
    if (this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true) && this.detailFormControls.status == 'VALID') {
      this.showMessage({ severity: 'info', summary: '', detail: this.translateService.instant('No_changes_available_to_save') });
      return;
    }
    if (this.checkValidations() && this.validateFields()) {
      let preFormattedData = this.formatFormDataBeforeSave();
      let data = preFormattedData
      const method = this.id ? 'update' : 'create';
      data = { ...this.data, ...data };
      if (this.id) {
        data.sid = this.id
      }

      const requestedObj = this.generateRequestObj(data);
      this.messageService.clear();

      if (environment?.prototype && this.appGlobalService.get('saveAndCloseClicked')) {

        this.dynamicDialogRef?.close();
        this.appGlobalService.write('saveAndCloseClicked', false);

      }
      else {
        const saveSubscription = this.tenantDomainConfigService[method](requestedObj, actionName).subscribe((res: any) => {
          this.onAfterSave(res, data, method, isToastNotNeeded);
        })
        this.subscriptions.push(saveSubscription);
      }
    }
  }

  validateFields() {
    const newDomain = (this.detailFormControls.get('domain')?.value || '').trim().toLowerCase();
    const selectedTenant = this.detailFormControls.get('tenant')?.value;
    const orgname = this.detailFormControls.get('orgname')?.value;
    const domainRegex = this.domainRegex;
    const isInvalid = !domainRegex.test(newDomain);
    const isDomainTooLong = newDomain.length > this.domainMaxLength;
    const labelsForDomains = newDomain.split('.');
    const isLabelTooLong = labelsForDomains.some((label: any) => label.length > this.domainLabelMaxLength);

    if (selectedTenant == null || selectedTenant == '') {
      this.showMessage({ severity: 'error', summary: 'Error', detail: this.translateService.instant('Tenant_is_required') });
      return false;
    }

    if (orgname != null && String(orgname).trim() !== '') {
      const len = String(orgname).trim().length;
      if (len < 2 || len > 255) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.translateService.instant('Invalid_organization_name_length') });
        return false;
      }
    }

    if (isInvalid || isDomainTooLong || isLabelTooLong) {
      if (newDomain === '') {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.translateService.instant('Domain_name_is_required') });
        return false;
      } else if (isInvalid) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.translateService.instant('Invalid_Domain_name') });
        return false;
      } else if (isDomainTooLong) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.translateService.instant('Invalid_Domain_length') });
        return false;
      } else if (isLabelTooLong) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.translateService.instant('Invalid_Domain_label_length') });
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  onAfterSave(res: any, data: any, method: string, isToastNotNeeded?: boolean) {
    if (AppConstants.isSql && res) {
      for (const property in data) {
        if (res && this.formFieldConfig[property]?.uiType != 'autosuggest') {
          this.data[property] = res[property];
        }
      }
    }
    else {
      this.data = { ...data, ...res };
    }
    this.onAfterSaveResponseAssigned(res, method, isToastNotNeeded);
  }

  onAfterSaveResponseAssigned(res: any, method: string, isToastNotNeeded?: boolean) {
    this.isFormValueChanged = false;
    this.detailFormControls.markAsPristine();
    this.formatRawData();
    this.isSaveResponseReceived = true;
    this.id = res.sid;
    this.setDefaultValues(true);
    this.detailFormControls.get('domain')?.disable();
    if (method === 'create' && !this.dynamicDialogConfig?.data?.popup) {
      // Construct the navigation parameters with only 'id'
      let queryParams: any = { id: this.id };
      const navigationExtras: any = {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,  // Set only the 'id' parameter
        queryParamsHandling: '',  // Clear all existing query parameters
        replaceUrl: true
      };

      // Perform the navigation
      this.router.navigate([], navigationExtras).then(() => {
        this.onInit();  // Assuming this method handles initialization
      });
    }
    if (!isToastNotNeeded) {
      const message = (method == 'update')
        ? this.translateService.instant('Record_Updated_Successfully')
        : this.translateService.instant('Record_Saved_Successfully');

      this.showMessage({ severity: 'success', summary: '', detail: message });
    }

    if (this.appGlobalService.get('saveAndCloseClicked')) {
      this.dynamicDialogRef?.close();
      this.appGlobalService.write('saveAndCloseClicked', false);
    }
    this.saveTriggered = true;
    setTimeout(() => {
      this.saveTriggered = false;
    }, 100);
  }

  actionBarAction(btn: any) {
    let methodName: any = btn.methodName ? btn.methodName : (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof TenantDomainConfigDetailBaseComponent, ' '> = methodName;
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
      const onSave: Exclude<keyof TenantDomainConfigDetailBaseComponent, ' '> = methodName.split('_')[0];
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
    let action: Exclude<keyof TenantDomainConfigDetailBaseComponent, ' '> = methodName;
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

  deleteFiles(splittedData: any) {
    return of(splittedData);
  }
  onBack() {
    this.messageService.clear();
    if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true)) {
      this.location.back();
    } else {
      this.confirmationService.confirm({
        message: this.translateService.instant('Do_you_want_to_discard_all_unsaved_changes_QUESTION'),
        header: this.translateService.instant('Confirmation'),
        icon: 'pipi-info-circle',
        accept: () => {
          this.backupData = this.appUtilBaseService.deepClone(this.detailFormControls.getRawValue());
          this.location.back();
        },
        reject: () => {
        },
      });
    }
  }

  onCancel() {
    this.messageService.clear();
    if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true)) {
      this.showMessage({ severity: 'info', summary: '', detail: this.translateService.instant('No_changes_available_to_cancel') });
    } else {
      this.confirmationService.confirm({
        message: this.translateService.instant('Do_you_want_to_discard_all_unsaved_changes_QUESTION'),
        header: this.translateService.instant('Confirmation'),
        accept: () => {
          const patchData = this.appUtilBaseService.deepClone(this.backupData)
          this.detailFormControls.patchValue(patchData, { emitEvent: false });
        },
        reject: () => {
        },
      });
    }

  }

  initForm() {
    this.currentUserData = this.appGlobalService.getCurrentUserData();
    this.formFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig);
    this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children);
    this.appUtilBaseService.configureValidators(this.detailFormControls, this.formFieldConfig);
    this.getData();
  }

  initFormValidations() {
    // this.detailFormControls.enable({ emitEvent: false });
    this.formValueChanges();
  }

  showMessage(config: any) {
    this.messageService.clear();
    this.messageService.add(config);
  }

  getId() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.id = params['id'];
      this.queryParams = params;
    });
  }

  formValueChanges() {
    this.detailFormControls.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
    )
      .subscribe(() => {

        Object.keys(this.formFieldConfig).forEach(key => {
          const control = this.detailFormControls.get(key);
          if (control?.dirty) {
            control.markAsPristine();
          }
        });
        this.isFormValueChanged = true;
      })
  }

  formatFormDataBeforeSave() {
    let data = this.detailFormControls.getRawValue();
    return data;
  }


  formatRawData() {
    // since this.data cannot be directly used for patch value, doing a deep copy
    // Deep copy converts date into string, so copy is performed before formatting
    let patchData = JSON.parse(JSON.stringify(this.data));
    this.selectedItems = [];
    for (const e in this.formFieldConfig) {
      const ec = this.formFieldConfig[e];
      if (ec.columns && !ec.multipleValues && this.data[ec.name]) {
        for (const e1 in this.data[ec.name]) {
          const ec1 = ec[e1];
          if (this.data[ec.name]) {
            this.data[ec.name][ec1.name] = this.bindData(this.data[ec.name][ec1.name], ec1, ec.name);
            patchData[ec.name][ec1.name] = this.bindData(patchData[ec.name][ec1.name], ec1, ec.name);
          }
        }
      }
      else if (ec.columns && ec.multipleValues && this.data[ec.name]) {
        this.data[ec.name]?.map((o: any, index: number) => {
          for (const e1 in o) {
            const ec1 = ec[e1];
            if (this.data[ec.name]) {
              this.data[ec.name][index][ec1.name] = this.bindData(this.data[ec.name][index][ec1.name], ec1, ec.name, index);
              patchData[ec.name][index][ec1.name] = this.bindData(patchData[ec.name][index][ec1.name], ec1, ec.name, index);
            }
          }
        })
      }

      else if (!ec.columns && this.data[ec.name]) {
        this.data[ec.name] = this.bindData(this.data[ec.name], ec);
        patchData[ec.name] = this.bindData(patchData[ec.name], ec);
      }

    }

    // const patchData = JSON.parse(JSON.stringify(this.data));
    this.detailFormControls.patchValue(patchData, { emitEvent: true });
    //this.bindLookupOnInit();
    this.backupData = this.appUtilBaseService.deepClone(this.detailFormControls.getRawValue());
  }


  bindData(data: any, ele: any, parentEle?: string, index?: number) {
    if (ele.fieldType == 'Date' && data) {
      const formattedDate = new Date(data);
      return formattedDate;
    }
    return data;
  }


  scrolltoTop() {
    const tracker = (<HTMLInputElement>document.getElementsByClassName('main-content')[0])
    let windowYOffsetObservable = fromEvent(tracker, 'scroll').pipe(map(() => {
      return Math.round(tracker.scrollTop);
    }));
    const headerHeight: any = $('#header-container').outerHeight(true);
    const titleBarheight: any = $('#title-bar').outerHeight(true);

    windowYOffsetObservable.subscribe((scrollPos: number) => {
      if (scrollPos >= titleBarheight) {
        $('.wizard-container .p-tieredmenu').animate({
          top: headerHeight, marginTop: '10px'
        }, 0);
      }
      else {
        $('.wizard-container .p-tieredmenu').animate({
          top: headerHeight + titleBarheight
        }, 0);
      }
    })
  }

  generateRequestObj(data: any) {
    const props = Object.keys(data);
    let requestedObj: any = {};
    props.forEach((o: any) => {
      if (this.detailFormControls.controls[o] instanceof FormGroup && !this.formFieldConfig[o].multiple) {
        data[o] = this.configureEmptyValuestoNull(data[o])
      }
      else if (this.detailFormControls.controls[o] instanceof FormGroup && this.formFieldConfig[o].multiple) {
        data[o].map((k: any, index: number) => { data[o][index] = this.configureEmptyValuestoNull(data[o][index]) })
      }
    })
    requestedObj = this.configureEmptyValuestoNull(data);
    return requestedObj;
  }

  configureEmptyValuestoNull(data: any) {
    const value = Object.keys(data).reduce((acc: any, key: string) => {
      acc[key] = data[key] === '' || (Array.isArray(data[key]) && data[key].length == 0) ? null :
        data[key]; return acc;
    }, {})
    return value;
  }

  /**
* Sets default values for the form fields based on the provided configuration.
* 
* @param {boolean} [edit] - Optional parameter to determine if the form is in edit mode. 
*                           If `edit` is true, it processes only transient fields. 
*                           If `edit` is false, it processes all fields.
*/
  setDefaultValues(edit?: boolean) {
    for (const ele in this.formFieldConfig) {
      if (this.formFieldConfig[ele]?.transient && edit || !edit) {
        if (this.formFieldConfig[ele].defaultVal && (this.formFieldConfig[ele].uiType === 'select' || this.formFieldConfig[ele].uiType === 'checkboxgroup' || this.formFieldConfig[ele].uiType === 'radio')) {
          let defaultValue: any = (this.formFieldConfig[ele].defaultVal);
          let defaultLabel: any;
          if (typeof defaultValue == 'string') {
            defaultLabel = (defaultValue?.trim()?.replace(/ /g, "_"))?.toUpperCase()
          } else if (Array.isArray(defaultValue)) {
            defaultValue?.forEach((obj: any, index: any, a: any) => {
              a[index] = (obj?.trim()?.replace(/ /g, "_"))?.toUpperCase();
            })
            defaultLabel = defaultValue
          } else {
            defaultLabel = defaultValue
          }
          if (this.formFieldConfig[ele].multiple || this.formFieldConfig[ele].uiType === 'checkboxgroup' || Array.isArray(defaultValue)) {
            this.detailFormControls.controls[ele].patchValue(defaultLabel, { emitEvent: true });
            this.backupData[ele] = Object.assign([], defaultLabel);
          } else {
            this.detailFormControls.controls[ele]?.patchValue(defaultLabel, { emitEvent: true });
            this.backupData[ele] = defaultLabel;
          }
        }
        else if ((typeof this.formFieldConfig[ele]?.defaultVal === 'string'
          ? this.formFieldConfig[ele]?.defaultVal?.trim() !== ''
          : true) && this.formFieldConfig[ele].defaultVal !== undefined && this.formFieldConfig[ele].defaultVal !== null) {
          const defaultValue = (this.formFieldConfig[ele].defaultVal);
          this.detailFormControls.controls[ele].patchValue(defaultValue, { emitEvent: true });
          this.backupData[ele] = defaultValue;
        }
      }
    }
  }

  checkValidations(): boolean {
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    if (!this.appUtilBaseService.validateNestedForms(this.detailFormControls, this.formErrors, finalArr, this.inValidFields, this.formFieldConfig)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), life: 5000 });
      }
      return false;
    }
    if (this.detailFormConfig.children) {
      let multComp = this.detailFormConfig.children.filter((ele: any) => ele.multipleValues && ele.columns);
      if (multComp.length) {
        let mulFormErrors: string[] = [];
        multComp.forEach((config: any) => {
          let colnames = config.columns.filter((col: any) => col.name !== 'jid').map((col: any) => col.name);
          let values = this.detailFormControls.value[config.field];
          values = values.filter((row: any) => {
            return Object.keys(row) && Object.keys(row).find(key => colnames.includes(key));
          });
          this.detailFormControls.get(config.field)?.patchValue(values);
          mulFormErrors = [...mulFormErrors, ...this.appUtilBaseService.validateMultipleComp(this.detailFormControls.value, config)];
        });
        if (mulFormErrors.length) {
          this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(mulFormErrors), life: 5000 });
          return false;
        }
      }
    }
    return true;
  }

  getButtonConfig(btn: any) {
    return {
      action: btn.action,
      confirmationTitle: btn.confirmationTitle || this.translateService.instant('Confirmation'),
      confirmationText: btn.confirmationText || 'Do you want to perform the action?',
      fields: btn.fields || { "children": [] },
      confirmButton: btn.confirmationButtonText,
      rejectButton: btn.cancelButtonText,
      values: this.detailFormControls.getRawValue()
    }
  }

  /**
* Retrieves a list of services to be fired based on the configuration and data.
* This method handles auto-suggest fields and prepares observables for fetching data.
* 
* @param {boolean} [newRec] - Indicates if the operation is for a new record.
* @returns {Observable<any[]>} - An observable that emits an array of responses from the services.
*/
  getListofServicesTobeFired(newRec?: boolean): Observable<any[]> {
    return new Observable(observer => {
      let autosuggestConfig: any = {};
      const observables: Observable<any>[] = [];

      // Assign responses to the respective controls
      this.assignReponseToControls(observables, autosuggestConfig, observer);
    });
  }

  /**
   * Assigns responses from the observables to the respective form controls.
   * 
   * @param {Observable<any>[]} observables - Array of observables for fetching data.
   * @param {any} autosuggestConfig - Configuration for auto-suggest fields.
   * @param {any} observer - Observer to emit the responses.
   */
  assignReponseToControls(observables: Observable<any>[], autosuggestConfig: any, observer: any) {
    if (observables.length > 0) {
      const sub = forkJoin(observables).subscribe((responses: any[]) => {
        responses.forEach((res: any, index: number) => {
          const property = Object.keys(autosuggestConfig)[index];
          const con = autosuggestConfig[property];
          this.referenceData[con.autoSuggestServiceName] = res; // Save the data for reference
          if (!res || res.length <= 0) return; // Skip processing if there was an error

          const tempDisplay: any[] = [];
          if (res.length == 1) { // If there is only one response, select it by default
            const filteredResponse = res[0] || {};
            con.displayFields?.forEach((obj: any) => tempDisplay.push(filteredResponse[obj.name]));
            this.displayDataDetails[property] = tempDisplay.join('_');
            filteredResponse['displayField'] = tempDisplay.join('_');
            filteredResponse['referenceField'] = con.parentField ? filteredResponse[con.parentField] : filteredResponse['displayField'];
            this.data[property] = filteredResponse;
            if (con.autoFillField) {
              this.isFormValueChanged = true;
            }
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

  getData() {
    if (environment.prototype && this.id) {
      const params = {
        sid: this.id
      };
      this.tenantDomainConfigService.getProtoTypingDataById(params).subscribe((res: any) => {
        res = JSON.parse(JSON.stringify(res))
        this.data = res;
        this.backupData = res;
        this.detailFormControls.patchValue(this.backupData);
        this.setDefaultValues(true);
        this.detailFormControls.get('domain')?.disable();
      });
    } else if (this.id) {
      const params = {
        sid: this.id
      };
      const dataSubscription = this.tenantDomainConfigService.getById(params).subscribe((res: any) => {
        this.data = res || {};
        this.getListofServicesTobeFired().subscribe(() => {
          this.formatRawData();
          this.setDefaultValues(true);
          this.detailFormControls.get('domain')?.disable();
        });
      });
      this.subscriptions.push(dataSubscription);
    }
    else {
      this.setDefaultValues();
      this.getListofServicesTobeFired(true).subscribe(() => {
        this.formatRawData();
      });
      this.backupData = this.appUtilBaseService.deepClone(this.detailFormControls.getRawValue());
    }
  }

  onTenantDropdownShow(event: any){
    this.tenantDomainConfigService.getTenants().subscribe((response: any) => {
      this.tenants = response;
      this.appLoaderService.hide();
    });
  }

  onInit() {
    this.appLoaderService.show();
    this.tenantDomainConfigService.getTenants().subscribe((response: any) => {
      this.tenants = response;
      this.appLoaderService.hide();
    });
    this.isComponentInitiated = true;
    this.getId();
    this.initForm();
    this.initFormValidations();
    localStorage.setItem("formChanged", JSON.stringify(false));
    this.detailFormControls.valueChanges.subscribe(() => {
      if ((Object.keys(this.backupData).length == 0 && this.id) || (this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true))) {
        localStorage.setItem("formChanged", JSON.stringify(false));
      }
      else {
        localStorage.setItem("formChanged", JSON.stringify(true));
      }
    });
  }

  onDestroy() {
  }

  onAfterViewInit() {
    this.isComponentInitiated = false;
    this.scrolltoTop();
    this.appUtilBaseService.setCurrentPageGlobally();
  }

  onChanges(changes: any) {
  }

}
