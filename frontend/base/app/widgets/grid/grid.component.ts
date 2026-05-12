import { Component, ElementRef, Input, OnInit, SecurityContext, SimpleChange, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { findIndex } from 'lodash';
// import * as _ from 'lodash';
// import { a } from './util.service';
import { Subject, Subscription, fromEvent, map, Observable } from 'rxjs';
import { AppConstants } from '@app/app-constants';
// import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppUtilService } from '@app/app.util.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { BaseService } from '@baseapp/base.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AppGlobalService } from '@baseapp/app-global.service';
import { MaskApplierService } from 'ngx-mask';
import { inject } from '@angular/core';
import tippy from 'tippy.js';
declare var $: any;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class GridComponent implements OnInit {

  public dtOptions: any = {};
  private dtInstance: any;
  private originalOrder: number[] = [];
  private serviceInprogress = false;
  private draw = 0;
  private start = 0;
  private length: any;
  private params: any = {};
  private total: any;
  private filtered: any;
  private sortDirection: any;
  private sortColumn: any;
  private tracker: any;
  public showLoading = false;
  public gridData: any = [];
  public currentPageNumber = 0;
  public isSql = AppConstants.isSql;
  dtTrigger: Subject<any> = new Subject();
  @Input() gridConfig: any;
  public paginatorOnTop = AppConstants.showPaginationonTop;
  public paginatorOnBottom = AppConstants.showPaginationonBottom

  // @Input() toggleColumnsValue: any;
  // @Input() dataTrigger: any;
  // @ViewChild(DataTableDirective, { static: false })
  // dtElement: DataTableDirective | any;
  @ViewChild('columnSettingsOP') columnSettingsOP: OverlayPanel | undefined
  private subscriptions: Subscription[] = [];
  private scrollSubscription: any;
  public currentPage: any;
  selectedColumns: any;
  Id: any;
  hideTable: boolean = true;
  private ts = inject(TranslateService)
  private util = inject(AppUtilService)
  private http = inject(HttpClient)
  private acRoute = inject(ActivatedRoute)
  private baseService = inject(BaseService)
  private appGlobalService = inject(AppGlobalService)
  private maskService = inject(MaskApplierService)
  findPage() {
    if (this.gridConfig.isListAsModal) {
      this.currentPage = this.gridConfig.modalName;
    }
    else {
      this.currentPage = this.acRoute.snapshot.data.label || this.acRoute.snapshot.routeConfig?.path;
    }
    let currentUserData = this.appGlobalService.get('currentUser');
    if (currentUserData) {
      this.currentPage = this.currentPage + "_" + currentUserData[0]?.sid;
    }
  }



  private onDrawCallback(settings: any, apiScope: any) {
    if (this.gridConfig?.drawCallback) {
      this.gridConfig?.drawCallback(settings, apiScope);
    }
    if (this.gridConfig?.colResize)
      this.resizeColumn(settings);
  }

  private resizeColumn(settings: { nTableWrapper: any; aoColumns: any; }) {
    setTimeout(() => {
      const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
      const table = $(settings.nTableWrapper);
      let totWidth: number = 0;
      $.map(settings.aoColumns, (o: { field?: any; width?: any; }, i: any) => {
        if (o.field && colStore[o.field] && Object.keys(colStore[o.field]).indexOf('size') > -1) {
          o.width = colStore[o.field].size;
        }
        if (Object.keys(o).indexOf('width') > -1)
          table.find('tr .' + o.field).css({ 'width': o.width + 'px' });

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


  private onRowCallback(row: Node | any, data: any[] | object, index: number) {
    $('td', row).off('click');
    $('td', row).on('click', (event: any) => {
      this.rowClickHandler(data, event, row);
    });
    return row
  }

  private rowClickHandler(info: any, event: any, row: any, presstype?: any): void {
    const targetEl = $(event.currentTarget);
    const contextMenuEl = $(event.target);
    const target = $(event.target);
    let targetIds = event.currentTarget.parentElement.getAttribute("id");

    if ((targetEl.hasClass('select-checkbox')) && !AppConstants.isMobile) {
      if ($(event.currentTarget.parentElement).hasClass('selected')) {
        $('#' + targetIds + ' .chk-select').prop("checked", false)
      } else {
        $('#' + targetIds + ' .chk-select').prop("checked", true)
      }
      return;
    }
    if (targetEl.hasClass('select-checkbox') && presstype === 'longpress' && AppConstants.isMobile) {
      if ($(event.currentTarget.parentElement).hasClass('selected')) {
        this.dtInstance.row(event.currentTarget.parentElement).deselect();
      } else {
        this.dtInstance.row(event.currentTarget.parentElement).select();
      }
      return;
    }
    const uniqueIdField = this.gridConfig?.uniqueIdentifier ? 'uniqueId' : 'sid';
    if (targetEl.hasClass('edit_icon') && this.gridConfig?.detailPageNavigation == 'row_edit') {
      this.gridConfig?.onRowClick(event, info[uniqueIdField]);
    }
    if (this.gridConfig?.detailPageNavigation == 'row_click') {
      this.gridConfig?.onRowClick(event, info[uniqueIdField]);
    }
  }

  private onInitComplete(dtInstance: any, settings: any, json: any): void {

    const self = this;
    dtInstance.on('select', (e: any, dt: any, type: any, ix: any) => {
      let currentId = e.currentTarget.getAttribute("id")
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
    });

    dtInstance.on('deselect', (e: any, dt: any, type: any, ix: any) => {
      let currentId = e.currentTarget.getAttribute("id")
      $(`#${currentId}_wrapper tr th .chk-select`).prop('checked', false);
      setTimeout(() => {
        const selected = dt.rows({ selected: true });
        self.gridConfig.onRowDeselect(selected);
      }, 100);

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


  public refreshGrid(params: any, fromDelete?: boolean): void {
    const _this = this;
    $(`#${_this.Id}_wrapper tr th .chk-select`).prop('checked', false);
    if (params) {
      // this.params.order = params.order;
      this.params.search = params.search;
    }
    $.fn.DataTable['ext'].errMode = 'none';
    if (!environment.prototype) {
      if (fromDelete && this.gridConfig?.paging) {
        this.refreshCurrentPage()
      }
      else if (fromDelete && !this.gridConfig?.paging) {
        this.getData(false, false, true, false, true);
      }
      else {
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

  private onReorderResizeCallback(settings: { s: { dt: { nTable: any; aoColumns: any; }; }; }) {
    if (!settings) return;
    const th = $(settings.s.dt.nTable).find('tr th')
    const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    colStore['t-w'] = $(settings.s.dt.nTable).width();
    $.map(settings.s.dt.aoColumns, (o: { field: string | number; bVisible: any; idx: any; }, i: string | number) => {

      colStore[o.field] = {
        visible: o.bVisible
      }
      if (this.gridConfig?.colReorder) {
        colStore[o.field].order = o.idx;
      }
      if (this.gridConfig?.colResize) {
        colStore[o.field].size = $(th[i]).width();
      }
    })
    localStorage.setItem(this.currentPage, JSON.stringify(colStore));
  }


  /*Method to get the initial column order of the table*/
  private getOriginalColumnOrder(dtInstance: any, settings: any, json: any) {
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

  private resetColumnSettings() {
    const tbl = this.dtInstance?.table();
    const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    if (!jQuery.isEmptyObject(colStore)) {
      colStore['t-w'] = '100%';

      this.selectedColumns = [];
      this.gridConfig?.columns.forEach((col: any, i: any) => {
        if (!this.gridConfig?.disableSelection) {
          i = i + 1
        }
        this.selectedColumns.push(col.label)
        setTimeout(() => {
          tbl?.columns([i]).visible(true);
        });
      });

      if (colStore?.colSortingOrder) {
        const params = this.params
        if (this.gridConfig?.sortField) {
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
          this.getData(false, true);
        } else {
          params.order = [];
          $("#" + this.Id + '_wrapper' + ' .sorting').removeClass('asc desc');
          this.getData(false, false, true);
        }
      }

      /* Logic to reset the order */
      if (this.originalOrder.indexOf(0) == -1) {
        this.originalOrder.unshift(0);
      }
      tbl.colReorder.reset();
      tbl.colReorder.order(this.originalOrder);
      localStorage.removeItem(this.currentPage);
      // localStorage.setItem(this.currentPage, JSON.stringify(colStore));
      /* Logic to reset the size */
      /* const width = { 'width': '100%' };
      $('.dataTables_scroll .dataTable').css(width);
      $('.dataTables_scroll .dataTables_scrollHeadInner').css(width);
      $('.dataTables_scroll th, .dataTables_scroll td').css({ 'width': 'auto' }); */
    }
  }


  toggleColumns(event: any) {
    if (event) {
      const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
      const tbl = this.dtInstance?.table();
      this.gridConfig?.columns?.forEach((columnsObj: any, columnsIndex: any) => {
        let eventIndex = event?.findIndex((eventObj: any) => eventObj === columnsObj?.label);
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
      localStorage.setItem(this.currentPage, JSON.stringify(colStore));
    }
  }

  isObject(value: any) {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    );
  }

  columnToggleChange() {
    this.toggleColumns(this.selectedColumns)
  }

  private checkIfColVisible(col: any) {
    const colVisiblityMap = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    return colVisiblityMap[col.field] ? colVisiblityMap[col.field].visible : true;
  }

  private checkIfColWidth(col: any) {
    let headerWidth = this.getLabelWidth(col);
    let defaultWidth = (col?.width && col.width != '0px') ? col.width : null;
    const colVisiblityMap = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    return colVisiblityMap[col.field]?.size ? colVisiblityMap[col.field].size + "px" : defaultWidth || ((headerWidth + 35) + "px");
  }


  getLabelWidth(col: any) {
    const text = this.ts.instant(col.label);
    const canvas = document.createElement("canvas");
    let ctx: any = canvas.getContext('2d');
    ctx.font = "normal 1.25rem Poppins";
    let widthObj = ctx?.measureText(text);
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
      case col.uiType === 'Boolean' && !confRender:
        formattedValue = `<div style="text-align:center">
          <i class="${row[col.field] === true || row[col.field] === 'yes' ? 'pi pi-check text-success' : 'pi pi-times text-danger'}" ></i>
          </div>`;
        break;
      case col.uiType == 'autosuggest' && !confRender:
        if (this.isSql) {
          formattedValue = this.setAutoSuggestValue(row, col);
        } else {
          formattedValue = row[col.field] ? this.formattedAutoSuggestValues(row[col.field], col) : '';
        }
        formattedValue = this.util.domSanitizer.sanitize(SecurityContext.HTML, formattedValue)
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
    return formattedValue
  }


  getPrefixorSuffix(data: any, col: any) {
    const prefix = col.prefix || '';
    const suffix = col.suffix || '';
    return data ? `${prefix} ${this.util.domSanitizer.sanitize(SecurityContext.HTML, this.util.getFormattedNumber(data, col))} ${suffix}` : `${prefix} 0 ${suffix} `;
  }

  private getColumns(): any {
    const self = this;
    const columns = [];
    const colStore: any = JSON.parse(localStorage.getItem(this.currentPage) + "");
    this.selectedColumns = [];
    for (const col of this.gridConfig?.columns) {

      col.className = col.fieldName.trim()
      if (col.showOnMobile) {
        col.className = col.className.concat(" ", "showMobile");
      }
      if (col.showLabel) {
        col.className = col.className.concat(" ", "showLabel");
      }
      if (col.uiType == 'autosuggest' && col.multipleValues == true) {
        col.className = col.className.concat(" ", "sorting_disabled");
      }

      col.visible = this.checkIfColVisible(col);
      col.width = this.checkIfColWidth(col);
      if (!col?.visible && (col?.visible != false)) {
        col['visible'] = true;
      }
      if (this.gridConfig.rowGrouping && col.field?.toLowerCase() != this.gridConfig.rowGrouping?.toLowerCase()) {
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
      }
      // col.title = self.ts.instant(col.title)
      columns.push(col);
      if (col.visible) {
        this.selectedColumns.push(col.label)
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
    if (this.gridConfig?.toggleColumns || this.gridConfig?.colReorder || this.gridConfig?.colResize || this.gridConfig?.showSettingsIcon) {
      this.gridConfig.fixedColumns.right = this.gridConfig.fixedColumns.right + 1
      columns.push({
        data: null,
        className: 'column-settings-icon',
        title: `<i class="pi pi-cog" style="font-size: 2rem"></i`,
        defaultContent: `<span></span>`,
        orderable: false,
      });
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
    if (this.gridConfig.paging || fromDelete || fromRefresh || fromSorting) {
      this.gridData = data?.results || [];
    }
    else {
      this.gridData = [...this.gridData, ...data.results];
    }
    this.total = data?.total ? data.total : '';
    this.filtered = data?.filtered ? data.filtered : '';
    this.currentPageNumber = data?.page + 1;
    this.serviceInprogress = false;
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
    if (!this.gridConfig?.paging) {
      this.setVirtualDatatableOverflowScrollHeight()
    }
    if (this.gridConfig?.onAfterServiceRequest) {
      this.gridConfig?.onAfterServiceRequest(data);
    }
  }
  private getData(drawNextPage?: boolean, fromSorting?: boolean, fromRefresh?: boolean, fromPreviousPage?: boolean, fromDelete?: boolean): void {
    const tbl = this.dtInstance?.table();
    let triggerAPI: boolean = true
    if ((this.gridConfig?.isChildPage && !this.gridConfig?.parentId) || environment.prototype) {
      triggerAPI = false;
    }
    $("#" + this.dtOptions.id + '_wrapper' + " .dataTables_empty").css({ "display": "none" })
    if (triggerAPI) {
      this.showLoading = true;
      const params = this.params;
      if (this.gridConfig?.fnServerParams) {
        if (typeof params.search.value === "string")
          params.search.value = JSON.parse(params.search.value);
        params.search.value = JSON.stringify(this.gridConfig?.fnServerParams(params.search.value));
      }
      let columnName = this.sortColumn;
      if (columnName) {
        this.gridConfig.columns.map((o: any) => {
          if (columnName == o.fieldName && o.uiType == 'autosuggest') {
            columnName = o.fieldName + this.gridConfig.sortSeparator + 'value' + this.gridConfig.sortSeparator + o.displayField;
          }
        })
        params.order = [{
          column: columnName,
          dir: this.sortDirection
        }];
      }
      if (fromSorting) {
        params.length = this.gridConfig?.pageLength || this.dtOptions.pageLength;
        params.order = [{
          column: columnName,
          dir: this.sortDirection
        }];
      } else if (fromRefresh) {
        params.start = 0;
        params.length = this.gridConfig?.pageLength || this.dtOptions.pageLength;
        this.start = params.start

      } else if (drawNextPage) {
        params.length = this.gridConfig?.pageLength || this.dtOptions.pageLength;
        if ((this.currentPageNumber * params.length) <= this.total) {
          params.start = params.start + params.length;
          this.start = params.start
        }
      }
      else if (fromPreviousPage) {
        params.length = this.gridConfig?.pageLength || this.dtOptions.pageLength;
        this.start = params.start - params.length
        params.start = this.start
      }
      if (this.gridConfig.parentId) {
        params.pid = this.gridConfig.parentId
      }
      let subject = this.getDatatableData(this.gridConfig?.ajaxUrl, params);

      const dataSubscription = subject.subscribe((data: any) => {
        this.bindDataToDataTable(data, fromDelete, fromRefresh, fromSorting);
      }, (err: any) => {
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
      });
      this.subscriptions.push(dataSubscription);
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

  private getParams(): void {
    const params: any = {};
    params.start = this.start;
    params.length = this.length;

    params.search = {};


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

    if (this.gridConfig.sortField) {
      params.order = [{
        column: this.gridConfig.sortField,
        dir: this.gridConfig.sortOrder?.toLowerCase()
      }];
    }

    if (this.gridConfig.defaultSearch) {
      params.search = this.gridConfig.searchParams ? this.gridConfig.searchParams : {};
    }

    const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
    if (colStore?.colSortingOrder) {
      this.sortDirection = colStore?.colSortingOrder?.sortDirection
      this.sortColumn = colStore?.colSortingOrder?.sortColumn
      params.order = [{
        column: this.sortColumn,
        dir: this.sortDirection.toLowerCase()
      }];
    }

    this.params = params;
  }

  private attachInfiniteScroll(dtInstance: any, settings: any) {

    this.tracker = document.getElementsByClassName('dataTables_scrollBody')[0];

    const windowYOffsetObservable: any = fromEvent(this.tracker, 'scroll').pipe(map(() => {
      return this.tracker.scrollTop;
    }));

    this.scrollSubscription = windowYOffsetObservable.subscribe((scrollPos: any) => {
      const limit = (this.tracker.scrollHeight - this.tracker.clientHeight) * 0.90;
      if (scrollPos >= limit && this.total > this.filtered) {
        if (!this.serviceInprogress) {
          this.serviceInprogress = true;
          this.getData(true);
        }
      }
    });
    this.subscriptions.push(this.scrollSubscription);
  }

  private attachSorting(dtInstance: any): void {
    $.fn.DataTable['ext'].errMode = 'none';
    const self = this;
    const headerEl = self.dtInstance.header()[0];

    const headNode = $(headerEl).find('th:not(.column-settings-icon)');
    headNode.off('click');
    headNode.on('click', (e: any) => {
      if ($(e.target).css('cursor') === 'col-resize') {
        return;
      }
      const curTarget = $(e.currentTarget);
      if (curTarget.hasClass('sorting_disabled')) { return; }

      const sortDirection = curTarget.hasClass('asc') ? 'desc' : 'asc';
      const colOrder = parseInt(curTarget.attr('data-column-index'));

      this.dtOptions.columns[colOrder].sortDirection = sortDirection;
      let sortColumnIndex = colOrder
      if (!this.gridConfig?.disableSelection) {
        sortColumnIndex = colOrder - 1
      }
      this.sortColumn = this.params.columns[sortColumnIndex].data

      this.sortDirection = sortDirection;

      headNode.removeClass('asc desc');
      if (sortDirection == 'asc') {
        $(curTarget).addClass('asc');
      } else {
        $(curTarget).addClass('desc');
      }
      const colStore = JSON.parse(localStorage.getItem(this.currentPage) + "") || {};
      colStore.colSortingOrder = { sortDirection: this.sortDirection, sortColumn: this.sortColumn }
      localStorage.setItem(this.currentPage, JSON.stringify(colStore));
      this.params.start = 0;
      this.start = 0;
      this.getData(false, true);

    });
  }

  //getDatatable data observable

  getDatatableData(urlProps: string, params: any): Observable<any> {
    const subject = new Observable(observer => {
      this.baseService.post(urlProps, params).subscribe((response: any) => {
        $.fn.DataTable['ext'].errMode = 'none';
        observer.next(response);
      },
        (err: any) => {
          $.fn.DataTable['ext'].errMode = 'none';
          observer.error(err);
        });
    });

    return subject;
  }

  ngOnInit(): void {
    this.findPage();
    const self = this;
    let rowGroupColumn: any;
    if (String(this.gridConfig?.rowGrouping)) {
      rowGroupColumn = this.gridConfig?.columns?.filter((field: any) => field.field?.toLowerCase() === String(this.gridConfig?.rowGrouping).toLowerCase())
      this.gridConfig.sortField = this.gridConfig?.rowGrouping;
      this.gridConfig.sortOrder = 'asc'
    }
    if (!this.gridConfig?.paging && this.gridConfig?.pageLength < 25) {
      this.gridConfig.pageLength = 25
    }
    const options: any = {
      scrollX: this.gridConfig?.scrollX ? this.gridConfig?.scrollX : true,
      bFilter: this.gridConfig?.bFilter ? this.gridConfig?.bFilter : false,
      search: {
        return: this.gridConfig?.enterKeytoSearch ? this.gridConfig?.enterKeytoSearch : false
      },
      id: 'datatables_' + Math.floor(this.util.getRandomNum() * 100) + 1,
      rowId: this.gridConfig?.uniqueIdentifier ? 'uniqueId' : 'sid',
      scrollY: this.gridConfig?.scrollY ? this.gridConfig?.scrollY : (window.innerHeight - 250),
      rresponsive: false,
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
        "emptyTable": this.ts.instant(this.gridConfig?.emptyTableMsg ? this.gridConfig?.emptyTableMsg : "No data available in table")
      },
      info: false, // show total count label
      // rowGroup: this.gridConfig?.rowGrouping ? { dataSrc: String(this.gridConfig?.rowGrouping) } : '',
      rowGroup: this.gridConfig?.rowGrouping ? {
        dataSrc: function (row: any) {
          return self.formatColumnDatas(rowGroupColumn[0], '', '', row, '', rowGroupColumn[0].render)
        }
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
        $("#" + options.id + '_wrapper' + ' .column-settings-icon').on('click', function () {
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
        if (this.gridConfig?.data?.length > 0) {
          $.fn.DataTable['ext'].errMode = 'none';
          const tbl = this.dtInstance?.table();
          tbl?.clear();
          tbl?.rows?.add(this.gridConfig?.data).draw();
          this.gridData = this.gridConfig?.data;
        } else {
          $.fn.DataTable['ext'].errMode = 'none';
          if (!this.showLoading) {
            const tbl = this.dtInstance?.table();
            tbl?.clear();
            tbl?.rows?.add([{}]).draw();
            tbl?.clear();
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
            return '<input class="chk-radio" type="radio" name="selectionRadio">';
          } else {
            return '<input class="chk-select" type="checkbox" name="selectionCheckbox">';
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
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnChanges(changes: SimpleChange) {

  }

  setVirtualDatatableOverflowScrollHeight() {
    const tbl = this.dtInstance.table();
    let rowCountHeight = (tbl?.rows()[0].length ? tbl?.rows()[0].length : 1)
    let tblContainer = tbl?.container();
    if ((rowCountHeight ? (rowCountHeight * 31) : rowCountHeight) < (window.innerHeight - 250) && ($(tblContainer)?.attr('id') == this.dtOptions.id + "_wrapper")) {
      let rowHeight = 31
      if ($('#' + this.dtOptions.id + '_wrapper' + ' .dataTables_scrollBody').find('.rowH-medium').length > 0) {
        rowHeight = 40
      } else if ($('#' + this.dtOptions.id + '_wrapper' + ' .dataTables_scrollBody').find('.rowH-large').length > 0) {
        rowHeight = 60
      }
      if ((rowCountHeight <= 10 && rowCountHeight <= this.dtOptions.pageLength) || rowCountHeight <= 5) {
        $('#' + this.dtOptions.id + '_wrapper' + ' .dataTables_scrollBody').css('max-height', (rowCountHeight * 2 * rowHeight))
      } else {
        $('#' + this.dtOptions.id + '_wrapper' + ' .dataTables_scrollBody').css('max-height', (rowCountHeight * rowHeight))
      }
    } else {
      $('#' + this.dtOptions.id + '_wrapper' + ' .dataTables_scrollBody').css('max-height', (window.innerHeight - 250))
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

}
