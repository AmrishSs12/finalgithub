import { Table1Service } from '../table1.service';
import { Table1Base} from '../table1.base.model';
import { Directive, ElementRef, EventEmitter, Input, Output, SecurityContext, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeLogsComponent } from '@libsrc/change-logs/change-logs.component';
import * as _ from 'lodash';

import { Table1ApiConstants } from '@baseapp/table1/table1/table1.api-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@libsrc/confirmation/confirmation-popup.component';
import { WorkflowConfirmationPopupComponent } from '@libsrc/confirmation/workflow-confirmation-popup.component';
import { CustomValidatorService } from '@libsrc/validators/customValidator.service';
import { BreadcrumbService } from '@libsrc/breadcrumb/breadcrumb.service';
import { AppGlobalService } from '@baseapp/app-global.service';
import { AppLoaderService } from '@baseapp/app-loader.service';
import { environment } from '@env/environment';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AppConstants } from '@app/app-constants';
import { UploaderService } from '@baseapp/upload-attachment.service';
import { WorkflowHistoryComponent } from '@libsrc/workflow-history/workflow-history.component';
import { distinctUntilChanged, switchMap, Observable, Subject, debounceTime, fromEvent, catchError, combineLatest, of, Observer, forkJoin, Subscription, map } from 'rxjs';
import { ActionItem } from '@libsrc/action-bar/action-bar.component';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AppBaseService } from '@baseapp/app.base.service';
import { WorkflowSimulatorComponent } from '@libsrc/workflow-simulator/workflow-simulator.component';
import { BaseService } from '@baseapp/base.service';

@Directive(
{
	providers:[MessageService, ConfirmationService, DialogService, DynamicDialogConfig]
}
)
export class Table1DetailBaseComponent{
	
	showGrid:boolean = true;



	isSearchFocused:boolean = false;
showBreadcrumb = AppConstants.showBreadcrumb;
mappedFiltersDisplay:any ={};
tooltipText:string =''


	
	comments: string ='';
confirmationReference:any;
wfNotInitiated:boolean = false;

		id: any;
pid:any;
isMobile: boolean = AppConstants.isMobile;  
combinedActionConfig:any =[];
errorfields: any = {};           
backupData:any = {};
hiddenFields:any = {};
data:any = {};
formErrors:any = {};
inValidFields:any = {};
formFieldConfig:any = {};
securityJson:any = {
}
formConfig = {};     
actionButtons:ActionItem[] = [];  
wizardItems:any = [];
currentUserData:any;
selectedItems:any ={};
workflowType = "";
workFlowEnabled = "false";
workFlowInitialState = "";
workFlowField = "";
isRCWorkflowChosen: boolean = false;

workflowActions:any ={
    disableActions:[],
    enableActions:[],
    hideActions:[]
  };
  isFormValueChanged: boolean = false;
  mandatoryFields:any ={};
  validatorsRetained:any ={};
  isSaveResponseReceived:boolean = false;
  isSaveSuccess:boolean = false;
  formSecurityConfig:any = {};
  enableReadOnly = AppConstants.enableReadOnly;
 showScrollSpy = AppConstants.showScrollSpy;
isRowSelected:boolean = true; 
isPrototype = environment.prototype;
isList = false;
detailPageIgnoreFields:any=[];
autoSuggestPageNo:number = 0;
complexAutoSuggestPageNo:number = 0
  fieldEditMode: any = {};
conditionalActions:any ={
  disableActions:[],
  hideActions:[]
}
actionBarConfig:any =[];
dateFormat: string = AppConstants.calDateFormat;
subscriptions: Subscription[] = [];
activeTabIndexes: any = {};
 showWorkflowSimulator:boolean = false;
roles:any ={};
isComponentInitiated:boolean =false;
timeFormatPrimeNG: string = AppConstants.timeFormatPrimeNG;
dateFormatPrimeNG: string = AppConstants.dateFormatPrimeNG ;
minFraction = AppConstants.minFraction;
maxFraction = AppConstants.maxFraction;
currency = AppConstants.currency;
currencyDisplay = AppConstants.currencyDisplay;
defaultLocale: string = AppConstants.defaultLocale; 
calculationError:any ={};
public validators:any ={};
public errorMessages:any = {};
 deletedAttachments:any ={};
fileErrorMessages:any ={}
inputText:any ='';
defaultActions= ['save','cancel','delete','refresh','back','changelog','workflowhistory','import','export','new','save_and_close'];
currentUserRolesMapping:any ={};
captionConfig: any = {};
 referenceData: any = {};
 displayDataDetails: any = {};
outputMappingFieldsConfig:any ={};
 formattedCaptionData:any = {};
 queryParams:any ={};
  showForm:boolean = true;
  filtersEmptyMsg:string = '';
  tableaccess: boolean = true;
  filterActions: any = {
    hideActions: []
  }
  pageVariableFieldConfig: any = {};

  metaData: any = {};
  hideListPageTitle: boolean = false;
  saveTriggered:boolean = false;
  isPVLoaded: any = {};
  bindPageVariablesSubscriptions: any = [];

	isChildPage:boolean = false;
	queryViewNotAllowedActions:any = [];
	
	leftActionBarConfig : any = {
  "children" : [ {
    "defaultDetailPageEnabled" : false,
    "visibility" : "show",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-arrow-left",
        "value" : "fas fa-arrow-left"
      }
    },
    "confirmationText" : "confirm",
    "label" : "Back",
    "enableLookup" : false,
    "type" : "button",
    "beforeAction" : "none",
    "detailPagePopupWidth" : 70,
    "outline" : false,
    "buttonType" : "icon_on_left",
    "autoFillLookup" : false,
    "showOn" : "both",
    "displayAsToggleSwitch" : false,
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "BackbuttonId0",
    "buttonEnabled" : "yes",
    "action" : "back",
    "confirmationTitle" : "confirmation",
    "hideListPageTitle" : false,
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  }, {
    "detailPagePopupWidth" : 70,
    "defaultDetailPageEnabled" : false,
    "outline" : false,
    "children" : [ {
      "defaultDetailPageEnabled" : false,
      "confirmationText" : "confirm",
      "type" : "button",
      "beforeAction" : "none",
      "outline" : false,
      "buttonType" : "icon_on_left",
      "showOn" : "both",
      "displayAsToggleSwitch" : false,
      "buttonId" : "SavebuttonId0",
      "buttonEnabled" : "yes",
      "action" : "save",
      "conditionForButtonEnable" : "",
      "cancelButtonText" : "no",
      "visibility" : "show",
      "buttonStyle" : "curved",
      "label" : "Save",
      "enableLookup" : false,
      "visiblity" : "show",
      "detailPagePopupWidth" : 70,
      "autoFillLookup" : false,
      "enableOnlyIfRecordSelected" : false,
      "confirmationTitle" : "confirmation",
      "hideListPageTitle" : false,
      "fields" : [ ],
      "confirmationButtonText" : "yes"
    }, {
      "defaultDetailPageEnabled" : false,
      "confirmationText" : "confirm",
      "type" : "button",
      "beforeAction" : "none",
      "outline" : false,
      "buttonType" : "icon_on_left",
      "showOn" : "both",
      "displayAsToggleSwitch" : false,
      "buttonId" : "CancelbuttonId1",
      "buttonEnabled" : "yes",
      "action" : "cancel",
      "conditionForButtonEnable" : "",
      "cancelButtonText" : "no",
      "visibility" : "show",
      "buttonStyle" : "curved",
      "label" : "Cancel",
      "enableLookup" : false,
      "visiblity" : "show",
      "detailPagePopupWidth" : 70,
      "autoFillLookup" : false,
      "enableOnlyIfRecordSelected" : false,
      "confirmationTitle" : "confirmation",
      "hideListPageTitle" : false,
      "fields" : [ ],
      "confirmationButtonText" : "yes"
    }, {
      "defaultDetailPageEnabled" : false,
      "confirmationText" : "confirm",
      "type" : "button",
      "beforeAction" : "none",
      "outline" : false,
      "buttonType" : "icon_on_left",
      "showOn" : "both",
      "displayAsToggleSwitch" : false,
      "buttonId" : "ChangelogbuttonId2",
      "buttonEnabled" : "yes",
      "action" : "changelog",
      "conditionForButtonEnable" : "",
      "cancelButtonText" : "no",
      "visibility" : "show",
      "buttonStyle" : "curved",
      "label" : "ChangeLog",
      "enableLookup" : false,
      "visiblity" : "show",
      "detailPagePopupWidth" : 70,
      "autoFillLookup" : false,
      "enableOnlyIfRecordSelected" : false,
      "confirmationTitle" : "confirmation",
      "hideListPageTitle" : false,
      "fields" : [ ],
      "confirmationButtonText" : "yes"
    } ],
    "autoFillLookup" : false,
    "displayAsToggleSwitch" : false,
    "displayCount" : "2",
    "hideListPageTitle" : false,
    "label" : "Button_Group",
    "enableLookup" : false,
    "type" : "buttonGroup"
  } ],
  "type" : "actionBar"
}
	workflowActionBarConfig : any = {
  "detailPagePopupWidth" : 70,
  "defaultDetailPageEnabled" : false,
  "outline" : false,
  "autoFillLookup" : false,
  "displayAsToggleSwitch" : false,
  "hideListPageTitle" : false,
  "label" : "Workflow Action Bar",
  "enableLookup" : false,
  "type" : "workflowActionBar",
  "isWorkflowConfigured" : false
}
	detailCaptionBarConfig : any = {
  "children" : [ ],
  "type" : "captionBar"
}
	detailFormStructureConfig : any = {
  "children" : [ ]
}
	detailViewFormConfig : any = {
  "allowEditing" : "yes",
  "children" : [ {
    "allowEditing" : "yes",
    "name" : "f1",
    "label" : "f1",
    "type" : "formField"
  } ],
  "allowViewing" : "yes"
}
	detailFormConfig : any = {
  "allowEditing" : "yes",
  "defaultDetailPageEnabled" : false,
  "disabledFieldsByLookup" : [ ],
  "columns" : "2",
  "enableLookup" : false,
  "type" : "form",
  "detailPagePopupWidth" : 70,
  "outline" : false,
  "children" : [ {
    "allowEditing" : "yes",
    "fieldName" : "f1",
    "data" : "",
    "isQueryView" : false,
    "isPrimaryKey" : false,
    "label" : "f1",
    "type" : "formField",
    "mandatory" : "no",
    "field" : "f1",
    "transient" : false,
    "uiType" : "text",
    "name" : "f1",
    "isForeignTableField" : false,
    "fieldType" : "string",
    "maxLength" : 50,
    "allowViewing" : "yes",
    "fieldId" : "f1"
  } ],
  "autoFillLookup" : false,
  "displayAsToggleSwitch" : false,
  "tableId" : "8b2c3f37-885e-428d-9208-330e40339ff8",
  "hideListPageTitle" : false,
  "actions" : {
    "read" : {
      "App Admin" : {
        "access" : "yes"
      }
    },
    "update" : {
      "App Admin" : {
        "access" : "yes"
      }
    },
    "changelog" : {
      "App Admin" : {
        "access" : "yes"
      }
    },
    "create" : {
      "App Admin" : {
        "access" : "yes"
      }
    },
    "delete" : {
      "App Admin" : {
        "access" : "yes"
      }
    }
  },
  "allowViewing" : "yes",
  "accordionOnFormSection" : "no",
  "queryViewMapping" : { }
}
	mapConfig : any = { }
	pageVariables : any = {
  "children" : [ ]
}
	pageViewTitle: string = 'table1_Detail';
	
	public table1Service = inject(Table1Service);
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
public dynamicDialogConfig = inject(DynamicDialogConfig);
public dynamicDialogRef = inject(DynamicDialogRef);
		pageVariableControls : UntypedFormGroup = new UntypedFormGroup({
});

		detailFormControls : UntypedFormGroup = new UntypedFormGroup({
	f1: new UntypedFormControl('',[Validators.maxLength(50)]),
});


	onBack(){
	this.messageService.clear();
	if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields), true)){			
     this.location.back();
	}else{
		this.appUtilBaseService.showSaveChangesDialog().subscribe((result) => {
			if (result === 'cancel') {
				// Do nothing, stay on page
			} else if (result === 'dontSave') {
				this.backupData = this.appUtilBaseService.deepClone(this.detailFormControls.getRawValue());
				this.location.back();
			} else if (result === 'save') {
				this.isSaveResponseReceived = false;
				this.onSave(true);
				const checkSaveComplete = setInterval(() => {
					if (this.isSaveResponseReceived) {
						clearInterval(checkSaveComplete);
						if (this.isSaveSuccess) {
							this.location.back();
						}
					}
				}, 100);
			}
		});
	}
}
	onSave(isToastNotNeeded?: boolean, actionName?: string) {
    if (this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true) && this.detailFormControls.status == 'VALID') {
      this.showMessage({ severity: 'info', summary: '', detail: this.translateService.instant('No_changes_available_to_save') });
      return;
    }
    if (this.checkValidations()) {
      const complexData = this.checkUnsavedComplexFields();
      if (complexData.hasUnSavedChanges) {

        complexData.fields.map((o: any) => $($('.' + o + '_editSave-btn')).trigger('click'));
      }
      let preFormattedData = this.formatFormDataBeforeSave();
      let data = this.normalize(preFormattedData)
      const method = this.id ? 'update' : 'create';
      data = { ...this.data, ...data };
      if (this.pid) {
        data.pid = this.pid;
      }
      if (this.id) {
        data.sid = this.id
      }

      const requestedObj = this.generateRequestObj(data);
      this.messageService.clear();
      const attachmentTypes = ['imageCarousel', 'attachments'];
      const attachmentFields = this.detailFormConfig?.children
        .filter((ele: any) => attachmentTypes.includes(ele.uiType))
        .map((item: any) => item.fieldName);
      const splittedData = this.appUtilBaseService.splitFileAndData(data, attachmentFields);

      if (environment?.prototype && this.appGlobalService.get('saveAndCloseClicked')) {

        this.dynamicDialogRef?.close();
        this.appGlobalService.write('saveAndCloseClicked', false);

      }
      else if (Object.keys(splittedData.files).length > 0) {

        const saveSubscription = this.uploadAttachmentsandSaveData(requestedObj, splittedData, actionName).subscribe(
          res => {
            this.onAfterSave(res, data, method, isToastNotNeeded);
          },
          err => { 
            this.onFormUpdateFailure();
          }
        )
        this.subscriptions.push(saveSubscription);
      }
      else {
              const saveSubscription = this.table1Service[method](requestedObj,actionName).subscribe(
                (res:Table1Base) => {
                  this.onAfterSave(res, data, method, isToastNotNeeded);
                },
                (err: any) => {
                  this.onFormUpdateFailure();
                }
              )
            this.subscriptions.push(saveSubscription);
      }
    }
  }

