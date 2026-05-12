import { Input, SecurityContext, SimpleChange, ViewChild, Directive } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AppConstants } from '@app/app-constants';
import { Observable, Subject, Subscription, catchError, debounceTime, fromEvent, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppGlobalService } from '@baseapp/app-global.service';
import { BaseService } from '@baseapp/base.service';
import { environment } from '@env/environment';
import { MaskApplierService } from 'ngx-mask';
import { OverlayPanel } from 'primeng/overlaypanel';
import tippy from 'tippy.js';
import { AppUtilService } from '@app/app.util.service';
import { MenuItem } from 'primeng/api';
declare var $: any;

@Directive({})
export class GridBaseComponent {

  public dtOptions: any = {};
  dtInstance: any;
  originalOrder: number[] = [];
  serviceInprogress = false;
  draw = 0;
  start = 0;
  length: any;
  params: any = {};
  total: any;
  filtered: any;
  lastFetchCount: number = 0;
  sortDirection: any;
  sortColumn: any;
  tracker: any;
  countRequired: any;
  public showLoading = false;
  public gridData: any[] = [];
  public currentPageNumber = 0;
  public isSql = AppConstants.isSql;
  dtTrigger: Subject<any> = new Subject();
  @Input() gridConfig: any;
  @Input() showonFilter: boolean = false;
  @Input() filtersApplied: boolean = false;
  @Input() fromDetailView: boolean = false;
  @Input() standardGrid: boolean = false;
  public paginatorOnTop = AppConstants.showPaginationonTop;
  public paginatorOnBottom = AppConstants.showPaginationonBottom

  // @Input() toggleColumnsValue: any;
  // @Input() dataTrigger: any;
  // @ViewChild(DataTableDirective, { static: false })
  // dtElement: DataTableDirective | any;
  @ViewChild('columnSettingsOP') columnSettingsOP: OverlayPanel | undefined
  subscriptions: Subscription[] = [];
  scrollSubscription: any;
  public currentPage: any;
  columnSettingsDPVisible: boolean = false;
  selectedColumns: any = [];
  selectedColumnsBackup: any = [];
  Id: any;
  hideTable: boolean = true;
  RecordstoTranslate: any;

  toggleAllColumnCheck: boolean = true
  selectedRowGroupValue: any;
  settingsMenu: MenuItem[] | undefined | any = []
  settingsPopupContentValue: any = 'toggleOption';
  startColReorderIndex: any;
  columnReorderVal: any = []
  columnReorderValBackup: any = []
  rowGroupingLabel: any;
  toggleSettings: any;
  columnReorder: any;
  columnResize: any;
  skipResize: boolean = false;
  multiColumnSortApplied: boolean = false;
  multiColumnSortFields: any = [];
  ts = inject(TranslateService)
  util = inject(AppUtilService)
  http = inject(HttpClient)
  acRoute = inject(ActivatedRoute)
  baseService = inject(BaseService)
  appGlobalService = inject(AppGlobalService)
  maskService = inject(MaskApplierService)
  router = inject(Router)
  findPage() {
    if (this.gridConfig.isListAsModal) {
      this.currentPage = this.gridConfig.modalName;
    } else {
      this.currentPage = this.acRoute.snapshot.data.label || this.acRoute.snapshot.routeConfig?.path;
    }
    if (this.gridConfig?.isChildPage || this.gridConfig.fromDetailPage) {
      this.currentPage = (this.currentPage || this.router?.routerState?.snapshot?.url?.split('/')[1]) + "_" + this.gridConfig.currentPageName;
    }
    let currentUserData = this.appGlobalService.get('currentUser');
    if (currentUserData) {
      this.currentPage = this.currentPage + "_" + (currentUserData?.sid || currentUserData[0]?.sid);
    }
  }



  onDrawCallback(settings: any, apiScope: any) {
    if (this.gridConfig?.drawCallback) {
      this.gridConfig?.drawCallback(settings, apiScope, this);
    }
    if (this.gridConfig?.colResize)
      this.resizeColumn(settings);
  }

  resizeColumn(settings: { nTableWrapper: any; aoColumns: any; }) {
    setTimeout(() => {
      if (this.skipResize) {
        this.applyDefaultColumnWidths($(settings.nTableWrapper));
        return;
      }
      const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
      const table = $(settings.nTableWrapper);
      let totWidth: number = 0;
      $.map(settings.aoColumns, (o: { field?: any; width?: any; }, i: any) => {
        if (o.field && colStore[o.field] && Object.keys(colStore[o.field]).indexOf('size') > -1) {
          o.width = colStore[o.field].size;
          table.find('tr .' + o.field).css({ 'width': o.width + 'px' });
        }
      });
      if (colStore['t-w']) {
        table.find('table').width(colStore['t-w']);
        table.find('.dataTables_scroll .dataTables_scrollHeadInner').width(colStore['t-w']);
      }
      else {
        table.find('tr:nth-child(1) td').each((i: any, td: any) => {
          totWidth = totWidth + ($(td).outerWidth());
        })
        table.find('table').width(totWidth);
      }
    })
  }

  applyDefaultColumnWidths(tableWrapper: any) {
    this.gridConfig?.columns.forEach((col: any) => {
      if (col.field) {
        const headerWidth = this.getLabelWidth(col);
        const defaultWidth = (col?._originalWidth && col._originalWidth != '0px') ? col._originalWidth : null;
        const colWidth = defaultWidth || ((headerWidth + 35) + "px");
        tableWrapper.find('tr .' + col.field).css('width', colWidth);
      }
    });
    tableWrapper.find('table').css('width', '100%');
    tableWrapper.find('.dataTables_scroll .dataTables_scrollHeadInner').css('width', '100%');
  }


  onRowCallback(row: Node | any, data: any[] | object, index: number) {
    $('td', row).off('click');
    $('td', row).on('click', (event: any) => {
      this.rowClickHandler(data, event, row);
    });
    return row
  }

  getCheckboxAndRadio(event: any): { isCheckbox: boolean; isRadio: boolean } {
    const targetEl = $(event.currentTarget);
    const target = $(event.target);
    return {
      isCheckbox: targetEl.hasClass('select-checkbox') && target.hasClass('chk-select'),
      isRadio: targetEl.hasClass('select-checkbox') && target.hasClass('chk-radio')
    };
  }

  rowClickHandler(info: any, event: any, row: any, presstype?: any): void {
    const targetEl = $(event.currentTarget);
    const contextMenuEl = $(event.target);
    const target = $(event.target);
    let targetIds = event.currentTarget.parentElement.getAttribute("id");

    const { isCheckbox, isRadio } = this.getCheckboxAndRadio(event);

    if ((isCheckbox || isRadio) && !AppConstants.isMobile) {
      if ($(event.currentTarget.parentElement).hasClass('selected')) {
        if ($('#' + this.Id + " tr.vs-grid-header").hasClass("selected")) {
          $("#" + this.Id + "_wrapper tr.vs-grid-header").removeClass("selected")
          $("#" + this.Id + "_wrapper tr.vs-grid-header .chk-select").prop('checked', false);
        }
        $('#' + this.Id + ' #' + targetIds + ' .chk-select').prop("checked", false)
        $('#' + this.Id + ' #' + targetIds + ' .chk-radio').prop("checked", false)
      } else {
        $('#' + this.Id + ' #' + targetIds + ' .chk-select').prop("checked", true)
        $('#' + this.Id + ' #' + targetIds + ' .chk-radio').prop("checked", true)
      }
      return;
    }
    if ((isCheckbox || isRadio) && presstype === 'longpress' && AppConstants.isMobile) {
      if ($(event.currentTarget.parentElement).hasClass('selected')) {
        this.dtInstance.row(event.currentTarget.parentElement).deselect();
      } else {
        this.dtInstance.row(event.currentTarget.parentElement).select();
      }
      return;
    }
    const uniqueIdField = this.gridConfig?.uniqueIdentifier ? 'uniqueId' : 'sid';
    if (targetEl.find('.hyperlink').length > 0) {
      const hyperlinkEl = targetEl.find('.hyperlink');
      if (hyperlinkEl.length > 0 && hyperlinkEl.attr('data-field-name')) {
        const field = hyperlinkEl.attr('data-field-name');
        this.openHyperLink(event, info, field)
      }
    } else {
      if (targetEl.hasClass('edit_icon') && this.gridConfig?.detailPageNavigation == 'row_edit') {
        this.gridConfig?.onRowClick(event, info[uniqueIdField], info);
      }
      if (!isCheckbox && !isRadio && this.gridConfig?.detailPageNavigation == 'row_click') {
        this.gridConfig?.onRowClick(event, info[uniqueIdField], info);
      }
    }
  }

  openHyperLink(_event: any, data: any, field: any) {
    const colConfig = this.gridConfig.columns.filter((col: any) => col.name == field);
    this.gridConfig?.onHyperLinkClick(_event, colConfig[0], data);
  }

  onInitComplete(dtInstance: any, settings: any, json: any): void {

    let headerOrCellClick: boolean = false;
    const self = this;
    $('#' + self.Id + '_wrapper').on("click", "th.select-checkbox > .chk-select", function () {
      headerOrCellClick = true;
    })
    
    dtInstance.on('click', 'td', (event: any) => {
      const { isCheckbox, isRadio } = this.getCheckboxAndRadio(event);
      if (isCheckbox || isRadio) {
        headerOrCellClick = true
      }
    })

    dtInstance.on('select', (e: any, dt: any, type: any, ix: any) => {
      if (!headerOrCellClick) {
        return;
      }
      let currentId = e.currentTarget.getAttribute("id");
      if ($(`#${currentId}_wrapper .dataTables_scrollBody tbody tr.selected`).length == $(`#${currentId}_wrapper .dataTables_scrollBody tbody tr`).length) {
        $(`#${currentId}_wrapper tr th .chk-select`).prop('checked', true);
      }
      const selected = dt.rows({ selected: true });
      const maxRows = self.gridConfig.maxRowsAllowedForSelection ? self.gridConfig.maxRowsAllowedForSelection : selected.count();
      if (selected.count() > maxRows) {
        console.log("MAX_ALLOWED_ROWS : " + maxRows)
        dt.rows(ix).deselect();
      } else {
        this.gridConfig?.onRowSelect(selected, ix);
      }
      headerOrCellClick = false;
    });

    dtInstance.on('deselect', (e: any, dt: any, type: any, ix: any) => {
      if (!headerOrCellClick) {
        return;
      }
      let currentId = e.currentTarget.getAttribute("id")
      $(`#${currentId}_wrapper tr th .chk-select`).prop('checked', false);
      setTimeout(() => {
        const selected = dt.rows({ selected: true });
        self.gridConfig.onRowDeselect(selected);
      }, 100);
      headerOrCellClick = false;
    });

    if (!this.gridConfig?.paging) {
      this.attachInfiniteScroll(dtInstance, settings);
    }
    if (this.gridConfig?.ajaxUrl) {
      this.attachSorting(dtInstance);
    }

    this.getOriginalColumnOrder(dtInstance, settings, json);

    if (this.gridConfig?.onInitComplete) {
      this.gridConfig?.onInitComplete(dtInstance, settings, json);
    }

    this.initSelectAllActions();
  }

