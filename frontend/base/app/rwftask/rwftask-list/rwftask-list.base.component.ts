import { RwftaskService } from '../rwftask.service';
import { RwftaskBase} from '../rwftask.base.model';
import { ChangeDetectorRef, Directive, EventEmitter, HostListener, Input, Output, SecurityContext, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { GridComponent } from '@libsrc/grid/grid.component';
import { environment } from '@env/environment';
import { distinctUntilChanged, switchMap, Observable, Subject, debounceTime, fromEvent, catchError, combineLatest, of, Observer, forkJoin, Subscription, map } from 'rxjs';
import { Location } from '@angular/common';
import { Filter } from '@baseapp/vs-models/filter.model';
import { BaseService } from '@baseapp/base.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { RwftaskApiConstants } from '../rwftask.api-constants';
import { NgZone } from '@angular/core';

@Directive(
{
	providers:[MessageService, ConfirmationService, DialogService, DynamicDialogConfig]
}
)
export class RwftaskListBaseComponent{

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

  gridData: RwftaskBase[] = [];
  totalRecords: number = 0;
  subscriptions: Subscription[] = [];
 selectedColumns:any =[];

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
localStorageStateKey = "rwftask-list";
showMenu: boolean = false;
conditionalActions:any ={
  disableActions:[],
  hideActions:[]
}
filterActions: any = {
  hideActions: []
}



actionBarConfig:any =[];
first: number =0;
rows: number = 0;
selectedFilterOption:any;
tableOptions: any[] = [];

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
showonFilter:boolean = false;
selectedRows:any =[];
@Input() filters:any ={};
@Input() componentId:string ='';
@Input() mapData:any ={};
@Input() dynamicDialogConfigFromDetailPage: any = {};
priorGridParams:any ={};
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
currentPaginationStart:any;
@Input() standardGrid:boolean = false;
@Input() pageIdentifier:string ="";
restorefilters:boolean = false;
currentUserInfo:any;
@Input() metaData?:any ={};
@Input() hideListPageTitle?: boolean = false;

@ViewChild('contextMenu')
contextMenu!: OverlayPanel;

contextMenuActions: any[] = [];
rwfListData: any[] = [];
selectedRow: any;
	isChildPage:boolean = false;
	componentMapping: { [key: string]: any } = {
	};

	leftActionBarConfig : any = {
  "children" : [ {
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
    "type" : "button",
    "beforeAction" : "none",
    "detailPagePopupWidth" : 70,
    "outline" : false,
    "buttonType" : "icon_on_left",
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
    "type" : "button",
    "beforeAction" : "none",
    "detailPagePopupWidth" : 70,
    "outline" : false,
    "buttonType" : "icon_only",
    "showOn" : "both",
    "displayAsToggleSwitch" : false,
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "RefreshbuttonId1",
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
  "detailPagePopupWidth" : 70,
  "outline" : false,
  "disabledFieldsByLookup" : [ ],
  "children" : [ {
    "fieldName": "tableId",
    "data" : "",
    "field": "tableId",
    "name": "tableId",
    "uiType" : "text",
    "isPrimaryKey" : true,
    "label": "Table_Name",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId": "tableId"
  }, ],
  "columns" : "1",
  "displayAsToggleSwitch" : false,
  "hideListPageTitle" : false,
  "type" : "tableSearch",
  "showAdvancedSearch" : true,
}
	quickFilterConfig : any = {
  "detailPagePopupWidth" : 70,
  "outline" : false,
  "disabledFieldsByLookup" : [ ],
  "children" : [ {
    "allowedValues" : {
      "values" : [  {
        "label" : "Pending_Tasks",
        "value" : "pendingTasks"
      }, {
        "label" : "Completed_Tasks",
        "value" : "completedTasks"
      } ]
    },
    "fieldName" : "status",
    "data" : "Status",
    "field" : "status",
    "name" : "status",
    "uiType" : "select",
    "isPrimaryKey" : false,
    "label" : "Status",
    "type" : "filterField",
    "fieldType" : "string",
    "fieldId" : "status"
  } ],
  "displayAsToggleSwitch" : false,
  "hideListPageTitle" : false,
  "type" : "quickFilter",
}
	defaultFilterConfig : any = {
  "children" : [ ]
}
  customRenderConfig: any = {
    "children": [
      {
        "fieldName": "action",
        render: (data: any, type: any, row: any, meta: any) => { return this.actionCustomRender(data, row); }
      },
      {
        "fieldName": "name",
        render: (data: any, type: any, row: any, meta: any) => { return this.actionCustomName(data, row); }
      },
      {
        "fieldName": "recordStatus",
        render: (data: any, type: any, row: any, meta: any) => { return this.recordStatusCustomRender(data, row); }
      }, {
        "fieldName": "dueDate",
        render: (data: any, type: any, row: any, meta: any) => { return this.customDueDateRender(data, row); }
      },
    ]
  }
	tableConfig : any = {
  "rightFreezeFromColumn" : "0",
  "currentNode" : "TABLE",
  "columnReorder" : false,
  "type" : "grid",
  "showDetailPageAs" : "navigate_to_new_page",
  "rowGroup" : "no",
  "outline" : false,
  "children" : [ {
    "fieldName" : "tableName",
    "data" : "",
    "formatDisplay" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : true,
    "label" : "Table_Name",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "tableName",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "tableName",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "tableName"
  }, {
    "fieldName" : "name",
    "data" : "",
    "formatDisplay" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : true,
    "label" : "Task_Name",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "name",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "name",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "name"
  }, {
    "fieldName" : "description",
    "data" : "",
    "formatDisplay" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : false,
    "label" : "Description",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "description",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "description",
    "uiType" : "textarea",
    "fieldType" : "string",
    "fieldId" : "description"
  }, {
    "fieldName" : "recordStatus",
    "data" : "",
    "formatDisplay" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : false,
    "label" : "Pre_HYP_Action_Status",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "recordStatus",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "recordStatus",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "recordStatus",
    "skipSanitize": true,
    "render" : "(data: any, type: any, row: any, meta: any) => {return this.recordStatusCustomRender(data,row);}\r\n"
  }, {
    "fieldName" : "completionDate",
    "data" : "",
    "formatDisplay" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : false,
    "label" : "Completion_Date",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "completionDate",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "completionDate",
    "uiType" : "datetime",
    "dateTimeFormatAngular" : "d MMM y h:mm:ss a",
    "fieldType" : "Date",
    "fieldId" : "completionDate"
  }, {
    "fieldName" : "dueDate",
    "data" : "",
    "formatDisplay" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : false,
    "label" : "Due_Date",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "dueDate",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "dueDate",
    "uiType" : "datetime",
    "dateTimeFormatAngular" : "d MMM y h:mm:ss a",
    "fieldType" : "Date",
    "fieldId": "dueDate",
    "width": '150px'
  }, {
    "fieldName" : "action",
    "data" : "Action",
    "formatDisplay" : true,
    "enableRecordCreation" : false,
    "showOnMobile" : true,
    "isPrimaryKey" : false,
    "label" : "Action",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "skipSanitize" : true,
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "action",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "action",
    "uiType" : "text",
    "fieldType" : "string",
    "render" : "(data: any, type: any, row: any, meta: any) => {return this.actionCustomRender(data,row);}\r\n",
    "fieldId" : "action",
    "width": '175px',
  }, {
    "fieldName" : "actionTaken",
    "data" : "actionTaken",
    "formatDisplay" : true,
    "enableRecordCreation" : false,
    "showOnMobile" : true,
    "isPrimaryKey" : false,
    "label" : "Action_Taken",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "skipSanitize" : true,
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "actionTaken",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "actionTaken",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "actionTaken"
  }, {
    "fieldName" : "actionTakenBy",
    "data" : "actionTakenBy",
    "formatDisplay" : true,
    "enableRecordCreation" : false,
    "showOnMobile" : true,
    "isPrimaryKey" : false,
    "label" : "Action_Taken_By",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "New",
    "skipSanitize" : true,
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "actionTakenBy",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "actionTakenBy",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "actionTakenBy"
  }],
  "valueChange" : true,
  "toggleColumns" : false,
  "displayAsToggleSwitch" : false,
  "sorting" : "single_column",
  "sortField" : "name",
  "rowSpacing" : "medium",
  "detailPageParametersMapping" : [ ],
  "rowHeight" : "medium",
  "striped" : true,
  "recordSelection" : "none",
  "infiniteScroll" : false,
  "inlineEditing" : false,
  "viewAs" : "list",
  "hoverStyle" : "box",
  "tableStyle" : "style_2",
  "detailPagePopupWidth" : 70,
  "pageLimit" : "50",
  "leftFreezeUptoColumn" : "0",
  "detailPageMapping" : [ ],
  "runtimeWorkflowEnabled" : false,
  "rememberLastTableSettings" : false,
  "columnResize" : false,
  "showGridlines" : false,
  "detailPageNavigation" : "click_of_the_row",
  "tableId" : "wf-task-list",
  "hideListPageTitle" : false
}

	pageViewTitle: string = 'My Tasks';

	public RwftaskService = inject(RwftaskService);
public appUtilBaseService = inject(AppUtilBaseService);
public translateService = inject(TranslateService);
public messageService = inject(MessageService);
public confirmationService = inject(ConfirmationService);
public cdr = inject(ChangeDetectorRef);
public dialogService = inject(DialogService);
public domSanitizer = inject(DomSanitizer);
public activatedRoute = inject(ActivatedRoute);
public renderer2 = inject(Renderer2);
public router = inject(Router);
public appGlobalService = inject(AppGlobalService);
public baseService = inject(BaseService);
public location = inject(Location);
public zone = inject(NgZone);


		tableSearchControls : UntypedFormGroup = new UntypedFormGroup({
      tableId: new UntypedFormControl('', []),
});

		quickFilterControls : UntypedFormGroup = new UntypedFormGroup({
	status: new UntypedFormControl('',[]),
});


	getSelectedObject(field:string,options:any){
      const selectedObj = (options.filter((item: { label: any}) => (item.label)?.toUpperCase() === field?.toUpperCase()));
      return selectedObj[0];
  }

actionCustomRender(data: any, row: any) {
    const index = this.rwfListData?.findIndex?.(r => r?.id === row?.id);
    if (index !== -1) {
      this.rwfListData[index] = row;
    } else {
      this.rwfListData?.push(row);
    }
  const actions = row?.actions || [];
  const visibleActions = actions?.slice?.(0, 3);
  const moreActions = actions?.slice?.(3);
  const rowdata = JSON.stringify(row);
  let html = '<div class="rwf-action-buttons">';
  visibleActions.forEach((action: any) => {
    html += `<button type="button" class="p-button p-button-sm p-mr-2 table-action-btn" data-action="${action.eventId}" data-row="${row.id}" onclick="window.__rwfTableActionHandler && window.__rwfTableActionHandler(event, '${action.eventId}', '${row.id}')">
      <span class="p-button-label">${action.eventName}</span>
    </button>`;
  });
  if (moreActions.length > 0) {
    html += `<button type="button" class="p-button p-button-sm p-button-info more-btn" onclick="window.__rwfTableMoreActionHandler && window.__rwfTableMoreActionHandler(event, ${row.id})">
      <i class="pi pi-ellipsis-v"></i>
    </button>`;
  }
  html += '</div>';
  return html;
}
actionCustomName(data:any,row:any){
  return `<div class="name-field">${data}</div>`
}

recordStatusCustomRender(data:any, row:any) {
    return `<div class="name-field">${this.translateService.instant(row['resourceStatusCode']) || row['resourceStatusCode']}</div>`;
}

  customDueDateRender(data: any, row: any) {
    if (data == null || data === '') return '';
    const ts = Number(data);
    if (Number.isNaN(ts)) return `<div class="due-date-field"></div>`;

    const date = new Date(ts);
    const now = new Date();

    // For day-level comparisons (ignore time)
    const dateDay = new Date(date?.getFullYear?.(), date?.getMonth?.(), date?.getDate?.());
    const nowDay = new Date(now?.getFullYear?.(), now?.getMonth?.(), now?.getDate?.());
    const diffMs = dateDay?.getTime?.() - nowDay?.getTime?.();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // Format helpers
    const pad = (n: number) => n?.toString?.().padStart?.(2, '0');
    const months = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
    const day = pad(date?.getDate?.());
    const monthTranslated = this.translateService?.instant?.(months[date?.getMonth?.()]);
    const year = date?.getFullYear?.();
    let hour = date?.getHours?.();
    const minute = pad(date?.getMinutes?.());
    const second = pad(date?.getSeconds?.());
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const ampmTranslated = this.translateService?.instant?.(ampm);
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const hourStr = pad(hour);
    const timeStr = `${hourStr}:${minute} ${ampmTranslated}`;
    const formatted = `${day} ${monthTranslated} ${year} ${hourStr}:${minute}:${second} ${ampmTranslated}`;

    let label = '';
    let extraClass = '';

    if (diffDays < 0) {
      // Overdue: show full date/time and mark red
      label = this.translateService.instant('Overdue') + ` - ${formatted}`;
      extraClass = ' overdue';
      // Inline color
      return `<div class="due-date-field${extraClass}" style="color:#d32f2f;">${label}</div>`;
    }

    if (diffDays === 0) {
      label = this.translateService.instant('Today_at_OPENBRACE_OPENBRACE_time_CLOSEBRACE_CLOSEBRACE', { time: timeStr });
    } else if (diffDays === 1) {
      label = this.translateService.instant('Tomorrow_at_OPENBRACE_OPENBRACE_time_CLOSEBRACE_CLOSEBRACE', { time: timeStr });
    } else if (diffDays > 1 && diffDays < 7) {
      label = this.translateService.instant('In_OPENBRACE_OPENBRACE_days_CLOSEBRACE_CLOSEBRACE_days_at_OPENBRACE_OPENBRACE_time_CLOSEBRACE_CLOSEBRACE', { days: diffDays, time: timeStr });
    } else if (diffDays >= 7 && diffDays < 28) {
      const weeks = Math.floor(diffDays / 7);
      label = weeks === 1
        ? this.translateService.instant('In_1_week')
        : this.translateService.instant('In_OPENBRACE_OPENBRACE_weeks_CLOSEBRACE_CLOSEBRACE_weeks', { weeks });
    } else {
      // 4 weeks or more: show full date/time
      label = this.translateService.instant('On_OPENBRACE_OPENBRACE_date_CLOSEBRACE_CLOSEBRACE', { date: formatted });
    }

    return `<div class="due-date-field${extraClass}">${label}</div>`;
  }

	mapFields(mapper: any, keys: any, mapData: any, metaData: any, sourceField: string, targetField: string, hasMapper ?:boolean): void {
    let value = '';
    keys?.forEach((key: { [x: string]: string | number; }) => {
    if(typeof key?.listType === 'string'){
        return;
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
    return { searchData: searchData, mapper: mapper } ;
  }



  populateDataFields(data: any, searchFields: any, config: any, filterKeys: boolean): void {
    for (const key in searchFields) {
      if (searchFields.hasOwnProperty(key) && (searchFields[key]?.toString().length)) {
        const isDefaultFilter = this.defaultFilters.includes(key);
        if (filterKeys && !isDefaultFilter) continue;
        if (!filterKeys && isDefaultFilter) continue;
        if (searchFields[key] === 'IS_EMPTY') {
          data[key] = '$__isEmpty';
        } else if (Array.isArray(searchFields[key])) {
          data[key] = searchFields[key].map((item: string) => item === 'IS_EMPTY' ? '$__isEmpty' : item);
        } else if (( config[key].fieldType != 'Boolean') && (searchFields[key] === undefined || (typeof searchFields[key] === 'string' && searchFields[key].trim() === '') || (typeof searchFields[key] === 'number' && isNaN(searchFields[key])))) {
          data[key] = null;
        } else {
          data[key] = searchFields[key];
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
      if(this.filter.sortField === ele.name){
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
      let property: Exclude<keyof RwftaskListBaseComponent, ' '> = value;
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
      ajaxUrl: RwftaskApiConstants.getDatatableData,
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
      ordering: false,
      // sortField: this.tableConfig.sortField,
      // sortOrder: this.tableConfig.sortOrder,
      colResize: (String(this.tableConfig?.columnResize)?.toLowerCase() === 'true'),
      disableSelection: ((this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' || this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only') ? false : true),
      recordSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' ? 'multi' : (this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only' ? 'single' : '')),
      bFilter: false,
      countRequired: true,
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
      parentId: false,
      uniqueIdentifier:this.tableConfig?.uniqueIdentifier|| null,
      defaultSearch: this.filters[this.componentId]?.length > 0 ||this.mapConfig[this.componentId]?.length > 0  || this.defaultFilters.length > 0 || this.restorefilters ? true : false,
      searchParams: { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig), ...this.getSearchData(this.filter.quickFilter, this.quickFilterFieldConfig)},
      mapper:this.getMapperData(this.filter.quickFilter, this.quickFilterFieldConfig),
       emptyTableMsg: this.gridEmptyMsg,
      fromDetailPage: this.fromDetailPage,
      restoredpage : this.currentPaginationStart,
      isChildIsInDetailPopup: false,
      onRowMenuClick: (option: any, row: any, data: any) => {
      },

      onRowSelect: (selectedRows: any, id: any) => {
        this.getSelectedvalues(selectedRows, id);
      },
      onRowDeselect: (selectedRows: any) => {
        this.getSelectedvalues(selectedRows, '');
      },
       onRowClick: (event: any, id: string,data:any) => {

        if (event.target.className == "p-button p-button-sm p-button-info more-btn" || event.target.className == "pi pi-ellipsis-v" || event.target.closest('.more-btn'))
          {
            this.toggleContextMenu(event, data);
            return;
          }
        if (event.target.closest('.rwf-action-buttons') || event.target.className == "rwf-action-buttons") {
          return;
        }
          this.openDetailPage(data, id);
      },
      drawCallback: (settings: any, apiScope: any,gridProps:any) => {
        this.currentPaginationStart = gridProps?.params.start;
        this.onSelectionChange(this.selectedFilterOption)
      },
      onActiveFilterSelection: (data:any) =>{
      }
    };
    return gridConfigData;
  }

  openDetailPage(rowData: any, recordId: string) {
    const detailRouting = rowData.defaultDetailPageRouting;
    if (detailRouting) {
      console.log('Navigating to:', detailRouting);

      this.router.navigate([`/${detailRouting}`], {
        queryParams: { id: rowData.resourceId }
      });
    } else {
      console.warn('No routing path provided.');
    }
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

showInfoMessage(message: string) {
    // Display an info message
    this.messageService.add({severity:'info', summary:'Info', detail: message});
  }

  toShowRecords(params?: any) {
    let searchDataValues = Object.keys(params?.search || {});
    let mapFields = Object.keys(params?.mapper || {});

   const mapConfigFields = this.mapConfig[this.componentId]?.map((config: { listField: any, listType: string }) => {
      return null;
    }).filter((field: any) => field !== null) || [];
    const missingMapConfigFields = mapConfigFields.filter((field: string) => !mapFields.includes(field));

    this.showonFilter = this.standardGrid && mapConfigFields.length >0 && this.fromDetailPage;


    // Set the grid empty message based on the filter checks
    this.setGridEmptyMessage();

    // Update gridConfig with the appropriate empty table message
    this.gridConfig['emptyTableMsg'] = this.gridEmptyMsg;
    this.gridConfig['parentId'] = false;
  }

comparePriorAndCurrentSearch = (prior: any, current: any) => {
    if (prior && current) {
      const priorString = JSON.stringify(prior);
      const currentString = JSON.stringify(current);
      return priorString === currentString;
    }
    return false;
  }

setGridEmptyMessage() {
        this.gridEmptyMsg = this.translateService.instant('No_Data_Available')
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
      if (filterFields.length > 0) {
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
getListofServicesTobeFired(): Observable<any[]> {
    return new Observable(observer => {
      const config = { ...this.quickFilterFieldConfig };
      let autosuggestConfig: any = {}
      const data = this.quickFilterControls.getRawValue();
      const tempUrl: any = [];
      const observables: Observable<any>[] = [];

      tempUrl.filter((obj: { id: any; }, index: any, self: any[]) =>
        index === self.findIndex((o: { id: any; }) => o.id === obj.id)
      );

      tempUrl?.map((o: any) => {
        const urlObj = {
          url: o.url,
          searchText: '',
          colConfig: config[o.field],
          value: data,
          pageNo: 0
                  };

        urlObj.url = this.appUtilBaseService.generateDynamicQueryParams(urlObj);

        const observable = this.baseService.get(urlObj).pipe(
          catchError((error: any) => {
            console.error('An error occurred:', error);
            return of(null);
          })
        );
        observables.push(observable);
      });
        observer.next([]);
        observer.complete();
    });
  }

    setQueryParam(data?:any){
      let queryParams: any = {}
      if (this.holdFilters.length > 0) {
        this.holdFilters.forEach((filter: string) => {
          const control = this.quickFilterControls.get(filter);
         if (this.shouldHoldValues(control,filter)) {
                if (this.quickFilterControls.get(filter)?.value || this.filtersFromParent[filter]) {
                  const fieldConfig = this.quickFilterFieldConfig?.[filter];
                  if (
                    fieldConfig?.fieldType === 'Date' &&
                    control instanceof FormGroup
                  ) {
                    queryParams[filter] = control.get('min')?.value || null;
                  }
                  else {
                    queryParams[filter] = this.quickFilterControls.get(filter)?.value || this.filtersFromParent[filter] ;
                  }
                }
              }
        })
      }
      this.getDetailpageParameters(queryParams,data);
      localStorage.setItem('holdFilters',JSON.stringify(queryParams));
      return queryParams;
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

  generatedGridStructure() {
    return {
      "quickFilter": {
        display: this.quickFilterControls.getRawValue(),
        reference: this.filter.quickFilter,
      },
      "advancedSearch": {
        display: this.tableSearchControls.getRawValue(),
        reference: this.filter.advancedSearch
      },
      "pageStart": this.currentPaginationStart
    }
  }


  rememberGridConfig(){
    this.appUtilBaseService.removeGridConfigProperty();
    const values = this.generatedGridStructure()
    this.appUtilBaseService.setGridConfigProperty(this.globalStorageKey,values);
  }


  restoreFilterSettings() {
    const fromPage = this.appGlobalService.get('FromPage');
    const detailPage = this.tableConfig?.detailPage?.url;
    const existingFilterSettings = this.appUtilBaseService.getGridConfigProperty(this.globalStorageKey)
    if (detailPage && this.appUtilBaseService.areUrlsEqual(fromPage, detailPage) && existingFilterSettings) {
      this.quickFilterControls.patchValue(existingFilterSettings.quickFilter.display,{emitEvent:false});
      this.filter.quickFilter = existingFilterSettings.quickFilter.reference;
      this.tableSearchControls.patchValue(existingFilterSettings.advancedSearch.display,{emitEvent:false});
      this.filter.advancedSearch = existingFilterSettings.advancedSearch.reference;
      this.filtersApplied = Object.values(this.filter.advancedSearch).some(value => value !== null);
      this.currentPaginationStart = existingFilterSettings.pageStart;
      this.restorefilters = true;
    }
    else{
      this.currentPaginationStart = null;
      this.restorefilters = false;
    }
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
    return queryParams;
  }

  onOperatorSelect(fieldConfig: any) {
    let equalFilter: boolean = (this.defaultFilters.includes(fieldConfig.name) );
    let operator = fieldConfig?.operator || 'has';
    if (fieldConfig?.operator == 'is equal to' || fieldConfig?.operator == 'is empty' || fieldConfig?.uiType == 'select' || equalFilter) {
      operator = '=';
    }
    return operator;
  }

     getDetailpageParameters(queryParams:any ={},data?:any) {
         if (!this.tableConfig.detailPageParametersMapping) {
          return; // If mapping is not available, return without modifying queryParams
      }

      this.tableConfig.detailPageParametersMapping?.forEach((key: any) => {
          const value = this.quickFilterControls.get(key.listField)?.value || (data && data[key.listField]);
          if (value) {
          queryParams[key.detailField] = value;
          }
      });

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
	quickFilterApplied: boolean = false;

	filterSearch() {
    this.quickFilterControls.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      if (!this.appUtilBaseService.isEqualIgnoreCase(this.quickFilterControls.getRawValue(), this.filter.quickFilter, [], true)) {
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


        this.filter.quickFilter = this.normalizeFilterStatus(filterVals);
        this.quickFilterApplied = this.appUtilBaseService.hasAtleastOneValidValue(filterVals);

        //if(this.quickFilterControls.dirty)
        this.onRefresh(false,true);
      }
    });
  }

  normalizeFilterStatus(filterVals: any): any {
    const statusMap: { [key: string]: string } = {
      'Pending_Tasks': 'Open',
      'Completed_Tasks': 'Done',
    };

    // Ensure filterVals is defined
    filterVals = filterVals || {};

    // Default to 'Pending_Tasks' if status is not present or empty
    if (!filterVals.status || filterVals.status.trim() === '') {
      filterVals.status = 'Pending_Tasks';
    }

    // Apply transformation if it exists in the map
    if (statusMap[filterVals.status]) {
      filterVals.status = statusMap[filterVals.status];
    }
    this.onSelectionChange(filterVals.status)

    return filterVals;
  }

  onSelectionChange(selected: 'Open' | 'Done') {
    this.selectedFilterOption = selected;
    if (selected === 'Open') {
      $('td.dueDate, th.dueDate, td.action, th.action').removeClass('hidden-column');
      $('td.completionDate, th.completionDate, td.actionTaken, th.actionTaken, td.actionTakenBy, th.actionTakenBy').addClass('hidden-column');
    } else if (selected === 'Done') {
      $('td.dueDate, th.dueDate, td.action, th.action').addClass('hidden-column');
      $('td.completionDate, th.completionDate, td.actionTaken, th.actionTaken, td.actionTakenBy, th.actionTakenBy').removeClass('hidden-column');
    }
  }

handleDateFields(hasDates: any[], filterVals: any, value: any, fromDefault?:boolean) {
    hasDates.forEach((f: any) => {
      const field = fromDefault ? f?.listField : f.name;
      const dateVal = fromDefault ? value[f?.detailField] : value[field];
      let val: any = {};

      if (!dateVal) {
        delete filterVals[field];
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

            val = {
              lLimit: tempDate1 ? tempDate1.getTime() : null,
              uLimit: tempDate2 ? tempDate2.getTime() : null,
              type: "Date"
            };
        } else {
          if(fromDefault){
            val = { lLimit: null, uLimit: dateVal ? new Date(dateVal).getTime() : null, type: "Date" };
          }
          else{
            val = { lLimit: new Date(dateVal.min).getTime(), uLimit: dateVal.max ? new Date(dateVal.max).getTime() : null, type: "Date" };
          }
        }
        if (val.lLimit || val.uLimit) {
          filterVals[field] = val;
        }
        if (!val.lLimit && !val.uLimit) {
          delete filterVals[field];
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



    initFilterForm(fromResetQuickFilter: Boolean = false) {
    this.quickFilterFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.quickFilterConfig);
    this.addCustomFilters();
    if(!fromResetQuickFilter) {
      this.filterSearch();
    }
    for (const key in this.quickFilterFieldConfig) {
      if (this.quickFilterFieldConfig.hasOwnProperty(key)) {
        const field = this.quickFilterFieldConfig[key];
      }
    }
    const filterValues = this.filters[this.componentId];
    if(fromResetQuickFilter){
      filterValues?.forEach((filter: any) => {
      let overridenValue = filter.detailType == 'value' ? filter.tableField:''; // when having static value
       let value;
     if ((filter.type == 'plusDays' || filter.type == 'minusDays')) {
        value = this.appUtilBaseService.getAdjustedDate(filter.tableField, filter.type)
      } else {
        value = filter.staticValue ? filter.staticValue : this.mapData[filter.tableField] || overridenValue || this.metaData[filter.tableField];
      }
      if(!filter.staticValue){
      const control = this.quickFilterControls.get(filter.lookupField) ;
      this.patchControlValue(control, value, filter);
      }

      if (filter.holdFilterValue) {
          this.filtersFromParent[filter.lookupField] = this.mapData[filter.tableField];
      }
    });
    }

      if (((this.defaultFilters?.length > 0 )  && !this.restorefilters) || fromResetQuickFilter) {
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

        this.filter.quickFilter = this.normalizeFilterStatus(filterVals);
        if(fromResetQuickFilter){
          this.onRefresh();
        }
      //this.quickFilterControls.updateValueAndValidity({ emitEvent: true });
    }
  }



patchControlValue(control: AbstractControl | null, defaultValue: any, field: any) {
    if (control instanceof FormGroup && typeof defaultValue !== 'string' && field.type !=='plusDays' && field.type !=='minusDays') {
      if (field.uiType == 'date' || field.uiType == 'datetime') {
          control.patchValue({
            min: defaultValue[0] ? new Date(defaultValue[0]): null,
            max: defaultValue[1] ? new Date(defaultValue[1]) : null,
          }, { emitEvent: false });
      } else {
        control.patchValue({
          min: defaultValue[0],
          max: defaultValue[1],
        }, { emitEvent: false });
      }
    }
     else if(typeof defaultValue === 'object' && defaultValue !== null && defaultValue?.displayField){
          control?.patchValue(defaultValue.displayField, { emitEvent: false });
     }
    else {
      control?.patchValue(defaultValue, { emitEvent: false });
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
    this.quickFilterControls.controls['status']?.setValue('Pending_Tasks');
  }

  resetNestedFormGroupDeep(formGroup: FormGroup) {
    if (!formGroup || !(formGroup instanceof FormGroup)) return;

    const resetValues = Object.keys(formGroup.controls).reduce((acc, key) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        // Recursively reset nested FormGroup
        this.resetNestedFormGroupDeep(control);
      } else if (control instanceof FormControl) {
          if (this.quickFilterFieldConfig?.[key]?.fieldType == 'Boolean' && !this.defaultFilters.includes(key) ) {
          acc[key] = false;
      }
          else if (!this.defaultFilters.includes(key) || (this.fromDetailPage )) {
          acc[key] = null;
      }
      }

      return acc;
    }, {} as any);

    formGroup.reset(resetValues, { emitEvent: false });
  }

	onUpdate(id: any, event?: any, data?: any) {
    let qparams: any = {};
    if (!this.tableConfig.detailPage?.url) return;
     this.rememberGridConfig();
    const value: any = "parentId";
    let property: Exclude<keyof RwftaskListBaseComponent, '' > = value;
    const methodName: any = "onUpdateChild";
    let action: Exclude<keyof RwftaskListBaseComponent, '' > = methodName;
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
                              this.appUtilBaseService.navigateWithQueryParams(qparams, this.tableConfig.detailPage.url)
            }
          })
        });
      } else {
         qparams = {...qparams,...this.setQueryParam(data)}
          this.appUtilBaseService.navigateWithQueryParams(qparams, this.tableConfig.detailPage.url)
      }
    }
  }

	actionBarAction(btn: any) {
    let methodName: any = btn.methodName ? btn.methodName : (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof RwftaskListBaseComponent, ' '> = methodName;
   const config = this.getButtonConfig(btn);
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
    else if(this.defaultActions.includes(btn.action) && btn.action === "save_and_close"){
      const onSave: Exclude<keyof RwftaskListBaseComponent, ' '> = methodName.split('_')[0];
      this[onSave](false, undefined, true);
    }
else if(this.defaultActions.includes(btn.action) && typeof this[action] === "function"){
      this[action]();
    }
    else if (typeof this[action] === "function"){
      this[action]();
    }
  }

	loadGridData() {
    let gridSubscription: any;
    if (environment.prototype && this.tableConfig.children?.length > 0) {
      gridSubscription = this.RwftaskService.getProtoTypingData().subscribe((data: any) => {
        this.gridData = [...this.gridData, ...data];
        this.isPageLoading = false;
      });
    }
    else {
      this.gridData = []
    }
}
	calculateFormula(){

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
            else{
              const translatedValue = ['dropdown','select','radiobutton'].includes(this.tableSearchFieldConfig[key]?.uiType) && value? this.translateService.instant(value) : value;
             formattedStringArray.push(`${key}: ${translatedValue}`);
            }
          }
      }
  }
  this.advancedSearchValue = formattedStringArray
}

advancedSearch() {
    this.filter.advancedSearch = this.tableSearchControls.value;
    let hasDates = this.tableSearchConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "date" || e.fieldType.toLowerCase() == "datetime");
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
      });
    }

    this.formatSearchString(this.filter.advancedSearch);
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
  clearTimeout(this.typingTimer);
  this.isSearchActive = true;
  this.typingTimer = setTimeout(() => {
    this.onUserInactive();
  }, this.typingDelay);
}