onFormUpdateFailure() {
  this.isSaveResponseReceived = true;
  this.isSaveSuccess = false;
}

       onAfterSave(res: any, data: any, method: string, isToastNotNeeded?: boolean) {
           let anyAutosuggestValueChanged = false;

           if (AppConstants.isSql && res) {

             for (const property in data) {

               if(res && this.formFieldConfig[property]?.uiType !='autosuggest'){
                 this.data[property] = res[property];
               }

               else if (this.formFieldConfig[property]?.uiType === 'autosuggest' && data[property] != res[property]) {

                 anyAutosuggestValueChanged = true;
                 res[property]? this.data[property] = res[property] : this.data[property] = null;

               }

             }
           }
           else {
             this.data = { ...data, ...res };
           }

           if (anyAutosuggestValueChanged) {

             this.getListofServicesTobeFired().subscribe((_responses: any[]) => {
               this.onAfterSaveResponseAssigned(res, method, isToastNotNeeded);
             });

             return;
           }

           this.onAfterSaveResponseAssigned(res, method, isToastNotNeeded);
           this.bindPageVariables();
       }

        onAfterSaveResponseAssigned(res: any, method: string, isToastNotNeeded?: boolean) {
           this.isFormValueChanged = false;
           this.detailFormControls.markAsPristine();
           this.formatRawData();
           this.isSaveResponseReceived = true;
           this.isSaveSuccess = true;
           this.id = res.sid;
           this.metaData = {
              ...this.metaData,
              ...res && {
                sid: res.sid,
                createdBy: res.createdBy,
                createdDate: res.createdDate,
                modifiedBy: res.modifiedBy,
                modifiedDate: res.modifiedDate
              }
            };
           this.tabErrorCount(true);
           this.setDefaultValues(true);
           if (method === 'create') {
          	 this.handleNavigation();
           }
           if (!isToastNotNeeded) {
             const message = (method == 'update')
               ? this.translateService.instant('Record_Updated_Successfully')
               : this.translateService.instant('Record_Saved_Successfully');
               localStorage.setItem("formChanged", JSON.stringify(false));
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

        handleNavigation() {
            if(this.dynamicDialogConfig?.data?.popup){
                // For popup, we need to reload the component with the new ID
                this.data.sid = this.id; // Ensure the data has the new ID
                this.dynamicDialogConfig.data.id = this.id; // Ensure the popupup data has the new ID
                this.onInit(); // Reinitialize the component with proper ID data
                this.enableChildOptions();
            } else {
                // Construct the navigation parameters with only 'id'
                let queryParams:any = { id: this.id, ...this.setPageVariableAfterSave() };
                const navigationExtras: any = {
                relativeTo: this.activatedRoute,
                queryParams:queryParams,  // Set only the 'id' parameter
                queryParamsHandling: '',  // Clear all existing query parameters
                replaceUrl: true
                };

                // Perform the navigation
                this.router.navigate([], navigationExtras).then(() => {
                this.onInit();  // Assuming this method handles initialization
                this.enableChildOptions();  // Enable child options after navigation
                });
            }
        }


        setPageVariableAfterSave() {
            const pageVariables = this.pageVariableControls.getRawValue();
            let queryParams: any = {}
            Object.keys(pageVariables).forEach(key => {
              if (this.queryParams.hasOwnProperty(key)) {
                queryParams[key] = pageVariables[key];
              }
            });
            return queryParams;
          }

uploadAttachmentsandSaveData(data: any, splittedData: any,actionName?:string): Observable<any> {
    const subject$ = new Subject();

    const completeReq = (resData: any,) => {
      resData ? subject$.next(resData) : subject$.error(resData);
      subject$.complete();
    }
    if (!this.id) {
       let saveSubscription: any;
       saveSubscription =  this.table1Service.create(splittedData.data,actionName).subscribe(
        createdData => {
          const data = { ...splittedData.data, ...createdData };
          splittedData.data = data;
          this.id = data.sid;
          if (splittedData.files) {
            this.updateData(splittedData).subscribe(
              updatedData => completeReq(updatedData),
              err => completeReq(null)
            );
          }
        },
        err => completeReq(null))
        this.subscriptions.push(saveSubscription);
    } else {
      const saveSubscription =  this.updateData(splittedData,actionName).subscribe(
        updatedOrg => completeReq(updatedOrg),
        err => completeReq(null)
      );
      this.subscriptions.push(saveSubscription);
    }

    return subject$.asObservable()
  }
  
  updateData(splittedData: any,actionName?:string) {
    const subject$ = new Subject();    
      const updateSubscription = this.deleteFiles(splittedData).subscribe((responseData: any) => {
        this.saveFiles(responseData).subscribe((dataToUpdate: any) => {
          dataToUpdate.data.sid = this.id;
            this.table1Service.update(dataToUpdate.data,actionName).subscribe(
              res => {
                subject$.next(res);
                subject$.complete();
              },
              err => {
                subject$.error(null);
                subject$.complete();
              })
        })
      });
    this.subscriptions.push(updateSubscription);
    return subject$.asObservable()
  }

saveFiles(splittedData: any) {
    const files: any = {};
    const existingfiles: any = {}
    Object.keys(splittedData.files).forEach(key => {
      splittedData.files[key].map((o: any) => {
        if (!o.id) {
          if (!files.hasOwnProperty(key)) {
            files[key] = [];
          }
          files[key].push(o);
        }
        else {
          if (!existingfiles.hasOwnProperty(key)) {
            existingfiles[key] = [];
          }
          existingfiles[key].push(o);
        }
      })
    })
    if (files && Object.values(files).filter((item: any) => (item || [])?.length).length) {
      return new Observable(observer => {
        this.uploaderService.saveAddedFiles(files, this.id, this.detailFormControls).subscribe((res: any) => {
          res.dataToResend = this.mergeExistingFiles(res.dataToResend, existingfiles);
          let fData: any = this.getFiles(res.dataToResend);
          const finalData = { data: { ...splittedData.data, ...fData } };
          if (res.error) {
            let errResponse = res.error;
            const errorArr: any = [];
            Object.keys(res.error).forEach((key) => {
              if (errResponse && errResponse[key]?.error?.MESSAGE) {
                errorArr.push(errResponse[key]?.error?.MESSAGE);
              } else {
                errorArr.push("Failed to upload " + key);
              }
            })
            if (errorArr.length > 0)
              this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(errorArr), life: 5000 });
          }
          observer.next(finalData);
          observer.complete();
        }, (err: any) => {
          observer.error(err);
        });
      });
    }
    if (existingfiles && Object.values(existingfiles).filter((item: any) => (item || [])?.length).length) {
      let fData: any = this.getFiles(existingfiles);
      splittedData.data = { ...splittedData.data, ...fData };
      return of(splittedData);
    }
    else {
      return of(splittedData)
    }
  }


  getFiles(responseData:any){
    let fData:any = {}
    for (const key in responseData) {
      if (responseData[key] instanceof Array) {
        const tempArr = responseData[key].flat();
        fData[key] = (tempArr.filter((n: any, i: any) => tempArr.indexOf(n) === i)).filter(Boolean);
      } else {
        fData[key] = [responseData[key]];
      }
      fData[key]= this.appUtilBaseService.removeImagePreviewProperties(fData[key]);
    }
    return fData;
  }


  mergeExistingFiles(newobj: any, oldobj: any) {
    let data: any = {};
    [oldobj, newobj].map((obj: any) => {
      for (let prop in obj) {
        if (!data.hasOwnProperty(prop)) {
          data[prop] = [];
        }
        data[prop].push(...obj[prop].flat(4));
      }
    })
    return data;
  }
  
  isCreate() {
    const isCreateMode = this.queryParams?.['isCreate'] === 'yes';
    const hasNoQueryParams = Object.keys(this.queryParams || {}).length === 0;
    const hasNoData = Object.keys(this.data || {}).length === 0;
    const isCreateCondition = !this.id && (isCreateMode || (hasNoQueryParams && hasNoData));
    return isCreateCondition;
  }
	actionBarAction(btn: any) {
    let methodName: any = btn.methodName ? btn.methodName : (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof Table1DetailBaseComponent, ' '> = methodName;
   const config = this.getButtonConfig(btn);
    this.appGlobalService.write('saveAndCloseClicked', false);

    if (btn.action === 'custom' && ['navigate_to_member_app', 'navigate_to_suite_app'].includes(btn.onClick)) {
      this.appUtilBaseService.navigateWithContextPath(btn);
      return;
    }

    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      if (btn?.navigationDataMapping?.length > 0) {
        const queryParams: any = {};
        this.passValuesToPage(btn.navigationDataMapping, queryParams);
        this.appUtilBaseService.navigateWithQueryParams({ isCreate: 'yes', ...queryParams }, btn.pageName?.url);
      } else {
        this.router.navigateByUrl(btn.pageName?.url);
      }
    }
    else if(this.defaultActions.includes(btn.action) && btn.action === "save_and_close"){
      const onSave: Exclude<keyof Table1DetailBaseComponent, ' '> = methodName.split('_')[0];
      this.appGlobalService.write('saveAndCloseClicked', true);
      this[onSave](false, undefined);
    }
else if(this.defaultActions.includes(btn.action) && typeof this[action] === "function"){
      this[action]();
    }
    else if (typeof this[action] === "function" && (btn.beforeAction ==='show_confirmation' || btn.beforeAction === 'get_additional_info')) {
      this.showConfirmationPopup(config,btn);
    }
    else if (typeof this[action] === "function"){
      this[action]();
    }
  }

  showConfirmationPopup(config: any, btn: any) {
     const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof Table1DetailBaseComponent, ' '> = methodName;
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
	getWorkflowConfig(workflowInfo?:any) {
    const workFlowInfo:any = (this.id)? this.data?.workflowInfo:workflowInfo;
    const params = {
      workflowType: this.workflowType
    }
    if (this.workFlowEnabled) {
      if (environment.prototype) {
        this.appBaseService.getPrototypingworkflow(this.workflowType).subscribe((res: any) => {
          this.securityJson = res.config;
          this.configureFormOnWorkflow(workFlowInfo);
        });
      } else if (!this.id) {
        this.wfNotInitiated = true;
      }
    }
  }
	onCancel(){
  this.messageService.clear();
  if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields), true)) {
    this.showMessage({ severity: 'info', summary: '', detail: this.translateService.instant('No_changes_available_to_cancel') });
  } else {
    this.confirmationService.confirm({
      message: this.translateService.instant('Do_you_want_to_reset_all_changes_QUESTION'),
      header: this.translateService.instant('Confirmation'),
      icon: 'pi pi-info-circle',
      accept: () => {
        const patchData = this.appUtilBaseService.deepClone(this.backupData)
        this.detailFormControls.patchValue(patchData,{ emitEvent: false });
        localStorage.setItem('formChanged', JSON.stringify(false));
        this.updateAllowedActions();
      },
      reject: () => {
      },
    });
  }

}
	canDeactivate(): Observable<boolean> | boolean {
    if(this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData,this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields),true)){
           return true;
         }
        else{
          return new Observable<boolean>((observer: Observer<boolean>) => {
            this.appUtilBaseService.showSaveChangesDialog().subscribe((result) => {
              if (result === 'cancel') {
                observer.next(false);
                observer.complete();
              } else if (result === 'dontSave') {
                observer.next(true);
                observer.complete();
              } else if (result === 'save') {
                this.isSaveResponseReceived = false;
                this.onSave(true);
                const checkSaveComplete = setInterval(() => {
                  if (this.isSaveResponseReceived) {
                    clearInterval(checkSaveComplete);
                    if (this.isSaveSuccess) {
                      observer.next(true);
                    } else {
                      observer.next(false);
                    }
                    observer.complete();
                  }
                }, 100);
              }
            });
          });
        }
      }
    
