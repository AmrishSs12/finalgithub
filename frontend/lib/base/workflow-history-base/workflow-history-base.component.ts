import { Directive, inject } from '@angular/core';
import { AppUtilService } from '@app/app.util.service';
import { AppBaseService } from '@baseapp/app.base.service';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Directive({})
export class WorkflowHistoryBaseComponent {

  isPageLoading: boolean = false;
  gridData: any[] = [];
  updatedRecords: any[] = [];
  first: number = 0;
  rows: number = 30;
  total: number = 0;
  params: any;
  // @Input() Id:any = [];
  tableConfig: any = {
    "rightFreezeFromColumn": "0",
    "columnReorder": false,
    "type": "grid",
    "showDetailPageAs": "navigate_to_new_page",
    "rowGroup": "",
    "storageName": "workflow-history-list",
    "children": [{
      "label": "STEP",
      "data": "",
      "field": "fromStep",
      "type": "gridColumn",
      "width": "120px",
      "showOnMobile": "true",
      "fieldType": "string",
      "fieldId": "fromStep",
      "timeOnly": false,
      "uiType": "text",
      "name": "fromStep",
      "fieldName": "fromStep"
    }, {
      "label": "ACTION",
      "data": "",
      "field": "action",
      "type": "gridColumn",
      "width": "120px",
      "showOnMobile": "true",
      "fieldType": "string",
      "fieldId": "action",
      "timeOnly": false,
      "uiType": "text",
      "name": "action",
      "fieldName": "action"
    }, {
      "label": "ACTOR",
      "data": "",
      "field": "actionBy",
      "type": "gridColumn",
      "width": "120px",
      "showOnMobile": "true",
      "fieldType": "string",
      "fieldId": "actionBy",
      "timeOnly": false,
      "uiType": "text",
      "name": "actionBy",
      "fieldName": "actionBy"
    }, {
      "label": "ACTION_ON",
      "data": "",
      "field": "actionOn",
      "type": "gridColumn",
      "width": "120px",
      "showOnMobile": "true",
      "fieldType": "number",
      "fieldId": "actionOn",
      "timeOnly": false,
      "uiType": "number",
      "name": "actionOn",
      "fieldName": "actionOn"
    }, {
      "label": "NEXT_STEP",
      "data": "",
      "field": "toStep",
      "type": "gridColumn",
      "width": "120px",
      "showOnMobile": "true",
      "fieldType": "string",
      "fieldId": "toStep",
      "timeOnly": false,
      "uiType": "text",
      "name": "toStep",
      "fieldName": "toStep"
    }, {
      "label": "NEXT_ACTOR",
      "data": "",
      "field": "nextActor",
      "type": "gridColumn",
      "width": "120px",
      "showOnMobile": "true",
      "fieldType": "string",
      "multipleValues": true,
      "fieldId": "nextActor",
      "timeOnly": false,
      "uiType": "text",
      "name": "nextActor",
      "fieldName": "nextActor"
    },
    {
      "label": "COMMENTS",
      "data": "",
      "field": "comments",
      "type": "gridColumn",
      "width": "120px",
      "showOnMobile": "true",
      "fieldType": "string",
      "multipleValues": true,
      "fieldId": "comments",
      "timeOnly": false,
      "uiType": "text",
      "name": "comments",
      "fieldName": "comments"
    }],
  }
  public DynamicDialogRef = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public appUtilBaseService = inject(AppUtilService);
  public appBaseService = inject(AppBaseService);
  public translateService = inject(TranslateService);


  onInit(): void {
    this.params = this.appUtilBaseService.getTableRequestParams(this.tableConfig);
    this.loadGridData();
  }


  loadGridData() {
    this.params.modelid = this.config.data.id;
    this.params.workflowType = this.config.data.workflowType;
    if(!this.params?.modelid){
      this.gridData =[];
      return;
    }
    this.isPageLoading = true;
    const gridSubscription = this.appBaseService.getWorkflowHistoryTable(this.params).subscribe((data: any) => {
      if (this.first >= this.total || this.first === 0) {
        data?.results.map((d: any) => {
          const tempData: any = [];
          d['nextActor'].map((o: any) => {
            if (o.value) {
              tempData.push(this.translateService.instant(o.value));
            }
          });
          d['nextActor'] = tempData.join();
        })

        let updateRecords: any[] = [...this.updatedRecords, ...data?.results];
        const ids = updateRecords.map(o => o.sid);
        this.updatedRecords = updateRecords.filter(({ sid }, index) => !ids.includes(sid, index + 1));
      }
      this.gridData = this.updatedRecords.slice(this.first, (this.first + this.rows));

      this.total = data?.filtered ? data?.filtered : 0;
      this.isPageLoading = false;
    }, (err: any) => {
      this.isPageLoading = false;
    });
  }

  next() {
    this.first = this.first + this.rows;
    this.params.start = this.first;
    this.loadGridData();
  }


  prev() {
    if (!this.isFirstPage()) {
      this.first = this.first - this.rows;
      this.params.start = this.first;
      if (this.first === 0) {
        this.gridData = [];
        this.updatedRecords = [];
      }
      this.loadGridData();
    }
  }

  isFirstPage(): boolean {
    return this.gridData ? this.first === 0 : true;
  }

}