  public queryViewRefreshForSideBySideView(data:any,uniqueFields:any,mandatoryFlds:any,params:any,queryViewApplied:any){
    if(uniqueFields?.length > 0){
      let searchData:any={};
      let combinedFilters = [...new Set([...(uniqueFields || []), ...(mandatoryFlds || [])])];
      combinedFilters.forEach(c=>{
        if(data[c]){
          searchData[c] = data[c];
        }
      })
      let paramsForSearch = {
        "search": searchData,
        "start": 0,
        "length": 50
      }
  let parts = this.gridConfig?.ajaxUrl?.url.split('/');
  if (parts.length > 2) {
    parts[3] = 'get-unique';
  }
  
  let updatedUrl = parts.join('/');
  
      let apiUrl = {
        url: updatedUrl,
        method: 'POST',
        showloading: true
    };
      this.currentDataSubscription = this.baseService.post(apiUrl, paramsForSearch).subscribe((data: any) => {
        if (data && data?.length == 1) {
          const tbl = this.dtInstance?.table();
     if (tbl) {
      this.tracker?.scroll(0, 0);

      // Find the row with the 'highlight-row' class
      const highlightedRow = $(tbl.table().body()).find('tr.highlighted-row');
    
      if (highlightedRow.length) {
        const rowIndex = tbl.row(highlightedRow).index();
    
        // Update the row data with the new single row
        tbl.row(rowIndex).data(data?.[0]).draw(false);
    
        // Ensure the row keeps its highlight class
        $(tbl.row(rowIndex).node()).addClass('highlighted-row');
      }
        }
        }
        else{
          this.refreshGrid(params,false,queryViewApplied);
        }
      })
    }
    else{
      this.refreshGrid(params,false,queryViewApplied);
    }
  }

  public updateGridDataForSideBySide(id: any,action?:any) {
    const table = this.dtInstance?.table();
    localStorage.setItem("formChanged", JSON.stringify(false));
    if(action && action == "isDelete" && id){
      if (action && action === "isDelete") {
        // Step 1: Remove from gridData
        const index = this.gridData.findIndex(row => row.sid == id);
        if (index !== -1) {
          this.gridData.splice(index, 1); // remove from array
        }
    
        // Step 2: Remove from DataTable
        if (table) {
          const rowIndex = table.rows().indexes().filter((idx: any) => {
            const rowData = table.row(idx).data();
            return rowData?.sid == id;
          })[0];
    
          if (rowIndex !== undefined) {
            table.row(rowIndex).remove().draw(false); // remove and redraw
          }
        }
    
        return; // done with delete case
      }
    }
    else if (id){
      let params = {
        "search": {
          "sid": id
        },
        "start": 0,
        "length": 50
      }
      this.currentDataSubscription = this.baseService.post(this.gridConfig.ajaxUrl, params).subscribe((data: any) => {
        if (data && data?.results?.[0]) {
         let  updatedData:any= data?.results?.[0];
           // Step 1: Update gridData
      const index = this.gridData.findIndex(row => row.sid == id);
      if (index !== -1) {
        this.gridData[index] = updatedData;
            // Step 2: Update DataTable row
      if (table) {
        const rowIndex = table.rows().indexes().filter((idx: any) => {
          const rowData = table.row(idx).data();
          return rowData?.sid == id;
        })[0];
    
        if (rowIndex !== undefined) {
          table.row(rowIndex).data(updatedData).draw(false);
        }
      }
      }
      else {
        this.gridData.push(updatedData);
        if (table) {
          const row = table.row.add(updatedData);
          // Redraw and wait until DataTables has actually updated the DOM
          table.draw(false);
      
          // Use setTimeout to ensure DOM is ready
          setTimeout(() => {
            const lastRowIdx = table.rows().count() - 1;
            const lastRowNode = table.row(lastRowIdx).node();
          
            if (lastRowNode) {
              $(lastRowNode).prependTo($(table.table().body()));
              $(lastRowNode).addClass('highlighted-row');
            } else {
              console.warn('Last row node not found');
            }
          }, 50); // or slightly longer if needed (e.g. 100ms)
          this.total = this.total + 1;
        }
      }
      
    
        }
      });
    }
  }


  initSelectAllActions() {
    if (this.gridConfig?.recordSelection != 'single') {
      $("#" + this.Id + '_wrapper .vs-grid-header th.select-checkbox').append('<input class="chk-select" type="checkbox" name="selectionCheckbox">')
    }
    let _this = this
    $('#' + _this.Id + '_wrapper').on("click", "th.select-checkbox > .chk-select", function () {
      if ($('#' + _this.Id + " tr.vs-grid-header").hasClass("selected")) {
        _this.dtInstance.rows().deselect()
        $("#" + _this.Id + "_wrapper tr.vs-grid-header").removeClass("selected")
        $("#" + _this.Id + "_wrapper tr td .chk-select").prop('checked', false);
      } else {
        _this.dtInstance.rows().select()
        $("#" + _this.Id + "_wrapper tr.vs-grid-header").addClass("selected")
        $("#" + _this.Id + "_wrapper tr td .chk-select").prop('checked', true);
      }
    }).on("select deselect", function () {
      ("Some selection or deselection going on")
      if ($('#' + _this.Id).rows({
        selected: true
      }).count() !== $('#' + _this.Id).rows().count()) {
        $("th.select-checkbox").removeClass("selected");
      } else {
        $("th.select-checkbox").addClass("selected");
      }
    });
  }


  public refreshGrid(params: any, fromDelete?: boolean, filtersApplied?: boolean): void {
    const _this = this;
    this.filtersApplied = filtersApplied ?? this.filtersApplied;
    if (this.dtInstance?.context[0]?.oLanguage) {
      this.dtInstance.context[0].oLanguage.sEmptyTable = this.gridConfig.emptyTableMsg || this.ts.instant('No_data_available_in_table');
      this.dtInstance.clear().draw();
    }
    if (this.dtOptions?.language?.emptyTable) {
      this.dtOptions.language.emptyTable = this.gridConfig.emptyTableMsg || this.ts.instant('No_data_available_in_table');
    }
    $(`#${_this.Id}_wrapper tr th .chk-select`).prop('checked', false);
    if (params) {
      // this.params.order = params.order;
      this.params.search = params.search;
      this.params.mapper = params.mapper;
    }
    $.fn.DataTable['ext'].errMode = 'none';
    if (!environment.prototype) {
      if (fromDelete && this.gridConfig?.paging) {
        this.refreshCurrentPage()
      }
      else if (fromDelete && !this.gridConfig?.paging) {
        this.getData(false, false, true, false, true);
      } else {
        this.start = 0;
        this.getData(false, false, true);
      }

    }
  }

  refreshTableAlignment() {
    const tbl = this.dtInstance?.table();
    // tbl?.clear();
    setTimeout(() => {
      tbl?.columns.adjust();
    }, 0);
  }

  onReorderResizeCallback(settings: { s: { dt: { nTable: any; aoColumns: any; }; }; }) {
    if (!settings) {
      return;
    }
    this.skipResize = false;
    const th = $(settings.s.dt.nTable).find('tr th')
    const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    colStore['t-w'] = $(settings.s.dt.nTable).width();
    this.columnReorderVal = []
    this.columnReorderValBackup = []
    $.map(settings.s.dt.aoColumns, (o: { field: string | number; bVisible: any; idx: any; label: any }, i: string | number) => {

      colStore[o.field] = {
        visible: o.bVisible
      }
      if (this.gridConfig?.colReorder) {
        colStore[o.field].order = o.idx;
        if (o.field) {
          this.columnReorderVal.push({ field: o.field, label: o.label })
          this.columnReorderValBackup.push({ field: o.field, label: o.label })
        }
      }
      if (this.gridConfig?.colResize) {
        colStore[o.field].size = $(th[i]).width();
      }
    })
    localStorage.setItem(this.currentPage, JSON.stringify(colStore));
  }


  /*Method to get the initial column order of the table*/
  getOriginalColumnOrder(dtInstance: any, settings: any, json: any) {
    const originalColumns = this.gridConfig?.columns;
    const changedColumns = settings.aoColumns;
    if (!this.gridConfig?.disableSelection && this.gridConfig?.recordSelection) {
      this.originalOrder.push(0);
    }
    originalColumns.map((col: any) => {
      let index = changedColumns?.findIndex((e: any) => {
        return !e.field ? 0 : e.field == col.field;
      })
      this.originalOrder.push(index);
    });
    changedColumns.map((col: any, colIndex: any) => {
      if (!col.field && colIndex != 0) {
        this.originalOrder.push(colIndex);
      }
    })
  }

  resetSorting(tbl?: any, localStorageValues: Record<string, any> = {}) {
    // Clear sorting-related local storage values
    ['multiColSorting', 'colSortingOrder'].forEach(key => delete localStorageValues[key]);

    this.multiColumnSortApplied = false;
    this.multiColumnSortFields = [];
    this.sortColumn = '';
    this.sortDirection = '';
    // Apply default sorting if multiple column sorting is enabled
    if (this.gridConfig.sorting === 'multiple_columns' && Array.isArray(this.gridConfig.sortFields) && this.gridConfig.sortFields.length > 0) {
      this.multiColumnSortApplied = true;
      this.multiColumnSortFields = [...this.gridConfig.sortFields];
    }

    if (this.gridConfig.sorting === 'single_column') {
      this.sortColumn = this.gridConfig?.sortField || '';
      this.sortDirection = this.gridConfig?.sortOrder?.toLowerCase() || 'asc';
    }

    // Update local storage and refresh data
    localStorage.setItem(this.currentPage, JSON.stringify(localStorageValues));
    this.getDataLatestSorting(localStorageValues);
  }