onUserInactive() {
  this.isSearchActive = false;
  this.showAdvancedSearch = false;
  this.onRefresh();
}

  get dynamicModel(): string {
    const raw = this.filtersApplied ? this.advancedSearchValue : this.filter.globalSearch;
    if (!Array.isArray(raw)) return '';
    const transformed = raw.map(item => {
      const [key, value] = item.split(':').map((s: string) => s.trim());
      if (key === 'tableId') {
        const match = this.tableOptions.find(t => t.tableId === value);
        return match ? `Table Name: ${match.tableName}` : null;
      }
      return `${key}: ${value}`;
    }).filter((item): item is string => typeof item === 'string');
    return transformed.join(', ');
  }

set dynamicModel(value: string) {
  if (this.filtersApplied) {
    this.advancedSearchValue = value;
  } else {
    this.filter.globalSearch = value;
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
  this.onRefresh();
}

    onInit() {
      this.loadTableInfo();
			this.initSearchForm();
			this.initFilterForm();
  this.globalStorageKey = this.fromDetailPage && this.componentId ?` ${this.componentId}_${this.localStorageStateKey}`: this.localStorageStateKey;
  this.restoreFilterSettings();
  this.getListofServicesTobeFired().subscribe((responses: any[]) => {
  this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
    this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
    this.loadGridData();
    this.disablechildAction();
    this.disableNewAction();
    this.updateActions();
    const params =  this.assignTableParams();
    this.toShowRecords(params);
    this.gridConfig = this.getGridConfig();
    this.selectedColumns = this.gridConfig.columns;
    this.combinedActionConfig = (this.leftActionBarConfig?.children ?? []).concat(this.rightActionBarConfig?.children ?? []);
    this.actionButtonEnableDisable();
    this.actionButtonHideShow();
       this.appUtilBaseService.updateButtonVisibilityBasedonAllowedActions(
     [],
      {
        left: this.leftActionBarConfig,
        right: this.rightActionBarConfig
      },
      this.conditionalActions,{});
 });

 this.quickFilterControls.get('status')?.valueChanges.subscribe(val => {
  if (!val) {
    this.quickFilterControls.get('status')?.setValue('Pending_Tasks', { emitEvent: false });
  }
});

    (window as any).__rwfTableActionHandler = (event: MouseEvent, action: string, id: string) => {
      event.stopPropagation();
      this.selectedRow = this.rwfListData.find((row: { id: any; }) => row.id === id);
      if (this.selectedRow && action) {
        this.onActionClick(action);
      }
    };
    }

     onDestroy() {
		this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());

    }
     onAfterViewInit() {
			 this.appUtilBaseService.setCurrentPageGlobally();
       if(this.filter)
       this.quickFilterControls.controls['status']?.setValue('Pending_Tasks');
    }

    onChanges(changes:any) {
	}

  toggleContextMenu(event: MouseEvent, row: any) {
    this.selectedRow = row;
    const icon = (event?.currentTarget as HTMLElement)?.querySelector?.('.pi.pi-ellipsis-v');
    if (row?.actions && row?.actions?.length > 3) {
      this.contextMenuActions = row?.actions?.slice?.(3);
    } else {
      this.contextMenuActions = row?.actions;
    }
    if (this.contextMenu) {
      this.contextMenu?.toggle?.(event, icon);
    }
  }

  handleRowAction(action: string, row: any) {
    this.onActionClick(action);
  }

  onActionClick(action: any) {
    const tableId = this.selectedRow.tableId;
    const resourceId = this.selectedRow.resourceId;
    const actionEndpoint = this.selectedRow.actionEndpoint;
    const actionId = action;

    if (actionId && tableId && resourceId) {
      this.performAction(actionId, tableId,resourceId,actionEndpoint);
    }
    this.contextMenu.hide();
  }


  performAction(actionId: string, tableId: string,resourceId:string,actionEndpoint:string) {
    const params = {
      actionId,
      tableId,
      resourceId,
      actionEndpoint
    };
    this.zone?.run?.(() => {
      this.confirmationService?.confirm?.({
        message: this.translateService?.instant?.('Are_you_sure_you_want_to_perform_this_action_QUESTION'),
        header: this.translateService?.instant?.('Confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.RwftaskService?.performActionTaskList?.(params)?.subscribe?.({
            next: (response: any) => {
              this.showMessage?.({ severity: 'success', summary: '', detail: this.translateService?.instant?.('Action_Performed_Successfully') });
              this.onRefresh?.();
            },
            error: (err: any) => {
              console.error('Error performing action:', err);
            }
          });
        },
        reject: () => {
          // After popup is closed
        }
      });
    });
    this.cdr.detectChanges();
  }
  showMessage(config: any) {
    this.messageService.clear();
    this.messageService.add(config);
  }

  loadTableInfo(): void {
    this.RwftaskService.getTablesInfo().subscribe({
      next: (response: any) => {
        if (response?.tables?.length) {
          this.tableOptions = response.tables.map((t: any) => ({
            tableName: t.tableName,
            tableId: t.tableId
          }));
        }
      },
      error: (err: any) => {
        console.error('Error loading table info:', err);
      }
    });
  }

}
