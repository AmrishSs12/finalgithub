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
import { Table1DetailComponent } from '@app/table1/table1/table1-detail/table1-detail.component'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@libsrc/confirmation/confirmation-popup.component';
import { FormControl, FormGroup, Validators, AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Renderer2, ViewChild } from '@angular/core';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { GridComponent } from '@libsrc/grid/grid.component';
import { environment } from '@env/environment';
import { distinctUntilChanged, switchMap, Observable, Subject, debounceTime, fromEvent, catchError, combineLatest, of, Observer, forkJoin, Subscription, map } from 'rxjs';
import { Location } from '@angular/common';
import { Filter } from '@baseapp/vs-models/filter.model';
import { BaseService } from '@baseapp/base.service';

@Directive(
{
	providers:[MessageService, ConfirmationService, DialogService, DynamicDialogConfig]
}
)
export class Table1ListBaseComponent{
	
	showGrid:boolean = true;



	isSearchFocused:boolean = false;
showBreadcrumb = AppConstants.showBreadcrumb;
mappedFiltersDisplay:any ={};
tooltipText:string =''


		
showAdvancedSearch: boolean = false;
typingDelay = 1500; 
isSearchActive = false; 
typingTimer: any; 
advancedSearchValue: any; 

tableSearchFieldConfig:any = {};
@ViewChild('toggleButton')
  toggleButton!: ElementRef;
  @ViewChild('menu')
  menu!: ElementRef;
 filtersApplied:boolean = false;


	quickFilter: any;
isQuickFilterTypingActive: boolean = false;
hiddenFields:any = {};
quickFilterFieldConfig:any={}

		  selectedValues: any[] = [];
  filter: Filter = {
    globalSearch: '',
    advancedSearch: {},
    sortField: null,
    sortOrder: null,
    quickFilter: {}
  };
params: any;
isMobile: boolean = AppConstants.isMobile;
combinedActionConfig:any =[];

  gridData: Table1Base[] = [];
  totalRecords: number = 0;
  subscriptions: Subscription[] = [];
 multiSortMeta:any =[];
 selectedColumns:any =[];
subHeader: any;
  autoSuggest: any;
  query: any;

rightFreezeColums:any;
total:number =0;
inValidFields:any = {};
selectedItems:any ={};
scrollTop:number =0;
isRowSelected: boolean = false;
isPrototype = environment.prototype;
  workFlowEnabled = false;
isList = true;
isPageLoading:boolean = false;
autoSuggestPageNo:number = 0;
complexAutoSuggestPageNo:number = 0
localStorageStateKey = "table1-list";
showMenu: boolean = false;
conditionalActions:any ={
  disableActions:[],
  hideActions:[]
}
filterActions: any = {
  hideActions: []
}
pageVariableFieldConfig:any ={};

isRCWorkflowChosen: boolean = false;

actionBarConfig:any =[];
first: number =0;
rows: number = 0;
updatedRecords:Table1Base[] = [];
showPaginationOnTop = AppConstants.showPaginationonTop;
 showPaginationOnBottom = AppConstants.showPaginationonBottom;
 tableFieldConfig:any ={};
dateFormat: string = AppConstants.calDateFormat;
selectedRowId: any = '';
 showWorkflowSimulator:boolean = false;
 gridConfig: any = {};
  @ViewChild(GridComponent)
  public gridComponent: any = GridComponent;
separator = "__";
timeFormatPrimeNG: string = AppConstants.timeFormatPrimeNG;
dateFormatPrimeNG: string = AppConstants.dateFormatPrimeNG ;
minFraction = AppConstants.minFraction;
maxFraction = AppConstants.maxFraction;
currency = AppConstants.currency;
currencyDisplay = AppConstants.currencyDisplay;
 responseData:any =[];
defaultActions= ['save','cancel','delete','activate','deactivate','refresh','back','changelog','workflowhistory','import','export','new'];
detailComponent= 'Table1DetailBaseComponent'; //adding the detail component here
queryViewList:boolean = false; // dynamic Variable has to be updated here
showonFilter:boolean = false;
selectedRows:any =[];
@Input() filters:any ={};
@Input() componentId:string ='';
@Input() mapData:any ={};
@Input() dynamicDialogConfigFromDetailPage: any = {};
priorGridParams:any ={};
queryViewFiltersApplied: boolean = false;
 gridEmptyMsg: string = '';
holdFilters:string[] =[];
defaultFilters:string[]=[];
defaultFilterSettings:any={};
@Input() mapConfig:any = {};
filtersFromParent:any ={};
hasMappedParameters:boolean = false;
@Input() existingFormDataFromParent:any = {};
@Input() existingFormId:string ='';
@Input() fromDetailPage:boolean = false;
@Output() onBeforeValidationEmitter: EventEmitter<any> = new EventEmitter();
globalStorageKey:string ="";
currentPaginationStart:any = 0;
@Input() standardGrid:boolean = false;
@Input() pageIdentifier:string ="";
restorefilters:boolean = false;
currentUserInfo:any;
@Input() metaData?:any ={};
@Input() hideListPageTitle?: boolean = false;
@Input() childPageLimit: string = '10';
filterValues: any = {};
fromResetFilter: string = '';
changedFilterValues: any = {};
changedFilterReferenceValues: any = {};
changedSearchValues: any = {};
changedSearchReferenceValues: any = {};

