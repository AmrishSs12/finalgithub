import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject, Directive } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Observable, Subject, Subscription, from, of } from 'rxjs';
import { ExportsService } from '../exports.service';
import { UploaderService } from '@baseapp/upload-attachment.service';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';
import { OptionalFiltersComponent } from '@libsrc/optional-filters/optional-filters.component';

interface ExportObject {
  tableName: string,
  exportName: string,
  possibleInputFiles: any,
  allowDatechangeonExport: string,
  allowDateTimechangeonExport: string,
  allowNumberchangeonExport: string,
  dateformats: any,
  numberformats: any,
  roles: any

};


@Directive({
  providers: []
})

export class ExportPageBaseComponent {

  @Input() exportConfig: any;
  @Input() fromListPage: any;
  @Input() fromTableName: any;
  @Output() onAfterExportInitiate: EventEmitter<any> = new EventEmitter();
  id: any;
  @ViewChild(OptionalFiltersComponent)
  public filters: any = OptionalFiltersComponent
  @ViewChild('tableName')
  tableDropdown!: any;
  @ViewChild('templateName')
  templateDropdown!: any;


  public exportsService = inject(ExportsService)
  public uploaderService = inject(UploaderService)
  public appUtilBaseService = inject(AppUtilService)
  public translateService = inject(TranslateService)
  public messageService = inject(MessageService)
  public router = inject(Router)
  public appGlobalService = inject(AppGlobalService)

  exportGroup: FormGroup = new FormGroup({
    tableName: new FormControl('', []),
    templateName: new FormControl('', [Validators.required]),
    // fileType: new FormControl('', [Validators.required]),
    // attachment: new FormControl(''),
    // googleSheetLink: new FormControl('', []),
    // dateFormat: new FormControl('', []),
    // dateTimeFormat: new FormControl('', []),
    // numberFormat: new FormControl('', [])
  });
  actionBarConfig: any = [];
  conditionalActions: any = {
    disableActions: [],
    hideActions: []
  }
  subscription!: Subscription;
  dateformat: any = [];
  datetimeformat: any = [];
  numberformat: any = [];
  displayUpload: any;
  inValidFields: any = {};
  updatedConfig: any[] = [];
  filterConfig: any[] = [];
  subscriptions: Subscription[] = [];
  //  isPageLoading:boolean = false;