onPopupClose() {
    if (this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true)) {
      this.dynamicDialogRef?.close();
    } else {
      this.appUtilBaseService.showSaveChangesDialog().subscribe((result) => {
        if (result === 'cancel') {
          // Do nothing, stay on page
        } else if (result === 'dontSave') {
          this.dynamicDialogRef?.close();
        } else if (result === 'save') {
          this.isSaveResponseReceived = false;
          this.onSave(true);
          const checkSaveComplete = setInterval(() => {
            if (this.isSaveResponseReceived) {
              clearInterval(checkSaveComplete);
              if (this.isSaveSuccess) {
                this.dynamicDialogRef?.close();
              }
            }
          }, 100);
        }
      });
    }
  }

    initForm(){
        if (this.detailFormConfig?.allowViewing === 'no') {
            this.showForm = false;
         }
        this.currentUserData= this.appGlobalService.getCurrentUserData();
        this.formFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig);
        this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children);
        this.captionConfig = this.appUtilBaseService.getControlsFromFormConfig(this.detailCaptionBarConfig);
        this.pageVariableFieldConfig = this.pageVariables?.children ? this.appUtilBaseService.getControlsFromFormConfig(this.pageVariables?.children):{};
        this.appUtilBaseService.configureValidators(this.detailFormControls, this.formFieldConfig);
        this.wizardItems = this.appUtilBaseService.getWizardItemFromFormConfig(this.detailFormStructureConfig, this);
        this.appUtilBaseService.assignInitialValueToPageVariables(this.pageVariables,this.pageVariableControls);
        let  executeEvent = this.appUtilBaseService.invertExecuteOnConfig(this.formFieldConfig);
        this.formFieldConfig = _.merge({}, this.formFieldConfig, executeEvent);
        executeEvent = this.appUtilBaseService.invertExecuteOnPageVariable(this.formFieldConfig);
        this.pageVariableFieldConfig = _.merge({}, this.pageVariableFieldConfig, executeEvent);
        this.getData();
    }
    
    initFormValidations(){
        this.detailFormControls.enable({ emitEvent: false });
        this.hiddenFields = {};
        this.updateAllowedActions();
        this.formValueChanges();
        this.disableDependantFields();
        this.addValidatorsForMinMaxDateValidation();
        this.bindPageVariables();
      }
    
    addValidatorsForMinMaxDateValidation() {
        for (const property in this.formFieldConfig) {
          if ((this.formFieldConfig[property]?.uiType?.toLowerCase() == 'datetime' || this.formFieldConfig[property]?.uiType?.toLowerCase() == 'date') && (this.formFieldConfig[property]?.minDate || this.formFieldConfig[property]?.maxDate)) {
            if (this.formFieldConfig[property]?.minDate) {
              this.detailFormControls.controls[property].addValidators(this.customValidatorService.dateValidator('min', this.formFieldConfig[property]))
            }
            if (this.formFieldConfig[property]?.maxDate) {
              this.detailFormControls.controls[property].addValidators(this.customValidatorService.dateValidator('max', this.formFieldConfig[property]))
            }
          }
        }
      }
    
    showMessage(config:any){
        this.messageService.clear();
        this.messageService.add(config);
    } 
    
    loadActionbar(){
        
    }
    
    loadCaptionbarItems(){
        
    }

  passValuesToPage(mappingValues: any, queryParams: any) {
    mappingValues.forEach((mapping: any) => {
      const { sourceField, targetField, sourceType } = mapping;
      let value: any = null;

      if (sourceType === 'pageVariable') {
        value = this.pageVariableControls.get(sourceField)?.value;
      } else if (sourceType === 'tableField') {
        value = this.detailFormControls.get(sourceField)?.value || (this.data && this.data[sourceField]);
      }

      if (value !== undefined && value !== null) {
        queryParams[targetField] = value;
      }
    });
    //close if the detail page is opened in popup
    if(this.dynamicDialogConfig?.data?.popup){
      this.onPopupClose();
    }
  }
    
    getId(){
       if (this.dynamicDialogConfig?.data?.popup) {
      this.id = this.dynamicDialogConfig.data?.id;
      this.pid = this.dynamicDialogConfig.data?.pid;
      this.queryParams = this.dynamicDialogConfig.data?.queryParams;
      this.actionButtonHideShow(this.leftActionBarConfig?.children, true);
    } else {
          this.actionButtonHideShow(this.leftActionBarConfig?.children, false);
          this.activatedRoute.queryParams.subscribe((params: any) => { 
            this.id = params['id'];
            this.pid = params['pid'];
            
            this.queryParams = params;
          }); 
        }
        this.metaData['sid'] = this.id;
        this.metaData['pid'] = this.pid;
        }

    updateAllowedActions() {
     this.checkFormLevelPermissions();
      const configs = [this.formFieldConfig, this?.captionConfig];
      for (const config of configs) {
        for (const ele in config) {
          if (this.detailFormControls.controls[ele] instanceof FormGroup) {
            for (const childEle in config[ele]) {
              this.updateFields(config, ele, childEle);
            }
          } else {
            if (config[ele].mapping) {
              const foreignkeyReference = this.appUtilBaseService.getControlsFromFormConfig(config[ele]);
              config[ele].mapping.map((fk: any) => {
                this.updateFields(foreignkeyReference, fk.fieldName, '', ele);
              });
            } else {
              this.updateFields(config, ele, '');
            }
          }
        }
      }
      const traverseStructure = (nodes: any[]) => {
        if (!Array.isArray(nodes)) return;
        nodes.forEach(node => {
          const key = node.name || node.label || node.tabName || node.elementId;;
          if (key) {
            this.updateFields({ [key]: node }, key, '');
          }
          if (node.children && node.children.length) {
            traverseStructure(node.children);
          }
        });
      };
      traverseStructure(this.detailFormStructureConfig.children);
    
      this.actionBarConfig?.forEach((action: any) => {
        this.updateActions(action);
      });
        this.disablefieldsByparentNode();

    }
     checkFormLevelPermissions() {

          if (this.detailViewFormConfig?.viewConditionally && this.detailViewFormConfig?.allowViewing === 'conditional') {
            const viewResult = this.appUtilBaseService.evaluvateCondition(
              this.detailViewFormConfig.viewConditionally?.query?.rules,
              this.detailViewFormConfig.viewConditionally?.query?.condition,
              { ...this.data, ...this.detailFormControls.getRawValue() },
              this.formFieldConfig
            );
            if (!viewResult) {
              this.showForm = false;
              return;
            }
            else{
                this.showForm = true;
                }
          }

          if (this.detailViewFormConfig?.editConditionally && this.detailViewFormConfig?.allowEditing === 'conditional') {
            const editResult = this.appUtilBaseService.evaluvateCondition(
              this.detailViewFormConfig.editConditionally?.query?.rules,
              this.detailViewFormConfig.editConditionally?.query?.condition,
              { ...this.data, ...this.detailFormControls.getRawValue() },
              this.formFieldConfig
            );
            if (!editResult) {
              this.detailFormControls.disable({ emitEvent: false });
            }
            else{
              this.detailFormControls.enable({ emitEvent: false });
            }
          }
        }
  disablefieldsByparentNode(){
      if (this.detailViewFormConfig && this.detailViewFormConfig.allowEditing === "no"){
        this.detailFormControls.disable({ emitEvent: false });
        return;
      }

    else if (this.detailViewFormConfig && this.detailViewFormConfig.children) {
      this.processChildrenForDisabling(this.detailViewFormConfig.children);
    }
  }
    getAllFormFields(nodes: any[]): any[] {
            if (!Array.isArray(nodes)) return [];
            return nodes.flatMap(node => {
              const fields = [];
              if (node.type === 'formField' && node.name) {
                fields.push(node);
              }
              if (node.children && Array.isArray(node.children)) {
                fields.push(...this.getAllFormFields(node.children));
              }
              return fields;
            });
          };
    processChildrenForDisabling(children: any[]): void {
            if (!Array.isArray(children)) return;
            children.forEach((ele: any) => {
              let shouldDisable = false;
              if (ele.allowEditing === "no") {
                shouldDisable = true;
              }
              if (!shouldDisable && ((ele.editConditionally && ele.allowEditing === 'conditional'))) {
                const conditions = ele.editConditionally;
                if (conditions) {
                  const conResult = this.appUtilBaseService.evaluvateCondition(
                    conditions?.query?.rules,
                    conditions?.query?.condition,
                    { ...this.data, ...this.detailFormControls.getRawValue() },
                    this.formFieldConfig
                  );
                  shouldDisable = !conResult;
                }
              }
              if(shouldDisable)
                if (ele.children && Array.isArray(ele.children)) {
                  const formFields = this.getAllFormFields(ele.children);
                  formFields.forEach((field: any) => {
                  let control = this.detailFormControls.get(field.name);
                    if (control && !control.disabled) {
                      control.disable({ emitEvent: false });
                    }
                  });
                  return;
                }
              if (ele.children && Array.isArray(ele.children)) {
                this.processChildrenForDisabling(ele.children);
              }
            });
          };
      hasMappingPriority(fieldConfig:any){
        const allFilterOutputMappings = Object.values(this.formFieldConfig)
          .flatMap((config: any) => config.filterOutputMapping || []);
          let isFieldEnabled = true;

        const mappingAvailable = allFilterOutputMappings.some((mapping: any) => {
          if (mapping.tableField === fieldConfig.name) {
            const config = this.formFieldConfig[mapping.tableField];
            isFieldEnabled = config?.fieldName === mapping.tableField && mapping?.isFieldEnabled;
            return true;
          }
          return false;
        });
        const hasMappingcheck = mappingAvailable ? !isFieldEnabled : true;
        return hasMappingcheck;
      }
    
          updateFields(formFieldConfig: any, ele: string, childEle: string, foreignKey ?: string) {
            const fieldConfig = (childEle) ? formFieldConfig[ele][childEle] : formFieldConfig[ele];
                let key: string;
                if (fieldConfig.type === 'inlineText' || fieldConfig.type === 'htmlContainer' || fieldConfig.type === 'formSection' || fieldConfig.type === 'tab' || fieldConfig.type === 'tabView') {
                key = fieldConfig.label
              } else {
                key = formFieldConfig[ele].name
              }
              const isStructuralElement = ['tab', 'tabView', 'formSection'].includes(fieldConfig.type);
              if(isStructuralElement) {
                 key = fieldConfig.elementId;
              }
              if (fieldConfig?.allowViewing === 'no') {
                if (childEle) {
                if (!this.hiddenFields[key])
                  this.hiddenFields[key] = {};
                this.hiddenFields[key][fieldConfig.name] = true;
              }
              else
                this.hiddenFields[key] = true;
            }
            else if ((fieldConfig.viewConditionally && fieldConfig?.allowViewing === 'conditional') || fieldConfig.conditionForButtonVisiblity) {
              const conditions = fieldConfig.type === "customButton" ? fieldConfig.conditionForButtonVisiblity : fieldConfig.viewConditionally;
              this.restrictEditandView(conditions, 'view', fieldConfig, false, foreignKey)
            }
              if (!isStructuralElement && ((fieldConfig.allowEditing === 'no' && this.hasMappingPriority(fieldConfig)) || (fieldConfig?.isPrimaryKey && this.id))) {
              if (childEle)
                this.detailFormControls.get(`${[fieldConfig.name]}.${fieldConfig.name}`)?.disable({ emitEvent: false });
              else {
                this.detailFormControls.get(fieldConfig.name)?.disable({ emitEvent: false });
                if (foreignKey)
                this.detailFormControls.get(foreignKey)?.disable({ emitEvent: false });
                }
            }
            else if (!isStructuralElement && fieldConfig.allowEditing === 'yes') {
              if (childEle)
                this.detailFormControls.get(`${[fieldConfig.name]}.${fieldConfig.name}`)?.enable({ emitEvent: false });
              else {
                this.detailFormControls.get(fieldConfig.name)?.enable({ emitEvent: false });
                if (foreignKey)
                  this.detailFormControls.get(foreignKey)?.enable({ emitEvent: false });
              }
            }
            else if (!isStructuralElement && ((fieldConfig.editConditionally && fieldConfig.allowEditing === 'conditional' && this.hasMappingPriority(fieldConfig)) || fieldConfig.conditionForButtonEnable)) {
            const conditions = fieldConfig.type == "customButton" ? fieldConfig.conditionForButtonEnable : fieldConfig.editConditionally;
            this.restrictEditandView(conditions, 'edit', fieldConfig, false, foreignKey);
            }
             if (!isStructuralElement && fieldConfig.mandatory === 'conditional' && fieldConfig.conditionalMandatory) {
              this.addRequiredValidator(fieldConfig.conditionalMandatory, fieldConfig.name, null, foreignKey);
              if (foreignKey) {
                let hasMandatory: boolean = false;
                this.formFieldConfig[foreignKey]?.childFields?.forEach((o: any) => {
                  if (this.detailFormControls.controls[o].hasValidator(Validators.required)) {
                    hasMandatory = true;
                  }
                })
                if (hasMandatory) {
                  this.detailFormControls.controls[foreignKey].addValidators([Validators.required]);
                }
                else if (this.detailFormControls.controls[foreignKey].hasValidator(Validators.required)) {
                  this.detailFormControls.controls[foreignKey].removeValidators([Validators.required]);
                }
              }
            }
        }
    updateActions(actionConfig:any){
      if (actionConfig?.action == 'changelog') {
        if (!this.id) {
          if (!this.conditionalActions.hideActions?.includes(actionConfig.buttonId)) {
            this.conditionalActions.hideActions?.push(actionConfig.buttonId);
          }
        }
        else {
          if (this.conditionalActions.hideActions?.includes(actionConfig.buttonId)) {
            this.conditionalActions.hideActions?.splice(this.conditionalActions.hideActions?.indexOf(actionConfig.buttonId), 1)
          }
          this.conditionalActions = {
            disableActions: [... this.conditionalActions.disableActions],
            hideActions: [... this.conditionalActions.hideActions]
          }
        }

      }



      if(actionConfig?.visibility === 'conditional' && actionConfig?.conditionForButtonVisiblity){
          this.restrictEditandView(actionConfig.conditionForButtonVisiblity,'view',actionConfig.action,true,'','',actionConfig.buttonId);
      }
      if(actionConfig?.buttonEnabled === 'conditional' && actionConfig?.conditionForButtonEnable){
          this.restrictEditandView(actionConfig.conditionForButtonEnable,'edit',actionConfig.action,true,'','',actionConfig.buttonId);
      }
    }
      
       restrictEditandView(ele: any, action: string, fieldconfig: any, fromActionBar?: boolean,foreignKey?:string,foreignkeyReference?:any,buttonId?:any) {
       let fieldName = fieldconfig?.name;
        const config = foreignkeyReference?foreignkeyReference :this.formFieldConfig;
        const conResult = this.appUtilBaseService.evaluvateCondition(ele?.query?.rules, ele?.query?.condition, { ...this.data, ...this.detailFormControls.getRawValue() }, config);
        const isStructuralElement = ['tab', 'tabView', 'formSection'].includes(fieldconfig?.type);
        if (isStructuralElement) {
           fieldName = fieldconfig.elementId;
        } else if (fieldconfig && (fieldconfig.type === 'inlineText' || fieldconfig.type === 'htmlContainer')){
           fieldName = fieldconfig.label;
        }
        if (fromActionBar) {
          this.allocateActions(buttonId, conResult, action,fieldName)
        } else {
          if (action == 'view') {
            this.hiddenFields[fieldName] = conResult ? false : true;
          }
          else if (action == 'edit') {
            conResult ? this.detailFormControls.get(fieldName)?.enable({ emitEvent: false }) :
              this.detailFormControls.get(fieldName)?.disable({ emitEvent: false });
            if (foreignKey) {
              let allKeysenabled: boolean = true;
              this.formFieldConfig[foreignKey]?.childFields?.forEach((o: any) => {
                if (this.detailFormControls.get(o)?.disabled) {
                  allKeysenabled = false;
                }
              })
              conResult && allKeysenabled ? this.detailFormControls.get(foreignKey)?.enable({ emitEvent: false }) :
                this.detailFormControls.get(foreignKey)?.disable({ emitEvent: false });
            }
            if (this.formFieldConfig[fieldName]?.type == 'customButton') {
                this.allocateActions(fieldName, conResult, action)
            }
            if(this.formFieldConfig[fieldName]){
            conResult === true ? this.formFieldConfig[fieldName].buttonEnabled = 'yes' : this.formFieldConfig[fieldName].buttonEnabled = 'no';
            }
          }
        }
      }
    
       allocateActions(label: string, result: boolean, action: string, actionName?: string) {
        if (action === 'view') {
          if (result && this.conditionalActions.hideActions.includes(label)){
            if ((actionName == 'changelog' && this.id) || actionName != 'changelog')
                this.conditionalActions.hideActions?.splice(this.conditionalActions.hideActions?.indexOf(label), 1)
          }
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
    
    
     restrictBasedonRoles(roles: any) {
        if (roles?.includes('selected')) {
           if(this.currentUserData){
            const userDataKeys = Object.keys(this.currentUserData);
            return roles?.some((item: any) => userDataKeys.includes(item.toLowerCase()));
          }
          else{
            return false;
          }
        }
        else if (roles?.includes('all'))
          return true;
        else
          return true;
      }
  
     formValueChanges() {
    this.detailFormControls.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
    )
      .subscribe(() => {
        this.updateAllowedActions();
        this.readOnlyBasedonRoles();
        this.disableDependantFields();

        Object.keys(this.formFieldConfig).forEach(key => {
          const control = this.detailFormControls.get(key);
          if (control?.dirty) {
            this.resetexecuteOnDependantFields(key);
            this.resetDependantFields(key);
            const formFieldArr: any = [];
            if (this.formFieldConfig[key]?.executeOnInv?.fieldChanges?.length > 0) {
             const sub= this.executeEventOnFieldChange(key, formFieldArr).subscribe((modifiedDataresponses: any) => {
              this.setExecuteOnEventsValue(formFieldArr, modifiedDataresponses);
              });
              this.subscriptions.push(sub);
            }
              control.markAsPristine();
          }
        });

        this.isFormValueChanged = true;
      })

  }
  resetexecuteOnDependantFields(ele: string) {  //if the parent value is changed/updated
    const executeEventFieldsToReset = this.formFieldConfig[ele]?.executeOnInv?.fieldChanges || [];
    executeEventFieldsToReset?.forEach((tableField: string) => {
      // Reset the tableField
      if (this.detailFormControls.get(tableField)?.value) {
        this.detailFormControls.get(tableField)?.markAsDirty({ onlySelf: true });
        this.formatRawData({
          [tableField]: null
        })
      }
    });
    const outputMappingsToReset = this.formFieldConfig[ele]?.filterOutputMapping?.map((mapping: any) => mapping.tableField) || [];
    outputMappingsToReset?.forEach((tableField: string) => {
      // Reset the tableField
      // to avoid resetting twice if output mapping and execute on field are same
      if(executeEventFieldsToReset.indexOf(tableField) === -1) {
          this.detailFormControls.get(tableField)?.markAsDirty({ onlySelf: true });
          this.formatRawData({
            [tableField]: this.detailFormControls.get(tableField)?.value
          });
      }
    });
  }
  
 executeEventOnFieldChange(key: string, formFieldArr: any[]) {
    return new Observable(observer => {
      let autosuggestConfig: any = {};
      const executeDetails = this.formFieldConfig[key]?.executeOnInv?.fieldChanges || [];
      const data = { ...this.detailFormControls.getRawValue(), ...this.pageVariableControls.getRawValue() };
      const tempUrl: any = [];
      const observables: Observable<any>[] = [];
      const config = { ...this.formFieldConfig };
      for (const fieldName of executeDetails) {
        if (config[fieldName].uiType !== 'autosuggest') continue;
        formFieldArr.push(config[fieldName]?.name)
        tempUrl.push({
          serviceName: config[fieldName].autoSuggestServiceName,
          url: config[fieldName].lookupUrl,
          field: config[fieldName]?.name
        });
      }
      this.formLookupObservables(tempUrl, config, autosuggestConfig, data, observables, false, true);
        this.assignReponseToControls(observables, autosuggestConfig, observer);
    });
  }

   bindPageVariables(): void {
    this.isPVLoaded = {};
    this.bindPageVariablesSubscriptions.forEach((subs: Subscription) => { subs?.unsubscribe(); });
    this.bindPageVariablesSubscriptions = [];
    if (!this.pageVariables?.children || !this.pageVariableControls) {
      return;
     }
    for (const ele of this.pageVariables.children) {
      if(!this.queryParams?.id){
        this.isPVLoaded[ele?.name] = true;
      }
      const sub  = this.pageVariableControls.get(ele?.name)?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((obj) => {
          if(!this.isPVLoaded[ele?.name]){
            this.isPVLoaded[ele?.name] = true;
            return;
          }
          const childName = ele?.name;
          const pgVarControl = this.pageVariableControls.get(childName);
          this.resetexecuteOnDependantPageVariables(childName);
          const formFieldArr: any = [];
          if (this.pageVariableFieldConfig[childName]?.executeOnInv?.variableChanges?.length > 0) {
            this.executeEventOnVariableChange(childName, formFieldArr).subscribe((modifiedDataresponses: any) => {
              this.setExecuteOnEventsValue(formFieldArr, modifiedDataresponses);
            });
          }
          pgVarControl?.markAsPristine();
        });
       this.bindPageVariablesSubscriptions.push(sub); 
    }
   }
   
    executeEventOnVariableChange(key: string, formFieldArr: any[]) {
    return new Observable(observer => {
      let autosuggestConfig: any = {};
      const executeDetails = this.pageVariableFieldConfig[key]?.executeOnInv.variableChanges || [];
      const payloaddata = {...this.detailFormControls.getRawValue(),...this.pageVariableControls.getRawValue()};
      const tempUrl: any = [];
      const observables: Observable<any>[] = [];
      const config = { ...this.formFieldConfig };
      for (const fieldName of executeDetails) {
        if (config[fieldName].uiType !== 'autosuggest') continue;
        formFieldArr.push(config[fieldName].name)
        tempUrl.push({
          serviceName: config[fieldName].autoSuggestServiceName,
          url: config[fieldName].lookupUrl,
          field: config[fieldName].name
        });
      }
      this.formLookupObservables(tempUrl, config, autosuggestConfig, payloaddata, observables, false, true);
      this.assignReponseToControls(observables, autosuggestConfig, observer);
    });
  }
  
  public setExecuteOnEventsValue(formFieldArr: any, modifiedDataresponses: any) {
    if (formFieldArr.length > 0 && modifiedDataresponses?.length > 0) {
      const patchObj: any = {};
      modifiedDataresponses.forEach((response: any, index: number) => {
        if (response.length !== 1) return;
        const responseData = response[0];
        const fieldName = formFieldArr[index];
        patchObj[fieldName] = responseData;
        this.detailFormControls.get(fieldName)?.markAsDirty({ onlySelf: true });
      });
      if (Object.keys(patchObj).length > 0) {
        this.formatRawData(patchObj);
      }
    }
  }

    resetexecuteOnDependantPageVariables(ele: string) {  //if the parent value is changed/updated
    const executeEventFieldsToReset = this.pageVariableFieldConfig[ele]?.executeOnInv?.variableChanges || [];
    for (const field of executeEventFieldsToReset) {
      if (this.formFieldConfig[field]?.uiType === 'autosuggest') {
        if (this.detailFormControls.get(field)?.value) {
          this.detailFormControls.get(field)?.markAsDirty({ onlySelf: true });
          this.formatRawData({
            [field]: null
          })
        }
      }
    }
  }
  
    normalize(data:any){
        return data;
      }
      
         formatFormDataBeforeSave() {
        let data = this.detailFormControls.getRawValue();
        for (const ele in this.formFieldConfig) {
          const ec = this.formFieldConfig[ele];
          if (ec.columns && !ec.multipleValues) {
            data[ec.name] = this.configureRequestData(data[ec.name], ec.columns, ec.name)
          }
          else if (ec.columns && ec.multipleValues && data[ec.name]) {
            data[ec.name]?.map((o: any,index:number) => {
              const tempData = this.configureRequestData(data[ec.name][index], ec.columns, ec.name,index);
              data[ec.name][index] = tempData;
            })
          }
        }
        data = this.configureRequestData(data,this.detailFormConfig.children);
        return data;
      }
    
    configureRequestData(data: any,ele: any,parentEle?: string,index?: number) {
        if (Array.isArray(ele)) {
          ele.map((ele: any) => {
      if (ele.uiType == 'autosuggest') {
              data[ele.name] = data[ele.name]?.[ele.parentField] || data[ele.name]?.['displayField'];       
            }
           if (ele.fieldType == 'Date' && data[ele.name]) {
              const formattedDate = new Date(data[ele.name]).getTime()
              if (ele.uiType == 'date') {
                const tempDate = new Date(data[ele.name]);
                const convertedDate = tempDate.getFullYear() + '-' + this.leftPad((tempDate.getMonth() + 1), 2) + '-' + this.leftPad(tempDate.getDate(), 2);
                data[ele.name] = convertedDate;
              }
              else {
                data[ele.name] = formattedDate;
              }
            }else if (ele.fieldType === 'Boolean') {
              if (
                data[ele.name] === null ||
                data[ele.name] === undefined ||
                data[ele.name] === ''
              ) {
                data[ele.name] = false;
              }
            }
                     
          });
        }
        return data;
      }
    
    denormalize(backupData: any) {
    }
  formatRawData(inputData?: any) {
        const dataToFormat = (inputData && Object.keys(inputData).length > 0) ? inputData : this.data;
        this.denormalize(dataToFormat);
            // since this.data cannot be directly used for patch value, doing a deep copy
            // Deep copy converts date into string, so copy is performed before formatting
        let patchData = JSON.parse(JSON.stringify(dataToFormat));
        this.selectedItems = [];
        for (const e in this.formFieldConfig) {
          const ec = this.formFieldConfig[e];
          if (ec.columns && !ec.multipleValues && dataToFormat[ec.name]) {
            for (const e1 in this.data[ec.name]) {
               const ec1 = ec[e1];
              if(this.data[ec.name]){
              dataToFormat[ec.name][ec1.name] = this.bindData(dataToFormat[ec.name][ec1.name], ec1,ec.name);
              patchData[ec.name][ec1.name] = this.bindData(patchData[ec.name][ec1.name], ec1,ec.name);
              }
            }
          }
          else if (ec.columns && ec.multipleValues && dataToFormat[ec.name]) {
            dataToFormat[ec.name]?.map((o: any, index: number) => {
              for (const e1 in o) {
                const ec1 = ec[e1];
                if (dataToFormat[ec.name]) {
                  dataToFormat[ec.name][index][ec1.name] = this.bindData(dataToFormat[ec.name][index][ec1.name], ec1,ec.name,index);
                  patchData[ec.name][index][ec1.name] = this.bindData(patchData[ec.name][index][ec1.name], ec1,ec.name,index);
                }
              }
            })
          }
          
            else if (!ec.columns && dataToFormat[ec.name]) {
              dataToFormat[ec.name] = this.bindData(dataToFormat[ec.name], ec);
              patchData[ec.name] = this.bindData(patchData[ec.name], ec);
            }
          
        }
    
        // const patchData = JSON.parse(JSON.stringify(this.data));
          this.detailFormControls.patchValue(patchData, { emitEvent: true});
          //this.bindLookupOnInit();
          if (!inputData || Object.keys(inputData).length === 0) {
         this.backupData = this.appUtilBaseService.deepClone(this.detailFormControls.getRawValue());
         if ((Object.keys(this.backupData).length == 0 && this.id) || (this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true))) {
        localStorage.setItem("formChanged", JSON.stringify(false));
      }
      else {
        localStorage.setItem("formChanged", JSON.stringify(true));
      }
     }
         this.initializeCaptionBar();
     }
      
    
    bindData(data: any, ele: any, parentEle?: string, index?: number) {
        if (ele.fieldType == 'Date' && data) {
          if (ele.uiType == 'autosuggest') {
            data['displayField']  = this.appUtilBaseService.formatRawDatatoRedableFormat({},data['displayField'],ele?.displayFields[0]?.f_type)
          }
          else {
            const formattedDate = new Date(data);
            return formattedDate;
          }
        }
        else if (['imageCarousel', 'attachments'].includes(ele.uiType)) {
          const responseFiles = this.appUtilBaseService.createImagePreviewURL(data);
          return responseFiles;
        } 
          return data;
      }
    
     createAutoSuggestFields(ele: any) {
        if (!this.selectedItems?.hasOwnProperty(ele)) {
          this.selectedItems[ele] = [];
        }
    
      }
    
    
      reloadForm(workflowInfo: any) {
        this.data.workflowInfo ={
              [this.workflowType]:workflowInfo
            };
      
    const wfData ={
    actors:workflowInfo.userTypes,
    step:workflowInfo.step
    }
           const methodName: any = "configureFormOnWorkflow";
            let action: Exclude<keyof Table1DetailBaseComponent, ' '> = methodName;
            if (typeof this[action] === "function") {
              this[action](wfData);
              this.updateAllowedActions();
              this.formValueChanges();
            }
      }
    
    
     openWorkflowSimilator() {
        const ref = this.dialogService.open(WorkflowSimulatorComponent, {
          header: 'Workflow Simulator',
          width: '350px',
          data: {
           statusFieldConfig: this.formFieldConfig[this.workFlowField],
            actorFieldConfig: Object.keys(this.securityJson).map((actor)=> {return{label:this.getActorLabel(actor),value:actor}}),
            selectedValues: (this.data?.workflowInfo)? this.data?.workflowInfo[this.workflowType]:{userTypes:[],step:''}
          }
        });
        ref.onClose.subscribe((workflowInfo: any) => {
          if (workflowInfo) {
            this.reloadForm(workflowInfo);
          }
        });
      }
      
	 getActorLabel(actor:string){
                const formattedActorName = actor.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
                        if (formattedActorName in this.roles){
                                return this.translateService.instant(formattedActorName)
                        }
                         else{
                        const field = this.detailFormConfig.children.find((child: any) => child.fieldName === actor);
                         return field ? this.translateService.instant(field.label) : formattedActorName;
                        }
          }
    
     addRequiredValidator(ele: any, fieldName: string, foreignkeyReference?: any,foreignKey?:string) {
        const fieldConfig = foreignkeyReference ? foreignkeyReference :this.formFieldConfig;
        const field = foreignKey ? foreignKey: fieldName;
        const conResult = this.appUtilBaseService.evaluvateCondition(ele.query?.rules, ele.query?.condition, this.detailFormControls.getRawValue(), fieldConfig);
        if (conResult ) {
          this.detailFormControls.controls[fieldName].addValidators([Validators.required]);
        }
        else {
          this.detailFormControls.controls[fieldName].removeValidators([Validators.required]);
        }
        this.detailFormControls.controls[fieldName].updateValueAndValidity({ emitEvent: false });
        this.formFieldConfig[field].isRequired =(conResult)? true:false;
    
      }
    
      disableDependantFields() {
        const detailFormControls = this.detailFormControls.getRawValue()
        for (const ele in this.formFieldConfig) {
          if (this.formFieldConfig[ele].uiType === 'autosuggest') {
            if (this.formFieldConfig[ele].mandatoryFilters) {
              this.disableInputFilters(ele, detailFormControls);
            }
            if (this.formFieldConfig[ele].filterOutputMapping) {
              this.formFieldConfig[ele].filterOutputMapping.forEach((f: any) => {
              if (this.formFieldConfig[f.tableField]?.allowEditing === 'no') {
                this.detailFormControls.get(f.tableField)?.disable({ emitEvent: false });
              }
              })
            }
            if (this.formFieldConfig[ele].allowEditing === 'no' || (this.detailFormConfig.disabledFieldsByLookup && this.detailFormConfig.disabledFieldsByLookup.includes(this.formFieldConfig[ele].fieldName))) {
              this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.disable({ emitEvent: false });
            }
          }
          if(this.formFieldConfig[ele].fieldName =="sid"  || this.formFieldConfig[ele].fieldName=="createdBy" || this.formFieldConfig[ele].fieldName=="modifiedBy" || this.formFieldConfig[ele].fieldName =="createdDate" || this.formFieldConfig[ele].fieldName =="modifiedDate" ){
            this.disableSysGenFields(this.formFieldConfig[ele].fieldName);
          }
          if (this.workFlowField === this.formFieldConfig[ele].fieldName) {
            this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.disable({ emitEvent: false });
          }
        }
      }
      disableSysGenFields(field: any){
        this.detailFormControls.get(field)?.disable({ emitEvent: false });
      }
    getValue(formControl: FormGroup, ele: string) {
        const parent = ele.split('?.')[0];
        if (formControl.controls[parent] instanceof FormGroup){
          const child = ele.split('?.')[1];
          return formControl.controls[parent].value[child];
        }
        else
          return formControl.controls[parent].value;
      }
    getDisabled(formControl: any, ele: string) {
      const parent = ele.split('?.')[0];
      if (formControl.controls[parent] instanceof FormGroup){
        return formControl.get(ele)?.disabled
      }
      else
        return formControl.controls[parent].disabled;
    }
    
    onWizardClick(event: any) {
        this.wizardItems.forEach((item: any) => {
          delete item.styleClass;
        });
        event.item.styleClass = 'wizard-active';
        let el: any = $("#section" + event.item.id);
        if (el?.length) {
    
          $('.main-content').animate({
            scrollTop: el.offset().top
          }, 100);
        }
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
    
      configureEmptyValuestoNull(data:any){
           const value =  Object.keys(data).reduce((acc:any, key:string) => {acc[key] = data[key] === '' ||(Array.isArray(data[key]) && data[key].length == 0)? null : 
        data[key]; return acc; }, {})
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
        if(this.formFieldConfig[ele]?.transient && edit || !edit){
          if (this.formFieldConfig[ele].uiType === 'autosuggest') {
            const defaultValue = this.formFieldConfig[ele].defaultVal;
            if (defaultValue !== undefined && defaultValue !== null && defaultValue !== '') {
            const patchValueObject = {
              displayField: defaultValue,
              referenceField: defaultValue
            };
            this.detailFormControls.controls[ele].patchValue(patchValueObject, { emitEvent: true });
            this.backupData[ele] = this.appUtilBaseService.deepClone(patchValueObject);
          }
         }
        else if (['Boolean'].includes(this.formFieldConfig[ele].fieldType)) {
            const defaultBooleanValues = this.formFieldConfig[ele].defaultVal ? this.formFieldConfig[ele].defaultVal : false;
            this.detailFormControls.controls[ele].patchValue(defaultBooleanValues, { emitEvent: true });
            this.backupData[ele] = defaultBooleanValues;
          } else if (this.formFieldConfig[ele].defaultVal && (this.formFieldConfig[ele].uiType === 'datetime' || this.formFieldConfig[ele].uiType === 'date')) {
            let defaultValue = (this.formFieldConfig[ele].defaultVal);
            if (typeof defaultValue == 'string') {
              if (defaultValue?.toLowerCase() == 'today') {
        //defaultValue = new Date(Date.now() + (new Date().getTimezoneOffset() * 60000)).getTime();
                   defaultValue = new Date(Date.now()).getTime();          
    } else if (defaultValue?.toLowerCase() == 'tomorrow') {
                defaultValue = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).getTime()
              } else if (defaultValue?.toLowerCase() == 'start_of_month') {
                defaultValue = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
              } else if (defaultValue?.toLowerCase() == 'end_of_month') {
                defaultValue = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime()
              }
            }
            const formattedDate = new Date(defaultValue)
              setTimeout(()=>{
                          this.detailFormControls.controls[ele].patchValue(formattedDate, { emitEvent: true });
                        },0)
            this.backupData[ele] = formattedDate;
          } else if (this.formFieldConfig[ele].defaultVal && (this.formFieldConfig[ele].uiType === 'select' || this.formFieldConfig[ele].uiType === 'checkboxgroup' || this.formFieldConfig[ele].uiType === 'radio' || this.formFieldConfig[ele].uiType === 'yesno')) {
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
          }       else if(Array.isArray(this.formFieldConfig[ele].defaultVal) && (this.formFieldConfig[ele].uiType =='number' || this.formFieldConfig[ele].uiType =='currency')){
            let tempArr: any = [];
            (this.formFieldConfig[ele].defaultVal || [])?.map((o: any) => {
              tempArr.push({
                display:o,
                value:o
              });
            })
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
        this.setDefaultFilterValues(edit);
      }
     onDateChange(ev:any,containerRef: { el: ElementRef }) {
            setTimeout(()=>{
              const $input = $(containerRef?.el?.nativeElement).find('input');
              if ($input.length === 0) return;
              const value = $input?.val() as string;
              const translatedValue = value
                .replace(AppConstants.amDesignator, this.translateService.instant(AppConstants.amDesignator))
                .replace(AppConstants.pmDesignator, this.translateService.instant(AppConstants.pmDesignator));

              $input.val(translatedValue);
            },300)

          }

      onPCalendarShow() {
                setTimeout(() => {
                  //Custom code to apply translation for AM/PM. for Primng version 15.4 in calendar picker
                  const $ampmPicker = $('.p-ampm-picker');
                  if ($ampmPicker.length === 0) return;
                  const $originalSpan = $ampmPicker.find('span').not('.ampmclass');
                  $originalSpan.css('visibility', 'hidden');
                  const translatedText = this.translateService.instant($originalSpan.text());
                  const $customSpan = $(`<span  class="ampmclass" style="position: absolute; margin-top: 20px; z-index: 1;">${translatedText}</span>`);
                  $ampmPicker.append($customSpan);
                  $ampmPicker.find('button').on('click', () => {
                    const updatedText = this.translateService.instant($originalSpan.text());
                    $customSpan.text(updatedText);
                  });
                }, 0);
              }
    checkValidations(): boolean {
        const finalArr: string[] = [];
        this.formErrors = {};
        this.inValidFields = {};
        if (!this.appUtilBaseService.validateNestedForms(this.detailFormControls, this.formErrors, finalArr, this.inValidFields,this.formFieldConfig)) {
          if (finalArr.length) {
            this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), life: 5000 });
          }
          return false;
        }
        if(this.detailFormConfig.children) {
          let multComp = this.detailFormConfig.children.filter((ele: any) => ele.multipleValues && ele.columns);
          if(multComp.length) {
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
            if(mulFormErrors.length) {
              this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(mulFormErrors), life: 5000 });
              return false;
            }
          }
        }
        return true;
      }
    
    checkColumnProperty(fieldName: string, table: string) {
        const columnConfig = this.formFieldConfig[table]?.columns?.find((item: any) => item.name == fieldName);
        return ((columnConfig.hidden) ? false : true);
      }
    
    checkUnsavedComplexFields():any {
        const newRows:any = []
        let hasUnSavedChanges:boolean = false;
        const data = this.detailFormControls.getRawValue();
        const fields:any =[];
        const complexTable = (Object.keys(this.formFieldConfig)).filter(key=> this.formFieldConfig[key].columns && this.formFieldConfig[key].multipleValues)
           if(complexTable.length> 0){ 
             complexTable.map((field)=>{
              data[field]?.map((e: any) => {
                if(e.isNewRow || this.fieldEditMode[field]){
                  hasUnSavedChanges = true;
                  fields.push(field);
                }
                  newRows.push(e);
              })
             })
           }
           return {
            newRows:newRows,
            fields:[...new Set(fields)],
            hasUnSavedChanges:hasUnSavedChanges
          }
        }
      
    
      confirmationPopup(fields: []) : Observable<boolean>{
        return Observable.create((observer: Observer<boolean>) => {
          this.confirmationService.confirm({
            message: this.translateService.instant('Complex_record_save_confirmation', { field: fields.toString() }),
            header: this.translateService.instant('Confirmation'),
            icon: 'pi pi-info-circle',
            accept: () => {
              fields.map((o) => $($(`.${o}_editSave-btn`)).trigger('click'));
               observer.next(true) 
               observer.complete();       
              },
            reject: () => {
              fields.map((o) => $($(`.${o}_editCancel-btn`)).trigger('click'));
              observer.next(true) 
               observer.complete(); 
            },
          });
        });
      }
      onUrlClick(event: any) {
          window.open(event.value, '_blank');
      }
      getTabIndex(tabName:string){
        return 0;
      }
                                                                                                                                                                                                                                                                                                                                                           
    getUserRoles(){
          this.appBaseService.getRoles().subscribe((res:any)=>this.roles = res ||{});
       } 
    
    editFormula(config:any,fieldname:any){
         const fieldConfig = config[fieldname]
         if(fieldConfig.formulaMethod){
           let methodName: Exclude<keyof Table1DetailBaseComponent, ' '> = fieldConfig.formulaMethod
             if(typeof this[methodName] ==="function")
              this[methodName](this.detailFormControls.getRawValue());
         }
       }
     onWorkflowhistory() {
        const workflowHistory = this.dialogService.open(WorkflowHistoryComponent, {
          header: this.translateService.instant('Workflow_History'),
          width: AppConstants.isMobile ? '90%' : '60%',
          contentStyle: { "max-height": "500px", "overflow": "auto" },
          styleClass: "workflow-history",
          data: {
            id: this.id,
            workflowType: this.workflowType
          }
        });
      }
     tabviewValidation(array: any, tabIndexes: any = {} , type:string) {
        array.children.map((o: any, index: number) => {
          if (o.type === type) {
            tabIndexes[o.tabName] =o;
          }
          if (o.children)
            this.tabviewValidation(o, tabIndexes,type);
        })
        return tabIndexes;
      }
    
      tabValidation(array: any, tabIndexes: any = [] , type:string) {
        let modal:any ={
          tabName :'',
          tabIndex:[]
        }
        let key = Object.keys(array);
        key.map((tabkey:string)=>{
          modal['tabName'] = tabkey;
          array[tabkey].children.map((o: any, index: number) => {
            if (o.type === 'tab') {
             modal.tabIndex.push(o.tabName);
            }
            else{
            if (o.children)
              this.tabValidation(o, tabIndexes,type);
            }
          })
          tabIndexes.push({...modal});
          modal.tabIndex = [];
        })
         return tabIndexes;
       }

    setTabState() {
      this.activatedRoute.queryParams.subscribe(params => {
        Object.keys(params).forEach(key => {
          const tabIndex = params[key];
          if (tabIndex !== null && tabIndex !== undefined && !isNaN(tabIndex)) {
            this.activeTabIndexes[key] = parseInt(tabIndex, 10);
          }
        });
      });
    }
    
    onTabChange(event: any,name:string) {
      if (event && event.index !== null && event.index !== undefined) {
        this.activeTabIndexes[name] = event.index;
        this.router.navigate([], { 
          replaceUrl: true, 
          queryParams:  {...this.activeTabIndexes}, 
          queryParamsHandling: 'merge' 
        });
      }
    }
                                                                                                                                                                                                                                                                                                                                                                   
        tabErrorCount(aftersave:boolean){ 
        const tabViews = this.tabviewValidation(this.detailFormStructureConfig ,[], 'tabView');
        const tabviewStructue = this.tabValidation(tabViews, [],'tab');
        tabviewStructue.forEach((parentele:any) => {
              parentele.tabIndex.map((ele:any,index:number)=>{
              const tabID =  ele+"_id"
              const tabLabelID =  ele+"_label_id"
               let er = (<HTMLInputElement>document.getElementById(tabID))?.querySelectorAll(".error")||[];
              if(er.length>0 && this.activeTabIndexes[parentele.tabName] !=index && !aftersave){
                  document.getElementById(tabLabelID)?.classList.add("taberror");
                  this.errorfields[ele] = true;
              }
              else{
                document.getElementById('tabIDS')?.classList.remove("taberror")
                this.errorfields[ele] = false;
              } 
            })
          });
      }
     leftPad(num:number, length:number) {
        var result = '' + num;
        while (result.length < length) {
          result = '0' + result;
        }
        return result;
      }
    
    addValidatorsForMultiValues() {
        for (const property in this.formFieldConfig) {
          if (this.formFieldConfig[property].multipleValues && (this.formFieldConfig[property].uiType == 'number')) {
            if(this.formFieldConfig[property].isDouble){
              this.validators[property] = [this.customValidatorService.ValidateDouble,this.customValidatorService.minValueValidator(this.formFieldConfig[property]),this.customValidatorService.maxValueValidator(this.formFieldConfig[property]),this.customValidatorService.validatePattern(this.formFieldConfig[property])];
            }
            else{
              this.validators[property] = [this.customValidatorService.validateNumber, this.customValidatorService.minValueValidator(this.formFieldConfig[property]), this.customValidatorService.maxValueValidator(this.formFieldConfig[property]),this.customValidatorService.validatePattern(this.formFieldConfig[property])]
            }
          }
          else if (this.formFieldConfig[property].multipleValues && this.formFieldConfig[property].uiType == 'string') {
            this.validators[property] = [this.customValidatorService.minLengthValidator(this.formFieldConfig[property]), this.customValidatorService.maxLengthValidator(this.formFieldConfig[property])]
          }
          else if (this.formFieldConfig[property].multipleValues && this.formFieldConfig[property].uiType == 'currency') {
            this.validators[property] = [this.customValidatorService.ValidateDouble, this.customValidatorService.minValueValidator(this.formFieldConfig[property]), this.customValidatorService.maxValueValidator(this.formFieldConfig[property])]
          }
        }
    this.errorMessages = {
          'minValue': this.translateService.instant('MIN_VALUE'),
          'maxValue': this.translateService.instant('MAX_VALUE'),
          'minLength': this.translateService.instant('MIN_LENGTH'),
          'maxLength': this.translateService.instant('MAX_LENGTH'),
          'invalid': this.translateService.instant('INVALID'),
          'pattern': this.translateService.instant('PATTERN'),
        }
      }
      onMultiDataFractionCheck(item:any,config:any){
        if (config?.uiType?.toLowerCase() == 'number' && config?.isDouble) {
          const dec = item.value.split('.')[1]
          const len = (dec && (dec.length > config.minFractionDigits) && (dec.length < config.maxFractionDigits)) ? dec.length :
            (dec && dec.length > config.maxFractionDigits) ? config.maxFractionDigits : config.minFractionDigits;
          let value = Number(item.value).toFixed(len);
          item.value = value;
          item.display = value;
    
        }
      }
    
      getButtonConfig(btn:any){
        return {
          action:btn.action,
          confirmationTitle:btn.confirmationTitle|| this.translateService.instant('Confirmation'),
          confirmationText:btn.confirmationText || 'Do you want to perform the action?',
          fields: btn.fields || {"children":[]},
             confirmButton:btn.confirmationButtonText,
          rejectButton:btn.cancelButtonText,
          values:this.detailFormControls.getRawValue()
        }
      }
    
    readOnlyBasedonRoles() {
        let rulesObj: any = {
          enableAccess: false,
          disableAcces: false,
          conditionalAccess: false
        };
        ['create', 'update'].map((o: string) => {
          const accessActions = this.detailFormConfig?.actions?.[o] || {};
          for (const property in accessActions) {
            if ((this.currentUserData?.userRoles ||[]).includes(property)) {
              if (accessActions[property]?.access === 'yes') {
                rulesObj.enableAccess = true;
              }
              else if (accessActions[property]?.access === 'no') {
                rulesObj.disableAccess = true;
              }
              else {
                const conditions = accessActions[property].conditions;
                const conResult = this.appUtilBaseService.evaluvateCondition(conditions?.rules, conditions?.condition, { ...this.data, ...this.detailFormControls.getRawValue() }, this.formFieldConfig);
                rulesObj.conditionalAccess = (conResult || rulesObj.conditionalAccess) ? true : false;
              }
            }
            else {
              rulesObj.disableAccess = true;
            }
          }
        });
    
        if ((!rulesObj.enableAccess && !rulesObj.conditionalAccess && rulesObj.disableAccess && !environment.prototype)) {
          this.tableaccess = false;
          this.detailFormControls.disable({ emitEvent: false });
        }
        else {
          this.tableaccess = true;
        }
      }
    
         bindLookupFields(): void {
        for (const ele in this.formFieldConfig) {
          if (this.formFieldConfig[ele].uiType === 'autosuggest') {
              this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.valueChanges.subscribe((obj) => {
                this.data[ele] = obj;
                if (this.formFieldConfig[ele].filterOutputMapping.length > 0) {
                this.mapOutputMappingFields(ele, obj, 'filterOutputMapping',this.formFieldConfig[ele].transient);
                }
               
              })
          }
        }
      }

    
	      mapOutputMappingFields(ele: any, obj: any, mappingobjName: string, transient?: boolean) {
	    const lookupArray: any = [];
	    const formConfig = this.formFieldConfig[ele][mappingobjName];
	
	    formConfig.forEach((filter: any) => {
	      const field = filter.tableField;
	      const lookupField = filter.lookupField;
	      const displayField = filter.displayField || lookupField;
	
	      if (this.formFieldConfig[ele].multipleValues && obj) {
	        this.handleMultipleValues(obj, filter, lookupArray);
	      } else {
	        this.handleSingleValue(obj, filter, displayField, transient);
	      }
	    });
	  }
	
	  handleMultipleValues(obj: any, filter: any, lookupArray: any[]) {
	    obj.forEach((o: any) => {
	      const filterValue = o.value ? o.value[filter.lookupField] : o[filter.lookupField];
	      lookupArray.push(filterValue);
	    });
	    this.updateFieldValue(filter.tableField, lookupArray.toString(),filter);
	  }
    
	handleSingleValue(obj: any, filter: any, displayField: string, transient?: boolean) {
	    if (obj) {
	      const filterValue = obj.value ? obj.value[displayField] : obj[displayField];
	      if (!transient && !this.detailFormControls.dirty && !this.isFormValueChanged) {
          if(!filter.isFieldEnabled)
	        this.disableField(filter.tableField);
	      } else {
	        this.updateFieldValue(filter.tableField, filterValue,filter);
	      }
	      if(this.pageVariableControls?.get(filter.tableField)){
          const control =  this.pageVariableControls?.get(filter.tableField);
          if (control) {
            control.enable();
            control.patchValue(filterValue);
          }
        }
	    } else {
	      this.updateFieldValue(filter.tableField, null,filter);
	    }
	  }

	  updateFieldValue(field: string, value: any,filter?:any) {
	    const control = this.detailFormControls?.get(field) || this.pageVariableControls?.get(field);
	
	    if (control) {
	      control.enable();
	      control.patchValue(value);
        if(!filter?.isFieldEnabled)
	      control.disable();
	    }
	  }
	
	  disableField(field: string) {
	    const control = this.detailFormControls?.get(field);
	    control?.disable();
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
      const config = { ...this.captionConfig, ...this.formFieldConfig };
      let autosuggestConfig: any = {};
      const pageVariableValues = this.pageVariableControls?.getRawValue() || {};
      const data = { ...pageVariableValues, ...(this.data || {}) };
      const tempUrl: any = [];
      const observables: Observable<any>[] = [];

      // Iterate through the configuration to identify auto-suggest fields
      for (const property in config) {
        if (config[property].uiType !== 'autosuggest' || (newRec && !config[property].autoFillField) || (!newRec && !data[property])) continue;
        // Handle auto-suggest fields without parentField
        if (config[property].uiType == 'autosuggest' && !config[property].parentField) {
          if (this.data[property] && !this.data[property]?.displayField && !newRec) {
            this.data[property] = { 'displayField': this.data[property] };
          }
        }

        // Prepare URLs for fetching data
        tempUrl.push({
          serviceName: config[property].autoSuggestServiceName,
          url: config[property].lookupUrl,
          field: config[property].name
        });
      }

      // Generate observables for the lookup services
      this.formLookupObservables(tempUrl, config, autosuggestConfig, data, observables, newRec);

      // Assign responses to the respective controls
      this.assignReponseToControls(observables, autosuggestConfig, observer);
    });
  }

  /**
   * Generates observables for the lookup services based on the configuration.
   * 
   * @param {any[]} tempUrl - Array of URLs and configurations for the lookup services.
   * @param {any} config - Configuration object for the form fields.
   * @param {any} autosuggestConfig - Configuration for auto-suggest fields.
   * @param {any} data - Data object containing the current form values.
   * @param {Observable<any>[]} observables - Array to store the generated observables.
   * @param {boolean} [newRec] - Indicates if the operation is for a new record.
   * @param {boolean} [isOnChange] - Indicates if the value is from executeEvent onChange.
   */
  formLookupObservables(tempUrl: any, config: any, autosuggestConfig: any, data: any, observables: Observable<any>[], newRec?: boolean, isOnChange: boolean = false) {
    // Remove duplicate URLs
    tempUrl.filter((obj: { id: any; }, index: any, self: any[]) =>
      index === self.findIndex((o: { id: any; }) => o.id === obj.id)
    );

    // Map through the URLs and create observables
    tempUrl?.map((o: any) => {
      const urlObj = {
        url: o.url,
        searchText: '',
        formConfig :{...this.formFieldConfig,...this.pageVariableFieldConfig},
        colConfig: config[o.field],
        value: data,
        pageNo: 0,
        id: null
      };
      autosuggestConfig[o.field] = config[o.field];
      urlObj.url = this.appUtilBaseService.generateDynamicQueryParams(urlObj, isOnChange);

      const observable = this.baseService.get(urlObj).pipe(
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return of(null);
        })
      );
      observables.push(observable);
    });
  }

  /**
   * Assigns responses from the observables to the respective form controls.
   * 
   * @param {Observable<any>[]} observables - Array of observables for fetching data.
   * @param {any} autosuggestConfig - Configuration for auto-suggest fields.
   * @param {any} observer - Observer to emit the responses.
   */
  assignReponseToControls(observables: Observable<any>[], autosuggestConfig: any, observer: any, targetData: any = this.data) {
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
              targetData[property] = filteredResponse;
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

      disableInputFilters(ele: any, detailFormControls: any) {
        let hasUnfilledValues: boolean = false;
        this.formFieldConfig[ele].filterInputMapping?.map((filter: { lookupField: string, tableField: string }) => {
          const fieldName = filter.tableField.split('.')[0];
          if (this.formFieldConfig[ele].mandatoryFilters.includes(filter.lookupField) && ele != filter.tableField && this.formFieldConfig[ele]?.isQueryView) {
             hasUnfilledValues = false;
         } else if (this.formFieldConfig[ele].mandatoryFilters.includes(filter.lookupField) && ele != filter.tableField &&
              ((detailFormControls[fieldName] === null || detailFormControls[fieldName] === undefined || detailFormControls[fieldName] === '') &&
               (this.pageVariableControls.get(fieldName)?.value === null || this.pageVariableControls.get(fieldName)?.value === undefined || this.pageVariableControls.get(fieldName)?.value === ''))) {
                    hasUnfilledValues = true;
          }
        })
          if(this.formFieldConfig[ele].allowEditing !='no' && this.formFieldConfig[ele].allowEditing !='conditional'){
           if(this.formSecurityConfig?.disableonlyfields?.includes(ele)) return;
           if(hasUnfilledValues ){
            if(this.detailFormControls.get(ele)?.value){
              // this.detailFormControls.get(ele)?.reset();
              // this.detailFormControls.get(ele)?.markAsPristine();
              this.detailFormControls.get(ele)?.patchValue(null);
              this.detailFormControls.get(ele)?.disable({emitEvent: false });
            }
            else{
              this.detailFormControls.get(ele)?.disable({emitEvent: false });
            }
           } else if(this.formFieldConfig[ele]?.isPrimaryKey && this.id) {
             this.detailFormControls.get(ele)?.disable({ emitEvent: false });
           } else
               this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.enable({ emitEvent: false });
        }
      }
     mapIndexedFields() {
        for (const ele in this.formFieldConfig) {
          const config = this.formFieldConfig[ele];
          if (config.uiType == 'autosuggest' && config.filterOutputMapping.length > 0) {
            config.filterOutputMapping.map((fieldsMap: any) => {
              if (fieldsMap.displayField) {
                this.outputMappingFieldsConfig[fieldsMap.tableField] = {
                  ['serviveName']: config.autoSuggestServiceName,
                  ['referenceField']: fieldsMap.lookupField
                }
              }
            })
          }
        }
      }
      
   resetDependantFields(ele: string) {  //if the parent value is changed/updated
    let tableFieldsToReset = this.filterFieldFromMandatoryFilters(ele) ||[];
    const executeEventFieldsToReset = this.formFieldConfig[ele]?.executeOnInv?.fieldChanges || [];
    tableFieldsToReset = tableFieldsToReset?.concat(executeEventFieldsToReset);
    tableFieldsToReset = [...new Set(tableFieldsToReset)];
    tableFieldsToReset?.forEach((tableField: string) => {
      // Reset the tableField
      if (this.detailFormControls.get(tableField)?.value) {
        this.detailFormControls.get(tableField)?.patchValue(null);
      }
    });
   }


  filterFieldFromMandatoryFilters(element: string): string[] | null {
    const matchingTableFields: string[] = [];
    const keys = Object.keys(this.formFieldConfig) || [];

    keys.forEach((fieldKey) => {
      const field = this.formFieldConfig[fieldKey];
      field?.filterInputMapping?.forEach((mapping: any) => {
        if (mapping?.tableField === element && field?.mandatoryFilters?.includes(mapping?.lookupField)) {
          matchingTableFields.push(fieldKey); // Add the corresponding tableField
        }
      });

    })
    return matchingTableFields.length ? matchingTableFields : null; // Return null if no matching table fields found
  }
     

     onBeforeGetData(){
    
      }
    checkFilters(params: any): boolean {
        const missingProperties: string[] = [];
        this.detailFormConfig.queryViewMandatoryFilters.forEach((filter: string) => {
          if (!params.hasOwnProperty(filter) || params[filter] === undefined || params[filter] === '') {
            missingProperties.push(filter);
          }
        });
    
        if (missingProperties.length === 0) {
          this.filtersEmptyMsg = 'All mandatory properties are present'
          return true;
        } else {
          let missingParams = missingProperties.join(', ').replace(/,(?=[^,]*$)/, ', and');
          this.filtersEmptyMsg = `${this.translateService.instant('Unable_to_display_any_records_DOT_The_query_is_missing_mandatory_parameter_OPENPARAN_s_CLOSEPARAN_COLON')} 
          ${this.translateService.instant(missingParams)}. 
          ${this.translateService.instant('Please_ensure_these_parameter_OPENPARAN_s_CLOSEPARAN_are_provided_for_the_view_to_display_records_DOT')}`;
          return false
        }
      }
      manipulateOutputData(res: any): void {
      }
      getInputParams() {
        return {}
      }
          
 setDefaultFilterValues(edit?:boolean) {
    Object.entries(this.queryParams || {}).forEach(([key, value]) => {
      if (((this.formFieldConfig[key]?.transient && edit) || this.pageVariableFieldConfig[key]) || !edit ) {
      if (this.formFieldConfig[key]?.uiType === 'date' || this.formFieldConfig[key]?.uiType === 'datetime') {
        const dateValue = this.parseDate(value);
        if (dateValue !== null) {
          this.patchFormControl(key, dateValue);
        } else {
          console.error(`Invalid date string: ${value}`);
        }
      } else if (this.formFieldConfig[key]?.fieldType === 'Boolean' || this.pageVariableFieldConfig[key]?.fieldType === 'Boolean') {
        const booleanValue = this.parseBoolean(value);
        this.patchFormControl(key, booleanValue);
      }
      else if (this.formFieldConfig[key]?.fieldType === 'number') {
        if (typeof value === 'string') {
          value = value.replace(/'/g, '');
        }
        const numberValue = Number(value);
        if (!isNaN(numberValue)) {
          this.patchFormControl(key, numberValue);
        }
      }
      else if (this.formFieldConfig[key]?.uiType === 'autosuggest') {
        this.handleLookupFields(value, key);
      }
      else {
        this.patchFormControl(key, value);
      }
      if (this.appUtilBaseService.restricedtFilterParams(value)) {
        this.backupData[key] = value;
      }
      }
    });
  }
parseDate(value: any): Date | null {
        if (typeof value === 'string') {
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1); // Remove the surrounding double quotes
            }
    
            // Attempt to parse ISO 8601 date format
            const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
            if (isoDateRegex.test(value)) {
                const parsedDate = new Date(value);
                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate;
                }
            }
            
            console.error(`Unable to parse date: ${value}`);
        }
        
        return null;
    }

  parseBoolean(value: any): boolean {
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  }
   patchFormControl(key: string, value: any) {
          const control = this.detailFormControls.get(key) || this.pageVariableControls.get(key);
        if (control) {
            control.patchValue(value);
        } else {
            console.error(`Form control not found for key: ${key}`);
        }
    }
    
    // Method in which provides new datail page by resetting form
    onNew() {
  if(this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData,this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields),true)){
      this.detailFormControls.reset();
      this.data = {};
      this.backupData = {...this.detailFormControls.value};
      const detailPageUrl = this.router.url.includes('?') ? this.router.url.split('?')[0] : this.router.url;
      sessionStorage.setItem(detailPageUrl, '{}');
      let gridConfig: any;
      // Check if gridConfig exists in localStorage
      if (localStorage.getItem('holdFilters')) {
        try {
          gridConfig = JSON.parse(localStorage.getItem('holdFilters')!);
        } catch (error) {
          console.error("Error parsing gridConfig from localStorage:", error);
          gridConfig = null; // Default to null or some other default value
        }
      } else {
        gridConfig = {}; // Set to a default value if not present in localStorage
      }
      this.activatedRoute.queryParams.subscribe((params: any) => { 
        this.pid = params['pid'];
      });
      if(gridConfig){
        this.queryParams = {isCreate:"yes",...gridConfig};
     }
     else{
       this.queryParams = {isCreate:"yes",pid:this.pid};
     }
     if(this.pid){
      this.queryParams ={...this.queryParams,pid:this.pid}
     }
     if (this.dynamicDialogConfig?.data?.popup) {
       this.dynamicDialogConfig.data = {
        id:"",
        pid:"",
        popup:true,
        queryParams:this.queryParams
       }
       this.onInit();  
     }
     else{
       this.dynamicDialogConfig = {};
       const navigationExtras: any = {
         relativeTo: this.activatedRoute,
         queryParams:  this.queryParams,  // Set only the 'id' parameter
         queryParamsHandling: '',  // Clear all existing query parameters
         replaceUrl: true
     };
     
     this.router.navigate([], navigationExtras).then(() => {
         this.onInit();  // Assuming this method handles initialization
         this.enableChildOptions();  // Enable child options after navigation
     });
     }
       }
  else{
   this.confirmationService.confirm({
     message: this.translateService.instant('Do_you_want_to_reset_all_changes_QUESTION'),
     header: this.translateService.instant('Confirmation'),
     icon: 'pi pi-info-circle',
     accept: () => {
       this.detailFormControls.reset();
       this.data = {};
       this.backupData = {...this.detailFormControls.value};
       let gridConfig: any;
       // Check if gridConfig exists in localStorage
       if (localStorage.getItem('holdFilters')) {
        try {
          gridConfig = JSON.parse(localStorage.getItem('holdFilters')!);
        } catch (error) {
          console.error("Error parsing gridConfig from localStorage:", error);
          gridConfig = null; // Default to null or some other default value
        }
      } else {
        gridConfig = {}; // Set to a default value if not present in localStorage
      }
      this.activatedRoute.queryParams.subscribe((params: any) => { 
        this.pid = params['pid'];
      });
      if(gridConfig){
        this.queryParams = {isCreate:"yes",...gridConfig};
     }
       else{
         this.queryParams = {isCreate:"yes"};
       }
       if(this.pid){
        this.queryParams ={...this.queryParams,pid:this.pid}
       }
       if (this.dynamicDialogConfig?.data?.popup) {
         this.dynamicDialogConfig.data = {
          id:"",
          pid:"",
          popup:true,
          queryParams:this.queryParams
         }
         this.onInit();  
       }
       else{
         this.dynamicDialogConfig = {};
         const navigationExtras: any = {
           relativeTo: this.activatedRoute,
           queryParams:  this.queryParams,  // Set only the 'id' parameter
           queryParamsHandling: '',  // Clear all existing query parameters
           replaceUrl: true
       };
       
       this.router.navigate([], navigationExtras).then(() => {
           this.onInit();  // Assuming this method handles initialization
           this.enableChildOptions();  // Enable child options after navigation
       });
       }
     },
     reject: () => {
     },
   });
  }
 }