	isChildPage:boolean = false;
	queryViewNotAllowedActions:any = [];
	componentMapping: { [key: string]: any } = {
	};
	
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
    "defaultDetailPageEnabled" : false,
    "visibility" : "show",
    "buttonStyle" : "curved",
    "confirmationText" : "confirm",
    "label" : "New",
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
    "buttonId" : "NewbuttonId1",
    "buttonEnabled" : "yes",
    "action" : "new",
    "confirmationTitle" : "confirmation",
    "hideListPageTitle" : false,
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  }, {
    "defaultDetailPageEnabled" : false,
    "visibility" : "show",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-trash-alt",
        "value" : "fas fa-trash-alt"
      },
      "iconColor" : "#000000",
      "iconSize" : "13px"
    },
    "confirmationText" : "confirm",
    "label" : "Delete",
    "enableLookup" : false,
    "type" : "button",
    "beforeAction" : "none",
    "detailPagePopupWidth" : 70,
    "outline" : false,
    "buttonType" : "icon_only",
    "autoFillLookup" : false,
    "showOn" : "both",
    "displayAsToggleSwitch" : false,
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "DeletebuttonId2",
    "buttonEnabled" : "yes",
    "action" : "delete",
    "confirmationTitle" : "confirmation",
    "hideListPageTitle" : false,
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  }, {
    "defaultDetailPageEnabled" : false,
    "visibility" : "show",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-sync",
        "value" : "fas fa-sync"
      },
      "iconColor" : "#000000",
      "iconSize" : "13px"
    },
    "confirmationText" : "confirm",
    "label" : "Refresh",
    "enableLookup" : false,
    "type" : "button",
    "beforeAction" : "none",
    "detailPagePopupWidth" : 70,
    "outline" : false,
    "buttonType" : "icon_only",
    "autoFillLookup" : false,
    "showOn" : "both",
    "displayAsToggleSwitch" : false,
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "RefreshbuttonId3",
    "buttonEnabled" : "yes",
    "action" : "refresh",
    "confirmationTitle" : "confirmation",
    "hideListPageTitle" : false,
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  } ],
  "type" : "actionBar"
}
	rightActionBarConfig : any = {
  "type" : "actionBar"
}
	tableSearchConfig : any = {
  "defaultDetailPageEnabled" : false,
  "disabledFieldsByLookup" : [ ],
  "columns" : "1",
  "enableLookup" : false,
  "type" : "tableSearch",
  "detailPagePopupWidth" : 70,
  "outline" : false,
  "children" : [ ],
  "autoFillLookup" : false,
  "displayAsToggleSwitch" : false,
  "hideListPageTitle" : false,
  "showAdvancedSearch" : true,
  "queryViewMapping" : { }
}
	quickFilterConfig : any = {
  "detailPagePopupWidth" : 70,
  "defaultDetailPageEnabled" : false,
  "outline" : false,
  "disabledFieldsByLookup" : [ ],
  "children" : [ ],
  "autoFillLookup" : false,
  "displayAsToggleSwitch" : false,
  "hideListPageTitle" : false,
  "enableLookup" : false,
  "type" : "quickFilter",
  "queryViewMapping" : { }
}
	defaultFilterConfig : any = {
  "children" : [ ]
}
	customRenderConfig : any = {
  "children" : [
     ]
}
	tableConfig : any = {
  "defaultDetailPageEnabled" : false,
  "rightFreezeFromColumn" : "0",
  "columnReorder" : false,
  "type" : "grid",
  "showDetailPageAs" : "as_a_popup",
  "rowGroup" : "no",
  "outline" : false,
  "children" : [ {
    "fieldName" : "f1",
    "data" : "",
    "formatDisplay" : false,
    "isQueryView" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : false,
    "label" : "f1",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "f1",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "f1",
    "uiType" : "text",
    "isForeignTableField" : false,
    "fieldType" : "string",
    "fieldId" : "f1"
  } ],
  "toggleColumns" : false,
  "displayAsToggleSwitch" : false,
  "sorting" : "single_column",
  "rowSpacing" : "medium",
  "detailPageParametersMapping" : [ ],
  "rowHeight" : "medium",
  "striped" : true,
  "recordSelection" : "multiple_records",
  "showTotalCountForStandardPages" : "AUTO",
  "inlineEditing" : false,
  "viewAs" : "list",
  "hoverStyle" : "box",
  "tableStyle" : "style_2",
  "enableLookup" : false,
  "detailPagePopupWidth" : 70,
  "pageLimit" : "50",
  "leftFreezeUptoColumn" : "0",
  "detailPageMapping" : [ ],
  "runtimeWorkflowEnabled" : false,
  "rememberLastTableSettings" : false,
  "columnResize" : false,
  "autoFillLookup" : false,
  "showGridlines" : false,
  "sortOrder" : "asc",
  "detailPage" : {
    "sid" : "16af80c6-3e37-47f4-b565-9d6bcaf2663b",
    "name" : "table1 Detail",
    "url" : "/table1/table1detail"
  },
  "detailPageNavigation" : "click_of_the_row",
  "tableId" : "8b2c3f37-885e-428d-9208-330e40339ff8",
  "hideListPageTitle" : false,
  "countRequired" : true
}
	pageVariables : any = {
  "children" : [ ]
}
	pageViewTitle: string = 'table1_List';
	
	public table1Service = inject(Table1Service);
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
public baseService = inject(BaseService);
public location = inject(Location);
		pageVariableControls : UntypedFormGroup = new UntypedFormGroup({
});

		tableSearchControls : UntypedFormGroup = new UntypedFormGroup({
});

		quickFilterControls : UntypedFormGroup = new UntypedFormGroup({
});


	onNew() {
  if (!this.tableConfig.detailPage?.url) return;

  let queryParams: any = {};
  this.getDetailpageParameters(queryParams);

  if (this.holdFilters.length > 0) {
    this.holdFilters.forEach((filter: string) => {
      const control = this.quickFilterControls.get(filter) || this.pageVariableControls.get(filter);
      if (this.shouldHoldValues(control, filter)) {
        if (
          this.quickFilterControls.get(filter)?.value ||
          this.filtersFromParent[filter] ||
          this.pageVariableControls.get(filter)?.value
        ) {
          const fieldConfig = this.quickFilterFieldConfig?.[filter];
          const parentField = fieldConfig?.parentField;
          const controlValue = this.quickFilterControls?.get(filter)?.value;

          if (
            fieldConfig?.uiType === 'autosuggest' &&
            parentField &&
            controlValue?.[parentField] != null
          ) {
            queryParams[filter] = controlValue[parentField];
          } else if (
            fieldConfig?.fieldType === 'Date' &&
            control instanceof FormGroup
          ) {
            queryParams[filter] = control.get('min')?.value || null;
          } else {
            queryParams[filter] = this.quickFilterControls.get(filter)?.value ||
                                  this.filtersFromParent[filter] ||
                                  this.pageVariableControls.get(filter)?.value;
          }
        }
      }
    });
  }

  localStorage.setItem('holdFilters', JSON.stringify(queryParams));

    const value: any = "parentId";
    let property: Exclude<keyof Table1ListBaseComponent, ''> = value;

    if (this.isChildPage && this[property]) {
      const methodName: any = "onNewChild";
      let action: Exclude<keyof Table1ListBaseComponent, ''> = methodName;

      if (typeof this[action] === "function") {
        this[action]({ 'isCreate': 'yes', ...queryParams });
      }
    } else {
      const routerUrl = this.router.url.includes('?') ? this.router.url.split('?')[0] : this.router.url;
      if (this.fromDetailPage) {
        this.onBeforeValidationEmitter.emit({
          data: this.tableConfig.showDetailPageAs,
          parentCallbackFunction: ((parentObj: any) => {
            if (parentObj == 'true') {
                  this.openDetailPopup('', '', { 'isCreate': 'yes', ...queryParams });
            }
          })
        });
      } else {
            this.openDetailPopup('', '', { 'isCreate': 'yes', ...queryParams });
      }
    }
}
	quickFilterApplied: boolean = false;

	filterSearch() {
    Object.keys(this.quickFilterControls.controls).forEach(controlName => {
      this.quickFilterControls.get(controlName)?.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(value => {
          if (!this.appUtilBaseService.isEqualIgnoreCase(this.quickFilterControls.getRawValue(), this.filter.quickFilter, [], true)) {
            let filterVals = { ...this.quickFilterControls.getRawValue() };
            if((this.quickFilterFieldConfig[controlName]?.uiType === "date" || this.quickFilterFieldConfig[controlName]?.uiType === "datetime") && filterVals[controlName] === null){
              filterVals[controlName] = '';
            }
            this.changedFilterValues[controlName] = filterVals[controlName];
            const hasDates = this.quickFilterConfig.children.filter((e: any) =>
              e.fieldType.toLowerCase() === "date" || e.fieldType.toLowerCase() === "datetime"
            );
            if (hasDates.length > 0) {
              this.handleDateFields(hasDates, filterVals, this.quickFilterControls.getRawValue(),false,true);
            }
            const hasNumbers = this.quickFilterConfig.children.filter((e: any) =>
              e.fieldType.toLowerCase() === "number" || e.fieldType.toLowerCase() === "double"
            );
            if (hasNumbers.length > 0) {
              this.handleNumberFields(hasNumbers, filterVals, this.quickFilterControls.getRawValue());
            }
            this.filter.quickFilter = filterVals;
            this.handleLookupFields(controlName);
            this.changedFilterReferenceValues[controlName] = filterVals[controlName];
            this.storeFilters('quickFilter');
            this.quickFilterApplied = this.appUtilBaseService.hasAtleastOneValidValue(filterVals);
            //if(this.quickFilterControls.dirty)
            this.triggerRefreshBasedOnTyping();
          }
        });
    });
  }

  onKeydownQuickFilter() {
      this.isQuickFilterTypingActive = true;
    }

   triggerRefreshBasedOnTyping() {
      if (this.isQuickFilterTypingActive) {
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => {
          this.onRefresh(false, true);
          this.isQuickFilterTypingActive = false;
        }, this.typingDelay);
      } else {
        this.onRefresh(false, true);
      }
    }

  sanitizeQueryParams(filterType: string){
    const sections = ['display', 'reference'] as const;
    const filter = this.filterValues[filterType];
    if (!filter) return;
    for (const section of sections) {
      const data = filter[section];
      if (data) {
        for (const [key, value] of Object.entries(data)) {
          if (value == null) {
            delete data[key];
          } else if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value && value.min == null && value.max == null) {
            delete data[key];
          }
        }
        if (Object.keys(data).length === 0) {
          delete filter[section];
        }
      }
    }
    if (Object.keys(filter).length === 0) {
      delete this.filterValues[filterType];
    }
  }

  storeFilters(filterType: string){
    let queryParams:any = {};
    let type;
    if(this.fromResetFilter){
      delete this.filterValues[filterType];
      if(this.fromResetFilter == 'qfReset'){
        this.changedFilterValues = {};
        this.changedFilterReferenceValues = {};
      } else if(this.fromResetFilter == 'searchReset'){
        this.changedSearchValues = {};
        this.changedSearchReferenceValues = {};
      }
    }
    if((filterType == 'quickFilter' || filterType == 'advancedSearch') && !this.fromResetFilter){
      this.filterValues[filterType] = {};
      this.filterValues[filterType].display = {};
      this.filterValues[filterType].reference = {};
    }
    if(filterType == 'quickFilter' && !this.fromResetFilter){
      this.filterValues[filterType].display = this.changedFilterValues;
      this.filterValues[filterType].reference = this.changedFilterReferenceValues;
    }
    else if(filterType == 'advancedSearch' && !this.fromResetFilter){
      this.filterValues[filterType].display = this.changedSearchValues;
      this.filterValues[filterType].reference = this.changedSearchReferenceValues;
    }
    else if(filterType == 'pageStart'){
      if(this.currentPaginationStart == 0){
        if(this.filterValues?.[filterType]){
          delete this.filterValues[filterType];
        }
      }else{
        this.filterValues[filterType] = this.currentPaginationStart;
      }
    }
    else if(filterType == 'globalSearch' || filterType == 'advancedSearch'){
      if(this.filter.globalSearch == ''){
        if(this.filterValues?.[filterType]){
          delete this.filterValues[filterType];
        }
      }else{
        this.filterValues[filterType] = this.filter.globalSearch;
      }
    }
    if((filterType == 'quickFilter' || filterType == 'advancedSearch') && !this.fromResetFilter){
      this.sanitizeQueryParams(filterType);
    }
    if(!this.filterValues['quickFilter'] && !this.filterValues['advancedSearch'] && (!this.filterValues['globalSearch'] || this.filterValues['globalSearch']=='') && (!this.filterValues['pageStart'] || this.filterValues['pageStart']==0)){
      this.filterValues = {};
      queryParams = { ...this.activatedRoute.snapshot.queryParams };
      delete queryParams[this.globalStorageKey];
    }else{
      queryParams[this.globalStorageKey] = JSON.stringify(this.filterValues);
      type = 'merge';
    }
    this.fromResetFilter = '';
    this.appendFiltersToQueryParams(queryParams, type);
  }

  appendFiltersToQueryParams(queryParams?: any, type?: any){
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: type,
      replaceUrl: true
    });
  }

getChangedFilters(prevValue: any, currValue: any){}

handleLookupFields(controlName: string){
  this.quickFilterConfig.children.forEach((field: any) => {
    if(field.filterOutputMapping && field.fieldName == controlName && field.filterOutputMapping.length != 0){
      field.filterOutputMapping.forEach((mapField: any) => {
        if(this.changedFilterReferenceValues[mapField.tableField]){
          delete this.changedFilterReferenceValues[mapField.tableField];
        }
        if(this.changedFilterValues[mapField.tableField]){
          delete this.changedFilterValues[mapField.tableField];
        }
      })
    }
  });
}

handleDateFields(hasDates: any[], filterVals: any, value: any, fromDefault?:boolean, fromFilterSearch?: boolean) {
    hasDates.forEach((f: any) => {
      const field = fromDefault ? f?.listField : f.name;
      const dateVal = fromDefault ? value[f?.detailField] : value[field];
      let val: any = {};

      if (!dateVal) {
        if(fromFilterSearch){
          filterVals[field] ="";
        }
        else{
          if (this.queryViewList) {
            filterVals[field] = null;
          } else {
            delete filterVals[field];
          }
        }
        return;
      }

      const findUiType = (field: any) => {
        const found = hasDates.find(item => item.listField === field && item.uiType =='date');
        return found ? found.uiType : null;
      };

      if (Array.isArray(dateVal)) {
        val = this.getDateRangeVal(field, dateVal);
        filterVals[field] = val;

        if (dateVal[0] == null && dateVal[1] == null) {
          delete filterVals[field];
        }
      } else if (typeof dateVal === 'object') {
        if (this.quickFilterFieldConfig[field]?.uiType === 'date' || findUiType(field)) {
          let tempDate1 = null;
          let tempDate2 = null;
          const createDate = (dateValue: any, isEndOfDay: boolean) => {
            if (dateValue !== undefined && dateValue !== null) {
              const tempDate = new Date(dateValue);
              if (isEndOfDay) {
                tempDate.setHours(23, 59, 59, 999); // Set to end of day
              } else {
                tempDate.setHours(0, 0, 0, 0); // Set to midnight
              }
              return tempDate;
            }
            return null;
          };
          tempDate1 = createDate(dateVal.hasOwnProperty('min') ? dateVal.min : dateVal, false);
          tempDate2 = createDate(dateVal.hasOwnProperty('max') ? dateVal.max : dateVal, true);
          if(this.queryViewList){
            if (dateVal !== undefined && dateVal !== null) { 
              const convertedDate1 = this.convertDateToString(dateVal);
              val = convertedDate1
            }
          }
          else{
            val = {
              lLimit: tempDate1 ? tempDate1.getTime() : null,
              uLimit: tempDate2 ? tempDate2.getTime() : null,
              type: "Date"
            };
          }
        } else {
          if(fromDefault){
            val = { lLimit: null, uLimit: dateVal ? new Date(dateVal).getTime() : null, type: "Date" };
            if(this.queryViewList){
              val = new Date(dateVal).getTime();
            }
          }
          else{
            val = { lLimit: new Date(dateVal.min).getTime(), uLimit: dateVal.max ? new Date(dateVal.max).getTime() : null, type: "Date" };
            if(this.queryViewList){
              val = new Date(dateVal).getTime();
            }
          }
        }
        if (val.lLimit || val.uLimit || this.queryViewList) {
          filterVals[field] = val;
        }
        if (!val.lLimit && !val.uLimit && !this.queryViewList) {
          delete filterVals[field];
        }
      }
    });
  }

handleNumberFields(hasNumbers: any[], filterVals: any, value: any) {
  hasNumbers.forEach((f: any) => {
      const field = f.name || f?.detailField;
      const numberValue = value[field];
      const isLookupField = f?.uiType === 'autosuggest';
      
      if (isLookupField) {
        if (!numberValue) {
          delete filterVals[field];
        }
      } else {
        if (numberValue && typeof numberValue === 'object' && !Array.isArray(numberValue)) {
            filterVals[field] = {
                lLimit: numberValue.min,
                uLimit: numberValue.max,
                type: "Number"
            };

            if (numberValue.min == null && numberValue.max == null) {
                delete filterVals[field];
            }
        }
      }
  });
}

getDateRangeVal(field: any, dateVal: any[]): any {
  const tempDate1 = new Date(dateVal[0]);
  const tempDate2 = new Date(dateVal[1]);
  const convertedDate1 = this.convertDateToString(tempDate1);
  const convertedDate2 = this.convertDateToString(tempDate2);

  return this.quickFilterFieldConfig[field].uiType === 'date'
      ? { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: dateVal[1] ? new Date(convertedDate2).getTime() : null, type: "Date" }
      : { lLimit: new Date(dateVal[0]).getTime(), uLimit: dateVal[1] ? new Date(dateVal[1]).getTime() : dateVal[1], type: "Date" };
}

 convertDateToString(date: Date): string {
  return date.getFullYear() + '-' + this.leftPad((date.getMonth() + 1), 2) + '-' + this.leftPad(date.getDate(), 2);
}
  addCustomFilters(){}

