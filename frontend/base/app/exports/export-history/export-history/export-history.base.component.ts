import { ExportHistoryService } from '../export-history.service';
import { ExportHistoryBase } from '../export-history.base.model';
import { Component, Directive, EventEmitter, Input, Output, SecurityContext, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ExportHistoryApiConstants } from '../export-history.api-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, Subscription, map } from 'rxjs';
import { environment } from '@env/environment';
import { Filter } from '@baseapp/vs-models/filter.model';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { ExportsService } from '@baseapp/exports/exports.service';
import tippy from 'tippy.js';
import { GridComponent } from '@libsrc/grid/grid.component';
// @Component({
//   selector: 'app-export-history-page',
//   templateUrl: './export-history.component.html',
//   styleUrls: ['./_export-history.component.scss']
// })

@Directive({
  providers: []
})

export class ExportHistoryBaseComponent {
  errId: any;
  quickFilter: any;
  hiddenFields: any = {};
  quickFilterFieldConfig: any = {}
  // bsModalRef?: BsModalRef;
  isSearchFocused: boolean = false;
  showBreadcrumb = AppConstants.showBreadcrumb;

  showAdvancedSearch: boolean = false;

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
  displayErrorDet: boolean = false;
  displayExport: boolean = false;


  gridData: ExportHistoryBase[] = [];
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
  localStorageStateKey = "export-history";
  showMenu: boolean = false;
  conditionalActions: any = {
    disableActions: [],
    hideActions: []
  }
  actionBarConfig: any = [];
  updatedRecords: ExportHistoryBase[] = [];
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

  allExportConfig: any;
  leftActionBarConfig: any = {
    "children": [{
      "visibility": "show",
      "buttonStyle": "curved",
      "label": "Export",
      "buttonType": "icon_on_left",
      "showOn": "both",
      "icon": {
        "type": "icon",
        "icon": {
          "label": "fa fa-upload",
          "value": "fa fa-upload"
        },
        "iconColor": "#000000",
        "iconSize": "13px"
      },
      "type": "button",
      "outline": true,
      "valueChange": true,
      "buttonEnabled": "yes",
      "action": "export"
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
      "action": "refresh",
      "buttonEnabled": "yes",
      "label": "REFRESH",
      "type": "button"
    }]
  }
  rightActionBarConfig: any = {}
  tableSearchConfig: any = {
    "children": [
      {
        "label": "TABLE",
        "data": "Table Name",
        "field": "modelName",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "modelName",
        "uiType": "text",
        "name": "modelName",
        "type": "searchField",
        "isPrimaryKey": false,
        "fieldName": "modelName"
      }, {
        "label": "TEMPLATE",
        "data": "",
        "field": "exportName",
        "type": "searchField",
        "fieldType": "string",
        "fieldId": "exportName",
        "uiType": "textarea",
        "name": "exportName",
        "isPrimaryKey": false,
        "fieldName": "exportName"
      }, {
        "label": "EXPORTED_BY",
        "data": "",
        "field": "createdBy",
        "type": "searchField",
        "fieldType": "string",
        "fieldId": "createdBy",
        "uiType": "textarea",
        "name": "createdBy",
        "isPrimaryKey": false,
        "fieldName": "createdBy"
      }, {
        "label": "STATUS",
        "data": "",
        "field": "exportStatus",
        "type": "searchField",
        "fieldType": "string",
        "multipleValues": false,
        "uiType": "select",
        "width": "160px",
        "render": "(data: any, type: any, row: any, meta: any) => {return this.customStatus(data,row);}\n",
        "allowedValues": {
          "values": [
            {
              "label": "INITIATED",
              "value": "INITIATED"
            }, {
              "label": "IN_PROGRESS",
              "value": "IN_PROGRESS"
            }, {
              "label": "COMPLETED",
              "value": "COMPLETED"
            }, {
              "label": "FAILED",
              "value": "FAILED"
            }],
          "conditions": {
            "conditionType": "auto",
            "conditions": []
          }
        },
        "fieldId": "exportStatus",
        "name": "exportStatus",
        "isPrimaryKey": false,
        "fieldName": "exportStatus"
      }],
    "columns": "2",
    "type": "tableSearch",
    "showAdvancedSearch": true
  }
  quickFilterConfig: any = {}
  customRenderConfig: any = {
    "children": [
      {
        "fieldName": "filters",
        render: (data: any, type: any, row: any, meta: any) => { return this.filtersCustomRender(data, row); }

      },
      {
        "fieldName": "outputFiles",
        render: (data: any, type: any, row: any, meta: any) => { return this.exportedFileRender(data, row); }

      },
      {
        "fieldName": "exportStatus",
        render: (data: any, type: any, row: any, meta: any) => { return this.customStatus(data, row); }

      }
    ]
  }




