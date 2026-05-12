import { ElementRef, Input, TemplateRef, ViewChild, inject, Directive } from '@angular/core';
import { BaseApiConstants } from '@baseapp/api-constants.base';
import { BaseAppConstants as AppConstants } from "@baseapp/app-constants.base";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Directive({})
export class ChangeLogsBaseComponent {
  @Input("changelogConfig") changelogConfig: any;
  previousState: any;
  previousStateParams: any;
  comparegridDT: any;
  compareDTApi: any;
  compareGridData: any;
  listgridDT: any;
  listgridApi: any;
  filterList = [];
  selectedFilter: any;
  CHANGE_LIST = 'changeList'
  COMPARE_LIST = 'compareList'
  @ViewChild('comparegrid')
  private comparegrid!: TemplateRef<any>;
  dialog: any;
  isMobile = AppConstants.isMobile;
  test_1: any = ['rwsd']
  public config = {
    changeLogListGrid: { data: {} },
    changeLogCompareGrid: {},
    // changeLogApis:{
    //   method:"GET",
    //   Url:'../assets/change-logs.json'
    // }
  };
  leftGridLoaded!: boolean;
  private element = inject(ElementRef);
  public bsModalRef = inject(BsModalRef);
  public dynamicDialogConfig = inject(DynamicDialogConfig);



  onInit() {
    this.changelogConfig = this.dynamicDialogConfig?.data
    this.config.changeLogListGrid = this.loadGridConfig();
    this.config.changeLogCompareGrid = this.loadCompareGridConfig();
  }
  private loadGridConfig(): any {
    const self = this;
    let gridHeight: number;
    const currentEl = this.element.nativeElement;
    const gridEl = currentEl.querySelector('change-logs-grid');
    const gridElOffsetTop = gridEl.querySelector('div').offsetTop + (AppConstants.isMobile ? 40 : 80);
    gridHeight = window.innerHeight - gridElOffsetTop;
    const gridConfig: any = {
      ellipses: ['createdBy', 'remarks'],
      ordering: false,
      customOrdering: true,
      colReorder: false,
      colResize: false,
      uniqueIdField: 'sid',
      columns: [
        {
          data: 'createdDate',
          name: 'createdDate',
          title: 'Modified_On',
          type: 'datetime',
        },
        {
          data: 'createdBy',
          name: 'createdBy',
          title: 'Modified_By',
          type: 'date',
        },
        {
          data: 'remarks',
          name: 'remarks',
          title: 'Remarks',
          type: 'string',
        }
      ],
      disableSelection: true,
      complexHeader: []
    };

    this.updateUrlProperties(gridConfig);
    return gridConfig;
  }
  updateUrlProperties(gridConfig: any) {
    let serviceConfig = BaseApiConstants.getChangelog;

    gridConfig.ajaxMethod = serviceConfig.method;
    let url = serviceConfig.url;

    url = url.replace("{entityName}", this.changelogConfig?.entityName);
    url = url.replace("{entityId}", this.changelogConfig?.entityId);
    url = url.replace("{fieldName}", this.changelogConfig?.fieldName);
    url = url.replace("{fromModifiedDate}", this.changelogConfig?.fromModifiedDate);

    gridConfig.ajaxUrl = url;
  }

  private loadCompareGridConfig(): any {
    const self = this;
    let gridHeight: number;
    const currentEl = this.element.nativeElement;
    const gridEl = currentEl.querySelector('change-logs-grid');
    const gridElOffsetTop = gridEl.querySelector('div').offsetTop + (AppConstants.isMobile ? 40 : 80);
    gridHeight = window.innerHeight - gridElOffsetTop;

    const gridConfig: any = {
      ellipses: [],
      ordering: false,
      colReorder: false,
      colResize: false,
      customOrdering: true,
      excludedColums: this.changelogConfig?.ignoreFields,
      dateTimeFields: this.changelogConfig?.dateTimeFields,
      translatableFields: this.changelogConfig?.translatableFields,
      dateFields: this.changelogConfig?.dateFields,
      emailFields: this.changelogConfig?.emailFields,
      config: this.changelogConfig?.config,
      columns: [
        {
          data: 'attributeLabel',
          name: 'attributeLabel',
          title: 'Attribute',
          type: 'string',
        },
        {
          data: 'old_value',
          name: 'old_value',
          title: 'Old_Value',
          type: 'string',
        },
        {
          data: 'new_value',
          name: 'new_value',
          title: 'New_Value',
          type: 'string',
        }
      ],
      disableSelection: true,
      complexHeader: []
    };
    gridConfig.data = [];
    return gridConfig;
  }


  cancelModal() {
    this.bsModalRef.hide()
  }
}