  isMobile: boolean = BaseAppConstants.isMobile;
  isSearchFocused: boolean = false;
  showBreadcrumb = BaseAppConstants.showBreadcrumb;
  pageViewTitle: string = 'Exports';
  selectedtablename: any;
  selectedValues: any = {};
  templateDownloadLink: string = "";
  enableDownloadLink: boolean = false;
  exportBtndisabled: boolean = false;
  allExportConfig: any;
  currentUserRoles: any;
  fieldConfig: any = {
    tableName: { label: "TABLE_TYPE" },
    templateName: { label: "TEMPLATE_TYPE" },
    fileType: { label: "FILE_TYPE" },
    // attachment: { label: "ATTACHMENT" },
    // googleSheetLink: { label: "GOOGLE_SHEET_LINK" },
    dateFormat: { label: "DATE_FORMAT" },
    dateTimeFormat: { label: "DATE_TIME_FORMAT" },
    numberFormat: { label: "NUMBER_FORMAT" }
  }
  fileTypeMap: Map<string, string> = new Map<string, string>;
  exportFilterConfig: any = [];
  /* dateFormatConfig: any = ['d/M/yy', 'd/M/y', 'd/MMM/yy', 'd/MMM/y', 'd MMM y', 'd MMM yy', 'M/d/yy', 'M/d/y', 'MMM d, y', 'MMMM d, y', 'EEEE, MMMM d, y'];
  dateTimeFormatConfig: any = ["d/M/yy h:mm a",
    "d/M/yy h:mm:ss a",
    "d/M/yy H:mm",
    "d/M/yy H:mm:ss",
    "d/M/y h:mm a",
    "d/M/y h:mm:ss a",
    "d/M/y H:mm",
    "d/M/y H:mm:ss",
    "d/MMM/yy h:mm a",
    "d/MMM/yy h:mm:ss a",
    "d/MMM/yy H:mm",
    "d/MMM/yy H:mm:ss",
    "d/MMM/y h:mm a",
    "d/MMM/y h:mm:ss a",
    "d/MMM/y H:mm",
    "d/MMM/y H:mm:ss",
    "d MMM yy h:mm a",
    "d MMM yy h:mm:ss a",
    "d MMM yy H:mm",
    "d MMM yy H:mm:ss",
    "d MMM y h:mm a",
    "d MMM y h:mm:ss a",
    "d MMM y H:mm",
    "d MMM y H:mm:ss",
    "M/d/yy h:mm a",
    "M/d/yy h:mm:ss a",
    "M/d/yy H:mm",
    "M/d/yy H:mm:ss",
    "M/d/y h:mm a",
    "M/d/y h:mm:ss a",
    "M/d/y H:mm",
    "M/d/y H:mm:ss",
    "MMM d, y h:mm a",
    "MMM d, y h:mm:ss a",
    "MMM d, y H:mm",
    "MMM d, y H:mm:ss",
    "MMMM d, y h:mm a",
    "MMMM d, y h:mm:ss a",
    "MMMM d, y H:mm",
    "MMMM d, y H:mm:ss",
    "EEEE, MMMM d, y h:mm a",
    "EEEE, MMMM d, y h:mm:ss a",
    "EEEE, MMMM d, y H:mm",
    "EEEE, MMMM d, y H:mm:ss"];
  numberFormatConfig: any = [
    {
      label: "9.999,00",
      value: {
        displayLabel: "9.999,00",
        thousandSeparator: ".",
        decimalSeperator: ","
      }
    },
    {
      label: "9,999.00",
      value: {
        displayLabel: "9,999.00",
        thousandSeparator: ",",
        decimalSeperator: "."
      }
    },
    {
      label: "9 999.00",
      value: {
        displayLabel: "9 999.00",
        thousandSeparator: " ",
        decimalSeperator: "."
      }
    },
    {
      label: "9 999,00",
      value: {
        displayLabel: "9 999,00",
        thousandSeparator: " ",
        decimalSeperator: ","
      }
    }
  ]; */
  dateFormatConfig: any = []
  dateTimeFormatConfig: any = []
  numberFormatConfig: any = []
  selectedExportType(event: any) {
    this.exportGroup.reset();
    this.exportGroup.controls["tableName"].setValue(this.selectedtablename);
    // this.exportGroup.controls["attachment"].addValidators([Validators.required]);
    this.selectedValues.selectedExportFileType = event.value.fileTypes || [];
    this.exportFilterConfig = event.value.filters;
    this.exportGroup.controls["templateName"].setValue(event.value.name);
    /* this.selectedFileType(this.selectedValues.selectedExportFileType[0])

    this.selectedValues.allowDatechangeonExport = event.value.modifyDateFmt;
    if (this.selectedValues.allowDatechangeonExport == true) {
      this.dateformat = [];
      this.dateformat.push(event.value.dateFormats)
    }
    this.selectedValues.allowDateTimechangeonExport = event.value.modifDateTimeFmt;
    if (this.selectedValues.allowDateTimechangeonExport == true) {
      this.datetimeformat = [];
      this.datetimeformat.push(event.value.dateTimeFormats)
    }
    this.selectedValues.allowNumberchangeonExport = event.value.modifyNumFmt;
    if (this.selectedValues.allowNumberchangeonExport == true) {
      this.numberformat = [];
      this.numberformat.push(event.value.numberFormats.displayLabel)
    }
    this.setDefaultValue(); */
  }