handleLookupFields(value: any, key: string) {
    const parentField = this.formFieldConfig[key].parentField || 'displayField';
    let lookupData: any = {};
    if (typeof value === 'string') {
      try {
        lookupData = JSON.parse(value);
      } catch (error) {
        // console.error('Error parsing JSON:', error);
      }
    }
    if (this.appUtilBaseService.isObject(lookupData) && lookupData?.displayField && lookupData[parentField]) {
      this.patchFormControl(key, lookupData);
    } else {
      // Value should be parent value of the field for proper functionality
      this.data[key] = value;
      this.getListofServicesTobeFired().subscribe({
        next: (data) => {
          this.formatRawData();
        },
        error: (err) => {
          console.error('Error fetching services:', err);
        }
      });
    }
  }

  actionButtonHideShow(children?: any, isPopup?: boolean) {
    
    children?.map((obj:any)=>{

      if (obj?.action === 'back' && isPopup) {
        obj.visibility = 'hide'
      } else if (obj?.action === 'save_and_close' && !isPopup) {
        obj.visibility = 'hide'
      }

      if (obj?.children) {
        this.actionButtonHideShow(obj.children, isPopup);
      }
    });
  
  }
 onBeforeValidationCheck(eventFromChild: any) {
    if (this.dynamicDialogConfig?.data?.popup) {
      if (this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true)) {
        if (eventFromChild.data == 'navigate_to_new_page') {
          this.appUtilBaseService.closeAllActivePopups();
        }
        eventFromChild.parentCallbackFunction('true');
      } else {
        this.confirmationService.confirm({
          message: this.translateService.instant('Do_you_want_to_reset_all_changes_QUESTION'),
          header: this.translateService.instant('Confirmation'),
          icon: 'pi pi-info-circle',
          accept: () => {
            if (eventFromChild.data == 'navigate_to_new_page') {
              this.appUtilBaseService.closeAllActivePopups();
            }
            eventFromChild.parentCallbackFunction('true')
          },
          reject: () => {
            eventFromChild.parentCallbackFunction('false')
          },
        });
      }
    } else {
      eventFromChild.parentCallbackFunction('true')
    }
  }
  