scrollFilterFieldsList(position: any, event: any) {
    if (position == 'right') {
      event.target.offsetParent?.children[1]?.scrollBy(200, 0)
    } else {
      event.target.offsetParent?.children[1]?.scrollBy(-200, 0)
    }
  }

checkIfScrollbarVisible() {
    const element: any = document.getElementById(this.localStorageStateKey);
    if (element) {
      const isScrollable = element.scrollWidth > element.clientWidth;
      if (!isScrollable) { return false }
    }; 
    return true;
  }

  manipulateDefaultFilters(){
    this.defaultFilterConfig.children.forEach((ele:any)=>{
      this.defaultFilters.push(ele.field);
      ele.holdFilterValue ? this.holdFilters.push(ele.field):'';
    })
    this.defaultFilterSettings = this.appUtilBaseService.getControlsFromFormConfig(this.defaultFilterConfig);
    this.quickFilterConfig = this.appUtilBaseService.mergeConfigs(this.quickFilterConfig,this.defaultFilterConfig);
  }

    initFilterForm(fromResetQuickFilter: Boolean = false) {
    this.appUtilBaseService.assignInitialValueToPageVariables(this.pageVariables, this.pageVariableControls);
    this.manipulateDefaultFilters();
    this.quickFilterFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.quickFilterConfig);
    this.addCustomFilters();
    if(!fromResetQuickFilter) {
      this.filterSearch();
    }
    for (const key in this.quickFilterFieldConfig) {
      if (this.quickFilterFieldConfig.hasOwnProperty(key)) {
        const field = this.quickFilterFieldConfig[key];
        if (field.mandatory === 'yes') {
          this.quickFilterControls.get(key)?.disable();
        }
        if (this.defaultFilters.includes(key)) {
          this.setDefaultFilters(field, key);
        }
        this.setFiltervisibility(field, key);
      }
    }
    const queryViewFilters = this.filters[this.componentId];
    if(fromResetQuickFilter){
      queryViewFilters?.forEach((filter: any) => {
      let overridenValue = filter.detailType == 'value' ? filter.tableField:''; // when having static value
       let value;
     if (this.queryViewList && (filter.type == 'plusDays' || filter.type == 'minusDays')) {
        value = this.appUtilBaseService.getAdjustedDate(filter.tableField, filter.type)
      } else {
        value = filter.staticValue ? filter.staticValue : this.mapData[filter.tableField] || overridenValue || this.metaData[filter.tableField];
      }
      if(!filter.staticValue){
      const control = this.quickFilterControls.get(filter.lookupField) || this.pageVariableControls.get(filter.lookupField);
      this.patchControlValue(control, value, filter);
      }
      if (filter.holdFilterValue) {
        if (!this.holdFilters.includes(filter.lookupField)) {
          this.holdFilters.push(filter.lookupField);
        }
        if (
          (filter?.uiType === 'autosuggest' && typeof this.mapData[filter.tableField] === 'object') ||
          (this.mapData[filter.tableField] && typeof this.mapData[filter.tableField] === 'object' && this.mapData[filter.tableField]?.referenceField)
        ) {
          this.filtersFromParent[filter.lookupField] = this.mapData[filter.tableField]['referenceField'];
        }
        else {
          this.filtersFromParent[filter.lookupField] = this.mapData[filter.tableField];
        }

      }
    });
    }
    
      if (((this.defaultFilters?.length > 0 || queryViewFilters?.length > 0)  && !this.restorefilters) || fromResetQuickFilter) {
      let filterVals = { ...this.quickFilterControls.getRawValue() };

        const hasDates = this.quickFilterConfig.children.filter((e: any) =>
          e.fieldType.toLowerCase() === "date" || e.fieldType.toLowerCase() === "datetime"
        );

        if (hasDates.length > 0) {
          this.handleDateFields(hasDates, filterVals, this.quickFilterControls.getRawValue());
        }

        const hasNumbers = this.quickFilterConfig.children.filter((e: any) =>
          e.fieldType.toLowerCase() === "number" || e.fieldType.toLowerCase() === "double"
        );

        if (hasNumbers.length > 0) {
          this.handleNumberFields(hasNumbers, filterVals, this.quickFilterControls.getRawValue());
        }

        this.filter.quickFilter = filterVals;
        if(fromResetQuickFilter){
          this.fromResetFilter = 'qfReset';
          this.storeFilters('quickFilter');
          this.onRefresh();
        }
      //this.quickFilterControls.updateValueAndValidity({ emitEvent: true });
    }
  }

  resolvecustomFilters(fieldconfig:any,key:string,defaultFilterSetting:any){

  }

  setDefaultFilters(field: any, key: string) {
  const control = this.quickFilterControls.get(key);
  const defaultFilterField = this.defaultFilterSettings[key];
   let defaultValue;
  if (defaultFilterField.type == 'pageVariable') {
    defaultValue = this.pageVariableControls.get(defaultFilterField.pageVariable)?.value;
  }
  // else if ((defaultFilterField.type == 'plusDays' || defaultFilterField.type == 'minusDays') && (field.uiType == 'date' || field.uiType == 'datetime')) {
   // defaultValue = this.appUtilBaseService.getAdjustedDate(field.value, field.type)
  //}
   else {
    defaultValue = defaultFilterField.value;
  }
  if (defaultFilterField.operator?.toLowerCase()?.trim() === 'is empty') {
    control?.patchValue(field.multiple ? ['IS_EMPTY'] : 'IS_EMPTY');
  }else if(field.fieldType == 'Boolean' && this.queryViewList && !defaultValue){
    this.patchControlValue(control,false,field);
  }  else if (defaultValue) {
    this.patchControlValue(control, defaultValue,field);
  } else if (defaultFilterField.isCustom) {
    this.resolvecustomFilters(field, key, this.defaultFilterSettings);
  }
  
}

patchControlValue(control: AbstractControl | null, defaultValue: any, field: any) {
    if (control instanceof FormGroup && typeof defaultValue !== 'string' && field.type !=='plusDays' && field.type !=='minusDays') {
      if (field.uiType == 'date' || field.uiType == 'datetime') {
        if(this.queryViewList){
          control?.patchValue(new Date(defaultValue), { emitEvent: false });
        }
        else{
          control.patchValue({
            min: defaultValue[0] ? new Date(defaultValue[0]): null,
            max: defaultValue[1] ? new Date(defaultValue[1]) : null,
          }, { emitEvent: false });
        }
      } else {
        control.patchValue({
          min: defaultValue[0],
          max: defaultValue[1],
        }, { emitEvent: false });
      }
    } else if(field?.uiType =='autosuggest' && this.queryViewList){
      control?.patchValue({displayField :defaultValue}, { emitEvent: false });
    } else if (typeof defaultValue === 'string') {
      defaultValue = this.getSpecialDateValue(defaultValue.toLowerCase(),field) || defaultValue;
      control?.patchValue(defaultValue, { emitEvent: false });
    } else if (typeof defaultValue === 'number' && field?.fieldType == 'Date'&& (field.type =='plusDays' || field.type =='minusDays')) {
      defaultValue = this.getPlusorMinusValue(defaultValue,field) || defaultValue;
      control?.patchValue(defaultValue, { emitEvent: false });
    } else if(field?.fieldType == 'Date'){
      control?.patchValue(defaultValue ? new Date(defaultValue) : null, { emitEvent: false });
    }
     else if(typeof defaultValue === 'object' && defaultValue !== null && defaultValue?.displayField){
          control?.patchValue(defaultValue.displayField, { emitEvent: false });
     }
    else {
      control?.patchValue(defaultValue, { emitEvent: false });
    }
  }
  
  
    getPlusorMinusValue(value: number, config: any) {
    const now = new Date();
    if (typeof value === 'number') {
      if (config.type === 'plusDays') {
        now.setDate(now.getDate() + value);
      } else if (config.type === 'minusDays') {
        now.setDate(now.getDate() - value);
      }
      if (config.uiType === 'datetime') {
        const min = new Date(now.setHours(0, 0, 0, 0));
        const max = new Date(now.setHours(23, 59, 59, 999));
        if (this.queryViewList) {
          return min;
        } else {
          return { min, max };
        }
      }
      return new Date(now.setHours(0, 0, 0, 0));
    }
    return null;
  }