  resetColumnSettings() {
    if (this.gridConfig?.displayActiveFilter) {
      this.gridConfig.softDeleteFilterValue = AppConstants.softDeleteFilterDefaultValue;
      this.gridConfig.onActiveFilterSelection?.(AppConstants.softDeleteFilterDefaultValue);
    }
    const tbl = this.dtInstance?.table();
    const colStore = JSON.parse(localStorage.getItem(this.currentPage) || "{}");

    if (!tbl || !colStore || jQuery.isEmptyObject(colStore)) return;

    const resetActions: Record<string, () => void> = {
      columnReorder: () => this.resetColumnReorder(tbl, colStore),
      toggleOption: () => this.resetToggleColumns(tbl, colStore),
      rowGroup: () => this.resetRowGroup(tbl, colStore),
      resetSorting: () => this.resetSorting(tbl, colStore),
      revertColumnWidthChanges: () => this.resetColumnsWidth(tbl, colStore),
    };

    if (this.settingsPopupContentValue === "resetAll" || this.settingsPopupContentValue === "revertColumnWidthChanges" || this.settingsPopupContentValue === "resetSorting") {
      this.skipResize = true;
    }

    if (this.settingsPopupContentValue === "resetAll") {
      Object.values(resetActions).forEach(action => action());
    } else if (resetActions[this.settingsPopupContentValue]) {
      resetActions[this.settingsPopupContentValue]();
    }
  }

  getDataLatestSorting(colStore: any) {
    if (!this.selectedRowGroupValue) {
      const params = this.params
      if (this.gridConfig?.sortField && !this.multiColumnSortApplied) {
        params.order = [{
          column: this.gridConfig?.sortField,
          dir: this.gridConfig?.sortOrder?.toLowerCase()
        }];
        if (params?.order) {
          if (params?.order[0]?.column && params?.order[0]?.dir) {
            $("#" + this.Id + '_wrapper' + ' .' + params?.order[0]?.column).removeClass('asc desc');
            $("#" + this.Id + '_wrapper' + ' .' + params?.order[0]?.column).addClass(params?.order[0]?.dir);
          }
        }
        $("#" + this.Id + '_wrapper ' + '.dataTables_scrollHead thead tr th').removeClass('sorting_disabled');
        this.getData(false, true);
      } else {
        params.order = [];
        $("#" + this.Id + '_wrapper' + ' .sorting').removeClass('asc desc');
        this.getData(false, false, true);
      }
    }
  }

  resetColumnReorder(tbl: any, localStorageValues: any) {
    let objKeys = Object.keys(localStorageValues)
    if (this.originalOrder.indexOf(0) == -1) {
      this.originalOrder.unshift(0);
    }
    tbl?.colReorder.reset();
    tbl?.colReorder.order(this.originalOrder);
    this.columnReorderVal = JSON.parse(JSON.stringify(this.gridConfig.columns))
    this.columnReorderValBackup = JSON.parse(JSON.stringify(this.gridConfig.columns))
    objKeys?.forEach((obj: any) => {
      if (obj && localStorageValues[obj]?.order) {
        delete localStorageValues[obj]?.order
      }
    })
    localStorage.setItem(this.currentPage, JSON.stringify(localStorageValues));
  }

  resetToggleColumns(tbl: any, localStorageValues: any) {
    let objKeys = Object.keys(localStorageValues)
    this.selectedColumns = [];
    this.selectedColumnsBackup = [];
    this.gridConfig?.columns.forEach((col: any, i: any) => {
      if (!this.gridConfig?.disableSelection) {
        i = i + 1
      }
      this.selectedColumns.push(col.field)
      this.selectedColumnsBackup.push(col.field)
      setTimeout(() => {
        tbl?.columns([i]).visible(true);
      });
    });
    objKeys?.forEach((obj: any) => {
      if (obj && (localStorageValues[obj]?.visible == false || localStorageValues[obj]?.visible)) {
        delete localStorageValues[obj]?.visible
      }
    })
    localStorage.setItem(this.currentPage, JSON.stringify(localStorageValues));
  }

  resetColumnsWidth(tbl: any, localStorageValues: any) {

    Object.keys(localStorageValues).forEach((key: any) => {
      if (key && localStorageValues[key]?.size) {
        delete localStorageValues[key].size;
      }
    });
    delete localStorageValues['t-w'];

    localStorage.setItem(this.currentPage, JSON.stringify(localStorageValues));

    // Reset gridConfig.columns width back to original so getColumns/checkIfColWidth don't reuse resized values
    this.gridConfig?.columns.forEach((col: any) => {
      if (col._originalWidth !== undefined) {
        col.width = col._originalWidth;
      }
    });

    // Clear DataTables internal aoColumns widths so .draw() doesn't reapply resized values
    const settings = tbl?.settings?.()?.[0];
    if (settings?.aoColumns) {
      settings.aoColumns.forEach((aoCol: any) => {
        if (aoCol.field) {
          delete aoCol.width;
          aoCol.sWidth = null;
          aoCol.sWidthOrig = null;
        }
      });
    }

    this.applyDefaultColumnWidths($("#" + this.Id + '_wrapper'));
  }

  resetRowGroup(tbl?: any, localStorageValues?: any) {
    if (localStorageValues) {
      delete localStorageValues['rowGroupField']
    }
    this.selectedRowGroupValue = '';
    tbl?.rowGroup().dataSrc('').draw();
    setTimeout(() => {
      $("#" + this.Id + '_wrapper' + ' .dtrg-group.dtrg-start.dtrg-level-0').hide()
    }, 0);
    localStorage.setItem(this.currentPage, JSON.stringify(localStorageValues));
    this.getDataLatestSorting(localStorageValues);
    this.dtInstance?.table().rowGroup().disable();
  }

  toggleColumns(event: any) {
    if (event) {
      const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
      const tbl = this.dtInstance?.table();
      this.gridConfig?.columns?.forEach((columnsObj: any, columnsIndex: any) => {
        let eventIndex = event?.findIndex((eventObj: any) => eventObj === columnsObj?.field);
        if (!this.gridConfig?.disableSelection) {
          columnsIndex = columnsIndex + 1
        }
        if (!colStore[columnsObj.field]) {
          colStore[columnsObj.field] = {};
        }
        colStore[columnsObj.field].visible = (eventIndex >= 0) ? true : false;
        let tblIndex = columnsIndex
        if (colStore[columnsObj?.field]?.order) {
          tblIndex = colStore[columnsObj?.field]?.order
        }
        setTimeout(() => {
          tbl?.columns([tblIndex]).visible((eventIndex >= 0) ? true : false);
        });
      })
      this.selectedColumns = this.selectedColumnsBackup;
      localStorage.setItem(this.currentPage, JSON.stringify(colStore));
    }
  }

  toggleAllColumns(event: any) {
    if (this.toggleAllColumnCheck) {
      let sColumns: any = [];
      this.gridConfig?.columns.forEach((col: any, i: any) => {
        sColumns.push(col.field)
      })
      this.selectedColumnsBackup = sColumns;
    } else {
      this.selectedColumnsBackup = []
    }
  }