hideNotAllowdActions() {
    if (!this.id ) {
      this.appUtilBaseService.updateButtonVisibilityBasedonAllowedActions(
        //hiding the update actions on create
        [...this.queryViewNotAllowedActions, ...['delete', 'activate', 'deactivate']],
        {
          left: this.leftActionBarConfig.children ? this.leftActionBarConfig : { children: [] },
          right: { children: [] }
        },
        this.conditionalActions,
        {
          id: this.id,
          queryParams: this.queryParams,
          data: this.data,
          hasConfigurationPriority: true,
        }
      );
    }
    else {
      const lowerCaseNotAllowedActions = this.queryViewNotAllowedActions.map((action: string) => action.toLowerCase());

      const allowedActions = ['delete', 'activate', 'deactivate'].filter(action =>
        !lowerCaseNotAllowedActions.includes(action)
      );
      this.appUtilBaseService.updateButtonVisibilityBasedonAllowedActions(
        this.queryViewNotAllowedActions,
        {
          left: this.leftActionBarConfig,
          right: { children: [] }
        },
        this.conditionalActions,
        {
          id: this.id,
          queryParams: this.queryParams,
          data: this.data,
          hasConfigurationPriority: true,
          allowedActions: allowedActions
        }
      );
    }
  }
  
getMapData() {
    return {
      ...this.detailFormControls.getRawValue(),

      ...this.pageVariableControls.getRawValue(),
      ...{saveTriggered:this.saveTriggered}
    };
  }
	initializeCaptionBar() {
    for (const captionItem of this.detailCaptionBarConfig.children) {
      if (this.data && captionItem) {
        this.formattedCaptionData[captionItem.field] = this.formatCaptionItems(captionItem, this.data);
      }
    }
  }


  formatCaptionItems(config: any, data: any) {
    if (Object.keys(data).length > 0) {
      const controls = this.detailFormControls.getRawValue();
      let value = '';
      if (typeof data[config.field] === 'object' && Object.keys(data[config.field]).length > 0) {
        value = data[config.field]['displayField'] || data[config.field];
      } else {
        value = controls[config.field] ? controls[config.field] : data[config.field];
      }
      if (!(value === null || value === undefined) && config.uiType !== 'autosuggest') {
        return this.appUtilBaseService.formatRawDatatoRedableFormat(config, value);
      }
      else{
        return value;
      }
    }
    return '';
  }
	getDateTimeFields() {
    return ['createdDate','modifiedDate'];
  }

  getDateFields() {
    return [];
  }
  
  
  getTranslatableFields() {
    return [];
  }
  
  
  getEmailFields(){
  	return [];
  }
  

  /**
  * Ignore fields from displaying in the changelog details
  */
  getIgnoreFields() {
    return ['sid', 'pid'];
  }
  
  