  selectedDateFormat(event: any) {
    console.log(event)
  }
  selectedDateTimeFormat(event: any) {
    console.log(event)
  }
  selectedNumberFormat(event: any) {
    console.log(event)
  }
  //selecting the File type radio buttons
  selectedFileType(filetype: any) {
    // this.exportGroup.controls["attachment"].setValue(null);
    this.selectedValues.selectedType = filetype;
    this.exportGroup.controls["fileType"].setValue(this.selectedValues.selectedType)
    // this.getTemplateLink();
  }

  //Download Link for Template
  /* getTemplateLink() {
    this.enableDownloadLink = false;
    const params = {
      modelName: this.exportGroup.controls["tableName"].value,
      templateName: this.exportGroup.controls["templateName"].value,
      fileType: this.selectedValues.selectedType
    }
    if (params.modelName && params.templateName && params.fileType && !environment.prototype) {
      const dataSubscription = this.exportsService.getTemplateLink(params).subscribe((res: any) => {
        this.templateDownloadLink = res.attachmentUrl;
        this.enableDownloadLink = true;
      });
    }
  } */

  formErrors: any = {};
  showMessage(config: any) {
    this.messageService.clear();
    this.messageService.add(config);
  }
  checkValidation() {
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    if (!this.appUtilBaseService.validateNestedForms(this.exportGroup, this.formErrors, finalArr, this.inValidFields, this.fieldConfig)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), life: 5000 });
      }
      return false;
    }
    else {
      return true;
    }
  }

  //selecting table name
  selectedTable(event: any) {
    this.enableDownloadLink = false;
    this.selectedValues = {}
    this.selectedtablename = event.value.tableName;
    this.exportConfig = event.value.exports;
    const key = { value: this.exportConfig[0] }
    this.selectedExportType(key);
  }
  selectedExport(event: any) {
    this.selectedExportType(event);

  }

  exportAuth(roles: any, config: any) {
    this.exportFilterConfig = []
    for (let i of config) {
      const found = (roles.some((r: any) => i.roles.includes(r)) || i.roles.includes("all") || false);
      if (found) {
        this.exportFilterConfig.push(i);
      }
    }
    return environment.prototype ? config : this.exportFilterConfig;
  }

  checkAuth() {
    this.updatedConfig = [];
    this.updatedConfig = this.exportAuth(this.currentUserRoles, this.exportConfig);
    this.exportConfig = this.updatedConfig
  }
  checkedAllExportConfig: any = [];
  checkallAuth() {
    for (let i of this.currentImpConfig) {
      i.exports = this.exportAuth(this.currentUserRoles, i.exports)
      if (i.exports.length) {
        this.checkedAllExportConfig.push(i);
      }
    }
    this.currentImpConfig = this.checkedAllExportConfig;
  }

  currentImpConfig: any[] = [];
  onInit(): void {
    this.currentUserRoles = this.appGlobalService.getCurrentUserData().userRoles || [];
    const exportSubscription = this.exportsService.getExportConfig().subscribe((data: any) => {
      this.allExportConfig = data;
    });
    for (const prop in this.allExportConfig) {
      this.currentImpConfig.push({ tableName: prop, exports: this.allExportConfig[prop] })
    }

    this.subscriptions.push(exportSubscription);
    if (this.fromListPage == true) {
      this.selectedtablename = this.fromTableName;
      this.exportConfig = this.findExpConfig(this.currentImpConfig, this.selectedtablename);
      this.checkAuth();
      const key = { value: this.exportConfig[0] }
      this.selectedExportType(key);
    }
    else {
      this.exportGroup.controls["tableName"].addValidators([Validators.required]);
      this.checkallAuth()
    }
    //fileTypeInitialization
    this.fileTypeMap.set("csv", "CSV");
    this.fileTypeMap.set("excel", "Excel");
    this.fileTypeMap.set("google_sheet", "Google Sheet");
  }
  findExpConfig(list: any, tablename: any) {
    const filteredImp = list.find((x: { tableName: string; }) => x.tableName == tablename).exports;
    return filteredImp;
  }
  /* setDefaultValue() {
    this.exportGroup.controls['dateFormat'].patchValue(this.dateformat[0]);
    this.exportGroup.controls['dateTimeFormat'].patchValue(this.datetimeformat[0]);
    this.exportGroup.controls['numberFormat'].patchValue(this.numberformat[0]);
  } */


  leftPad(num: number, length: number) {
    var result = '' + num;
    while (result.length < length) {
      result = '0' + result;
    }
    return result;
  }


  //on click of start export
  initiateExport(isToastNotNeeded?: boolean) {
    // this.filters.dynamicFilterForm.getRawValue()
    let filterData: any = {};
    if (this.filters) {
      //  filterData= {...this.filters?.dynamicFilterForm?.getRawValue()};
      filterData = JSON.parse(JSON.stringify(this.filters?.dynamicFilterForm?.getRawValue()));
      const exportFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.exportFilterConfig);
      for (const key in exportFieldConfig) {
        if (exportFieldConfig[key]?.fieldType == "Date" && filterData[key] && Array.isArray(filterData[key])) {
          if (exportFieldConfig[key].uiType == 'date') {
            const tempDate1 = new Date(filterData[key][0]);
            const tempDate2 = new Date(filterData[key][1]);
            const convertedDate1 = tempDate1.getFullYear() + '-' + this.leftPad((tempDate1.getMonth() + 1), 2) + '-' + this.leftPad(tempDate1.getDate(), 2);
            const convertedDate2 = tempDate2.getFullYear() + '-' + this.leftPad((tempDate2.getMonth() + 1), 2) + '-' + this.leftPad(tempDate2.getDate(), 2);
            filterData[key][0] = convertedDate1;
            filterData[key][1] = filterData[key][1] ? convertedDate2 : null;
          }
          else {
            filterData[key][0] = new Date(filterData[key][0]).getTime();
            filterData[key][1] = filterData[key][1] ? new Date(filterData[key][1]).getTime() : null;
          }

        }
      }
    }
    if (this.checkValidation()) {
      this.exportBtndisabled = true;
      const data = {
        modelName: this.selectedtablename,
        exportName: this.exportGroup.controls["templateName"].value,

        filters: filterData,

        outputFileType: this.selectedValues.selectedExportFileType ? ((this.selectedValues.selectedExportFileType[0]).toUpperCase()) : "CSV"
      };

      const method = this.id ? 'update' : 'create';
      let requestedObj: any = { ...data };
      this.messageService.clear();
      if (method == 'create') {
        requestedObj.exportStatus = "INITIATED"
      }
      const saveSubscription = this.exportsService.initiateExport(requestedObj).subscribe((res: any) => {
        this.onAfterSave(res, data, method, isToastNotNeeded);
      }, (err: any) => {
        this.exportBtndisabled = false;
      })
      this.subscriptions.push(saveSubscription);
    }
    else {
      this.exportBtndisabled = false;
    }

  }

  onAfterSave(res: any, data: any, method: string, isToastNotNeeded?: boolean) {
    this.exportBtndisabled = false;
    this.filters?.dynamicFilterForm?.reset();
    this.exportGroup.reset();
    if (this.fromListPage != true) {
      if (this.tableDropdown)
        this.tableDropdown.clear();
      if (this.templateDropdown)
        this.templateDropdown.clear();
      this.selectedtablename = null;
      this.selectedValues = {};
    }
    this.onAfterExportInitiate.emit()
    if (!isToastNotNeeded) {
      this.showMessage({ severity: 'success', summary: '', detail: this.translateService.instant('Export_Initiated_DOT_Exported_file_will_be_available_in_Exports_Page_once_Export_is_complete') });
    }
  }

  onAfterViewInit() {

  }

}