  tableConfig: any = {
    "rightFreezeFromColumn": "0",
    "currentNode": "table",
    "columnReorder": false,
    "tableStyle": "style_2",
    "type": "grid",
    "showDetailPageAs": "navigate_to_new_page",
    "pageLimit": "50",
    "children": [
      {
        "label": "TABLE",
        "data": "Table Name",
        "width": "150px",
        "showOnMobile": "true",
        "showLabel": false,
        "labelPosition": "top",
        "field": "modelName",
        "fieldType": "string",
        "multipleValues": false,
        "fieldId": "modelName",
        "timeOnly": false,
        "uiType": "text",
        "name": "modelName",
        "type": "gridColumn",
        "isPrimaryKey": false,
        "fieldName": "modelName"
      }, {
        "label": "TEMPLATE",
        "data": "",
        "field": "exportName",
        "type": "gridColumn",
        "width": "150px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "string",
        "fieldId": "exportName",
        "timeOnly": false,
        "uiType": "textarea",
        "name": "exportName",
        "isPrimaryKey": false,
        "fieldName": "exportName"
      },
      {
        "label": "FILTERS",
        "data": "Filters",
        "formatDisplay": true,
        "width": "120px",
        "showOnMobile": "true",
        "showLabel": false,
        "labelPosition": "top",
        "field": "filters",
        "type": "gridColumn",
        "currentNode": "2b069878-82a1-43fc-8f77-6367396b27f3",
        "valueChange": true,
        "render": "(data: any, type: any, row: any, meta: any) => {return this.filtersCustomRender(data,row);}\n",
        "skipSanitize": true,
        "fieldType": "string",
        "fieldId": "filters",
        "timeOnly": false,
        "uiType": "textarea",
        "name": "filters",
        "isPrimaryKey": false,
        "fieldName": "filters"
      },
      {
        "label": "EXPORTED_AT",
        "data": "",
        "field": "createdDate",
        "type": "gridColumn",
        "width": "150px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "Date",
        "fieldId": "createdDate",
        "timeOnly": false,
        // "dateTimeFormatAngular": "d MMM y h:mm:ss a",
        "uiType": "datetime",
        "name": "createdDate",
        "isPrimaryKey": false,
        "fieldName": "createdDate"
      },
      {
        "label": "EXPORTED_BY",
        "data": "",
        "field": "createdBy",
        "type": "gridColumn",
        "width": "120px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "string",
        "fieldId": "createdBy",
        "timeOnly": false,
        "uiType": "textarea",
        "name": "createdBy",
        "isPrimaryKey": false,
        "fieldName": "createdBy"
      },
      {
        "label": "STATUS",
        "data": "",
        "field": "exportStatus",
        "type": "searchField",
        "fieldType": "string",
        "multipleValues": false,
        "uiType": "select",
        "width": "160px",
        "render": "(data: any, type: any, row: any, meta: any) => {return this.customStatus(data,row);}\n",
        "allowedValues": {
          "values": [
            {
              "label": "INITIATED",
              "value": "INITIATED"
            }, {
              "label": "IN_PROGRESS",
              "value": "IN_PROGRESS"
            }, {
              "label": "COMPLETED",
              "value": "COMPLETED"
            }, {
              "label": "FAILED",
              "value": "FAILED"
            }],
          "conditions": {
            "conditionType": "Custom",
            "conditions": [
              {
                "id": "INITIATED",
                "query": {
                  "condition": "and",
                  "rules": [{
                    "field": "exportStatus",
                    "operator": "==",
                    "value": "Initiated"
                  }]
                },
                "style": {
                  "background-color": "rgba(26,115,232,0.15)",
                  "color": "#1a73e8",
                  "cell-background-color": "#ffffff",
                  "text-align": "center",
                  "showText": true,
                  "icon": "",
                  "iconColor": "#333333"
                }
              },
              {
                "id": "IN_PROGRESS",
                "query": {
                  "condition": "and",
                  "rules": [{
                    "field": "exportStatus",
                    "operator": "==",
                    "value": "In progress"
                  }]
                },
                "style": {
                  "background-color": "rgba(26,115,232,0.15)",
                  "color": "#1a73e8",
                  "cell-background-color": "#ffffff",
                  "text-align": "center",
                  "showText": true,
                  "icon": "",
                  "iconColor": "#333333"
                }
              }, {
                "id": "COMPLETED",
                "query": {
                  "condition": "and",
                  "rules": [{
                    "field": "exportStatus",
                    "operator": "==",
                    "value": "Completed"
                  }]
                },
                "style": {
                  "background-color": "rgba(22,104,21,0.15)",
                  "color": "#166815",
                  "cell-background-color": "#ffffff",
                  "text-align": "center",
                  "showText": true,
                  "icon": "",
                  "iconColor": "#333333"
                }
              }, {
                "id": "FAILED",
                "query": {
                  "condition": "and",
                  "rules": [{
                    "field": "exportStatus",
                    "operator": "==",
                    "value": "Failed"
                  }]
                },
                "style": {
                  "background-color": "rgba(255,0,0,0.15)",
                  "color": "#ff0000",
                  "cell-background-color": "#ffffff",
                  "text-align": "center",
                  "showText": true,
                  "icon": "",
                  "iconColor": "#333333"
                }
              }]
          }
        },
        "fieldId": "exportStatus",
        "name": "exportStatus",
        "isPrimaryKey": false,
        "fieldName": "exportStatus"
      },
      {
        "label": "COMPLETED_TIME",
        "data": "",
        "field": "completedTime",
        "type": "gridColumn",
        "width": "120px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "Date",
        "fieldId": "completedTime",
        "timeOnly": false,
        // "dateTimeFormatAngular": "d MMM y h:mm:ss a",
        "uiType": "datetime",
        "name": "completedTime",
        "isPrimaryKey": false,
        "fieldName": "completedTime"
      },
      {
        "label": "EXPORTED_FILE",
        "data": "",
        "field": "outputFiles",
        "type": "gridColumn",
        "width": "120px",
        "showOnMobile": "true",
        "labelPosition": "top",
        "fieldType": "any",
        "fieldId": "outputFiles",
        "timeOnly": false,
        "uiType": "attachments",
        "name": "outputFiles",
        "isPrimaryKey": false,
        "fieldName": "outputFiles",
        "render": "(data: any, type: any, row: any, meta: any) => {return this.exportedFileRender(data,row);}\n",
      }, /* {
      "label" : "OUTPUT_DATE_FORMAT",
      "data" : "",
      "field" : "outputDateFormat",
      "type" : "gridColumn",
      "width" : "150px",
      "showOnMobile" : "true",
      "labelPosition" : "top",
      "fieldType" : "Date",
      "fieldId" : "outputDateFormat",
      "timeOnly" : false,
      // "dateFormatAngular" : "d MMM y",
      "uiType" : "date",
      "name" : "outputDateFormat",
      "isPrimaryKey" : false,
      "fieldName" : "outputDateFormat"
    }, {
      "label" : "OUTPUT_DATE_TIME_FORMAT",
      "data" : "",
      "field" : "outputDateTimeFormat",
      "type" : "gridColumn",
      "width" : "200px",
      "showOnMobile" : "true",
      "labelPosition" : "top",
      "fieldType" : "Date",
      "fieldId" : "outputDateTimeFormat",
      "timeOnly" : false,
      // "dateTimeFormatAngular" : "d MMM y h:mm:ss a",
      "uiType" : "datetime",
      "name" : "outputDateTimeFormat",
      "isPrimaryKey" : false,
      "fieldName" : "outputDateTimeFormat"
    }, {
      "label" : "OUTPUT_NUMBER_FORMAT",
      "data" : "",
      "field" : "outputNumberFormat",
      "type" : "gridColumn",
      "width" : "170px",
      "showOnMobile" : "true",
      "labelPosition" : "top",
      "fieldType" : "number",
      "fieldId" : "outputNumberFormat",
      "timeOnly" : false,
      "uiType" : "number",
      "name" : "outputNumberFormat",
      "isPrimaryKey" : false,
      "fieldName" : "outputNumberFormat"
    } */],
    "sorting": "single_column",
    "sortField": "createdDate",
    "sortOrder": "desc",
    "showSettingsIcon": "false",
    "detailPageNavigation": "click_of_the_row",
    "rowSpacing": "medium",
    "rowHeight": "medium",
    "infiniteScroll": true
  }
  pageViewTitle: string = 'Exports';