onChangelog() {
    this.dialogService.open(ChangeLogsComponent, {
      showHeader: true,
      closable: true,
      width: "90%",
      styleClass: "modal-xl modal-changelog",
      data: {
        dateFields: this.getDateFields(),
        dateTimeFields: this.getDateTimeFields(),
        ignoreFields: this.getIgnoreFields(),
        translatableFields:this.getTranslatableFields(),
        emailFields:this.getEmailFields(),
        config :this.formFieldConfig,
        filters: [{
          label: 'BASIC_DETAIL'
        }],
        entityId : this.data.sid,
        entityName : 'Table1',
        fieldName : null,
        fromModifiedDate : new Date().getTime(),
        useModifiedDate: true,
        translations: {}
      }
    });
  }
	enableChildOptions(){
	}
	workflowActionBarAction(btn: any) {
    if(!btn.wfAction) {
      if(btn.action)
        this.actionBarAction(btn);
      return;
    }
    let action: Exclude<keyof Table1DetailBaseComponent, ' '>;
    const methodName: any = (`onwf` + btn.wfAction.charAt(0).toUpperCase() + btn.wfAction.slice(1));
    action = methodName;
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    if(!this.isRCWorkflowChosen) {
      this.mandatoryFields = this.formSecurityConfig?.mandatoryfields?.hasOwnProperty(btn.wfAction) ? this.formSecurityConfig.mandatoryfields[btn.wfAction] : {}
      if (Object.keys(this.mandatoryFields).length > 0)
        this.addValidations(this.mandatoryFields);
    }

      if (!this.appUtilBaseService.validateNestedForms(this.detailFormControls, this.formErrors, finalArr, this.inValidFields,this.formFieldConfig) && btn.wfAction !== 'resumeRuntimeWorkflow' && btn.wfAction !== 'resumeRuntimeCreate' && btn.wfAction !== 'resumeRuntimeUpdate') {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), life: 5000 });
        if (Object.keys(this.mandatoryFields).length > 0)
          this.clearValidations(this.mandatoryFields);
      }
    } else {
        if (typeof this[action] === "function") {
          const actionLabel = this.translateService.instant(btn.label);
          this.confirmationReference= this.dialogService.open(WorkflowConfirmationPopupComponent, {
            header: this.translateService.instant('Confirmation'),
            width: AppConstants.isMobile ? '90%' : '30%',
            contentStyle: { "max-height": "500px", "overflow": "auto" },
            styleClass: "confirm-popup-container",
            data: {
              confirmationMsg: `${this.translateService.instant('Do_you_want_to')} ${actionLabel} ${this.translateService.instant('the_record')} ?`,
              isRequired: this.formSecurityConfig.comments?.hasOwnProperty(btn.wfAction) && this.formSecurityConfig.comments[btn.wfAction],
              action:btn.label
            }
          });

          this.confirmationReference.onClose.subscribe((result: any) => {
            if (Object.keys(this.mandatoryFields).length > 0)
              this.clearValidations(this.mandatoryFields);
            if (result?.accepted) {
              this.comments = result.comments;
            if(!(this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true))) {
                this.isSaveResponseReceived = false;
                const isToastNotNeeded = true;
                this.onSave(isToastNotNeeded);
                let checkResponse = setInterval(() => {
                  if (this.isSaveResponseReceived) {
                    if (this.isSaveSuccess) {
                      this[action]();
                    }
                    clearInterval(checkResponse);
                  }
                }, 1000);
              }
              else {
                  this[action]();
              }
            }
          });
        }
    }
  }
