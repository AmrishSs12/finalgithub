import { Directive, inject } from "@angular/core";
import { AppBaseService } from "@baseapp/app.base.service";
import { BaseService } from "@baseapp/base.service";
import { groupEnd } from "console";
import { ConfirmationService } from 'primeng/api';

@Directive(
  {
    providers: [ConfirmationService]
  }
)

export class UserSettingsBaseComponent {

  public confirmationService = inject(ConfirmationService);
  public appBaseService = inject(AppBaseService);
  public baseService = inject(BaseService)

  groups: any = [];
  clonedGroup: any = [];
  selectedRow: any;
  roles: any = {};
  params: any = {};



  gridConfig: any = [{
    "label": "groupId",
    "data": "",
    "field": "groupId",
    "type": "gridColumn",
    "width": "120px",
    "showOnMobile": "true",
    "labelPosition": "top",
    "fieldType": "string",
    "multipleValues": false,
    "fieldId": "groupId",
    "timeOnly": false,
    "uiType": "text",
    "name": "groupId",
    "isPrimaryKey": false,
    "fieldName": "groupId"
  },
  {
    "label": "roleId",
    "data": "",
    "field": "roleId",
    "type": "gridColumn",
    "width": "120px",
    "showOnMobile": "true",
    "labelPosition": "top",
    "fieldType": "string",
    "multipleValues": false,
    "fieldId": "roleId",
    "timeOnly": false,
    "uiType": "text",
    "name": "roleId",
    "isPrimaryKey": false,
    "fieldName": "roleId"
  }]

  onInit() {
    this.getParams();
    this.loadData();
    this.getUserRoles();
  }

  onAfterViewInit() {

  }

  disableNewButton() {

  }

  addNewRow() {
    this.groups.push({ sid: new Date().getTime(), isNewRow: true });
    setTimeout(() => {
      this.groups?.map((o: any, index: number) => {
        if (o.isNewRow) {
          $($(`.edit-btn`)[index]).trigger('click');

        }
      })
    }, 100);
  }

  onRowEditInit(rowData: any) {
    this.selectedRow = rowData.sid;
    // this.clonedGroup = { ...rowData };
    // this.clonedProducts[product.id as string] = { ...product };

  }

  onRowEditSave(group: any) {
    // console.log(group);
    const method = group.isNewRow ? 'post' : 'put';
    delete group.isNewRow;
    if (method == 'post') {
      delete group.sid;
    }
    const index = this.clonedGroup.findIndex((x: any) => x.sid === group.sid);
    if (index > -1) {
      this.clonedGroup[index] = { ...group }
    }
    else {
      this.clonedGroup.push({ ...group });
    }
    this.SaveGroups(group, method);
  }

  onRowEditCancel(group: any, index: number) {
    const data = JSON.parse(JSON.stringify(this.clonedGroup))
    this.groups = [...data];
  }

  onRowDelete(data: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        // const index = this.clonedGroup.findIndex((x: any) => x.groupId === data.groupId);
        // this.clonedGroup.splice(index, 1);
        this.deleteRow([data.sid]);
      },
      reject: () => {
      },
    });
  }


  deleteRow(selectedValues: any) {
    const url = '/rest/rappitjitgrouprolemapping/{ids}';
    let requestedParams: any = { ids: selectedValues.toString() }
    this.baseService.delete({ url: url }, requestedParams).subscribe((res: any) => {
      this.loadData();
    })
  }


  SaveGroups(data: any, method: any) {
    const methodName: any = method;
    data.roleId = data.roleId.join();
    const params = data;
    const url = "/rest/rappitjitgrouprolemapping/";
    if (method == 'post') {
      this.baseService.post({ url: url }, params).subscribe((res: any) => {
        // this.groups = [...res];
        this.loadData();
      })
    }
    else {
      this.baseService.put({ url: url }, params).subscribe((res: any) => {
        // this.groups = [...res];
        this.loadData();
      })
    }
  }

  loadData() {
    const url = "/rest/rappitjitgrouprolemapping/datatable";
    this.baseService.post({ url: url }, this.params).subscribe((res: any) => {
      res.results.map((x: any) => x.roleId = x.roleId.split(','));
      this.groups = [...res.results];
      this.clonedGroup = JSON.parse(JSON.stringify(res.results));
    })
  }

  getUserRoles() {
    this.appBaseService.getRoles().subscribe((res: any) => {
      const roleData = res || {}

      this.roles = Object.values(roleData);
    }

    );
  }


  private getParams(): void {
    const params: any = {};
    params.start = 0;
    params.length = 30;

    params.search = {};

    params.columns = [];
    for (const col of this.gridConfig) {
      const column: any = {};
      column.data = col.field;
      column.name = col.name;
      column.searchable = true;
      column.orderable = col.orderable === false ? false : (this.gridConfig?.orderable ? this.gridConfig?.orderable : true);

      column.search = {};


      params.columns.push(column);
    }

    params.columns.order = [];
    this.params = params;
  }
}