getSpecialDateValue(value: string, config: any): { min: Date, max: Date } | Date | null {
    const now = new Date();
    if (value === 'today') {
      if (config.uiType === 'datetime') {
        const min = new Date(now.setHours(0, 0, 0, 0));
        const max = new Date(now.setHours(23, 59, 59, 999));
        if(this.queryViewList){
          return min;
        }
        else{
          return { min, max };
        }
      }
      return new Date(now.setHours(0, 0, 0, 0));
    } else if (value === 'tomorrow') {
      if (config.uiType === 'datetime') {
        const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        const max = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);
        if(this.queryViewList){
          return min;
        }
        else{
          return { min, max };
        }
      }
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    }
    return null;
  }

   setFiltervisibility(field: any, key: string) {
    const defaltFilterField = this.quickFilterFieldConfig[key];
    if (!defaltFilterField || defaltFilterField.viewInPages === undefined || defaltFilterField.editInPages === undefined) {
          return;
    }
    this.hiddenFields[key] = !defaltFilterField.viewInPages;
    if (defaltFilterField.viewInPages && defaltFilterField.editInPages) {
      this.quickFilterControls.get(key)?.enable({emitEvent:false});
    } else {
      this.quickFilterControls.get(key)?.disable({emitEvent:false});
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

   resetQuickFilterValues() {
    this.resetNestedFormGroupDeep(this.quickFilterControls);
    this.initFilterForm(true);
    this.quickFilterApplied = this.appUtilBaseService.hasAtleastOneValidValue(this.filter?.quickFilter);
  }

  resetNestedFormGroupDeep(formGroup: FormGroup) {
    if (!formGroup || !(formGroup instanceof FormGroup)) return;
  
    const resetValues = Object.keys(formGroup.controls).reduce((acc, key) => {
      const control = formGroup.get(key);
  
      if (control instanceof FormGroup) {
        // Recursively reset nested FormGroup
        this.resetNestedFormGroupDeep(control);
      } else if (control instanceof FormControl) {
          if (this.quickFilterFieldConfig?.[key]?.fieldType == 'Boolean' && this.queryViewList && !this.defaultFilters.includes(key) ) {
          acc[key] = false;
      }
          else if (!this.defaultFilters.includes(key) || (this.fromDetailPage && this.queryViewList)) {
          acc[key] = null;
      }
      }
  
      return acc;
    }, {} as any);
  
    formGroup.reset(resetValues, { emitEvent: false });
  }

 onDateChangeQf(ev:any,containerRef: { el: ElementRef }) {
             setTimeout(()=>{
               const $input = $(containerRef?.el?.nativeElement).find('input');
               if ($input.length === 0) return;
               const value = $input?.val() as string;
               const translatedValue = value
                .replace(AppConstants.amDesignator, this.translateService.instant(AppConstants.amDesignator))
                .replace(AppConstants.pmDesignator, this.translateService.instant(AppConstants.pmDesignator));
               $input.val(translatedValue);
             },0)

           }
           

       onPCalendarShowQf(nativeRef: any) {
                  const calendarPanel = nativeRef.overlay.firstElementChild
                  if (calendarPanel) {
                 
                    calendarPanel.addEventListener('click', (event: Event) => this.onPCalendarPanelClick(event, nativeRef));
                    calendarPanel.addEventListener('mousedown', (event: Event) => this.onPCalendarPanelClick(event, nativeRef));
                    
                  }
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

  preventCalendarClose(event: Event): void {
  event.stopPropagation(); // Prevent the click from propagating and closing the overlay
}


  
  onPCalendarPanelClick(event: Event, nativeRef: any) {

    const calendarPanel = nativeRef.overlay
    if (calendarPanel) {
    
      calendarPanel.addEventListener('click', (event: Event) => event.stopPropagation());
      calendarPanel.addEventListener('mousedown', (event: Event) => event.stopPropagation);
      
    }
    event?.stopPropagation();
  }
	actionBarAction(btn: any) {
    let methodName: any = btn.methodName ? btn.methodName : (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof Table1ListBaseComponent, ' '> = methodName;
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
      const onSave: Exclude<keyof Table1ListBaseComponent, ' '> = methodName.split('_')[0];
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
    let action: Exclude<keyof Table1ListBaseComponent, ' '> = methodName;
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
	onUpdate(id: any, event?: any, data?: any) {
    let qparams: any = {};
    if (!this.tableConfig.detailPage?.url) return;
    const value: any = "parentId";
    let property: Exclude<keyof Table1ListBaseComponent, '' > = value;
    const methodName: any = "onUpdateChild";
    let action: Exclude<keyof Table1ListBaseComponent, '' > = methodName;
    if (this.isChildPage && this[property]) {
      if (typeof this[action] === "function") {
        this[action](id);
      }
    } else {
    qparams['id'] = id;
      if(this.fromDetailPage) {
        this.onBeforeValidationEmitter.emit({
          data: this.tableConfig.showDetailPageAs,
          parentCallbackFunction: ((parentObj: any) => {
            if (parentObj == 'true') {
                qparams = {...qparams,...this.setQueryParam(data)}
                this.openDetailPopup(id,'',qparams);
            }
          })
        });
      } else {
          qparams = {...qparams,...this.setQueryParam(data)}
          this.openDetailPopup(id,'',qparams);
      }
    }
  }
	onRefresh(fromDelete?:boolean,fromFilters?:boolean): void {
    const fromDel = fromDelete || false;
    const params = this.assignTableParams();
    this.toShowRecords(params);
    if(this.mapConfig[this.componentId]?.length > 0){
      const NeedRefresh = this.hasMappedParameters || fromFilters;
       if (this.gridComponent && 'refreshGrid' in this.gridComponent) {
        this.gridComponent.refreshGrid(params, fromDel,NeedRefresh);
      }
    }
    else{
       if (this.gridComponent && 'refreshGrid' in this.gridComponent) {
        this.gridComponent.refreshGrid(params, fromDel);
      }
    }
    this.selectedValues =[];
    this.priorGridParams.search = params.search;
    this.priorGridParams.mapper = params.mapper;
  }
	onBack(){
this.location.back();
}
	openDetailPopup(sid?: any, parentId?: any, queryParams : any = {}) {
    const dynamicDialogRef = this.dialogService.open(Table1DetailComponent, {
      showHeader: true,
      closable: false,
      position: "top",
      closeOnEscape: false,
      width: this.tableConfig?.detailPagePopupWidth ? this.tableConfig?.detailPagePopupWidth + ''?.trim() + '%': '70%',
      data: { popup: true, id: sid, pid: parentId, queryParams: queryParams, currentComponent: this.detailComponent },
      styleClass: 'detail-page-as-popup-container'
    });
    if (!environment.prototype) {
      const detailPopupSubscription = dynamicDialogRef.onClose.subscribe((data: any) => {
        this.onRefresh();
      });
      this.subscriptions.push(detailPopupSubscription);
    }
  }
	enableChildOptions(){
	}
	calculateFormula(){
	
}
	onDelete() {
    let formChanged = localStorage.getItem("formChanged");
    if (formChanged && JSON.parse(formChanged)) {
      this.confirmationService.confirm({
        message: this.translateService.instant("Do_you_want_to_reset_all_changes_QUESTION"),
        header: this.translateService.instant('Confirmation'),
        icon: 'pi pi-info-circle',
        accept: () => {
          setTimeout(() => {
            this.deleteRecord();
          }, 300);
        },
        reject: () => {
        },
      });
  }
  else{
    this.deleteRecord();
  }
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
            const deleteSubscription = this.table1Service.delete(requestedParams).subscribe((res: any) => {
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
	toggleAdvancedSearch() {
  this.showAdvancedSearch = !this.showAdvancedSearch;
}

clearAllFilters() {
  this.filter.globalSearch = '';
  this.clearFilterValues();
}

clearFilterValues() {
  this.tableSearchControls.reset();
  this.filter.advancedSearch = {};
  this.fromResetFilter = 'searchReset';
  this.storeFilters('advancedSearch');
  this.onRefresh();
  this.filtersApplied = false;
  this.readonlyOnSearch();
}

readonlyOnSearch(){
  const inputField = document.getElementById('inputField') as HTMLInputElement | null;    
  if (inputField) {
    if (this.filtersApplied) {
      inputField.setAttribute('readonly', 'true'); // Make input read-only
    } else {
      inputField.removeAttribute('readonly'); // Remove read-only state
    }
  }
  
}
 onDateChangeSearch(ev:any,containerRef: { el: ElementRef }) {
             setTimeout(()=>{
               const $input = $(containerRef?.el?.nativeElement).find('input');
               if ($input.length === 0) return;

               const value = $input.val() as string;

                  const translatedValue = value
                .replace(AppConstants.amDesignator, this.translateService.instant(AppConstants.amDesignator))
                .replace(AppConstants.pmDesignator, this.translateService.instant(AppConstants.pmDesignator));

               $input.val(translatedValue);
             },0)

           }

onPCalendarShowSearch() {
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


formatSearchString(obj: any) {
  let formattedStringArray: string[] = [];
  for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (value !== null && value !== undefined && value !== "") {
            if(value?.type == 'Date'){
              let lowerLimitDate;
              let upperLimitDate;
              value?.lLimit ? lowerLimitDate = this.appUtilBaseService.formatDate(value?.lLimit,AppConstants.dateFormatAngular) : lowerLimitDate = null;
              value?.uLimit ? upperLimitDate = this.appUtilBaseService.formatDate(value?.uLimit,AppConstants.dateFormatAngular) : upperLimitDate = null;
              if(value?.lLimit && value?.uLimit){
              formattedStringArray.push(`${key}: ${lowerLimitDate}-${upperLimitDate}`);
            }
            else{
              (value?.lLimit) ? formattedStringArray.push(`${key}: ${lowerLimitDate}`) : (value?.uLimit) ? formattedStringArray.push(`${key}: ${upperLimitDate}`) :formattedStringArray.push(`${key}: ${value}`)  ;
            }
          }
          else if (typeof value === 'object' && (value?.lLimit !== undefined || value?.uLimit !== undefined)) {
            if (value?.lLimit !== null && value?.uLimit !== null) {
              formattedStringArray.push(`${key}: ${value?.lLimit} - ${value?.uLimit}`);
            }
            else {
              (value?.lLimit) ? formattedStringArray.push(`${key}: ${value?.lLimit}`) : (value?.uLimit) ? formattedStringArray.push(`${key}: ${value?.uLimit}`) : formattedStringArray.push(`${key}: ${value}`);
            }
          }
            else {
              let translatedValue;
              if (this.tableSearchFieldConfig[key]?.uiType === 'autosuggest' && value?.displayField) {
                translatedValue = this.translateService.instant(value.displayField);
              }
              else if (['dropdown', 'select', 'radiobutton'].includes(this.tableSearchFieldConfig[key]?.uiType) && value) {
                translatedValue = this.translateService.instant(value);
              }
              else {
                translatedValue = value;
              }
              formattedStringArray.push(`${key}: ${translatedValue}`);
            }
          }
      }
  }
  if(formattedStringArray.length != 0){
    this.filter.globalSearch = "";
    this.storeFilters('globalSearch');
  }
  this.advancedSearchValue = formattedStringArray
}


advancedSearch() {
    this.filter.advancedSearch = this.tableSearchControls.value;
    let hasDates = this.tableSearchConfig.children.filter((e: any) => (e.fieldType.toLowerCase() == "date" || e.fieldType.toLowerCase() == "datetime") && e.uiType?.toLowerCase() !== "autosuggest");
    if (hasDates.length > 0) {
      hasDates.forEach((f: any) => {
        let val:any ={};
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && Array.isArray(value)) {
            if(this.tableSearchFieldConfig[field].uiType ==='date'){
              const tempDate1 = new Date(value[0]);
              const tempDate2 = new Date(value[1]);
              const convertedDate1 = tempDate1.getFullYear() + '-' + this.leftPad((tempDate1.getMonth() + 1), 2) + '-' + this.leftPad(tempDate1.getDate(), 2);
              const convertedDate2 = tempDate2.getFullYear() + '-' + this.leftPad((tempDate2.getMonth() + 1), 2) + '-' + this.leftPad(tempDate2.getDate(), 2);
              val = { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: value[1] ? new Date(convertedDate2).getTime() : null, type: "Date" };
            }
            else{
              val = { lLimit: new Date(value[0]).getTime(), uLimit: value[1] ? new Date(value[1]).getTime(): value[1], type: "Date" }          
            }
          
          this.filter.advancedSearch[field] = val;
          if (value[0] == null && value[1] == null) {
            delete this.filter.advancedSearch[field];
          }
        }

        if (value && typeof value == 'object' && !Array.isArray(value)) {
          if (this.tableSearchFieldConfig[field].uiType === 'date') {
            const tempDate1 = typeof value?.min == 'undefined' ? value : value?.min ? new Date(value?.min) : null;
            const tempDate2 = typeof value?.max == 'undefined' ? value : value?.max ? new Date(value?.max) : null;
            const convertedDate1 = tempDate1 ? tempDate1.getFullYear() + '-' + this.leftPad((tempDate1.getMonth() + 1), 2) + '-' + this.leftPad(tempDate1.getDate(), 2) : null;
            const convertedDate2 = tempDate2 ? tempDate2.getFullYear() + '-' + this.leftPad((tempDate2.getMonth() + 1), 2) + '-' + this.leftPad(tempDate2.getDate(), 2) : null;
            val = { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: convertedDate2 ? new Date(convertedDate2).getTime() : null, type: "Date" };
          } else {
            val = { lLimit: new Date(value?.min).getTime(), uLimit: value?.max ? new Date(value?.max).getTime() : null, type: "Date" }
          }
          if (val?.lLimit || val?.uLimit) {
            this.filter.advancedSearch[field] = val;
          }
          if (!val?.lLimit && !val?.uLimit) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    let hasNumbers = this.tableSearchConfig.children.filter((e: any) => (e.fieldType.toLowerCase() == "number" || e.fieldType.toLowerCase() == "double") && e.uiType?.toLowerCase() !== "autosuggest");
    if (hasNumbers.length > 0) {
      hasNumbers.forEach((f: any) => {
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && !Array.isArray(value) && typeof value == 'object') {
          this.filter.advancedSearch[field] = {
            lLimit: value.min, uLimit: value.max, type: "Number"
          }
          if (value.min == null && value.max == null) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    this.formatSearchString(this.filter.advancedSearch);
    Object.keys(this.tableSearchControls.controls).forEach(controlName => {
      const control = this.tableSearchControls.get(controlName);
      if (control && control.dirty) {
        this.changedSearchValues[controlName] = control.value;
        this.changedSearchReferenceValues[controlName] = this.filter.advancedSearch[controlName];
      }
    });
    this.storeFilters('advancedSearch');
    this.onRefresh(false,true);
    this.toggleAdvancedSearch();
    this.filtersApplied = Object.values(this.filter.advancedSearch).some(value => value !== null);    
    this.readonlyOnSearch();
  }

  onSearchFocus() {
    this.isSearchActive = true;
  }

  onSearchBlur() {
      this.isSearchActive = false;
  }

onKeydown(event: any) {
  this.showAdvancedSearch = false;
  if (event.which === 13 || event.keyCode === 13) {
    // this.filter.globalSearch = this.globalSearch
   this.onRefresh();
   return
  }
  this.isSearchActive = true; 
  this.onUserInactive();
}

onUserInactive() {
  this.isSearchActive = false;
  this.showAdvancedSearch = false;
  this.onRefresh();
}

get dynamicModel() {
  return this.filtersApplied ? this.advancedSearchValue : this.filter.globalSearch;
}

set dynamicModel(value: string) {
  if (this.filtersApplied) {
    this.advancedSearchValue = value;
  } else {
    this.filter.globalSearch = value;
    this.storeFilters('globalSearch');
  }
}

initSearchForm(){
  this.tableSearchFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.tableSearchConfig)
}

clearFilters(){
  this.filter.globalSearch = '';
  this.isSearchFocused = false;
}
clearValues(){
  if(this.filtersApplied){
    this.clearFilterValues();
  }
  else{
    this.clearGlobalSearch();
  }
}

focus(){
  this.isSearchFocused = !this.isSearchFocused;
}

clearGlobalSearch(){
  this.filter.globalSearch = '';
  this.storeFilters('globalSearch');
  this.onRefresh();
}
	loadGridData() {
    let gridSubscription: any;
    if (environment.prototype && this.tableConfig.children?.length > 0) {
      gridSubscription = this.table1Service.getProtoTypingData().subscribe((data: any) => {
        this.gridData = [...this.gridData, ...data];
        this.isPageLoading = false;
      });
    }
    else {
      this.gridData = []
    }
}
	mapFields(mapper: any, keys: any, mapData: any, metaData: any, sourceField: string, targetField: string, hasMapper ?:boolean): void {
    let value = '';
    keys?.forEach((key: { [x: string]: string | number; }) => {
    if(typeof key?.listType === 'string' && key.listType?.toLowerCase() == 'pagevariable'){
        return;
      }

      if (key.uiType == 'autosuggest' || (typeof mapData[key[sourceField]] === 'object' && mapData[key[sourceField]]?.referenceField)) {
          mapper[key[targetField]] = mapData[key['parentField']] || mapData[key[sourceField]]?.referenceField;
      }
      else if (key.fieldType == 'Boolean' || key.uiType =='checkbox') {
        mapper[key[targetField]] = mapData[key[sourceField]] ? mapData[key[sourceField]] : false;
      }
       else {
        if (mapData[key[sourceField]] || metaData[key[sourceField]]){
          const srcField:any = key['sourceField']
          if(!hasMapper && !this.quickFilterControls.get(srcField)?.value){
            return;
          }else{
            mapper[key[targetField]] = mapData[key[sourceField]] || metaData[key[sourceField]];
          }
        }   
      }
    });
  
    const hasDates = keys?.filter((e: any) =>
      (e.fieldType?.toLowerCase() === "date" || e.fieldType?.toLowerCase() === "datetime") && e.listType?.toLowerCase() != 'pagevariable'
    );
  
    if (hasDates?.length > 0) {
      this.handleDateFields(hasDates, mapper, mapData, hasMapper);
    }
  
    const hasNumbers = keys?.filter((e: any) =>
    
    (e.fieldType?.toLowerCase() === "number" || e.fieldType?.toLowerCase() === "double")&& e.listType?.toLowerCase() != 'pagevariable'

    );
  
    if (hasNumbers?.length > 0) {
      this.handleNumberFields(hasNumbers, mapper, mapData);
    }
  
  }

  passValuesToPage(mappingValues: any, queryParams: any) {
    mappingValues.forEach((mapping: any) => {
      const { sourceField, targetField } = mapping;
      const value = this.pageVariableControls.get(sourceField)?.value;

      if (value !== undefined && value !== null) {
        queryParams[targetField] = value;
      }
    });
  }

  setValuestoPage() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      const queryParams = params;

      Object.entries(queryParams || {}).forEach(([key, value]) => {
        if (this.pageVariableFieldConfig[key]) {
          let parsedValue = value;
          // Convert string to boolean for Boolean page variables
          if (this.pageVariableFieldConfig[key]?.fieldType === 'Boolean') {
            parsedValue = String(value).toLowerCase() === 'true';
          }
          this.pageVariableControls.get(key)?.patchValue(parsedValue);
        }
      });
    });
  }

    getDefaultFilterValues(fromSearch: boolean): any {
    // Process filters
    let searchData: any = {};
    let mapper: any = {};
    if (fromSearch) {
      if (this.filters[this.componentId]) {
        this.mapFields(searchData, this.filters[this.componentId], this.mapData, this.metaData, 'tableField', 'lookupField');
      }
    }
    else {
      // Process mapConfig
      if (this.mapConfig[this.componentId]) {
        this.mapFields(mapper, this.mapConfig[this.componentId], this.mapData, this.metaData, 'detailField', 'listField',true);
      }
    }
    return { searchData: searchData, mapper: mapper } || {};
  }

openPopup(sid?: any, parentId?: any, queryParams?: any,component?:any, col?:any) {
    const dynamicDialogRef = this.dialogService.open(component, {
    showHeader: true,
    closable: false,
    position: "top",
    closeOnEscape: false,
    width: col?.detailPagePopupWidth ? col.detailPagePopupWidth + ''?.trim() + '%': '70%',
    data: { popup: true, id: queryParams['id'], pid: parentId, queryParams: queryParams },
      styleClass: 'detail-page-as-popup-container'
    });
    if (!environment.prototype) {
        const detailPopupSubscription = dynamicDialogRef.onClose.subscribe((_data: any) => {
    this.onRefresh();
    });
      this.subscriptions.push(detailPopupSubscription);
    }
}

  populateDataFields(data: any, searchFields: any, config: any, filterKeys: boolean): void {
    for (const key in searchFields) {
      if (searchFields.hasOwnProperty(key) && (searchFields[key]?.toString().length || this.queryViewList)) {
        // If it is queryview, default filters will be considered as search not mapper
        const isDefaultFilter = this.defaultFilters.includes(key) && !this.queryViewList;
        if (filterKeys && !isDefaultFilter) continue;
        if (!filterKeys && isDefaultFilter) continue;
  
        if (config[key]?.uiType === 'autosuggest') {
          let lookupObj: any = [];
          if (config[key].multiple) {
            searchFields[key]?.map((o: any) => lookupObj.push(o.sid));
          }
          const isBooleanLookup = config[key]?.fieldType === 'Boolean';
          const rField = isBooleanLookup
            ? "referenceField"
            : (this.tableSearchFieldConfig[key]?.parentField || this.quickFilterFieldConfig[key]?.parentField || "displayField");
          const fieldValue = searchFields[key]?.[rField];
          const normalizedValue = isBooleanLookup ? this.appUtilBaseService.coerceBoolean(fieldValue) : fieldValue;
          data[key] = (this.queryViewList && (normalizedValue === undefined || normalizedValue === null || (typeof normalizedValue === 'string' && normalizedValue.trim() === '') || (typeof normalizedValue === 'number' && isNaN(normalizedValue)))) ? null : normalizedValue;
        } else if (searchFields[key] === 'IS_EMPTY') {
          data[key] = '$__isEmpty';
        } else if (Array.isArray(searchFields[key])) {
          data[key] = searchFields[key].map((item: string) => item === 'IS_EMPTY' ? '$__isEmpty' : item);
        } else if ((this.queryViewList && config[key].fieldType != 'Boolean') && (searchFields[key] === undefined || (typeof searchFields[key] === 'string' && searchFields[key].trim() === '') || (typeof searchFields[key] === 'number' && isNaN(searchFields[key])))) {
          data[key] = null;       
        } else if (typeof searchFields[key] === 'string' && searchFields[key].replace(/\s/g, '') === '') {
          data[key] = null;
        } else {
          data[key] = config[key]?.fieldType === 'Boolean' ? this.appUtilBaseService.coerceBoolean(searchFields[key]) : searchFields[key];
        }
      }
    }
  }

  getSearchData(searchFields?: any, config?: any): any {
    let searchData: any = {};
    const enrichedData = this.getDefaultFilterValues(true);
    searchData = enrichedData?.searchData;
  
    if (searchFields) {
      this.populateDataFields(searchData, searchFields, config, false);
    }
  
    return searchData;
  }
  
  getMapperData(searchFields?: any, config?: any): any {
    let mapperData: any = {};
    const enrichedData = this.getDefaultFilterValues(false);
    mapperData = enrichedData?.mapper;
  
    if (searchFields) {
      this.populateDataFields(mapperData, searchFields, config, true);
    }
  
    return mapperData;
  }

 assignTableParams() {
    const params: any = {};
    this.filter.sortField = this.tableConfig.groupOnColumn ? this.tableConfig.groupOnColumn?.name : this.filter.sortField;
    const searchData = { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig), ...this.getSearchData(this.filter.quickFilter, this.quickFilterFieldConfig) }
    const mapper = this.getMapperData(this.filter.quickFilter, this.quickFilterFieldConfig);
    if (this.filter.globalSearch)
      searchData['_global'] = this.filter.globalSearch;

    if (this.filter.sortField && this.filter.sortOrder) {
    let columnName:any = null;
    this.tableConfig.children.map((ele: any) => {
      if (ele.uiType === "autosuggest" && this.filter.sortField === ele.name) {
        columnName = (ele.name + "__value__" + ele.displayField);
      }
      else if(this.filter.sortField === ele.name){
        columnName = this.filter.sortField 
      }
      if(columnName){
        params.order = [{
          column: columnName,
          dir: this.filter.sortOrder
        }]
      }
      else{
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
 updateActions() {
        this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children) ||[];
        this.actionBarConfig?.forEach((actionConfig: any) => {
            if (actionConfig && actionConfig.visibility === 'conditional' && actionConfig.conditionForButtonVisiblity) {
                const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonVisiblity?.query?.rules, actionConfig.conditionForButtonVisiblity?.query?.condition);
                this.validateActions(actionConfig.buttonId, conResult, 'view');
            }
            if (actionConfig && actionConfig.buttonEnabled === 'conditional' && actionConfig.conditionForButtonEnable) {
                const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonEnable?.query?.rules, actionConfig.conditionForButtonEnable?.query?.condition);
                this.validateActions(actionConfig.buttonId, conResult, 'edit');
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
  disablechildAction(pid?:any) {
      const value: any = "parentId";
      let property: Exclude<keyof Table1ListBaseComponent, ' '> = value;
      if (!this.mapConfig[this.componentId]) {
      const parentId = this[property] || pid;
      this.leftActionBarConfig?.children?.map((ele: any) => {
        if (ele?.action === 'new' && !parentId && this.isChildPage && ele.buttonEnabled != 'conditional') {
          ele.buttonEnabled = 'no';
        }
        else if (ele.action === 'new' && parentId && this.isChildPage && ele.buttonEnabled != 'conditional') {
          ele.buttonEnabled = 'yes';
        }
      })
    }
      }
  getGridConfig() {
    const self = this;
    this.tableConfig.tableStyle = this.appUtilBaseService.getTableView(this.tableConfig.tableStyle,this.tableConfig.rowSpacing,this.tableConfig.rowHeight)?.tableStyle;
    const gridConfigData: any = {
      data: this.gridData,
      columns: this.getColumns(),
      ajaxUrl: Table1ApiConstants.getDatatableData,
      select: true,
      colReorder: (String(this.tableConfig?.columnReorder)?.toLowerCase() === 'true'),
      detailPageNavigation: (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_of_the_row' ? 'row_click' : (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_on_navigate_icon' ? 'row_edit' : '')),
      toggleColumns: (String(this.tableConfig?.toggleColumns)?.toLowerCase() === 'true'),
      paging: !(String(this.tableConfig?.infiniteScroll)?.toLowerCase() === 'true'),
      scrollX: true,
      quickfilterConfigured: this.quickFilterConfig?.children?.length > 0,
      scrollCollapse: true,
      pageLength: parseInt(String(this.tableConfig?.pageLimit)),
      deferRender: true,
      ordering: true,
      sortField: this.tableConfig.sortField,
      sortOrder: this.tableConfig.sortOrder,
      countRequired: this.tableConfig.countRequired ?? true,
      colResize: (String(this.tableConfig?.columnResize)?.toLowerCase() === 'true'),
      disableSelection: ((this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' || this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only') ? false : true),
      recordSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' ? 'multi' : (this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only' ? 'single' : '')),
      bFilter: false,
      enterKeytoSearch: false,
      showGridlines:this.tableConfig.showGridlines,
      striped:this.tableConfig.striped,
      rowSpacing:this.appUtilBaseService.getTableView(this.tableConfig.tableStyle,this.tableConfig.rowSpacing,this.tableConfig.rowHeight)?.rowSpacing,
      rowHeight:this.appUtilBaseService.getTableView(this.tableConfig.tableStyle,this.tableConfig.rowSpacing,this.tableConfig.rowHeight)?.rowHeight,
      sortSeparator:this.separator,
      rowGrouping: jQuery.isEmptyObject(this.tableConfig?.groupOnColumn) ? '' : this.tableConfig?.groupOnColumn?.name,
      rowGroupColumns: this.tableConfig?.rowGroupColumns,
      rowGroup: (String(this.tableConfig?.rowGroup)?.toLowerCase() === 'yes'),
      currentPageName:this.pageViewTitle,
      fixedColumns: {
        left: parseInt(String(this.tableConfig?.leftFreezeUptoColumn || '0') ),
        right: parseInt(String(this.tableConfig?.rightFreezeFromColumn || '0') )
      },
      isChildPage: this.isChildPage,
      childPageLength: this.childPageLimit || 10,
      parentId: this.getParentId(),
      uniqueIdentifier:this.tableConfig?.uniqueIdentifier|| null,
      defaultSearch: true,
      searchParams: { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig), ...this.getSearchData(this.filter.quickFilter, this.quickFilterFieldConfig)},
      mapper:this.getMapperData(this.filter.quickFilter, this.quickFilterFieldConfig),
       emptyTableMsg: this.gridEmptyMsg,
      fromDetailPage: this.fromDetailPage,
      restoredpage : this.currentPaginationStart,
      isChildIsInDetailPopup: this.dynamicDialogConfigFromDetailPage?.popup,
       sorting: this.tableConfig?.sorting?.toLowerCase() === 'multiple_columns' ? 'multiple_columns' :  this.tableConfig?.sorting?.toLowerCase() === 'single_column' ? 'single_column' : null,
      sortFields: this.tableConfig?.sorting?.toLowerCase() === 'multiple_columns' ? this.tableConfig?.sortFields : null,
      onRowMenuClick: (option: any, row: any, data: any) => {
      },

      onRowSelect: (selectedRows: any, id: any) => {
        this.getSelectedvalues(selectedRows, id);
      },
      onRowDeselect: (selectedRows: any) => {
        this.getSelectedvalues(selectedRows, '');
      },
       onRowClick: (event: any, id: string,data:any) => {
        this.onUpdate(id, event,data);
      },
      drawCallback: (settings: any, apiScope: any,gridProps:any) => {
        if(this.currentPaginationStart != gridProps?.params.start){
          this.currentPaginationStart = gridProps?.params.start;
          if (!this.tableConfig?.infiniteScroll) {
            this.storeFilters("pageStart");
          }
        }
        this.onDrawCallback(settings, apiScope);
      },
      onAfterServiceRequest: (data: any) => {
        this.onAfterServiceRequest(data)
      },
      onHyperLinkClick: (event: any, col: any,rowdata:any) => {
       this.openHyperLink(event,col,rowdata)
      },
      onActiveFilterSelection: (data:any) =>{
      }
    };
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

  clearSelectedValues() {
    this.selectedValues = [];
    this.actionButtonEnableDisable();
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

actionButtonEnableDisable() {
    this.leftActionBarConfig?.children?.map((ele: any) => {
      if(ele.type?.toLowerCase() == 'buttongroup' && ele.children?.length > 0) {
        ele?.children?.map((gButtonEle:any) => {
          this.disableButtons(gButtonEle)
        })
      } else {
        this.disableButtons(ele)
      }
    })
  }

  disableButtons(ele:any) {
    if ((ele?.action === 'delete' || ele?.action === 'activate' || ele?.action === 'deactivate') && ele.buttonEnabled != 'conditional') {
      if (this.selectedValues?.length > 0) {
        ele.buttonEnabled = 'yes';
      } else {
        ele.buttonEnabled = 'no';
      }
    }
  }

  getColumns() {
   const json1 = this.tableConfig.children ||[];
    const json2 = this.customRenderConfig.children ||[];
    let merged = [];
    for (let i = 0; i < json1.length; i++) {
 if(json1[i].mapping?.length > 0){
        json1[i].orderable = false;
      }
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
getParentId() {
  const value: any = "parentId";
  let property: Exclude<keyof Table1ListBaseComponent, ' '> = value;
  if (this.isChildPage) {
    if (this[property]) {
      return this[property];
    } else {
      return false;
    }
  }
}
leftPad(num:number, length:number) {
    var result = '' + num;
    while (result.length < length) {
      result = '0' + result;
    }
    return result;
  }

 getButtonConfig(btn:any){
    return {
      action:btn.action,
      confirmationTitle:btn.confirmationTitle|| this.translateService.instant('Confirmation'),
      confirmationText:btn.confirmationText || 'Do you want to perform the action?',
      fields: btn.fields || {"children":[]},
        confirmButton:btn.confirmationButtonText,
      rejectButton:btn.cancelButtonText,
      values:(this.responseData?.filter((o:any)=>o.sid == this.selectedValues[0]))[0]
    }
  }
onBeforeRefresh(params:any){
    return params;
  }

  getDefaultSearchParams(){
    const searchData:any ={};
    if(this.filters[this.componentId]?.length > 0){
      this.filters[this.componentId].forEach((keys:any)=>{
        if(this.mapData[keys.tableField])
          searchData[keys.field] = this.mapData[keys.tableField]
      })
    }
    return searchData;
  }
showInfoMessage(message: string) {
    // Display an info message
    this.messageService.add({severity:'info', summary:'Info', detail: message});
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
  
    this.showonFilter = this.queryViewList ||  (this.standardGrid && mapConfigFields.length >0 && this.fromDetailPage);
  
    this.applyQueryViewFilters(params, searchDataValues,mapFields);
    this.applyMapConfigFilters(params, mapFields, missingMapConfigFields);
  
    // Set the grid empty message based on the filter checks
    this.setGridEmptyMessage(searchDataValues,missingMapConfigFields,mapFields);
  
    // Update gridConfig with the appropriate empty table message
    if (!this.gridConfig) {
      this.gridConfig['emptyTableMsg'] = this.gridEmptyMsg;
    }
    this.gridConfig['parentId'] = this.getParentId();
  }
  
  applyQueryViewFilters(params: any, searchDataValues: string[], mapFields?:any) {
    const mandatoryFilters = this.checkMandatoryFilters();
    const missingFilters = mandatoryFilters.filter(filter => !searchDataValues.includes(filter) && !mapFields.includes(filter));
  
    if (this.queryViewList) {
        this.queryViewFiltersApplied = true;
    }
 
  }
  
  applyMapConfigFilters(params: any, searchDataValues: string[], missingMapConfigFields: string[]) {
    if ((this.mapConfig[this.componentId]?.length > 0 && missingMapConfigFields.length > 0) || !this.existingFormId) {
      this.hasMappedParameters = false;
    }
   else if((missingMapConfigFields.length  == 0 || this.mapConfig[this.componentId]?.length <= 0)  && this.existingFormId){
      this.hasMappedParameters = true;
    }
  }

comparePriorAndCurrentSearch = (prior: any, current: any) => {
    if (prior && current) {
      const priorString = JSON.stringify(prior);
      const currentString = JSON.stringify(current);
      return priorString === currentString;
    }
    return false;
  }

setGridEmptyMessage(searchDataValues: string[], missingMapConfigFields: string[],mapFields:any) {
    const mandatoryFilters = this.checkMandatoryFilters();
    const missingFilters = mandatoryFilters.filter(filter => !searchDataValues.includes(filter) && !mapFields.includes(filter));

    // Check for missing map config fields first
    if (this.mapConfig[this.componentId]?.length > 0) {
      if (missingMapConfigFields.length > 0)
        this.gridEmptyMsg = `${this.translateService.instant("To_view_the_records_COM_please_fill_in_the_field_OPENPARAN_s_CLOSEPARAN__COLON")}
         ${missingMapConfigFields.join(', ').replace(/,(?=[^,]*$)/, ', and')}.`;
      else
        this.gridEmptyMsg = this.translateService.instant('No_Data_Available')
    }
    // Then check for missing mandatory filters
    else if (!this.queryViewFiltersApplied && this.showonFilter && this.queryViewList) {
      let missingParams = missingFilters.join(', ').replace(/,(?=[^,]*$)/, ', and');
      this.gridEmptyMsg = `${this.translateService.instant('Unable_to_display_any_records_DOT_The_query_is_missing_mandatory_parameter_OPENPARAN_s_CLOSEPARAN_COLON')} 
      ${this.translateService.instant(missingParams)}. 
      ${this.translateService.instant('Please_ensure_these_parameter_OPENPARAN_s_CLOSEPARAN_are_provided_for_the_view_to_display_records_DOT')}`;
      console.log("Mandatory fields without user interaction:", missingFilters);
    }
    // Default message if no data is available
    else {
        this.gridEmptyMsg = this.translateService.instant('No_Data_Available')
    }
  }


checkMandatoryFilters() {
    const mandatoryFields: string[] = [];
    Object.keys(this.quickFilterControls.controls).forEach(key => {
      const control = this.quickFilterControls.get(key);
      if (control && control.validator && control.validator(control)) {
        const errors = control.validator(control);
        if (errors && errors.required) {
          mandatoryFields.push(key);
        }
      }
    });

    this.filters[this.componentId]?.forEach((obj: any) => {
      if (!mandatoryFields.includes(obj.lookupField) && !this.pageVariableControls.get(obj.lookupField)) {
        mandatoryFields.push(obj.lookupField);
      }
    });
    this.tableConfig.queryViewMandatoryFilters?.forEach((field: any) => {
      const child = this.tableConfig?.children?.find((c: any) => c.name === field);
      const labelOrField = child?.label || field;
      if (!mandatoryFields.includes(labelOrField)) {
        mandatoryFields.push(labelOrField);
      }
    });
    return mandatoryFields;
  }

 shouldRefresh(previousValue: any, currentValue: any): boolean {
    // Check if any of the changed fields match the filter fields
    const filterFields = this.filters[this.componentId]?.map((filter: any) => filter.tableField) || [];
    const mappingFields = this.mapConfig[this.componentId]?.map((filter: any) => filter.detailField) || [];

    const filtersObject = this.filters[this.componentId]?.reduce((acc: any, filter: any) => {
      if (filter.tableField) {
        acc[filter.tableField] = filter; // Add filter object with tableField as the key
      }
      return acc;
    }, {}) || {};

    return [...filterFields, ...mappingFields].some((field: any) => {
      const previousFieldValue = previousValue[field];
      const currentFieldValue = currentValue[field];
      //if there is a static value in query view list, no need to refresh.
      if (this.queryViewList && filterFields.length > 0) {
          if (filtersObject[field]?.value) {
            return false;
          }
          else {
            return JSON.stringify(previousFieldValue) !== JSON.stringify(currentFieldValue);
          }
      }
      // Check if the field has changed
      return JSON.stringify(previousFieldValue) !== JSON.stringify(currentFieldValue);
    });
  }
  
  manipulateOutputData(res: any): void {
    
  }
  
  

  getInputParams() {
    return {}
  }

  getMappedFilters(fromParent?: boolean, changedProps?: string[]): void {
  const componentConfig = this.mapConfig[this.componentId];
    const queryViewConfig = this.filters[this.componentId];
    if (queryViewConfig) {
      this.getqueryViewFilters();
    }
    const value: any = "parentId";
   let property: Exclude<keyof Table1ListBaseComponent, ' '> = value;
    if (!componentConfig) {
      return;
    }
    componentConfig.forEach((filter: any) => {
      const label = filter?.label
        ? this.translateService.instant(filter.label)
        : filter.listField;
      if (label && filter.viewInPages && filter.listType !== 'pageVariable') {
         let formattedText:any;
        if(filter.detailType === 'value'){
           formattedText = this.appUtilBaseService.formatRawDatatoRedableFormat(filter, filter.detailField, '', true);
        }
        else{
           formattedText = this.mapData[filter.detailField] ? 
           this.appUtilBaseService.formatRawDatatoRedableFormat(filter, this.mapData[filter.detailField], '', true) : this.mapData[filter.detailField];
        }

        this.mappedFiltersDisplay[label] = formattedText;
      }
      if (filter.holdFilterValue) {
        if (!this.holdFilters.includes(filter.listField)) {
          this.holdFilters.push(filter.listField);
        }
        this.filtersFromParent[filter.listField] = this.mapData[filter.detailField];
      }
       if (filter.listType == 'pageVariable') {
        const control = this.pageVariableControls.get(filter.listField);
        this.patchControlValue(control, this.mapData[filter.detailField], filter);
      }
    });
   Object.keys(this.mappedFiltersDisplay).forEach(key => {
      const value = this.mappedFiltersDisplay[key];
      if (value === "" || value === undefined || value === null) {
        delete this.mappedFiltersDisplay[key];
      }
    });
   this.updateTooltipText();
  }
  
getqueryViewFilters(fromParent?: boolean, changedProps?: string[]) {
    const queryViewFilters = this.filters[this.componentId];
   queryViewFilters?.forEach((filter: any) => {
      let value = this.getValueOnPriority(filter);
      // removed the surrounding if condition cause we are having staticValue in the customValue case
      const control = this.quickFilterControls.get(filter.lookupField) || this.pageVariableControls.get(filter.lookupField);
      this.patchControlValue(control, value, filter);

      if (filter.holdFilterValue) {
        if (!this.holdFilters.includes(filter.lookupField)) {
          this.holdFilters.push(filter.lookupField);
        }
        if (
          (filter?.uiType === 'autosuggest' && typeof this.mapData[filter.tableField] === 'object') ||
          (this.mapData[filter.tableField] && typeof this.mapData[filter.tableField] === 'object' && this.mapData[filter.tableField]?.referenceField)
        ) {
          this.filtersFromParent[filter.lookupField] = this.mapData[filter.tableField]['referenceField'];
        }
        else {
          this.filtersFromParent[filter.lookupField] = this.mapData[filter.tableField];
        }

      }
    });
    let filterVals = { ...this.quickFilterControls.getRawValue() };

    const hasDates = this.quickFilterConfig.children.filter((e: any) =>
      e.fieldType.toLowerCase() === "date" || e.fieldType.toLowerCase() === "datetime"
    );

    if (hasDates.length > 0) {
      this.handleDateFields(hasDates, filterVals, this.quickFilterControls.getRawValue());
    }

    const hasNumbers = this.quickFilterConfig.children.filter((e: any) =>
      e.fieldType.toLowerCase() === "number" || e.fieldType.toLowerCase() === "double"
    );

    if (hasNumbers.length > 0) {
      this.handleNumberFields(hasNumbers, filterVals, this.quickFilterControls.getRawValue());
    }

    this.filter.quickFilter = filterVals;
  }

  getValueOnPriority(filter: any, fromParent?: boolean, changedProps?: any){
    let filterValues = this.quickFilterControls.getRawValue();
    // added the customValue in the condition
    // assigning the staticValue of filter instead of tableField
    let overridenValue = (filter.detailType == 'value' || filter.detailType == 'customValue') ? filter.tableField:''; // when having static value
    if(this.queryViewList && (filter.type == 'plusDays' || filter.type == 'minusDays')){
      return this.appUtilBaseService.getAdjustedDate(filter.staticValue, filter.type);
    }else{
      return filter.staticValue ? filter.staticValue : this.mapData[filter.tableField] || overridenValue || this.metaData[filter.tableField];
    }
  }

  getGlobalStorageKey() {
    return this.fromDetailPage && this.componentId ?`${this.componentId}_${this.localStorageStateKey}`: this.localStorageStateKey;
  }

 actionButtonHideShow() {
    if (this.dynamicDialogConfigFromDetailPage?.popup) {
      let actionBarConfig = [...this.leftActionBarConfig?.children || [], ...this.rightActionBarConfig?.children || []];
      actionBarConfig?.map((obj: any) => {
        if (obj?.action === 'back') {
          obj.visibility = 'hide'
        }
      })
    }
  }
/**
   * Retrieves a list of services to be fired based on the configuration and data.
   * @returns {Observable<any[]>} An observable that emits an array of responses from the services.
   */
  getListofServicesTobeFired(): Observable<any[]> {
    return new Observable(observer => {
      const config = { ...this.quickFilterFieldConfig, ...this.tableSearchFieldConfig };
      let autosuggestConfig: any = {};
      const pageVariableValues = this.pageVariableControls?.getRawValue() || {};
      const data = { ...pageVariableValues, ...this.quickFilterControls.getRawValue(), ...this.tableSearchControls.getRawValue() };
      const tempUrl: any = [];
      const observables: Observable<any>[] = [];

      // Iterate through the configuration to identify autosuggest fields
      for (const property in config) {
        if (
          config[property].uiType !== 'autosuggest' ||
          (!config[property].isCustom && !config[property].autoFillField) ||
          (config[property].isCustom && !data[property])
        ) continue;

        tempUrl.push({
          serviceName: config[property].autoSuggestServiceName,
          url: config[property].lookupUrl,
          field: config[property].name
        });
      }

      // Generate observables for the identified services
      this.formLookupObservables(tempUrl, config, autosuggestConfig, data, observables);

      // Assign responses to the respective controls
      this.assignReponseToControls(observables, autosuggestConfig, observer);
    });
  }

  /**
   * Forms lookup observables for autosuggest fields.
   * @param tempUrl - Array of service configurations.
   * @param config - Configuration object for the fields.
   * @param autosuggestConfig - Object to store autosuggest configurations.
   * @param data - Data from the form controls.
   * @param observables - Array to store the generated observables.
   */
  formLookupObservables(tempUrl: any, config: any, autosuggestConfig: any, data: any, observables: Observable<any>[]) {
    // Remove duplicate service configurations
    tempUrl.filter((obj: { id: any; }, index: any, self: any[]) =>
      index === self.findIndex((o: { id: any; }) => o.id === obj.id)
    );

    // Map each service configuration to an observable
    tempUrl?.map((o: any) => {
      const urlObj = {
        url: o.url,
        searchText: '',
        colConfig: config[o.field],
        value: data,
        pageNo: 0
      };
      autosuggestConfig[o.field] = config[o.field];
      urlObj.url = this.appUtilBaseService.generateDynamicQueryParams(urlObj);

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
            this.quickFilterControls.get(property)?.patchValue(filteredResponse);
            this.tableSearchControls.get(property)?.patchValue(filteredResponse);
             let filterVals = { ...this.quickFilterControls.getRawValue()};
            this.filter.advancedSearch = {...this.tableSearchControls.getRawValue()};
            this.filter.quickFilter = filterVals;
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


onOperatorSelect(fieldConfig: any) {
    let equalFilter: boolean = (this.defaultFilters.includes(fieldConfig.name) && this.queryViewList);
    let operator = fieldConfig?.operator || 'has';
    if (fieldConfig?.operator == 'is equal to' || fieldConfig?.operator == 'is empty' || fieldConfig?.uiType == 'select' || equalFilter) {
      operator = '=';
    }
    return operator;
  }
  
     /**
   * To set query params for new button in detail page
   */
    setQueryParam(data?:any){
      let queryParams: any = {}
      if (this.holdFilters.length > 0) {
        this.holdFilters.forEach((filter: string) => {
          const control = this.quickFilterControls.get(filter) || this.pageVariableControls?.get(filter);
         if (this.shouldHoldValues(control,filter)) {
                if (this.quickFilterControls.get(filter)?.value || this.filtersFromParent[filter]) {
                  const fieldConfig = this.quickFilterFieldConfig?.[filter];
                  const parentField = fieldConfig?.parentField;
                  const controlValue = this.quickFilterControls?.get(filter)?.value;
                  if (
                    fieldConfig?.uiType === 'autosuggest' &&
                    parentField &&
                    controlValue?.[parentField] != null
                  ) {
                    queryParams[filter] = controlValue[parentField];
                  }
                  else if (
                    fieldConfig?.fieldType === 'Date' &&
                    control instanceof FormGroup
                  ) {
                    queryParams[filter] = control.get('min')?.value || null;
                  }
                  else {
                    queryParams[filter] = this.quickFilterControls.get(filter)?.value || this.filtersFromParent[filter] ||this.pageVariableControls.get(filter)?.value;
                  }
                }
              }
        })
      }
      this.getDetailpageParameters(queryParams,data);
      localStorage.setItem('holdFilters',JSON.stringify(queryParams));
      return queryParams;
    }
    
updateTooltipText(): void {
    const keyValuePairs = Object.entries(this.mappedFiltersDisplay)
        .map(([key, value]) => ` ${key}  :  ${value} `)
        .join(', ');
    this.tooltipText = `( ${keyValuePairs} )`;
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

getDisabled(formControl: FormGroup, ele: string) {
  const parent = ele.split('?.')[0];
  if (formControl.controls[parent] instanceof FormGroup){
    return formControl.get(ele)?.disabled
  }
  else
    return formControl.controls[parent].disabled;
}

disableNewAction() {
    this.leftActionBarConfig?.children?.map((ele: any) => {
      if (ele?.action === 'new' && this.mapConfig[this.componentId]?.length > 0 && !this.existingFormId && ele.buttonEnabled != 'conditional') {
        ele.buttonEnabled = 'no';
      }
      else if (ele.action === 'new' && this.mapConfig[this.componentId]?.length > 0 && this.existingFormId &&  ele.buttonEnabled != 'conditional') {
        ele.buttonEnabled = 'yes';
      }
    })
  }

rememberGridConfig() { }

  getFilterQueryParams(){
    this.activatedRoute.queryParams.subscribe(params => {
      if (params[this.globalStorageKey]) {
        try {
          let extractedFilterValues = JSON.parse(params[this.globalStorageKey]);
          this.filterValues = extractedFilterValues;
          this.changedFilterValues = extractedFilterValues?.quickFilter?.display ? extractedFilterValues.quickFilter.display : {};
          this.changedFilterReferenceValues = extractedFilterValues?.quickFilter?.reference ? extractedFilterValues.quickFilter.reference : {};
          this.changedSearchValues = extractedFilterValues?.advancedSearch?.display ? extractedFilterValues.advancedSearch.display : {};
          this.changedSearchReferenceValues = extractedFilterValues?.advancedSearch?.reference ? extractedFilterValues.advancedSearch.reference : {};
          if(this.filterValues?.quickFilter?.display){
            this.processFilterValues(this.quickFilterConfig.children, this.filterValues?.quickFilter?.display, this.quickFilterControls);
          } else if (this.filterValues?.advancedSearch?.display){
            this.processFilterValues(this.tableSearchConfig.children, this.filterValues?.advancedSearch?.display, this.tableSearchControls);
          }
          this.restoreFilterSettings();
          this.formatSearchString(this.filter.advancedSearch);
        } catch (e) {
          console.log('Error parsing filters:', e);
          this.filterValues = {};
        }
      }
    });
  }

 /**
 * Process filter values from Query params.
 * @returns {void}
 */
  processFilterValues(filters: any, displayValues: any, controls: any) {
    for (let filter of filters) {
      const value = displayValues[filter?.name];
      let control = controls.get(filter?.name);
      if ((filter?.uiType === "date" || filter?.uiType === "datetime") && control && !(control instanceof FormGroup) && value && value !== null && value !== '') {
        displayValues[filter?.name] = new Date(value);
      } else if ((filter?.uiType === "date" || filter?.uiType === "datetime") && control && (control instanceof FormGroup) && value && value !== null && value !== '') {
        displayValues[filter?.name].min = value.min ? new Date(value.min) : '';
        displayValues[filter?.name].max = value.max ? new Date(value.max) : '';
      }
    }
  }
  
 /**
 * Restores filter settings from saved configuration.
 * @returns {void}
 */
  restoreFilterSettings() {
    const existingFilterSettings = this.filterValues;
    if (Object.keys(existingFilterSettings).length>0) {
      if(existingFilterSettings?.quickFilter?.display){
        this.quickFilterControls.patchValue(existingFilterSettings.quickFilter.display,{emitEvent:false});
      }
      if(existingFilterSettings?.quickFilter?.reference){
        this.filter.quickFilter = { ...this.filter.quickFilter, ...existingFilterSettings.quickFilter.reference};
      }
      if(existingFilterSettings?.advancedSearch?.display){
        this.tableSearchControls.patchValue(existingFilterSettings.advancedSearch.display,{emitEvent:false});
      }
      if(existingFilterSettings?.advancedSearch?.reference){
        this.filter.advancedSearch = { ...this.filter.advancedSearch, ...existingFilterSettings.advancedSearch.reference};
      }
      this.filtersApplied = Object.values(this.filter.advancedSearch).some(value => value !== null);
      const hasPageStart = existingFilterSettings?.pageStart !== undefined && existingFilterSettings?.pageStart !== null;
      this.currentPaginationStart = hasPageStart ? existingFilterSettings.pageStart : 0;
      this.filter.globalSearch = existingFilterSettings?.globalSearch ? existingFilterSettings.globalSearch : this.filter.globalSearch;
      if(this.filter.globalSearch){
        setTimeout(() => {
          this.onRefresh(false, true);
        }, 100);
      }
      this.restorefilters = true;
    }
    else{
      this.currentPaginationStart = null;
      this.restorefilters = false;
    }
  }

    openHyperLink(event: any, col: any, rowData: any) {
    if (!col?.detailPage?.url) return; //  return if no detailPage or URL
  
    // Construct query parameters based on detailPageMapping and holdFilters
    const queryParams = this.createQueryParams(col, rowData);
    //  const componentName = this.getRouteForUrl(col.detailPage.url);
    // Handle navigation or popup based on configuration
    if (col.showDetailPageAs === 'navigate_to_new_page') {
      this.appUtilBaseService.navigateWithQueryParams(queryParams, col.detailPage.url);
    } else if (col.showDetailPageAs === 'as_a_popup') {
      const componentName = this.componentMapping[col.componentName];
      this.openPopup(null,null,queryParams,componentName, col);
    }  
    // Prevent event propagation
    event.stopPropagation();
  }
  
  /**
   * Helper function to create query parameters based on mappings and filters.
   */
  createQueryParams(col: any, rowData: any): any {
    const queryParams: any = {};

    // Function to process mappings and populate queryParams
    const processMappings = (mappings: any[]) => {
      mappings.forEach(({ listField, detailField }) => {
        if (listField && detailField) {
          if (rowData[listField]) {
            queryParams[detailField === 'sid' ? 'id' : detailField] = rowData[listField];
            }
            else if (this.pageVariableControls && this.pageVariableControls.get(listField)) {
            queryParams[detailField === 'sid' ? 'id' : detailField] = this.pageVariableControls.get(listField)?.value;
          }
        }
      });
    };

    // Check if record creation is not enabled before processing detailPageMapping
    if (rowData[col.fieldName]) {
      processMappings(col.detailPageMapping || []);
    }
    else {
      processMappings([...col.detailPageMapping || [], ...col.holdFilters || []]);
    }
    // Process both detailPageMapping and holdFilters together
    return queryParams;
  }
  
  bindLookupFields(): void {
    const fieldConfig = { ...this.quickFilterFieldConfig, ...this.tableSearchFieldConfig };
    for (const ele in fieldConfig) {
      if (fieldConfig[ele].uiType === 'autosuggest') {
        const controls = [this.quickFilterControls, this.tableSearchControls];
        controls.forEach(control => {
          control.get(fieldConfig[ele].fieldName)?.valueChanges.subscribe((obj) => {
            console.log(obj);
            if (fieldConfig[ele].filterOutputMapping.length > 0) {
              this.mapOutputMappingFields(ele, obj, 'filterOutputMapping');
            }
          });
        });
      }
    }
  }
  
  mapOutputMappingFields(ele: any, obj: any, mappingobjName: string, transient?: boolean) {
    const formConfigs = [
      { config: this.quickFilterFieldConfig, controls: this.quickFilterControls },
      { config: this.tableSearchFieldConfig, controls: this.tableSearchControls },
      { config: this.pageVariableFieldConfig, controls: this.pageVariableControls }
    ];
  
    formConfigs.forEach(({ config }) => {
      if (config[ele]?.[mappingobjName]) {
        config[ele][mappingobjName].forEach((filter: any) => {
          const dpField = filter.displayField || filter.lookupField;
          let filterValue = obj ? (obj.value ? obj.value[dpField] : obj[dpField]) : null;
            if (filter?.uiType?.toLowerCase() === 'date') {
            if (filterValue) {
              const date = new Date(filterValue); 
              const d = date.getFullYear() + '-' + this.leftPad((date.getMonth() + 1), 2) + '-' + this.leftPad(date.getDate(), 2);
              filterValue = d;
            }   
            }
  
          // Update all relevant controls from all configurations
          formConfigs.forEach(({ controls }) => {
            controls?.get(filter.tableField)?.patchValue(filterValue);
          });
        });
      }
    });
  
    // Log all form values after updates
    console.log({
      quickFilterValues: this.quickFilterControls.getRawValue(),
      tableSearchValues: this.tableSearchControls.getRawValue(),
      pageVariableValues: this.pageVariableControls.getRawValue()
    });
  }

  getDetailpageParameters(queryParams: any = {}, data?: any) {
    if (!this.tableConfig?.detailPageParametersMapping && this.tableConfig?.detailPageMapping?.length <= 0) {
      return; // If mapping is not available, return without modifying queryParams
    }

    this.tableConfig.detailPageParametersMapping?.forEach((key: any) => {
      const value = this.quickFilterControls.get(key.listField)?.value || this.pageVariableControls.get(key.listField)?.value || (data && data[key.listField]);
      if (value) {
        queryParams[key.detailField  === 'sid' ? 'id' : key.detailField] = value;
      }
    });

    if (this.tableConfig?.detailPageMapping?.length > 0) {
      this.tableConfig.detailPageMapping.forEach((mapping: { lookupField: any; tableField: any; }) => {
        const lookupField = mapping.lookupField;
        const tableField = mapping.tableField;
        const value = this.pageVariableControls.get(tableField)?.value || (data && data[tableField]);
        if (value) {
          queryParams[lookupField] = value;
        }
      });
    }
  }

      shouldHoldValues(control: any, filter: string): boolean {
    const filterConfig = this.quickFilterFieldConfig[filter];
    if (
      control instanceof FormGroup &&
      !(
        filterConfig.value === 'today' ||
        filterConfig.value === 'tomorrow' ||
        filterConfig.type === 'plusDays' ||
        filterConfig.type === 'minusDays'
      )
    ) {
      return false;
    }
  
    return true;
  }

    onInit() {
			this.initSearchForm();
  

		  this.initFilterForm();

		  this.appUtilBaseService.assignInitialValueToPageVariables(this.pageVariables, this.pageVariableControls);  localStorage.setItem("formChanged", JSON.stringify(false));
    this.globalStorageKey = this.getGlobalStorageKey();
  this.getListofServicesTobeFired().subscribe((responses: any[]) => {   
  this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
    this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
   this.pageVariableFieldConfig = this.pageVariables?.children? this.appUtilBaseService.formatTableFieldConfig(this.pageVariables.children):{};
   this.setValuestoPage();
    this.getMappedFilters();
    this.loadGridData();
    this.disablechildAction();
    this.disableNewAction();
    this.updateActions();
    this.getFilterQueryParams();
    const params =  this.assignTableParams();
    this.gridConfig = this.getGridConfig();
    this.toShowRecords(params);
    this.selectedColumns = this.gridConfig.columns;
    this.combinedActionConfig = (this.leftActionBarConfig?.children ?? []).concat(this.rightActionBarConfig?.children ?? []);
    this.actionButtonEnableDisable();
    this.actionButtonHideShow();
       this.appUtilBaseService.updateButtonVisibilityBasedonAllowedActions(
      this.queryViewNotAllowedActions,
      {
        left: this.leftActionBarConfig,
        right: this.rightActionBarConfig
      },
      this.conditionalActions,{});
 });
 this.bindLookupFields();

    }
	
     onDestroy() {
		this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());

    }
     onAfterViewInit() {
			 this.appUtilBaseService.setCurrentPageGlobally();

    }
    
    onChanges(changes:any) {
			const mapDataChanged = changes.mapData && changes.mapData.previousValue &&
        JSON.stringify(changes.mapData.previousValue) !== JSON.stringify(changes.mapData.currentValue) &&
        this.shouldRefresh(changes.mapData.previousValue, changes.mapData.currentValue);

        const metaDataChanged = changes.metaData && changes.metaData.previousValue &&
        JSON.stringify(changes.metaData.previousValue) !== JSON.stringify(changes.metaData.currentValue) &&
        this.shouldRefresh(changes.metaData.previousValue, changes.metaData.currentValue);
    
      const existingFormIdChanged = !this.queryViewList && changes.existingFormId &&
        changes.existingFormId.previousValue === undefined &&
        changes.existingFormId.currentValue;
    
      const parentIdChanged = this.fromDetailPage && changes.parentId && 
      changes.parentId.previousValue === undefined &&
      changes.parentId.currentValue;
    
        if (mapDataChanged || existingFormIdChanged || parentIdChanged || metaDataChanged || this.mapData.saveTriggered) {
        // Parent form value has changed, update the grid
        this.getMappedFilters();
        this.restoreFilterSettings();
        const params = this.assignTableParams();
      if(this.gridComponent && this.gridComponent.params && this.gridComponent.params.search)
      { this.gridComponent.params.search = params.search; } 
        this.toShowRecords(params);
            setTimeout(() => {
            this.onRefresh();
          }, 100);
        
      }
 if (existingFormIdChanged) {
      this.disableNewAction();
    }

	}
}
