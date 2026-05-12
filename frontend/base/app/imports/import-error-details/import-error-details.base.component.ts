import { Directive, ElementRef, Input, Renderer2, ViewChild, inject, SecurityContext } from '@angular/core';
import { ImportsService } from '../imports.service';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { Filter } from '@baseapp/vs-models/filter.model';
import { AppConstants } from '@app/app-constants';
import { Subscription } from 'rxjs';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AppGlobalService } from '@baseapp/app-global.service';
import { ImportsApiConstants } from '../imports.api-constants';
import { GridComponent } from '@libsrc/grid/grid.component';

@Directive(
  {
    // providers:[MessageService, ConfirmationService, DialogService]
  }
)

export class ImportErrorDetailsBaseComponent {
  @Input() errId: any;
  @Input() detPopupOpen: any;
  gridConfig: any = {};
  errData: any = {};
  quickFilter: any;
  hiddenFields: any = {};
  quickFilterFieldConfig: any = {}
  // bsModalRef?: BsModalRef;
  isSearchFocused: boolean = false;

  showAdvancedSearch: boolean = false;

  tableSearchFieldConfig: any = {};
  @ViewChild('toggleButton')
  toggleButton!: ElementRef;
  @ViewChild('menu')
  menu!: ElementRef;

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
  displayErrorDet: boolean = false;

  gridData: any[] = [];
  totalRecords: number = 0;
  subscriptions: Subscription[] = [];
  multiSortMeta: any = [];
  selectedColumns: any = [];
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
  localStorageStateKey = "import-error-details";
  showMenu: boolean = false;
  conditionalActions: any = {
    disableActions: [],
    hideActions: []
  }
  actionBarConfig: any = [];
  first: number = 0;
  rows: number = 0;
  updatedRecords: any[] = [];
  tableFieldConfig: any = {};
  dateFormat: string = AppConstants.calDateFormat;
  selectedRowId: any = '';
  showWorkflowSimulator: boolean = false;
  @ViewChild(GridComponent)
  private gridComponent: any = GridComponent;
  separator = ".";
  isChildPage: boolean = false;

  quickFilterConfig: any = {}
  customRenderConfig: any = {
    "children": [
      {
        "fieldName": "errorMessage",
        render: (data: any, type: any, row: any, meta: any) => { return this.errorMessage(data, row); }
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
    "leftFreezeUptoColumn": "0",
    "pageLimit": "5",
    "children": [{
      "label": "Row_Number",
      "data": "",
      "field": "rowNumber",
      "type": "gridColumn",
      "width": "60px",
      "showOnMobile": "true",
      "labelPosition": "top",
      "fieldType": "string",
      "multipleValues": false,
      "fieldId": "rowNumber",
      "timeOnly": false,
      "uiType": "text",
      "name": "rowNumber",
      "fieldName": "rowNumber"
    },
    //  {
    //   "label" : "ROW_DETAIL",
    //   "data" : "",
    //   "field" : "failedRow",
    //   "type" : "gridColumn",
    //   "width" : "120px",
    //   "showOnMobile" : "true",
    //   "labelPosition" : "top",
    //   "fieldType" : "Date",
    //   "fieldId" : "failedRow",
    //   "timeOnly" : false,
    //   "uiType" : "text",
    //   "name" : "failedRow",
    //   "fieldName" : "failedRow"
    // }, 
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
      "fieldName": "errorMessage"
    }],
    "sorting": "single_column",
    "sortField": "rowNumber",
    "sortOrder": "asc",
    "detailPageNavigation": "click_of_the_row",
    "rowSpacing": "medium",
    "rowHeight": "medium"
  }
  pageViewTitle: string = 'Import_Error_Details';

  tableSearchControls: UntypedFormGroup = new UntypedFormGroup({
    initiatedBy: new UntypedFormControl('', []),
    initiatedTime: new UntypedFormControl('', []),
    status: new UntypedFormControl('', []),
    uploadedFile: new UntypedFormControl('', []),
    completedTime: new UntypedFormControl('', []),
    numberOfRecordsImported: new UntypedFormGroup({ min: new UntypedFormControl(null, []), max: new UntypedFormControl(null, []) }),
    sourceFileType: new UntypedFormControl('', []),
    importType: new UntypedFormControl('', []),
    inputDateFormat: new UntypedFormControl('', []),
    inputNumberFormat: new UntypedFormControl('', []),
  });

  quickFilterControls: UntypedFormGroup = new UntypedFormGroup({
  });

  public importsService = inject(ImportsService);
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



  onUpdate(id: any, event?: any) {
    if (this.tableConfig.detailPage?.url) {
      const value: any = "parentId";
      let property: Exclude<keyof ImportErrorDetailsBaseComponent, ''> = value;
      const methodName: any = "onUpdateChild";
      let action: Exclude<keyof ImportErrorDetailsBaseComponent, ''> = methodName;
      if (this.isChildPage && this[property]) {
        if (typeof this[action] === "function") {
          this[action](id);
        }
      }
      else {
        this.router.navigateByUrl(this.tableConfig.detailPage.url + '?id=' + id)
      }
    }
  }
  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
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

  clearFilters() {
    this.filter.globalSearch = '';
    this.isSearchFocused = false;
  }

  focus() {
    this.isSearchFocused = !this.isSearchFocused;
  }

  getGridConfig() {
    const self = this
    const gridConfigData: any = {
      data: this.errData,
      columns: this.getColumns(),
      ajaxUrl: ImportsApiConstants.getErrorData,
      select: false,
      colReorder: (String(this.tableConfig?.columnReorder)?.toLowerCase() === 'true'),
      detailPageNavigation: (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_of_the_row' ? 'row_click' : (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_on_navigate_icon' ? 'row_edit' : '')),
      toggleColumns: (String(this.tableConfig?.toggleColumns)?.toLowerCase() === 'true'),
      paging: true,
      scrollX: true,
      scrollCollapse: true,
      pageLength: 25,
      deferRender: true,
      ordering: false,
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
      isChildPage: true,
      isListAsModal: true,
      modalName: 'ImproerrorDetails',
      parentId: this.errId,
      uniqueIdentifier: this.tableConfig?.uniqueIdentifier || null,
      onRowMenuClick: (option: any, row: any, data: any) => {
      },
      onRowClick: (event: any, id: string) => {
        this.onUpdate(id, event);

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
  onInit() {
    if (this.detPopupOpen == true) {
      this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
      this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
      this.gridConfig = this.getGridConfig();
      this.selectedColumns = this.gridConfig.columns;
    }
  }

  onDestroy() {


    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  }
  onAfterViewInit() {

  }

  ngOnChanges() {
    if (this.detPopupOpen == true) {
      this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
      this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
      this.gridConfig = this.getGridConfig();
      this.selectedColumns = this.gridConfig.columns;
    }
  }

  errorMessage(data: any, row: any) {
    const lines = data.split(/\s*\.\s*/).filter(Boolean);
    const spanHTML = lines.map((line: any) => `<span>${line}</span>`).join('<br>');
    const customHTML = `<div>${spanHTML}</div>`;
    return this.appUtilBaseService.domSanitizer.sanitize(SecurityContext.HTML, customHTML);
  }

}