  tableSearchControls: UntypedFormGroup = new UntypedFormGroup({
    modelName: new UntypedFormControl('', []),
    createdBy: new UntypedFormControl('', []),
    // initiatedTime: new UntypedFormControl('', []),
    exportStatus: new UntypedFormControl('', []),
    exportName: new UntypedFormControl('', []),
    // completedTime: new UntypedFormControl('', []),
    // exportedFile: new UntypedFormControl([], []),
    // outputNumberFormat: new UntypedFormControl('', []),
    // filters: new UntypedFormControl('', []),
    // outputDateTimeFormat: new UntypedFormControl('', []),
    // outputDateFormat: new UntypedFormControl('', []),
  });

  quickFilterControls: UntypedFormGroup = new UntypedFormGroup({
  });

  public exportsService = inject(ExportsService);
  public exportHistoryService = inject(ExportHistoryService);
  public appUtilBaseService = inject(AppUtilService);
  public translateService = inject(TranslateService);
  public messageService = inject(MessageService);
  public confirmationService = inject(ConfirmationService);
  public dialogService = inject(DialogService);
  public domSanitizer = inject(DomSanitizer);
  // public bsModalService = inject(BsModalService);
  public activatedRoute = inject(ActivatedRoute);
  public renderer2 = inject(Renderer2);
  public router = inject(Router);
  public appGlobalService = inject(AppGlobalService);



  actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ExportHistoryBaseComponent, ' '> = methodName;
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
    else if (typeof this[action] === "function") {
      this[action]();
    }
  }
  /* clearFilterValues() {
    this.tableSearchControls.reset();
    this.filter.advancedSearch = {};
    this.onRefresh();
    this.filtersApplied = false;
  } */
  getDisabled(formControl: FormGroup, ele: string) {
    const parent = ele.split('?.')[0];
    if (formControl.controls[parent] instanceof FormGroup) {
      return formControl.get(ele)?.disabled
    }
    else
      return formControl.controls[parent].disabled;
  }
  customErrDetField(data: any, row: any) {
    const customMsg = "Show Error"
    return this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, customMsg);
  }
  onExport() {
    this.displayExport = true
  }
  onExportSucess() {
    this.displayExport = false;
    this.onRefresh();
  }
  loadGridData() {
    let gridSubscription: any;
    if (environment.prototype) {
      gridSubscription = this.exportHistoryService.getProtoTypingData().subscribe((data: any) => {
        this.gridData = [...this.gridData, ...data];
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
    this.gridComponent.refreshGrid(params);
  }
  onRowClickEvent(id: any, event?: any, row?: any) {
    let tableName = row?.firstElementChild?.innerText
    let fileType: any;
    if (tableName) {
      this.allExportConfig[tableName]?.forEach((obj: any) => {
        if (obj.sid == id) {
          fileType = obj.fileTypes[0]
        }
      })
    }
    let url: any = event?.target?.innerText
    if (fileType?.toLowerCase() == 'google_sheet') {
      window.open(url, '_blank');
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
  advancedSearch() {
    // this.filter.advancedSearch = this.tableSearchControls.value;
    this.filter.advancedSearch = JSON.parse(JSON.stringify(this.tableSearchControls.value))
    let hasDates = this.tableSearchConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "date" || e.fieldType.toLowerCase() == "datetime");
    if (hasDates.length > 0) {
      hasDates.forEach((f: any) => {
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && Array.isArray(value)) {
          let val = { lLimit: value[0].getTime(), uLimit: value[1] ? value[1].getTime() : value[1], type: "Date" }
          this.filter.advancedSearch[field] = val;
          if (value[0] == null && value[1] == null) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    let hasNumbers = this.tableSearchConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "number" || e.fieldType.toLowerCase() == "double");
    if (hasNumbers.length > 0) {
      hasNumbers.forEach((f: any) => {
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && !Array.isArray(value)) {
          this.filter.advancedSearch[field] = {
            lLimit: value.min, uLimit: value.max, type: "Number"
          }
          if (value.min == null && value.max == null) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    this.onRefresh();
    this.toggleAdvancedSearch();
  }

  clearFilters() {
    this.filter.globalSearch = '';
    this.isSearchFocused = false;
  }

  focus() {
    this.isSearchFocused = !this.isSearchFocused;
  }
  initSearchForm() {
    this.tableSearchFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.tableSearchConfig)
  }
  filterSearch() {
    this.quickFilterControls.valueChanges.subscribe((value) => {
      for (let control of this.quickFilterConfig.children) {
        if (control.uiType === 'autosuggest' && AppConstants.isSql) {
          control.mapping?.map((o: any, index: number) => {
            if (o.isApplicable && !this.hiddenFields[o.childField] && value[control.fieldName] && value[control.fieldName][o.parentField]) {
              this.quickFilterControls.get([o.childField])?.patchValue(value[control.fieldName][o.parentField], { emitEvent: false });
            }
          })
        }
      }
      let filterVals = { ... this.quickFilterControls.value };
      let hasDates = this.quickFilterConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "date" || e.fieldType.toLowerCase() == "datetime");
      if (hasDates.length > 0) {
        hasDates.forEach((f: any) => {
          let field = f.name;
          let dateVal = value[field];
          if (!dateVal) delete filterVals[field];
          if (dateVal && Array.isArray(dateVal)) {
            let val = { lLimit: dateVal[0].getTime(), uLimit: dateVal[1] ? dateVal[1].getTime() : dateVal[1], type: "Date" }
            filterVals[field] = val;
            if (dateVal[0] == null && dateVal[1] == null) {
              delete filterVals[field];
            }
          }
        });
      }
      let hasNumbers = this.quickFilterConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "number" || e.fieldType.toLowerCase() == "double");
      if (hasNumbers.length > 0) {
        hasNumbers.forEach((f: any) => {
          let field = f.name;
          let numberValue = value[field];
          if (numberValue && !Array.isArray(numberValue)) {
            filterVals[field] = {
              lLimit: numberValue.min, uLimit: numberValue.max, type: "Number"
            }
            if (numberValue.min == null && numberValue.max == null) {
              delete filterVals[field];
            }
          }
        });
      }
      this.filter.quickFilter = filterVals;
      this.onRefresh();
    });
  }
  getSearchData(searchFields: any, config: any) {
    const exportStatuses = ["EXPORT_HANDLER_CREATED", "EXPORT_EXTRACTION_INITIATED", "EXPORT_EXTRACTION_INPROGRESS", "EXPORT_EXTRACTION_COMPLETED", "EXPORT_FINALIZER_STARTED", "CONVERT_OUTPUTFILE_COMPLETED", "SHARE_OUTPUTFILE_COMPLETED"];
    let searchData: any = {}
    for (const key in searchFields) {
      if (searchFields.hasOwnProperty(key) && searchFields[key]?.toString().length) {
        if (this.selectedItems.hasOwnProperty(key)) {
          let lookupObj: any = [];
          if (config[key].multiple) {
            this.selectedItems[key].map((o: any) => lookupObj.push(o.id));
          }
          searchData[`${key}.id`] = config[key].multiple ? lookupObj : this.selectedItems[key][0].id;
        }
        else if (key == 'exportStatus' && searchFields[key].includes("IN_PROGRESS")) {
          const index = searchFields[key].indexOf("IN_PROGRESS");
          if (index > -1) {
            searchFields[key].splice(index, 1);
          }
          searchData[key] = [...searchFields[key], ...exportStatuses];
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
    const searchData = { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig), ...this.getSearchData(this.filter.quickFilter, this.quickFilterFieldConfig) }
    if (this.filter.globalSearch)
      searchData['_global'] = this.filter.globalSearch;

    if (this.filter.sortField && this.filter.sortOrder) {
      let columnName: any = null;
      this.tableConfig.children.map((ele: any) => {
        if (ele.uiType === "autosuggest" && this.filter.sortField === ele.name) {
          columnName = (ele.name + ".value." + ele.displayField);
        }
        else if (this.filter.sortField === ele.name) {
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
    const self = this;
    this.tableConfig.tableStyle = this.appUtilBaseService.getTableView(this.tableConfig.tableStyle, this.tableConfig.rowSpacing, this.tableConfig.rowHeight)?.tableStyle;
    const gridConfigData: any = {
      data: this.gridData,
      columns: this.getColumns(),
      ajaxUrl: ExportHistoryApiConstants.getDatatableData,
      select: false,
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
      colResize: (String(this.tableConfig?.columnResize)?.toLowerCase() === 'true'),
      disableSelection: ((this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' || this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only') ? false : true),
      recordSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' ? 'multi' : (this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only' ? 'single' : '')),
      bFilter: false,
      enterKeytoSearch: false,
      showGridlines: this.tableConfig.showGridlines,
      striped: this.tableConfig.striped,
      rowSpacing: this.appUtilBaseService.getTableView(this.tableConfig.tableStyle, this.tableConfig.rowSpacing, this.tableConfig.rowHeight)?.rowSpacing,
      rowHeight: this.appUtilBaseService.getTableView(this.tableConfig.tableStyle, this.tableConfig.rowSpacing, this.tableConfig.rowHeight)?.rowHeight,
      rowGrouping: jQuery.isEmptyObject(this.tableConfig?.groupOnColumn) ? '' : this.tableConfig?.groupOnColumn?.name,
      sortSeparator: this.separator,
      fixedColumns: {
        left: parseInt(String(this.tableConfig?.leftFreezeUptoColumn || '0')),
        right: parseInt(String(this.tableConfig?.rightFreezeFromColumn || '0'))
      },
      isChildPage: this.isChildPage,
      parentId: this.getParentId(),
      uniqueIdentifier: this.tableConfig?.uniqueIdentifier || null,
      onRowClick: (event: any, id: string, row: any) => {
        this.onRowClickEvent(id, event, row);
      },
      drawCallback: (settings: any, apiScope: any) => {
        this.onDrawCallback(settings, apiScope);
      }
    };
    return gridConfigData;
  }


  onDrawCallback(settings: any, apiScope: any) {
    // Function that is called every time DataTables performs a draw.
    const self = this
    var popoverTriggerList = [].slice.call(document.querySelectorAll('td.filters'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl: any) {
      if (popoverTriggerEl.innerText) {
        tippy(popoverTriggerEl, {
          // content: self.getPopoverContent.bind(self),
          content: popoverTriggerEl.innerText,
          followCursor: true,
          // trigger: 'click',
        });
      }
    });
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
  getParentId() {
    const value: any = "parentId";
    let property: Exclude<keyof ExportHistoryBaseComponent, ' '> = value;
    if (this.isChildPage) {
      if (this[property]) {
        return this[property];
      } else {
        return false;
      }
    }
  }
  calculateFormula() {

  }

  onKeydown(event: any) {
    if (event.which === 13 || event.keyCode === 13) {
      // this.filter.globalSearch = this.globalSearch
      this.onRefresh();
    }
  }
  clearGlobalSearch() {
    this.filter.globalSearch = '';
    this.onRefresh();
  }

  onInit() {

    this.initSearchForm();

    this.initFilterForm();
    this.initFilterForm();
    this.initSearchForm();
    this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
    this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
    this.loadGridData();
    // this.disablechildAction();
    this.updateActions();
    this.gridConfig = this.getGridConfig();
    const exportSubscription = this.exportsService.getExportConfig().subscribe((data: any) => {
      this.allExportConfig = data;
    });
    this.subscriptions.push(exportSubscription);
  }

  onDestroy() {


    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  }
  onAfterViewInit() {

  }

  filtersCustomRender(data: any, row: any) {
    let keyData: any = [];
    if (data && typeof data != "string" && typeof data == "object") {
      if (!jQuery.isEmptyObject(data)) {
        keyData = Object.keys(data);
      } else if (jQuery.isEmptyObject(data)) {
        keyData = ""
        data = ""
      }
    }

    let displayData = (keyData.length > 0 && Array.isArray(keyData)) ? keyData.map((filterValue: any) => " " + filterValue + " : " + this.getFormattedValues(row, data[filterValue], filterValue)) : data
    return data ? this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, displayData) : '';
    // return data ? this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, (keyData.length > 0 && Array.isArray(keyData)) ? keyData.map((x: any) => " " + x + " : " + data[x]) : data) : '';
  }

  getFormattedValues(row: any, data: any, filterValue?: any) {
    let filters = this.allExportConfig[row.modelName]?.filter((filterObj: any) => filterObj.name === row.exportName) || [];
    let col: any = filters[0]?.filters?.children.filter((filterObj: any) => filterObj.field === filterValue);
    let formattedValue = data;
    if (Array.isArray(data) && (!col || (col && (col[0]?.uiType != 'dropdown' && col[0]?.uiType != 'select' && col[0]?.uiType != 'autosuggest')))) {
      let filtersVAl = data
      let formattedRange: any = "";
      filtersVAl.forEach((obj: any, index: any) => {
        data = obj;
        if (index == 0) {
          formattedRange = this.formatFilterFieldsRangeValue(col, "", data, row)
        } else if (data) {
          formattedRange = formattedRange + " - " + this.formatFilterFieldsRangeValue(col, "", data, row)
        }
      })
      formattedValue = formattedRange
    } else {
      formattedValue = this.formatFilterFieldsRangeValue(col, "", data, row)
    }

    return formattedValue;
  }

  formatFilterFieldsRangeValue(col: any, formattedValue: any, data: any, row: any) {
    if (col && col != undefined) {
      col = col[0] || {};
      switch (true) {
        case col.uiType === 'date':
          formattedValue = data ? this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, this.appUtilBaseService.formatDate(data, col.dateFormatAngular || AppConstants.dateFormatAngular || null)) : '';
          break;
        case col.uiType === 'datetime':
          formattedValue = data ? this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, this.appUtilBaseService.formatDateTime(data, col.dateTimeFormatAngular || AppConstants.dateTimeFormatAngular || null)) : '';
          break;
        case col.uiType === 'currency':
          formattedValue = data ? this.appUtilBaseService.getFormattedCurrency(data, row?.filters, col) : '';
          break;
        case col.uiType === 'number':
        case col.uiType === 'double':
          let numberObj: any = {};
          numberObj.min = data.min && typeof data.min == "number" ? this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, this.appUtilBaseService.getFormattedNumber(data.min, col)) : 0;
          numberObj.max = data.max && typeof data.max == "number" ? this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, this.appUtilBaseService.getFormattedNumber(data.max, col)) : 0;
          formattedValue = `min:${numberObj.min}, max:${numberObj.max}`
          break;
        case col.uiType === 'autosuggest':
          if (Array.isArray(data)) {
            formattedValue = ((data && data?.map((o: { [x: string]: any; }) => o[col.displayField])) || []).toString()
          }
          else {
            formattedValue = data && data[col.displayField]
          }
          break;

        case col.uiType === 'dropdown':
        case col.uiType === 'select':
        case col.uiType === 'radio':
        case col.uiType === 'yesno':
        case col.uiType === 'checkboxgroup':
          if (Array.isArray(data)) {
            formattedValue = (data && data?.map((o: any) => this.translateService.instant((o.replace(/ /g, "_")).toUpperCase())) || []).toString();
          }
          else {
            formattedValue = data && this.translateService.instant((data?.replace(/ /g, "_")).toUpperCase());
          }
          break;

        case col.uiType === 'checkbox':
          if (typeof data != 'undefined') {
            if (col.fieldType == 'Boolean') {
              formattedValue = data ? 'True' : 'False';
            }
          }
          break;
        default:
          formattedValue = data ? this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, data) : '';
          const msg = `Please verify that the field ${col.name} has been configured correctly`;
          console.log(msg);
      }
    }
    return formattedValue
  }

  exportedFileRender(data: any, row: any) {
    let template = '';
    data?.map((o: any) => {
      if (row['outputFileType'] == 'CSV' || row['outputFileType'] == 'EXCEL') {
        template = template + `<span>
    <a target='_blank' href="rest/rappitexports/download/${row.sid}" class="ellipsis white-space-nowrap">${this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, 'Link')}</a>
    </span>`

      } else {
        template = template + `<span>
        <a target='_blank' href="${o}" class="ellipsis white-space-nowrap">${this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, 'Link')}</a>
        </span>`
      }

    })
    return template;
  }


  customStatus(data: any, row: any) {
    let conditionalTemplate: any = '';
    const arrVars = ["EXPORT_HANDLER_CREATED", "EXPORT_EXTRACTION_INITIATED", "EXPORT_EXTRACTION_INPROGRESS", "EXPORT_EXTRACTION_COMPLETED", "EXPORT_FINALIZER_STARTED", "CONVERT_OUTPUTFILE_COMPLETED", "SHARE_OUTPUTFILE_COMPLETED"]
    let customStatus = this.translateService.instant(data);
    if (arrVars.includes(data)) {
      data = "IN_PROGRESS";
      customStatus = this.translateService.instant("IN_PROGRESS");
    }
    else if (["FAILED", "EXTRACT_NOT_SUPPORTED"].includes(data)) {
      data = "FAILED";
      customStatus = this.translateService.instant("FAILED");
    }
    let colorConfig = this.tableFieldConfig["exportStatus"].conditionalStyling[data]
    conditionalTemplate = conditionalTemplate + `<span class="conditional conditional-container ellipsis white-space-nowrap ${data}" >
    <span align="center" style="display:block;">
    ${customStatus}</span>
       </span>`;
    return conditionalTemplate;

  }

  onExportPopupClose() {
    this.displayExport = false
    this.onRefresh();
  }

  getValue(formControl: FormGroup, ele: string) {
    const parent = ele.split('?.')[0];
    if (formControl.controls[parent] instanceof FormGroup) {
      const child = ele.split('?.')[1];
      return formControl.controls[parent].value[child];
    }
    else
      return formControl.controls[parent].value;
  }

  getSelectedMultipleObjects(field: any[], options: any) {
    let arr: any[] = [];
    if (field) {
      field?.forEach((ele: any) => {
        const selectedObj: any = (options.filter((item: { label: any }) => item.label.toUpperCase() === ele.toUpperCase()));
        arr.push(selectedObj[0]);
      })
    }
    return arr;
  }

  onRemovestatusItem($event: any, item: any, index: number, ele: string) {
    $event.stopPropagation();
    const removedIndex = this.tableSearchControls.get(ele)?.value?.indexOf(item?.label);
    this.tableSearchControls.get(ele)?.value?.splice(removedIndex, 1);
  }

}