  isObject(value: any) {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    );
  }

  applySettingsChange() {
    const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    if (this.settingsPopupContentValue == "toggleOption") {
      this.toggleColumns(this.selectedColumnsBackup)
    } else if (this.settingsPopupContentValue == "rowGroup") {
      this.applyRowGroup(this.selectedRowGroupValue)
    } else if (this.settingsPopupContentValue == "columnReorder") {
      const tbl = this.dtInstance?.table();
      let originalOrder: any = [];
      let isSelectionIndex: any = 0;
      if (!this.gridConfig?.disableSelection) {
        isSelectionIndex = 1
        originalOrder.push(0)
      }
      this.columnReorderValBackup.forEach((aObj: any, aIndex: any) => {
        let isvalueChecked = false
        this.columnReorderVal.forEach((bObj: any, bIndex: any) => {
          if (aObj.field == bObj.field && aIndex != bIndex) {
            isvalueChecked = true;
            originalOrder.push(bIndex + isSelectionIndex)
            if (!colStore[aObj.field]) {
              colStore[aObj.field] = { order: bIndex }
            }
            colStore[aObj.field]['order'] = bIndex;
          }
        })
        if (!isvalueChecked) {
          originalOrder.push(aIndex + isSelectionIndex)
        }
      })
      originalOrder.push(isSelectionIndex + this.columnReorderValBackup?.length)
      tbl.colReorder.reset();
      tbl.colReorder.order(originalOrder);
      this.columnReorderVal = this.columnReorderValBackup;
      localStorage.setItem(this.currentPage, JSON.stringify(colStore));
    }
  }

  checkIfColVisible(col: any) {
    const colVisiblityMap = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    return colVisiblityMap[col.field] ? colVisiblityMap[col.field].visible : true;
  }

  checkIfColWidth(col: any) {
    let headerWidth = this.getLabelWidth(col);
    let origWidth = col?._originalWidth || col?.width;
    let defaultWidth = (origWidth && origWidth != '0px') ? origWidth : null;
    const colVisiblityMap = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    return colVisiblityMap[col.field]?.size ? colVisiblityMap[col.field].size + "px" : defaultWidth || ((headerWidth + 35) + "px");
  }


  getLabelWidth(col: any) {
    const text = this.ts.instant(col.label);
    const canvas = document.createElement("canvas");
    let ctx: any = canvas.getContext('2d');
    ctx.font = "normal 1.25rem Poppins";
    let widthObj = ctx?.measureText(text);
    if (this.gridConfig.sorting === 'multiple_columns' && Array.isArray(this.gridConfig.sortFields) && this.gridConfig.sortFields?.length > 0) {
      return (widthObj.width + 10) || 120;
    }
    return widthObj.width || 120;
  }

  formatColumnDatas(col: any, data: any, type: any, row: any, meta: any, confRender: any = '') {
    const self = this;
    let formattedValue: any
    if (col.conditionalStyling) {
      col.uiType = 'conditionalStyling'
    } else if (col.numberFormat) {
      col.uiType = 'numberFormat'
    } else if (col.fieldType == 'Boolean') {
      col.uiType = 'Boolean'
    }
    switch (true) {
      case col.uiType === 'date' && !confRender:
        formattedValue = row[col.field] ? this.util.domSanitizer.sanitize(SecurityContext.HTML, self.util.formatDate(row[col.field], col.dateFormatAngular || AppConstants.dateFormatAngular || null)) : '';
        break;
      case col.uiType === 'datetime' && !confRender:
        formattedValue = row[col.field] ? this.util.domSanitizer.sanitize(SecurityContext.HTML, self.util.formatDateTime(row[col.field], col.dateTimeFormatAngular || AppConstants.dateTimeFormatAngular || null)) : '';
        break;
      case col.uiType === 'currency' && !confRender:
        formattedValue = row[col.field] ? self.util.getFormattedCurrency(data, row, col) : '';
        break;
      case col.uiType === 'conditionalStyling' && !confRender:
        formattedValue = row[col.field] ? this.conditionalColoring(data, row, col) : '';
        break;
      case col.uiType === 'number' && !confRender && typeof row[col.field] == "number":
        formattedValue = this.getPrefixorSuffix(row[col.field], col);
        break;
      case col.uiType === 'numberFormat' && !confRender:
        formattedValue = row[col.field] ? (col.numberFormat ? self.maskService.applyMask(row[col.field].toString(), col.numberFormat) :
          this.util.domSanitizer.sanitize(SecurityContext.HTML, row[col.field])) : '';
        break;
      case (col.uiType == 'attachments' || col.uiType == 'imageCarousel') && !confRender:
        formattedValue = row[col.field] ? this.getAttachmenetUrl(data, row, col) : '';
        break;
      case col.uiType === 'Boolean' && col.isToggle === true && !confRender:
        const isChecked = row[col.field] === true || row[col.field] === 'yes';
        formattedValue = `<div style="text-align:center">
              <div class="toggle-container ${isChecked ? 'on' : ''}"><div class="toggle-knob"></div></div>
              </div>`;
        break;
      case col.uiType === 'Boolean' && !confRender:
        formattedValue = `<div style="text-align:center">
          <i class="${row[col.field] === true || row[col.field] === 'yes' ? 'pi pi-check text-success' : 'pi pi-times text-danger'}" ></i>
          </div>`;
        break;
      case (col.uiType == 'link') && !confRender:
        formattedValue = row[col.field] ? `<span>
          <a target='_blank' href="${row[col.field]}"
          class="ellipsis white-space-nowrap">${this.util.domSanitizer.sanitize(SecurityContext.HTML, 'link')}
          </a></span>` : ''
        break;
      case col.uiType == 'autosuggest' && !confRender:
        if (this.isSql) {
          formattedValue = this.setAutoSuggestValue(row, col);
        } else {
          formattedValue = row[col.field] ? this.formattedAutoSuggestValues(row[col.field], col) : '';
        }
        formattedValue = this.util.domSanitizer.sanitize(SecurityContext.HTML, formattedValue)
        break;
      case (col.uiType == 'select' || col.uiType == 'checkboxgroup' || col.uiType == 'radio') && !confRender:
        formattedValue = row[col.field] ? this.allowedValuesFormat(data, row, col) : '';
        break;
      default:
        if (row && !row.hasOwnProperty(col.field)) {
          row[col.field] = "";
          data = row[col.field];
        }
        if (confRender) {
          if (col.skipSanitize) {
            return confRender(row[col.field], type, row, meta);
          } else {
            return row[col.field] ? this.util.domSanitizer.sanitize(SecurityContext.HTML, confRender(row[col.field], type, row, meta)) : '';
          }
        }
        if (typeof row[col.field] == "string" || typeof row[col.field] == "number" || Array.isArray(row[col.field])) {
          data = row[col.field] ? this.util.domSanitizer.sanitize(SecurityContext.HTML, (Array.isArray(row[col.field]) ? row[col.field]?.map((x: any) => x) : row[col.field])) : '';
        }
        else if (typeof row[col.field] == "object") {
          this.util.removeUnSafeParams(row[col.field]);
        }
        formattedValue = data;
        break;

    }
    if (col.detailPage) {
      formattedValue = this.createHyperLinkTag(formattedValue, col, row);

    }
    return formattedValue
  }

  createHyperLinkTag(formattedValue: any, col: any, row: any) {
    const createLabel = col.createButtonLabel ? this.ts.instant(col.createButtonLabel) : 'Create';
    const tooltip = col.tooltipMessage ? this.ts.instant(col.tooltipMessage) : '';
    if (row[col.field]) {
      return `
        <div class="hyperlink" title="${tooltip}" data-field-name=${col.field}>${formattedValue}</div>`;
    } else if (col.enableRecordCreation) {
      return `
        <div class="hyperlink record-creation" title="${tooltip}" data-field-name=${col.field}>
        <i class="pi pi-plus initial-icon" style=""></i>
        <button><i class="pi pi-plus create-icon"> </i>${createLabel}</button></div>`;
    } else {
      return formattedValue;
    }
  }


  getLabelsFromValue(row: any, col: any): string | string[] | undefined {
    const values = row[col.field];
    const options = col.allowedValues?.values || [];

    if (Array.isArray(values)) {
      return values
        .map(val => options.find((option: any) => option.value === val)?.label)
        .filter(label => label !== undefined);
    } else {
      return options.find((option: any) => option.value === values)?.label;
    }
  }

  allowedValuesFormat(data: any, row: any, col: any) {
    const real_Data = this.getLabelsFromValue(row, col);
    return this.util.domSanitizer.sanitize(SecurityContext.HTML, (typeof real_Data == 'string' ? this.ts.instant(real_Data) : (Array.isArray(real_Data) ? real_Data?.map(x => this.ts.instant(x)) : real_Data)))
  }


  getPrefixorSuffix(data: any, col: any) {
    const prefix = col.prefix || '';
    const suffix = col.suffix || '';
    return data ? `${prefix} ${this.util.domSanitizer.sanitize(SecurityContext.HTML, this.util.getFormattedNumber(data, col))} ${suffix}` : `${prefix} 0 ${suffix} `;
  }

  getColumns(): any {
    const self = this;
    const columns = [];
    const colStore: any = JSON.parse(localStorage.getItem(this.currentPage) + "");
    this.selectedColumns = [];
    this.selectedColumnsBackup = [];
    for (const col of this.gridConfig?.columns) {

      col.className = col.fieldName.trim()
      if (col.showOnMobile) {
        col.className = col.className.concat(" ", "showMobile");
      }
      if (col.showLabel) {
        col.className = col.className.concat(" ", "showLabel");
      }
      if (col.multipleValues == true) {
        col.className = col.className.concat(" ", "sorting_disabled");
      }

      col.visible = this.checkIfColVisible(col);
      if (col._originalWidth === undefined) {
        col._originalWidth = col.width || null;
      }
      col.width = this.checkIfColWidth(col);
      if (!col?.visible && (col?.visible != false)) {
        col['visible'] = true;
      }
      if ((this.gridConfig.rowGrouping && col.field?.toLowerCase() != this.gridConfig.rowGrouping?.toLowerCase()) || (this.gridConfig?.rowGroup && this.selectedRowGroupValue && col.field?.toLowerCase() != this.selectedRowGroupValue?.toLowerCase())) {
        col.className = col.className.concat(" ", "sorting_disabled");
      }
      const confRender = col.render;
      col.className = col.className.concat(" ", "tooltip-content");
      if (col.uiType === 'date' && !confRender) {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta)
          return this.addLabels(col, data, type, row, meta, _temp)
        };
      } else if (col.uiType === 'datetime' && !confRender) {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta)
          return this.addLabels(col, data, type, row, meta, _temp)
        };
      } else if (col.uiType === 'currency' && !confRender) {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta)
          return this.addLabels(col, data, type, row, meta, _temp)
        };
      } else if (col.conditionalStyling && !confRender && !jQuery.isEmptyObject(col?.conditionalStyling)) {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta)
          return this.addLabels(col, data, type, row, meta, _temp)
        }
      } else if (col.uiType === 'number' && !confRender) {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta)
          return this.addLabels(col, data, type, row, meta, _temp)
        };
      } else if (col.numberFormat && !confRender) {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta)
          return this.addLabels(col, data, type, row, meta, _temp)
        };
      } else if ((col.uiType == 'attachments' || col.uiType == 'imageCarousel') && !confRender) {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta)
          return this.addLabels(col, data, type, row, meta, _temp)
        }
      } else if (col.fieldType == 'Boolean' && !confRender) {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta)
          return this.addLabels(col, data, type, row, meta, _temp)
        };
      } else if (col.uiType == 'autosuggest' && !confRender) {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta)
          return this.addLabels(col, data, type, row, meta, _temp)
        }

      } else {
        col.render = (data: any, type: any, row: any, meta: any) => {
          let _temp = self.formatColumnDatas(col, data, type, row, meta, confRender)
          return this.addLabels(col, data, type, row, meta, _temp)
        };
      }
      if (this.gridConfig?.colReorder && colStore && colStore[col.field]) {
        col.order = colStore[col.field].order;
        let orderIndex = colStore[col.field].order
        if (!this.gridConfig?.disableSelection) {
          orderIndex = orderIndex - 1
        }
        this.columnReorderVal[orderIndex] = col
        this.columnReorderValBackup[orderIndex] = col
      }
      // col.title = self.ts.instant(col.title)
      columns.push(col);
      if (col.visible) {
        this.selectedColumns.push(col.field)
        this.selectedColumnsBackup.push(col.field)
      }
    }
    if (this.gridConfig?.colReorder && colStore) {
      columns.sort(function (a, b) { return a.order - b.order });
    }
    if (!this.gridConfig?.disableSelection) {
      columns.unshift({
        data: '',
        orderable: false,
      });
    }
    if (this.gridConfig?.detailPageNavigation == 'row_edit') {
      this.gridConfig.fixedColumns.right = this.gridConfig.fixedColumns.right + 1
      columns.push({
        data: '',
        className: 'edit_icon',
        title: '',
        orderable: false,
        render: (data: any, type: any, row: any, meta: any) => {
          return `<button pbutton="" pripple="" type="button" icon="pi pi-angle-right"
              class="p-element p-button-text p-button p-component p-button-icon-only">
              <span class="p-button-icon pi pi-angle-right" aria-hidden="true"></span>
          </button>`
        }
      });
    }
    const shouldAddSettingsColumn = Boolean(
      this.gridConfig?.toggleColumns ||
      this.gridConfig?.colReorder ||
      this.gridConfig?.colResize ||
      this.gridConfig?.rowGroup ||
      (['single_column', 'multiple_columns'].includes(this.gridConfig?.sorting) && (this.gridConfig?.sortField || this.gridConfig?.sortFields?.length))) &&
      this.settingsMenu?.length > 0;

    if (shouldAddSettingsColumn || this.gridConfig?.showSettingsIcon || this.gridConfig?.displayActiveFilter) {
      this.gridConfig.fixedColumns.right = (this.gridConfig.fixedColumns.right || 0) + 1;

      columns.push({
        data: null,
        className: 'column-settings-icon',
        title: `<i class="pi pi-cog" style="font-size: 2rem"></i>`,
        defaultContent: `<span></span>`,
        orderable: false,
      });

      if (this.settingsMenu.length > 1 || this.gridConfig?.displayActiveFilter) {
        this.settingsMenu = [
          ...this.settingsMenu,
          {
            label: this.ts.instant('Reset_All'),
            command: () => this.settingsMenuOptionClick('resetAll')
          }
        ];
      }
    }
    return columns;
  }

  addLabels(col: any, data: any, type: any, row: any, meta: any, _temp: any) {
    if (col.showLabel && AppConstants.isMobile && col.labelPosition == "top") {
      return `<div class="gridlabel">${this.ts.instant(col.label)}</div> ${_temp}`
    } else if (col.showLabel && AppConstants.isMobile) {
      return `${_temp} <div class="gridlabel">${this.ts.instant(col.label)}</div>`
    } else {
      return _temp
    }
  }


  bindDataToDataTable(data: any, fromDelete?: boolean, fromRefresh?: boolean, fromSorting?: boolean) {
    const tbl = this.dtInstance?.table();
    $("#" + this.dtOptions.id + '_wrapper' + " .dataTables_empty").css({ "display": "revert" })
    if (this.gridConfig.uniqueIdentifier) {
      (data?.results || []).map((d: any) => {
        const uniqueKeys: any[] = [];
        this.gridConfig.uniqueIdentifier.map((m: any) => {
          uniqueKeys.push(d[m]);
        })
        d['uniqueId'] = uniqueKeys.join('_');
      })
    }
    this.lastFetchCount = data?.results?.length || 0;
    if (this.gridConfig.paging || fromDelete || fromRefresh || fromSorting) {
      this.gridData = data?.results || [];
    }
    else {
      this.gridData = [...this.gridData, ...data.results];
    }
    this.total = data?.total ? data.total : '';
    this.countRequired = data?.countRequired ?? this.gridConfig?.countRequired;
    this.filtered = data?.filtered ? data.filtered : '';
    this.currentPageNumber = data?.page + 1;
    this.serviceInprogress = false;
    this.RecordstoTranslate = data;
    if (this.total > this.gridConfig?.pageLength) {
      $('.paginate_button.next').removeClass('disabled')
    }
    if (this.start > 0) {
      $('.paginate_button.previous ').removeClass('disabled')
    }
    // if (!drawNextPage) {
    if (this.gridConfig.paging || fromDelete || fromRefresh || fromSorting) {
      if (tbl) {
        this.tracker?.scroll(0, 0);
        tbl.clear();
        tbl.rows.add(data.results).draw();
      } else {
        this.dtOptions.data = data.results;
        this.dtTrigger.next(0);
      }
    } else {
      if (tbl) {
        tbl.rows.add(data.results).draw(false);
      }
      else {
        this.dtOptions.data = [...this.dtOptions.data, ...data.results];
        this.dtTrigger.next(0);
      }
    }
    let smoothScrollTransition: boolean = false;
    let popUpChildMaxheight: number = 0;
    if ((this.gridConfig.isChildPage || this.gridConfig.fromDetailPage) && this.gridConfig.isChildIsInDetailPopup) {
      let maxheight: any = document.getElementById(this.Id + '_wrapper')?.getElementsByClassName('dataTables_scrollBody')[0]?.scrollHeight;
      if (!this.gridConfig.paging && maxheight > 500) {
        maxheight = maxheight - 50;
      } else if (maxheight < 100) {
        maxheight = 100;
      }
      smoothScrollTransition = true;
      popUpChildMaxheight = maxheight;
      if (this.gridConfig?.paging) {
        setTimeout(() => {
          $("#" + this.Id + '_wrapper ' + '.dataTables_scrollBody').css({ 'max-height': (maxheight > 600 ? 600 : maxheight), 'transition': 'max-height 0.4s ease-in-out' });
        }, 0);
      }
    }
    if (!this.selectedRowGroupValue) {
      setTimeout(() => {
        $("#" + this.Id + '_wrapper' + ' .dtrg-group.dtrg-start.dtrg-level-0').hide()
      }, 0);
    }
    if (!this.gridConfig?.paging) {
      this.setVirtualDatatableOverflowScrollHeight(smoothScrollTransition, popUpChildMaxheight)
    }
    if (this.gridConfig?.onAfterServiceRequest) {
      $(`#${this.Id}_wrapper tr th .chk-select`).prop('checked', false);
      this.gridConfig?.onAfterServiceRequest(data);
    }
  }
  getData(drawNextPage?: boolean, fromSorting?: boolean, fromRefresh?: boolean, fromPreviousPage?: boolean, fromDelete?: boolean, drawLastPage?: boolean): void {
    const tbl = this.dtInstance?.table();
    let triggerAPI: boolean = true
    if (((this.gridConfig?.isChildPage && !this.standardGrid) && !this.gridConfig?.parentId && this.fromDetailView) || environment.prototype || (this.showonFilter && !this.filtersApplied)) {
      triggerAPI = false;
    }
    $("#" + this.dtOptions.id + '_wrapper' + " .dataTables_empty").css({ "display": "none" });
    const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    if (triggerAPI) {
      this.showLoading = true;
      const params = this.params;
      if (this.gridConfig?.fnServerParams) {
        if (typeof params.search.value === "string")
          params.search.value = JSON.parse(params.search.value);
        params.search.value = JSON.stringify(this.gridConfig?.fnServerParams(params.search.value));
      }
      let columnName = this.sortColumn;
      if (columnName && (this.selectedRowGroupValue || this.gridConfig.sorting === 'single_column' || !this.multiColumnSortApplied) && this.multiColumnSortFields?.length === 0) {
        const columnConfig = this.gridConfig.columns.find((o: any) => columnName === o.fieldName && o.uiType === 'autosuggest');
        if (columnConfig) {
          columnName = `${columnConfig.fieldName}${this.gridConfig.sortSeparator}value${this.gridConfig.sortSeparator}${columnConfig.displayField}`;
        }

        params.order = [{
          column: columnName,
          dir: this.sortDirection,
        }];
      } else if (!this.selectedRowGroupValue && ((this.gridConfig.sorting === 'multiple_columns' && this.gridConfig?.sortFields?.length > 0) || this.multiColumnSortApplied)) {
        params.order = this.multiColumnSortFields.reduce((orderArray: any[], obj: any) => {
          const columnConfig = this.gridConfig.columns.find((o: any) => obj.sortField === o.fieldName);
          if (columnConfig) {
            const sortField = columnConfig.uiType === 'autosuggest' ? `${columnConfig.fieldName}${this.gridConfig.sortSeparator}value${this.gridConfig.sortSeparator}${columnConfig.displayField}` : obj.sortField;

            orderArray.push({
              column: sortField,
              dir: obj.sortOrder,
            });
          }
          return orderArray;
        }, []);
      }
      if (fromSorting && !this.multiColumnSortApplied) {
        params.length = this.gridConfig?.pageLength || this.dtOptions.pageLength;
        if (columnName) {
          params.order = [{
            column: columnName,
            dir: this.sortDirection
          }];
        } else {
          params.order = [];
        }
      } else if (fromRefresh) {
        params.start = 0;
        params.length = this.gridConfig?.pageLength || this.dtOptions.pageLength;
        if (this.start == 0) {
          this.start = params.start
        }
        else if (this.gridConfig.paging) {
          params.start = this.start;
        }
      } else if (drawNextPage) {
        params.length = this.gridConfig?.pageLength || this.dtOptions.pageLength;
        const hasMorePagesWithTotal = this.total && (this.currentPageNumber * params.length) <= this.total && (params.start + params.length) < this.total;
        const hasMorePagesWithoutTotal = !this.total && this.gridData.length >= params.length;
        if (hasMorePagesWithTotal || hasMorePagesWithoutTotal) {
          params.start = params.start + params.length;
          this.start = params.start
        }
      } else if (fromPreviousPage) {
        params.length = this.gridConfig?.pageLength || this.dtOptions.pageLength;
        this.start = params.start - params.length
        params.start = this.start
      }
      if (this.gridConfig.parentId) {
        params.pid = this.gridConfig.parentId
      }
      if (columnName || fromSorting || this.multiColumnSortApplied) {
        $("#" + this.Id + '_wrapper' + ' .dataTables_scrollHead thead tr th').removeClass('asc desc sorting');
        this.dtOptions.columns.forEach((col: any) => {
          if (col && col.hasOwnProperty('multiColumnSortOrder')) {
            delete col['multiColumnSortOrder'];
          }
          if (col && col.hasOwnProperty('sortOrder')) {
            delete col['sortOrder'];
          }
        });
        if (this.multiColumnSortApplied && Array.isArray(params.order) && params.order.length) {
          const fields = params.order.map((obj: any, index: number) => {
            $("#" + this.Id + '_wrapper' + ' .dataTables_scrollHead thead tr th.' + obj.column).addClass(`sorting ${obj.dir}`);
            this.setColumnSortOrder(obj, index);
            return {
              sortField: obj.column,
              sortOrder: obj.dir,
            };
          });
          colStore.multiColSorting = fields;
        } else if (params.order?.[0]) {
          const { column, dir } = params.order[0];
          this.setColumnSortOrder({ column, dir }, 0);
          $("#" + this.Id + '_wrapper' + ' .dataTables_scrollHead thead tr th.' + column).addClass(`sorting ${dir}`);
          colStore.colSortingOrder = { sortDirection: dir, sortColumn: column };
        }

        localStorage.setItem(this.currentPage, JSON.stringify(colStore));
      }
      // Filter out downloadErrors from order as it's a computed field
      if (params.order && params.order.length > 0) {
        params.order = params.order.filter((o: any) => o.column !== 'downloadErrors');
      }
      this.loadData(params, fromDelete, fromRefresh, fromSorting);
    }
    else {
      $("#" + this.dtOptions.id + '_wrapper' + " .dataTables_empty").css({ "display": "revert" })
      setTimeout(() => {
        const data = {
          results: [],
          total: 1,
          filtered: 1
        }
        if (this.gridConfig.paging || fromDelete || fromRefresh || fromSorting) {
          this.gridData = [];
          this.dtOptions.data = data.results;
        }
        else {
          this.dtOptions.data = [...this.dtOptions.data, ...data.results]
        }
        this.dtTrigger.next(0);
      }, 1000);

    }
  }

  setColumnSortOrder(obj: any, index: number): void {
    const colIndex = this.dtOptions.columns.findIndex((col: any) => obj.column === col.fieldName);
    if (colIndex !== -1) {
      if (this.multiColumnSortApplied) {
        this.dtOptions.columns[colIndex]['multiColumnSortOrder'] = index + 1;
      }
      this.dtOptions.columns[colIndex]['sortOrder'] = obj.dir;
    }
  }

  getParams(): void {
    const params: any = {};
    params.start = this.start;
    params.length = this.length;

    params.search = {};
    params.mapper = {};

    params.columns = [];
    for (const col of this.gridConfig?.columns) {
      const column: any = {};
      column.data = col.field;
      column.name = col.name;
      column.searchable = true;
      column.orderable = col.orderable === false ? false : (this.gridConfig?.orderable ? this.gridConfig?.orderable : true);

      column.search = {};


      params.columns.push(column);
    }

    params.columns.order = [];

    const colStore = JSON.parse(localStorage.getItem(this.currentPage) || '{}');

    let gridFields = this.gridConfig.columns.map((field: any) => field.fieldId);

    if (colStore.colSortingOrder) {
      const sortFieldExists = gridFields.includes(colStore.colSortingOrder?.sortColumn);
      if (!sortFieldExists) {
        delete colStore['colSortingOrder'];
      }
    }

    if (colStore.multiColSorting) {
      colStore.multiColSorting = colStore.multiColSorting.filter(
        (field: any) => gridFields.includes(field.sortField)
      );
    }
    localStorage.setItem(this.currentPage, JSON.stringify(colStore));

    // Handle sorting (single or multiple columns)
    if (Array.isArray(colStore.multiColSorting) && colStore.multiColSorting.length > 0) {
      this.multiColumnSortApplied = true;
      this.multiColumnSortFields = [...colStore.multiColSorting];
    } else if (
      Array.isArray(this.gridConfig?.sortFields) &&
      this.gridConfig.sorting === 'multiple_columns' &&
      !colStore.colSortingOrder &&
      this.gridConfig.sortFields.length > 0
    ) {
      this.multiColumnSortApplied = true;
      this.multiColumnSortFields = [...this.gridConfig.sortFields];
    } else if (
      colStore.colSortingOrder ||
      (this.gridConfig.sortField && (this.gridConfig.sorting === 'single_column' || !this.gridConfig.sorting))
    ) {
      this.sortColumn = colStore.colSortingOrder?.sortColumn ?? this.gridConfig.sortField;
      this.sortDirection = (colStore.colSortingOrder?.sortDirection ?? this.gridConfig.sortOrder ?? 'asc').toLowerCase();
    }

    if (this.sortColumn) {
      params.order = [{
        column: this.sortColumn,
        dir: this.sortDirection
      }];
    }

    if (this.gridConfig.defaultSearch) {
      params.search = this.gridConfig.searchParams ?? {};
      params.mapper = this.gridConfig.mapper ?? {};
    }

    if (this.gridConfig.restoredpage != null || this.gridConfig.restoredpage != undefined) {
      params.start = this.gridConfig.restoredpage;
      this.start = this.gridConfig.restoredpage;
    }

    params.countRequired = this.gridConfig?.countRequired;

    this.params = params;
  }

  attachInfiniteScroll(dtInstance: any, settings: any) {

    this.tracker = settings.nScrollBody;

    const windowYOffsetObservable: any = fromEvent(this.tracker, 'scroll').pipe(map(() => {
      return this.tracker.scrollTop;
    }));

    this.scrollSubscription = windowYOffsetObservable.subscribe((scrollPos: any) => {
      const limit = (this.tracker.scrollHeight - this.tracker.clientHeight) * 0.90;
      const hasMoreWithTotal = this.total && this.total > this.filtered;
      const hasMoreWithoutTotal = !this.total && this.lastFetchCount >= this.gridConfig?.pageLength;
      if (scrollPos >= limit && (hasMoreWithTotal || hasMoreWithoutTotal)) {
        if (!this.serviceInprogress) {
          this.serviceInprogress = true;
          this.getData(true);
        }
      }
    });
    this.subscriptions.push(this.scrollSubscription);
  }

  attachSorting(dtInstance: any): void {
    $.fn.DataTable['ext'].errMode = 'none';
    const self = this;
    const headerEl = self.dtInstance.header()[0];

    const headNode = $(headerEl).find('th:not(.column-settings-icon)');
    headNode.off('click keydown');
    headNode.on('click keydown', (e: JQuery.TriggeredEvent & { originalEvent: MouseEvent | KeyboardEvent }) => {
      const isCtrlClick = e.type === 'click' && (e.ctrlKey || e.metaKey);

      if ($(e.target).css('cursor') === 'col-resize') {
        return;
      }

      const curTarget = $(e.currentTarget);
      if (curTarget.hasClass('sorting_disabled')) { return; }

      let sortDirection: string;
      if (curTarget.hasClass('asc')) {
        sortDirection = 'desc';
      } else if (curTarget.hasClass('desc')) {
        sortDirection = '';
      } else {
        sortDirection = 'asc';
      }
      const colOrder = parseInt(curTarget.attr('data-column-index'));

      this.dtOptions.columns[colOrder].sortDirection = sortDirection;
      let sortColumnIndex = colOrder;
      if (!this.gridConfig?.disableSelection) {
        sortColumnIndex = colOrder - 1;
      }

      const sortColumn = this.params.columns[sortColumnIndex]?.data || '';
      const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};

      if (isCtrlClick) { // Handle Ctrl+Click or Cmd+Click
        this.multiColumnSortApplied = true;
        this.multiColumnSortFields = this.multiColumnSortFields || [];
        if (this.sortColumn && this.sortDirection && this.multiColumnSortFields.length === 0) {
          this.multiColumnSortFields.push({ sortField: this.sortColumn, sortOrder: this.sortDirection });
        }
        const existingFieldIndex = this.multiColumnSortFields.findIndex((obj: any) => obj.sortField === sortColumn);
        if (sortDirection === '') {
          if (existingFieldIndex !== -1) {
            this.multiColumnSortFields.splice(existingFieldIndex, 1);
          }
        } else if (existingFieldIndex !== -1) {
          this.multiColumnSortFields[existingFieldIndex].sortOrder = sortDirection;
        } else {
          this.multiColumnSortFields.push({ sortField: sortColumn, sortOrder: sortDirection });
        }
      } else if (e.type === 'click') {// Handle regular click
        headNode.removeClass('asc desc');
        this.multiColumnSortApplied = false;
        this.multiColumnSortFields = []
        if (colStore['multiColSorting']) {
          delete colStore['multiColSorting']
        }
      }
      if (!sortDirection) {
        this.sortColumn = '';
      } else {
        this.sortColumn = sortColumn;
      }

      if (sortDirection == 'asc') {
        $(curTarget).addClass('asc');
      } else if (sortDirection == 'desc') {
        $(curTarget).addClass('desc');
      }
      this.sortDirection = sortDirection;

      colStore.colSortingOrder = { sortDirection: this.sortDirection, sortColumn: this.sortColumn }
      localStorage.setItem(this.currentPage, JSON.stringify(colStore));
      this.params.start = 0;
      this.start = 0;
      this.getData(false, true);

    });
  }

  //getDatatable data observable

  private dataSubject = new Subject<any>();
  private currentDataSubscription: Subscription | undefined;

  loadData(params: any, fromDelete: any, fromRefresh: any, fromSorting: any) {
    if (this.currentDataSubscription) {
      this.currentDataSubscription.unsubscribe();
    }

    if (this.gridConfig?.onAfterServiceError && this.gridConfig?.ajaxUrl) {
      this.gridConfig.ajaxUrl['handleError'] = false;
    }

    this.currentDataSubscription = this.dataSubject.pipe(
      debounceTime(300),
      switchMap(() => this.getDatatableData(this.gridConfig?.ajaxUrl, params)),
    ).subscribe((data: any) => {
      if (data) {
        this.bindDataToDataTable(data, fromDelete, fromRefresh, fromSorting);
      } else {
        $("#" + this.dtOptions.id + '_wrapper' + " .dataTables_empty").css({ "display": "revert" })
        this.showLoading = false;
        const data = {
          results: [],
          total: 1,
          filtered: 1
        }
        if (this.gridConfig.paging || fromDelete || fromRefresh || fromSorting) {
          this.gridData = [];
          this.dtOptions.data = data.results;
        }
        else {
          this.dtOptions.data = [...this.dtOptions.data, ...data.results]
        }
        this.dtTrigger.next(0);
      }
    }, (error: any) => {
      if (this.gridConfig?.onAfterServiceError) {
        this.gridConfig.onAfterServiceError(error)
      }
    });
    this.subscriptions.push(this.currentDataSubscription);
    this.dataSubject.next({ params, fromDelete, fromRefresh, fromSorting });
  }

  getDatatableData(urlProps: string, params: any): Observable<any> {
    return this.baseService.post(urlProps, params);
  }

  settingsMenuOptionClick(value: any) {
    this.settingsPopupContentValue = value
    if (value == 'revertColumnWidthChanges' || value == 'resetAll' || value == 'resetSorting') {
      this.resetColumnSettings()
      this.columnSettingsOP?.hide()
    } else if (value == 'ACTIVE_RECORDS_ONLY' || value == 'INACTIVE_RECORDS_ONLY' || value == 'ALL_RECORDS') {
      this.gridConfig['softDeleteFilterValue'] = value;
      this.gridConfig.onActiveFilterSelection(value)
    } else {
      this.columnSettingsDPVisible = true
    }

    const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    if (value == 'rowGroup' && (!colStore['rowGroupField'] && !this.gridConfig?.rowGrouping)) {
      this.selectedRowGroupValue = ''
    }

    if (value == "toggleOption" && (this.selectedColumns?.length == this.gridConfig?.columns?.length)) {
      this.selectedColumnsBackup = this.selectedColumns;
      this.toggleAllColumnCheck = true
    } else {
      this.toggleAllColumnCheck = false
    }

    if (value == "columnReorder") {
      this.columnReorderValBackup = JSON.parse(JSON.stringify(this.columnReorderVal));
    }
  }

  setTranslationForLabels() {
    this.ts.onLangChange.subscribe(() => {
      this.subscribeToTranslation();
    });
    if (this.appGlobalService.get('currentUser')?.languageCode) {
      this.subscribeToTranslation();
    }
    if (environment.prototype) {
      this.subscribeToTranslation();
    }
  }

  subscribeToTranslation() {
    this.settingsMenu = [];
    this.ts.get('Row_Grouping').subscribe((translation: string) => {
      this.rowGroupingLabel = translation;
      if (this.gridConfig?.rowGroup && this.gridConfig.rowGroupColumns?.length > 0) {
        this.settingsMenu.push({ label: this.rowGroupingLabel, icon: 'pi pi-angle-right', command: () => this.settingsMenuOptionClick('rowGroup') })
      }
    });
    this.ts.get('Toggle_Columns').subscribe((translation: string) => {
      this.toggleSettings = translation;
      if (this.gridConfig?.toggleColumns) {
        this.settingsMenu.push({ label: this.toggleSettings, icon: 'pi pi-angle-right', command: () => this.settingsMenuOptionClick('toggleOption') })
      }
    });
    this.ts.get('Reorder_Columns').subscribe((translation: string) => {
      this.columnReorder = translation;
      if (this.gridConfig?.colReorder) {
        this.settingsMenu.push({ label: this.columnReorder, icon: 'pi pi-angle-right', command: () => this.settingsMenuOptionClick('columnReorder') })
      }
    });
    this.ts.get('Reset_Columns_Width').subscribe((translation: string) => {
      this.columnResize = translation;
      if (this.gridConfig?.colResize) {
        this.settingsMenu.push({ label: this.columnResize, command: () => this.settingsMenuOptionClick('revertColumnWidthChanges') })
      }
    });
    this.ts.get('Reset_Sorting').subscribe((translation: string) => {
      if (!this.selectedRowGroupValue && ['single_column', 'multiple_columns'].includes(this.gridConfig.sorting)) {
        this.settingsMenu.push({ label: translation, command: () => this.settingsMenuOptionClick('resetSorting') });
      }
    });
    this.ts.get('No_Data_Available').subscribe((translation: string) => {
      if (this.dtOptions?.language?.emptyTable) {
        this.dtOptions.language.emptyTable = translation;
        this.dtInstance.context[0].oLanguage.sEmptyTable = translation;
      }
    });
  }

  onInit(): void {
    this.findPage();
    const self = this;
    let rowGroupColumn: any;
    if (String(this.gridConfig?.rowGrouping)) {
      rowGroupColumn = this.gridConfig?.columns?.filter((field: any) => field.field?.toLowerCase() === String(this.gridConfig?.rowGrouping).toLowerCase())
      this.gridConfig.sortField = this.gridConfig?.rowGrouping;
      this.gridConfig.sortOrder = 'asc';
      this.selectedRowGroupValue = this.gridConfig?.rowGrouping
    } else if (this.gridConfig?.rowGroupColumns?.length > 0 && this.gridConfig?.rowGroup) {
      rowGroupColumn = [];
      rowGroupColumn.push(this.gridConfig?.rowGroupColumns[0]);
      /* if (rowGroupColumn?.length > 0) {
        this.gridConfig.rowGrouping = rowGroupColumn[0]?.field
        this.gridConfig.sortField = this.gridConfig?.rowGrouping;
        this.gridConfig.sortOrder = 'asc';
        this.selectedRowGroupValue = this.gridConfig?.rowGrouping
      } */
    }
    if (!this.gridConfig?.paging && this.gridConfig?.pageLength < 25) {
      this.gridConfig.pageLength = 25
    }
    if (this.gridConfig.isChildPage || this.gridConfig.fromDetailPage) {
      this.gridConfig.pageLength = Number(this.gridConfig.childPageLength) || 10;
    }

    this.setTranslationForLabels();
    this.columnReorderVal = JSON.parse(JSON.stringify(this.gridConfig.columns))
    this.columnReorderValBackup = JSON.parse(JSON.stringify(this.gridConfig.columns))
    const options: any = {
      scrollX: this.gridConfig?.scrollX ? this.gridConfig?.scrollX : true,
      bFilter: this.gridConfig?.bFilter ? this.gridConfig?.bFilter : false,
      search: {
        return: this.gridConfig?.enterKeytoSearch ? this.gridConfig?.enterKeytoSearch : false
      },
      id: this.gridConfig.id ?? 'datatables_' + Math.floor(this.util.getRandomNum() * 100) + 1,
      rowId: this.gridConfig?.uniqueIdentifier ? 'uniqueId' : 'sid',
      scrollY: this.gridConfig?.scrollY ? this.gridConfig?.scrollY : (window.innerHeight - (this.gridConfig?.quickfilterConfigured ? AppConstants.withFilterHeightReduction : AppConstants.withoutFilterHeightReduction)),
      responsive: AppConstants.isMobile ? {
        details: {
          display: $.fn.DataTable?.Responsive.display.childRowImmediate,
          type: 'column',
          target: -1
        }
      } : false,
      scrollCollapse: this.gridConfig?.scrollCollapse ? this.gridConfig?.scrollCollapse : true,
      columns: this.getColumns(),
      ordering: this.gridConfig?.ordering ? this.gridConfig?.ordering : false,
      aaSorting: [],
      // order: this.gridConfig?.order ? this.gridConfig?.order : [[1, 'asc']],
      paging: this.gridConfig?.paging ? this.gridConfig?.paging : false,
      // pagingType: "simple", // show only Previous and Next button
      deferRender: this.gridConfig?.deferRender ? this.gridConfig?.deferRender : true,
      pageLength: this.gridConfig?.pageLength ? this.gridConfig?.pageLength : AppConstants.defaultPageSize || 50,
      lengthMenu: this.gridConfig?.lengthMenu ? this.gridConfig?.lengthMenu : [10, 25, 50, 100],
      columnDefs: this.gridConfig?.columnDefs ? this.gridConfig?.columnDefs : [],
      fixedColumns: this.gridConfig?.fixedColumns ? this.gridConfig?.fixedColumns : '',
      className: this.gridConfig?.className ? this.gridConfig?.className : '',
      rowSpacing: this.gridConfig?.rowSpacing ? this.gridConfig?.rowSpacing : '',
      rowHeight: this.gridConfig?.rowHeight ? this.gridConfig?.rowHeight : '',
      showGridlines: this.gridConfig?.showGridlines ? this.gridConfig?.showGridlines : false,
      striped: this.gridConfig?.striped ? this.gridConfig?.striped : false,
      colReorder: this.gridConfig?.colReorder ? this.gridConfig?.colReorder : false,
      colResize: this.gridConfig?.colResize ? this.gridConfig?.colResize : false,
      showSettingsIcon: this.gridConfig?.showSettingsIcon ? this.gridConfig?.showSettingsIcon : true,
      toggleColumns: this.gridConfig?.toggleColumns ? this.gridConfig?.toggleColumns : true,
      detailPageNavigation: this.gridConfig?.detailPageNavigation ? this.gridConfig?.detailPageNavigation : '',
      dom: 'Rfrti',
      // dom: 'Rflrtip' 'l' - show length options, 'p' - show pagination control
      "language": {
        "emptyTable": this.ts.instant(this.gridConfig?.emptyTableMsg ? this.gridConfig?.emptyTableMsg : "No_data_available_in_table")
      },
      info: false, // show total count label
      // rowGroup: this.gridConfig?.rowGrouping ? { dataSrc: String(this.gridConfig?.rowGrouping) } : '',
      rowGroup: (this.gridConfig?.rowGrouping || this.gridConfig?.rowGroup) ? {
        dataSrc: function (row: any) {
          return self.formatColumnDatas(rowGroupColumn[0], '', '', row, '', rowGroupColumn[0].render)
        },
        enable: false,
        "emptyDataGroup": this.ts.instant("No_data_for_Grouping")
      } : '',
      complexHeader: this.gridConfig?.complexHeader ? this.gridConfig?.complexHeader : [],
      rowCallback: (row: Node, data: any[] | object, index: number) => {
        self.onRowCallback(row, data, index);
      },
      drawCallback: function (settings: any) {
        const api = this.api();

        $('.paginate_button.next', api.table().container()).on('click', function () {
          if (self.total > self.gridConfig?.pageLength) {
            self.getData(true)
            self.gridConfig?.nextButtonClick("Next");
          }
        });
        self.onDrawCallback(settings, this);
        $('#' + options.id + '_length').on('change', 'select', (event: any) => {
          if (event?.target?.value) {
            self.gridConfig.pageLength = event?.target?.value;
          }
        })
        let popoverTriggerList = [].slice.call(document.querySelectorAll('td.tooltip-content'))
        popoverTriggerList.map(function (popoverTriggerEl: any) {
          if (popoverTriggerEl.innerText && (popoverTriggerEl.offsetWidth < popoverTriggerEl.scrollWidth)) {
            tippy(popoverTriggerEl, {
              content: popoverTriggerEl.innerText,
              followCursor: false,
            });
          }
        });
      },
      initComplete: (settings: any, json: any) => {
        this.dtInstance = settings.oInstance.api();
        this.dtInstance.refreshGrid = this.refreshGrid.bind(this);
        self.onInitComplete(this.dtInstance, settings, json);
        $("#" + options.id + '_wrapper' + ' .dataTables_scrollBody thead tr').css({ visibility: 'collapse' });
        $("#" + options.id + '_wrapper' + ' .column-settings-icon .pi.pi-cog').on('click', function () {
          self.columnSettingsOP?.toggle(event);
        });

        const params = this.params;
        if (params?.order) {
          if (params?.order[0]?.column && params?.order[0]?.dir) {
            $("#" + options.id + '_wrapper' + ' .' + params?.order[0]?.column).removeClass('asc desc');
            $("#" + options.id + '_wrapper' + ' .' + params?.order[0]?.column).addClass(params?.order[0]?.dir);
          }
        }
        this.hideTable = false;
        const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
        if (this.gridConfig?.rowGroupColumns && colStore['rowGroupField']) {
          this.selectedRowGroupValue = colStore['rowGroupField']
          if (this.selectedRowGroupValue) {
            this.applyRowGroup(this.selectedRowGroupValue)
          }
        } else {
          this.selectedRowGroupValue = '';
          this.applyRowGroup('')
        }
        if (this.gridConfig?.data?.length > 0) {
          $.fn.DataTable['ext'].errMode = 'none';
          const tbl = this.dtInstance?.table();
          tbl?.clear();
          tbl?.rows?.add(this.gridConfig?.data).draw();
          this.gridData = this.gridConfig?.data;
          this.total = this.gridData.length;
          this.filtered = this.gridData.length;
        } else {
          $.fn.DataTable['ext'].errMode = 'none';
          if (!this.showLoading) {
            const tbl = this.dtInstance?.table();
            tbl?.clear();
            tbl?.rows?.add([]).draw();
            this.getData();
          }
        }
        if (!this.gridConfig?.paging) {
          this.setVirtualDatatableOverflowScrollHeight()
        }
      },
      colReorderResizeCallback: (dt: any) => {
        self.onReorderResizeCallback(dt);
      },
      stateSave: this.gridConfig?.stateSave ? this.gridConfig?.stateSave : false,
    };

    if (!this.gridConfig?.disableSelection && this.gridConfig?.recordSelection) {
      options.select = {
        style: this.gridConfig?.recordSelection,
        selector: 'td:first-child'
      };
      let _that = this;
      options.columnDefs = [{
        orderable: false,
        className: (this.gridConfig?.recordSelection == 'single' ? 'select-checkbox single' : 'select-checkbox'),
        targets: 0,
        render: function () {
          if (_that.gridConfig?.recordSelection == 'single') {
            return '<input class="chk-radio " type="radio" name="selectionRadio">';
          } else {
            return '<input class="chk-select " type="checkbox" name="selectionCheckbox">';
          }
        }
      }]
    }
    this.length = this.gridConfig?.pageLength ? this.gridConfig?.pageLength : this.dtOptions.pageLength;
    this.getParams();
    $.fn.DataTable['ext'].errMode = 'none';
    this.dtOptions = $.extend(options, { data: [] });
    setTimeout(() => {
      self.dtTrigger.next(0);
    }, 100);
    this.Id = options.id
    this.ts.onLangChange.subscribe((event: LangChangeEvent) => {
      this.bindDataToDataTable(this.RecordstoTranslate, false, true, false);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnChanges(changes: SimpleChange) {

  }

  setVirtualDatatableOverflowScrollHeight(smoothScrollTransition: boolean = false, popUpChildMaxheight: number = 0) {
    const tbl = this.dtInstance.table();
    let rowCountHeight = (tbl?.rows()[0].length ? tbl?.rows()[0].length : 1)
    let tblContainer = tbl?.container();
    let $scrollBody = $('#' + this.dtOptions.id + '_wrapper' + ' .dataTables_scrollBody');
    if ((rowCountHeight ? (rowCountHeight * 31) : rowCountHeight) < (window.innerHeight - 250) && ($(tblContainer)?.attr('id') == this.dtOptions.id + "_wrapper")) {
      let rowHeight = 31
      if ($scrollBody.find('.rowH-medium').length > 0) {
        rowHeight = 41
      } else if ($scrollBody.find('.rowH-large').length > 0) {
        rowHeight = 60
      }
      if ((rowCountHeight < 10 && rowCountHeight < this.dtOptions.pageLength) || rowCountHeight <= 5) {
        if (smoothScrollTransition) {
          let maxheight = (rowCountHeight * 2 * rowHeight) < popUpChildMaxheight ? (rowCountHeight * 2 * rowHeight) : popUpChildMaxheight;
          setTimeout(() => {
            $("#" + this.Id + '_wrapper ' + '.dataTables_scrollBody').css({ 'max-height': (maxheight > 600 ? 600 : maxheight), 'transition': 'max-height 0.4s ease-in-out' });
          }, 0);
        } else {
          $scrollBody.css('max-height', (rowCountHeight * 2 * rowHeight))
        }
      } else {
        if (smoothScrollTransition) {
          let maxheight = ((rowCountHeight - 1) * rowHeight) < popUpChildMaxheight ? ((rowCountHeight - 1) * rowHeight) : popUpChildMaxheight;
          setTimeout(() => {
            $("#" + this.Id + '_wrapper ' + '.dataTables_scrollBody').css({ 'max-height': (maxheight > 600 ? 600 : maxheight), 'transition': 'max-height 0.4s ease-in-out' });
          }, 0);
        } else {
            $scrollBody.css('max-height', rowCountHeight < this.gridConfig?.pageLength ? (rowCountHeight * rowHeight) : ((rowCountHeight - 1) * rowHeight));
        }
      }
    } else {
      const heightAdjustment = this.gridConfig.quickfilterConfigured ?  290 : 220;
      $scrollBody.css('max-height', (window.innerHeight - heightAdjustment));
    }

    const div = $('.dataTables_scrollBody');
    const hasVerticalScrollbar: boolean = div.prop("scrollHeight") > div.prop("clientHeight");
    if (hasVerticalScrollbar) {
      $('.dataTables_scrollHead table tr').addClass("scrollbar-enabled");
    }
    else {
      $('.dataTables_scrollHead table tr').removeClass("scrollbar-enabled");
    }

  }

  //Format Columns

  conditionalColoring(data: any, row: any, col: any) {
    const d = col.fieldType === 'string[]' ? row[col.field] || [] : [row[col.field]] || [];
    let conditionalTemplate: any = '';
    d?.map((datum: any) => {
      const conditionalClrData = col.conditionalStyling[datum];
      if (this.isObject(conditionalClrData) && Object.keys(conditionalClrData).length > 0) {
        conditionalTemplate = conditionalTemplate + `<span class="conditional conditional-container ellipsis white-space-nowrap" style="background-color:${conditionalClrData.style['background-color']}">
        <span class="conditional-icon ${conditionalClrData.style.icon}" style="display:${conditionalClrData.style.showIcon};color:${conditionalClrData.style.iconColor}"></span>
        <span align="center" style="display:${conditionalClrData.style.showlabel};color:${conditionalClrData.style.color}">
        ${this.util.domSanitizer.sanitize(SecurityContext.HTML, (typeof datum == 'string' ? this.ts.instant(datum) : (Array.isArray(datum) ? datum?.map(x => this.ts.instant(x)) : datum)))}</span>
           </span>`;
      }
      else {
        conditionalTemplate = conditionalTemplate + `<span class="comma">
          <span class="ellipsis white-space-nowrap ">
          ${this.util.domSanitizer.sanitize(SecurityContext.HTML, (typeof datum == 'string' ? this.ts.instant(datum) : (Array.isArray(datum) ? datum?.map(x => this.ts.instant(x)) : datum)))}
         </span>`
      }
    })
    return conditionalTemplate;
  }

  setAutoSuggestValue(data: any, col: any) {
    const displayFields = col.mapping;
    let displayFieldconCat: any = [];
    displayFields.map((o: any) => {
      if (o.isApplicable) {
        const formattedData = this.util.formatRawDatatoRedableFormat({}, data[o.childField], o.type);
        if (formattedData) {
          displayFieldconCat.push(formattedData);
        }
      }
    });
    if (displayFieldconCat.length > 1) {
      return displayFieldconCat.join('_');
    }
    else {
      return displayFieldconCat.join();
    }
  }

  getAttachmenetUrl(data: any, row: any, col: any) {
    let template = '';
    row[col.field]?.map((o: any) => {
      template = template + `<span>
    <a target='_blank' href="${AppConstants.attachmentBaseURL}${o.id}" class="ellipsis white-space-nowrap">${this.util.domSanitizer.sanitize(SecurityContext.HTML, o.fileName)}</a>
    </span>`
    })
    return template;
  };

  formattedAutoSuggestValues(data: any, col: any) {
    const arr: any = [];
    const displayField = col.displayField ? col.displayField : '';
    if (data && Array.isArray(data)) {
      data?.forEach((k: any) => {
        arr.push(k.value ? k.value[displayField] : k);
      })
    }
    else if (data?.value) {
      arr.push(data.value[displayField]);
    }
    else {
      arr.push(data);
    }
    return arr.join();
  }


  refreshCurrentPage() {
    this.getData(false, false, false);
  }

  nextPage() {
    this.getData(true, false, false);
  }

  previousPage() {
    if (this.start != 0) {
      this.getData(false, false, false, true);
    }

  }

  firstPage(){
    this.start=0;
    this.getData(false,false,true); 
  }

  applyRowGroup(columnName: any) {
    const tbl = this.dtInstance?.table();
    const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    if (columnName) {
      let rowGroupColumn: any;
      rowGroupColumn = this.gridConfig?.columns?.filter((field: any) => field.field?.toLowerCase() === String(columnName).toLowerCase());
      this.gridConfig.sortField = rowGroupColumn[0].name;
      this.gridConfig.sortOrder = 'asc';

      this.applySortingOnRowGroupColumn();
      this.getData(false, true);
      const self = this;
      tbl.rowGroup().dataSrc(function (row: any) {
        return self.formatColumnDatas(rowGroupColumn[0], '', '', row, '', rowGroupColumn[0].render)
      }).draw();
      colStore['rowGroupField'] = columnName;
      colStore.colSortingOrder = { sortDirection: this.gridConfig.sortOrder, sortColumn: this.gridConfig.sortField }
      localStorage.setItem(this.currentPage, JSON.stringify(colStore));
    } else {
      this.resetRowGroup(tbl, colStore)
    }
    if (!this.selectedRowGroupValue) {
      setTimeout(() => {
        $("#" + this.Id + '_wrapper' + ' .dtrg-group.dtrg-start.dtrg-level-0').hide()
      }, 0);
    }
  }

  applySortingOnRowGroupColumn() {
    if (this.selectedRowGroupValue) {
      this.dtInstance?.table().rowGroup().enable();
      this.gridConfig.columns?.forEach((obj: any) => {
        if (this.gridConfig.sortField != obj.field) {
          $("#" + this.Id + '_wrapper' + ' .dataTables_scrollHead thead tr th').removeClass('asc desc sorting');
          $("#" + this.Id + '_wrapper' + ' .dataTables_scrollHead thead tr th').addClass('sorting_disabled')
        }
      })
      $("#" + this.Id + '_wrapper' + ' .dataTables_scrollHead thead tr th.' + this.gridConfig.sortField).addClass('sorting asc');
      $("#" + this.Id + '_wrapper' + ' .dataTables_scrollHead thead tr th.' + this.gridConfig.sortField).removeClass('sorting_disabled');
      this.multiColumnSortApplied = false;
      this.multiColumnSortFields = [];
      this.sortColumn = this.gridConfig.sortField;
      this.sortDirection = this.gridConfig.sortOrder;
    }
  }

  onDragStartColReorder(index: number) {
    this.startColReorderIndex = index;
  }

  onDropColReorder(dropIndex: number) {
    const general = this.columnReorderValBackup[this.startColReorderIndex];
    this.columnReorderValBackup.splice(this.startColReorderIndex, 1);
    this.columnReorderValBackup.splice(dropIndex, 0, general);
  }

}