addValidations(mandatoryFields:[]){
    mandatoryFields.forEach((controlName:string)=>{
      if(this.detailFormControls.controls[controlName]?.hasValidator(Validators.required)){
        if(!(this.validatorsRetained.hasOwnProperty(controlName))){
          this.validatorsRetained[controlName]= {}
        }
        this.validatorsRetained[controlName]['requiredValidator'] = true;
      }
      else{
        this.detailFormControls.controls[controlName]?.addValidators([Validators.required]);
        this.detailFormControls.controls[controlName]?.updateValueAndValidity({emitEvent:false});
      }
     })
  }

  clearValidations(mandatoryFields: []) {
    mandatoryFields.forEach((controlName: string) => {
      if (!(this.validatorsRetained[controlName] && this.validatorsRetained[controlName]['requiredValidator'])) {
        this.formFieldConfig[controlName].isRequired = false;
        this.formFieldConfig[controlName].mandatory = "no";
        this.detailFormControls.controls[controlName].removeValidators(Validators.required);
        this.detailFormControls.controls[controlName].updateValueAndValidity({emitEvent:false});
      }

    })
  }

configureFormOnWorkflow(workflowDataForNewRecord?:any) {
    const actions: any = this.workflowActionBarConfig?.children;
    let workflowInformation:any = {}
    let workflowDataForNewRec = workflowDataForNewRecord || {};
 if (this.id) {
workflowInformation.actors = this.data?.workflowInfo && this.data?.workflowInfo[this.workflowType]?.userTypes || [],
workflowInformation.step = this.data?.workflowInfo && this.data?.workflowInfo[this.workflowType]?.step || ''
}
else {
workflowInformation.actors = workflowDataForNewRec.actors || [];
workflowInformation.step = workflowDataForNewRec.step || '';
}
    this.formSecurityConfig = this.appUtilBaseService.getFormSecurityConfigFromSecurityJSON(this.securityJson, this.detailFormControls, actions, workflowInformation);
    console.log(this.formSecurityConfig)
    this.hiddenFields = this.formSecurityConfig.hidefields;

    for (const control in this.detailFormControls.getRawValue()) {
      if (this.formSecurityConfig.disableonlyfields.indexOf(control) > -1)
      // && !(this.formSecurityConfig.enableonlyfields.indexOf(control) > -1)) 
      {
        this.detailFormControls.controls[control].disable({ emitEvent: false });
      }
      if (this.formSecurityConfig.enableonlyfields.indexOf(control) > -1) {
        this.detailFormControls.controls[control].enable({ emitEvent: false });
      }
      if (this.formSecurityConfig.hidefields.indexOf(control) > -1 )
      // && !(this.formSecurityConfig.showfields.indexOf(control) > -1)) 
      {
        this.hiddenFields[control] = true;
      }
      if (this.formSecurityConfig.showfields.indexOf(control) > -1) {
        this.hiddenFields[control] = false;
      }
      if(this.formSecurityConfig?.mandatoryfields && ((Object.keys(this.formSecurityConfig.mandatoryfields).length)==1)){
        const mandatoryFields:any = Object.values(this.formSecurityConfig.mandatoryfields)[0];
        if(mandatoryFields.includes(control)){
         this.formFieldConfig[control].mandatory = "yes";
         this.formFieldConfig[control].isRequired = true;
         }
      }
    }
    this.workflowActions = {
      disableActions: [...this.formSecurityConfig.disableonlyactions],
      enableActions: [...this.formSecurityConfig.enableonlyactions],
      hideActions: [...this.formSecurityConfig.hideactions],
      showActions: [...this.formSecurityConfig.showactions]
    }
    this.wfNotInitiated = false;
  }


   waitForResponse() {
    if (environment.prototype) {
      this.getWorkflowConfig();
    }
      }
  initWorkflow() {
    if (this.workFlowInitialState && this.workFlowEnabled && this.workFlowField) {
      this.detailFormConfig?.children?.forEach((ele: any) => {
        if (ele?.field === this.workFlowField && ele?.multipleValues) {
          this.detailFormControls.get(this.workFlowField)?.patchValue([this.workFlowInitialState], { emitEvent: false });
          this.backupData[this.workFlowField] = [this.workFlowInitialState];
        }
        else {
          if (ele?.field === this.workFlowField && !ele?.multipleValues) {
            this.detailFormControls.get(this.workFlowField)?.patchValue(this.workFlowInitialState, { emitEvent: false });
            this.backupData[this.workFlowField] = this.workFlowInitialState;
          }
        }
      })
      this.activatedRoute.queryParams.subscribe((params: any) => {
        if (!environment.prototype && !params['id']) {
        const currentUserData= this.appGlobalService.getCurrentUserData();
          const state = this.workFlowInitialState ? this.workFlowInitialState.replace(/ /g, "_").toLowerCase() : '';
         this.appBaseService.getUserRoles().subscribe((response:any)=>{
            this.currentUserRolesMapping = response;
            const actors = this.getRoleShortName(currentUserData.userRoles) || [];
            const workflowInfo = { actors: actors, step: state }
             this.getWorkflowConfig(workflowInfo);
          })
        }
      });

    }
  }

 getRoleShortName(currentUserData:any){
    const tmData:any =[];
    currentUserData.map((o:string)=>{
      if(this.currentUserRolesMapping[o]){
        const d:string =  this.currentUserRolesMapping[o] || '';
        tmData.push(d);
      }
    })
    return tmData;
  }

  camelize(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0
          ? letter.toLowerCase()
          : letter.toUpperCase()
      )
      .replace(/\s+/g, '');
  }
	deleteFiles(splittedData: any) {
       return of(splittedData);
  }
	calculateFormula(){
	
}
	getData(){
  if (environment.prototype && this.id) {
    const params = {
      sid: this.id
    };
    this.table1Service.getProtoTypingDataById(params).subscribe((res: any) => {
      res = JSON.parse(JSON.stringify(res))
    for (let key in res) {
        if (this.formFieldConfig[key]?.fieldType =="Date") {
            res[key] = new Date(res[key]);
        }
      }
      this.data = res;
      this.backupData = res;
      this.detailFormControls.patchValue(this.backupData);
      this.setDefaultValues(true);
    });
    this.initializeCaptionBar();
  } else if (this.id) {
      const params = {
          sid: this.id
        };
            const dataSubscription = this.table1Service.getById(params).subscribe((res: any) => {
              this.data = res || {};
              this.metaData = {
                ...this.metaData,
                ...this.data && {
                  sid: this.data.sid,
                  createdBy: this.data.createdBy,
                  createdDate: this.data.createdDate,
                  modifiedBy: this.data.modifiedBy,
                  modifiedDate: this.data.modifiedDate
                }
              };
              this.getListofServicesTobeFired().subscribe((responses: any[]) => {
                  this.formatRawData();
                  this.setDefaultValues(true);
                });
            });
        this.subscriptions.push(dataSubscription);
  }
  else {
    this.wfNotInitiated = true;
    this.setDefaultValues();
    this.getListofServicesTobeFired(true).subscribe((responses: any[]) => {
      this.formatRawData();
    });
    this.backupData = this.appUtilBaseService.deepClone(this.detailFormControls.getRawValue());
  }
}

    onInit() {
		
	this.waitForResponse();
this.initWorkflow();

		this.isComponentInitiated = true;
this.getId();   
this.initForm();
this.calculateFormula();
this.initFormValidations();
this.activeTabIndexes = this.appUtilBaseService.generateDynamicTabViewProps(this.detailFormStructureConfig);
this.setTabState();
this.showWorkflowSimulator = Boolean(this.isPrototype && this.workFlowEnabled);
this.getUserRoles();
this.bindLookupFields();
this.addValidatorsForMinMaxDateValidation();
this.addValidatorsForMultiValues();
this.readOnlyBasedonRoles();
this.mapIndexedFields();
localStorage.setItem("formChanged", JSON.stringify(false));
  this.detailFormControls.valueChanges.subscribe((newValue) => {
    if((Object.keys(this.backupData).length==0 && this.id)||(this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData,this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields),true))){
      localStorage.setItem("formChanged", JSON.stringify(false));
    }
  else{
  localStorage.setItem("formChanged", JSON.stringify(true));
  }
  });
this.combinedActionConfig = this.leftActionBarConfig?.children ?? [];
this.hideNotAllowdActions();

    }
	
     onDestroy() {
		    this.bindPageVariablesSubscriptions.forEach((subs: Subscription) => { subs?.unsubscribe(); });

    }
     onAfterViewInit() {
		     this.isComponentInitiated=false;
	 this.scrolltoTop();
	 this.appUtilBaseService.setCurrentPageGlobally();

    }
    
    onChanges(changes:any) {
	}
}
