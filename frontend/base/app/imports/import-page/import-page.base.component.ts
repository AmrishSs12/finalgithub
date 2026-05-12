import { Directive, EventEmitter, Input, OnInit, OnDestroy, Output, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject, Subscription, from, of } from 'rxjs';
import { ImportsService } from '../imports.service';
import { UploaderService } from '@baseapp/upload-attachment.service';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
interface ImportObject {
  tableName : string,
  importName : string,
  possibleInputFiles : any,
  allowDatechangeonImport : string,
  allowDateTimechangeonImport : string,
  allowNumberchangeonImport : string,
  dateformats : any,
  numberformats : any,
  roles : any

};
// @Component({
//   selector: 'app-import-page',
//   templateUrl: './import-page.component.html',
//   styleUrls: ['./import-page.component.scss']
// })

@Directive(
  {
    providers:[MessageService, ConfirmationService, DialogService]
  }
  )

export class ImportPageBaseComponent implements OnDestroy {

  @Input() ImportConfig:any;
  @Input() fromListPage:any;
  @Input() fromTableName:any;
  @Input() popupOpen:any;
  @Output() onAfterImportInitiate: EventEmitter<any> = new EventEmitter();
  @ViewChild('csvRef')
  csvRef!: any;
  @ViewChild('excelRef')
  excelRef!: any;
  @ViewChild('tableDropdown')
  tableDropdown!: any;
  @ViewChild('templateDropdown')
  templateDropdown!: any;

  id: any;

  public importsService = inject(ImportsService)
  public uploaderService = inject(UploaderService)
  public appUtilBaseService = inject(AppUtilService)
  public translateService = inject(TranslateService)
  public messageService = inject(MessageService)
  public router = inject(Router)
  public appGlobalService = inject(AppGlobalService)
  public http = inject(HttpClient)

  importGroup: FormGroup = new FormGroup({
    tableName: new FormControl('', []),
    templateName: new FormControl('', [Validators.required]),
    FileType: new FormControl('', []),
    attachment: new FormControl(''),
    googleSheetLink: new FormControl('', []),
    dateFormat: new FormControl('', []),
    runtimeEvents: new FormControl(false, []),
    dateTimeFormat: new FormControl('', []),
    numberFormat: new FormControl('', [])
  });
  actionBarConfig: any = [];
  conditionalActions: any = {
    disableActions: [],
    hideActions: []
  }
  subscription!: Subscription;
  dateformat:any = [];
  runtimeEvents:any;
  datetimeformat:any= [];
  numberformat:any = [];
  displayUpload:any;
  inValidFields:any = {};
  updatedConfig:any[] =[];
  filterConfig:any[] =[];
  subscriptions: Subscription[] = [];
  //  isPageLoading:boolean = false;

  isMobile: boolean = BaseAppConstants.isMobile;
  isSearchFocused:boolean = false;
  showBreadcrumb = BaseAppConstants.showBreadcrumb;
  pageViewTitle: string = 'Add_Imports';
  selectedtablename:any;
  selectedValues:any = {};
  templateDownloadLink: string = "";
  enableDownloadLink: boolean = false;
  allImportConfig: any;
  currentUserRoles:any;
  formErrors:any = {};
  fieldConfig:any={
    tableName:{label:"Table_Type"},
    templateName:{label:"Template_Type"},
    FileType:{label:"File_Type"},
    attachment:{label:"Attachment"},
    googleSheetLink:{label:"Google_Sheet_Link"},
    dateFormat:{label:"Date_Format"},
    runtimeEvents:{label:"Runtime_Events"},
    dateTimeFormat:{label:"Date_Time_Format"},
    numberFormat: {label:"Number_Format"}
  }
  fileTypeMap = new Map<string, string>([["csv", "CSV"], ["excel", "Excel"]]);
  importBtndisabled: boolean = true;
  today = new Date();
  runtimeEventsValue: any;

  // Public method that can be called when popup opens
  public resetForNewImport(): void {
    this.resetImportPageValue();

    // If we're not on a list page, ensure no table is selected
    if (!this.fromListPage) {
      this.selectedtablename = null;
      this.ImportConfig = [];
    }
  }

  // Methods for runtime business rules handling
  shouldShowRuntimeOptions(): boolean {
    return this.runtimeEventsValue === 'Configure In Runtime';
  }

  onRuntimeEventsChange(value: boolean): void {
    this.importGroup.controls['runtimeEvents'].setValue(value);
  }

  getRuntimeDisplayValue(): string {
    if (this.runtimeEventsValue === 'Yes') {
      return this.translateService.instant('Yes');
    } else if (this.runtimeEventsValue === 'No') {
      return this.translateService.instant('No');
    }
    return this.runtimeEventsValue || '';
  }

  initializeRuntimeBusinessRules(): void {
    if (!this.runtimeEventsValue || this.runtimeEventsValue === 'No' || this.runtimeEventsValue === 'Configure In Runtime') {
      this.importGroup.controls['runtimeEvents'].setValue(false);
    } else if (this.runtimeEventsValue === 'Yes') {
      this.importGroup.controls['runtimeEvents'].setValue(true);
    }
  }

  selectedImportType(event: any){
    this.importGroup.reset();
    this.importBtndisabled = false;
    this.importGroup.controls["tableName"].setValue(this.selectedtablename);
    this.importGroup.controls["attachment"].addValidators([Validators.required]);

    // Clear previous values
    this.runtimeEventsValue = null;
    this.enableDownloadLink = false;

    this.selectedValues.selectedImportFileType = event.value.fileTypes.reverse();
    this.importGroup.controls["templateName"].setValue(event.value.name);
    this.selectedFileType( this.selectedValues.selectedImportFileType[0])

    this.dateformat = event.value.dateFormat;
    this.runtimeEvents = event.value.runtimeEvents;
    // Set runtimeEventsValue from the backend property runtimeBusinessRuleOption
    this.runtimeEventsValue = event.value.runtimeBusinessRuleOption;
    this.datetimeformat = event.value.dateTimeFormat;
    this.numberformat = event.value.numberFormat;

    // Initialize runtime business rules based on backend value
    this.initializeRuntimeBusinessRules();

    this.setDefaultValue();
  }
  //selecting the File type radio buttons
  selectedFileType(filetype:any){
    this.importGroup.controls["attachment"].setValue(null);
    this.selectedValues.selectedType = filetype;
    this.importGroup.controls["FileType"].setValue(this.selectedValues.selectedType)
    if(this.popupOpen == true){
      this.getTemplateLink();
   }
  }

  //Download Link for Template
  getTemplateLink() {
    this.enableDownloadLink = true;
    const params = {
      modelName: this.importGroup.controls["tableName"].value,
      templateName: this.importGroup.controls["templateName"].value,
    }
    if (params.modelName && params.templateName && !environment.prototype) {
      const templateFileName = (params.modelName.replace(/ /g, '') + "_" + params.templateName.replace(/ /g, '') + "_template").toLowerCase();
        if(this.selectedValues.selectedType === 'csv' ) {
          this.templateDownloadLink = AppConstants.importTemplateURL + templateFileName + ".csv";
        } else if(this.selectedValues.selectedType === 'excel' ) {
          this.templateDownloadLink = AppConstants.importTemplateURL + templateFileName + ".xlsx";
        }
    }
  }
  showMessage(config:any){
    this.messageService.clear();
    this.messageService.add(config);
  }
  checkValidation() {
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    if (!this.appUtilBaseService.validateNestedForms(this.importGroup, this.formErrors, finalArr, this.inValidFields, this.fieldConfig)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), life: 5000 });
        setTimeout(() => {
          this.messageService.clear();
        }, 5000);
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
    this.ImportConfig = event.value.imports;
    this.ImportConfig.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
    this.setDefaultImport()
  }

  setDefaultImport(){
    const key={ value: this.ImportConfig[0] }
    this.selectedImportType(key);
  }
  selectedImport(event:any){
    this.selectedImportType(event);

  }

  ImportAuth(roles:any, config:any) {
    this.filterConfig = []
    for (let i of config){
      const found = (roles.some((r: any) => i.roles.includes(r)) || i.roles.includes("all") || false);
      if (found){
        this.filterConfig.push(i);
      }
    }
    return environment.prototype ? config : this.filterConfig;
  }

  checkAuth(){
    this.updatedConfig = [];
    this.updatedConfig = this.ImportAuth(this.currentUserRoles,this.ImportConfig);
  }
  checkedAllImportConfig: any = [];
  checkallAuth(){
    this.checkedAllImportConfig = [];
    for (let i of this.currentImpConfig){
      i.imports = this.ImportAuth(this.currentUserRoles,i.imports)
      if (i.imports.length){
        this.checkedAllImportConfig.push(i);
      }
    }
    this.currentImpConfig = this.checkedAllImportConfig;
  }

    onRemoveAttachment() {
    this.importGroup.controls.attachment.setValue(null);
    }

  onSelectattachment(event: any, ref: any) {

    if (ref.msgs.length > 0 && ref.msgs[0]?.severity == "error") {
      const attachmentError = this.appUtilBaseService.capitalizeFirstLetter(ref.msgs[0]?.detail) || this.translateService.instant("File_attachment_failed_DOT_Please_try_again_DOT_Ensure_the_file_meets_the_required_format_and_size_restrictions");
      this.showMessage({ severity: 'error', summary: 'Error', detail: attachmentError, life: 5000 });
    } else {
          this.importGroup.controls.attachment.setValue(event.currentFiles[0]);
          this.appUtilBaseService.setImagePreview(event.files).subscribe((res: any) => {
            this.importGroup.controls.attachment.setValue(res.slice(0));
          });
    }
  }
  currentImpConfig: any[] = [];

  onInit(): void {
    this.currentUserRoles = this.appGlobalService.getCurrentUserData().userRoles ||[];
    this.currentImpConfig = [];

    const importSubscription = this.importsService.getImportConfig().subscribe((data: any) => {
      this.allImportConfig = data;
      });
      for (const prop in this.allImportConfig) {
        if (this.allImportConfig[prop] && this.allImportConfig[prop].length > 0) {
          this.currentImpConfig.push({tableName:prop,imports:this.allImportConfig[prop]})
        }
      }

    this.subscriptions.push(importSubscription);
      if(this.fromListPage == true){
        this.selectedtablename = this.fromTableName;
        this.ImportConfig = this.findImpConfig(this.currentImpConfig,this.selectedtablename);
        this.ImportConfig.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
        this.checkAuth();
        this.setDefaultImport()
      }
      else{
        this.importGroup.controls["tableName"].addValidators([Validators.required]);
        this.checkallAuth()
      }

    this.currentImpConfig.sort((a, b) => a.tableName.localeCompare(b.tableName));
    this.resetImportPageValue();
  }
  findImpConfig(list: any, tablename: any) {
    const filteredImp = list.find((x: { tableName: string; }) => x.tableName == tablename).imports;
    return filteredImp;
  }
  setDefaultValue(){
    this.importGroup.controls['dateFormat'].patchValue(this.dateformat && this.dateformat.length > 0 ? this.dateformat[0] : '');
    this.importGroup.controls['dateTimeFormat'].patchValue(this.datetimeformat && this.datetimeformat.length > 0 ? this.datetimeformat[0] : '');
    this.importGroup.controls['numberFormat'].patchValue(this.numberformat && this.numberformat.length > 0 ? this.numberformat[0] : '');
    // this.importGroup.controls['dateFormat'].disable();
    // this.importGroup.controls['dateTimeFormat'].disable();
    // this.importGroup.controls['numberFormat'].disable();
  }



  async initiateImport(isToastNotNeeded?: boolean) {
    if (this.checkValidation()) {
      this.importBtndisabled = true;
      const isTableCreationValid = await this.validateImport(); // To check whether the default import tables are created properly

      if (isTableCreationValid) {
        const data = {
          modelName: this.selectedtablename,
          templateName: this.importGroup.controls["templateName"].value,
          fileType: this.importGroup.controls["FileType"].value,
          rappitImport: this.importGroup.controls["attachment"].value,
          dateFormat: this.importGroup.controls['dateFormat'].value,
          runtimeEvents: this.importGroup.controls['runtimeEvents'].value,
          dateTimeFormat: this.importGroup.controls['dateTimeFormat'].value,
          numberFormat: this.importGroup.controls['numberFormat'].value
        };

        const method = this.id ? 'update' : 'create';
        const requestedObj = data;
        this.messageService.clear();
        const attachmentFields = ['rappitImport'];
        const splittedData = this.appUtilBaseService.splitFileAndData(data, attachmentFields);

        if (Object.keys(splittedData.files).length > 0) {
          const saveSubscription = this.uploadAttachmentsandSaveData(requestedObj, splittedData).subscribe(
            (res: any) => {
              this.onAfterSave(res, data, method, isToastNotNeeded);
            },
            (err: any) => {
              this.importBtndisabled = false;
            }
          );
          this.subscriptions.push(saveSubscription);
        }
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Error',
          detail: this.translateService.instant('The_import_process_cannot_begin_because_the_necessary_import_related_tables_are_not_found'),
          life: 5000
        });
        this.importBtndisabled = false;
      }
    } else {
      this.importBtndisabled = false;
    }
  }



  validateImport(): Promise<boolean> {
    this.importBtndisabled = true;
    return new Promise((resolve, reject) => {
      const validateSub = this.importsService.validateToImport().subscribe({
        next: (response) => {
          if (response) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        }
      });
      this.subscriptions.push(validateSub);
    });
  }

  onAfterSave(res: any, data: any, method: string, isToastNotNeeded?: boolean) {
    this.importBtndisabled = false ;
    if (!isToastNotNeeded) {
      this.showMessage({ severity: 'success', summary: '', detail: this.translateService.instant('Record_Saved_Successfully') });
    }
  }

  uploadAttachmentsandSaveData(data: any, splittedData: any): Observable<any> {
    const subject$ = new Subject();

    const completeReq = (resData: any,) => {
      resData ? subject$.next(resData) : subject$.error(resData);
      subject$.complete();
    }
    if (!this.id) {
      // New flow: Upload file first, then create import with FILE_UPLOADED status
      this.uploadFilesFirst(splittedData).subscribe(
        (uploadResult: any) => {
          if (uploadResult && Object.keys(uploadResult.error).length === 0) {
            // Flatten and process upload response (upload service returns nested arrays)
            let processedUploadData: any = {};
            for (const key in uploadResult.dataToResend) {
              if (uploadResult.dataToResend[key] instanceof Array) {
                const tempArr = uploadResult.dataToResend[key].flat();
                processedUploadData[key] = (tempArr.filter((n: any, i: any) => tempArr.indexOf(n) === i)).filter(Boolean);
              } else {
                processedUploadData[key] = [uploadResult.dataToResend[key]];
              }
              processedUploadData[key] = this.appUtilBaseService.removeImagePreviewProperties(processedUploadData[key]);
            }

            // Merge upload response into data and create import with FILE_UPLOADED status
            const requestedData = { ...splittedData.data, ...processedUploadData };
            requestedData.importStatus = "FILE_UPLOADED";

            // Show success message and close popup immediately before API call
            this.showMessage({ severity: 'success', summary: '', detail: this.translateService.instant('Import_Initiated_SuccessFully') });
            this.clearSelectedFiles();

            // Reset the form state
            if (this.fromListPage == true) {
              this.selectedtablename = this.fromTableName;
              this.setDefaultImport();
            } else {
              this.resetImportPageValue();
              this.selectedtablename = null;
              if (this.tableDropdown)
                this.tableDropdown.clear();
              if (this.templateDropdown)
                this.templateDropdown.clear();
            }

            // Emit event to close popup immediately - don't wait for API
            this.onAfterImportInitiate.emit();
            subject$.next(null);
            subject$.complete();

            // Fire-and-forget: Create import record in background
            this.importsService.create(requestedData).subscribe(
              (res: unknown) => {
                // Import created and triggered successfully in background
              },
              (err: any) => {
                // Log error but don't block UI since popup is already closed
                console.error('Error creating import:', err);
              }
            );
          } else {
            // Upload failed
            this.importBtndisabled = false;
            const errorArr: any = [];
            errorArr.push("Failed to upload the file");
            this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(errorArr), life: 5000 });
            completeReq(null);
          }
        },
        (err: any) => {
          this.importBtndisabled = false;
          completeReq(null);
        }
      );
    }

    return subject$.asObservable();
  }

  /**
   * Upload files first without requiring an existing import record.
   * Uses empty string for modelKey since it's not functionally used.
   */
  uploadFilesFirst(splittedData: any): Observable<any> {
    const files: any = {};
    Object.keys(splittedData.files).forEach(key => {
      splittedData.files[key].map((o: any) => {
        if (!o.id) {
          if (!files.hasOwnProperty(key)) {
            files[key] = [];
          }
          files[key].push(o);
        }
      });
    });

    if (files && Object.values(files).filter((item: any) => (item || [])?.length).length) {
      // Pass empty string as modelKey since it's not functionally used
      return this.uploaderService.saveAddedFiles(files, '', null);
    } else {
      return of({ dataToResend: {}, error: {} });
    }
  }

  // updateData method removed - no longer needed in new flow
  // New flow: upload file first → create import with FILE_UPLOADED status

  saveFiles(splittedData: any) {
    const files:any={};
    const existingfiles:any={}
    const detailsform = null;
  Object.keys(splittedData.files).forEach(key => {
    splittedData.files[key].map((o:any)=>{
      if(!o.id){
        if(!files.hasOwnProperty(key)){
           files[key]=[];
        }
        files[key].push(o);
      }
      else{
        if(!existingfiles.hasOwnProperty(key)){
          existingfiles[key]=[];
       }
       existingfiles[key].push(o);
      }
    })
  })
      if (files && Object.values(files).filter((item:any) =>  (item||[])?.length).length) {

      return new Observable(observer => {
        this.uploaderService.saveAddedFiles(files, this.id, detailsform).subscribe((res: any) => {
          let fData: any = {};
          for (const key in res.dataToResend) {
            if (res.dataToResend[key] instanceof Array) {
              const tempArr = res.dataToResend[key].flat();
              fData[key] = (tempArr.filter((n: any, i: any) => tempArr.indexOf(n) === i)).filter(Boolean);
            } else {
              fData[key] = [res.dataToResend[key]];
            }
            fData[key] = this.appUtilBaseService.removeImagePreviewProperties(fData[key]);
          }

          const finalData = { data: { ...splittedData.data, ...fData }, error:res.error};
          const isErrorEmpty = Object.keys(res.error).length === 0;
          if (!isErrorEmpty) {
            const errorArr: any = [];
            // Object.keys(res.error).forEach((key) => {
              errorArr.push("Failed to upload the file");
            // })

            if (errorArr.length > 0){
              this.id = '';
              this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(errorArr), life: 5000 });
            }
          }
          observer.next(finalData);
          observer.complete();
        }, (err: any) => {
          observer.error(err);
        });
      });
    } else {
      return of(splittedData)
    }
  }
  clearSelectedFiles() {
    if(this.csvRef)
    this.csvRef.clear();
    if(this.excelRef)
    this.excelRef.clear();
  }
  onAfterViewInit() {

  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
    this.subscriptions = [];

    // Reset form state
    this.resetImportPageValue();
  }

  downloadTemplate() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.get(this.templateDownloadLink, { headers, responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        const downloadUrl = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        const params = {
          modelName: this.importGroup.controls["tableName"].value,
          templateName: this.importGroup.controls["templateName"].value,
       }
        const templateFileName = (params.modelName.replace(/ /g, '') + "_" + params.templateName.replace(/ /g, '') + "_template").toLowerCase();
        link.href = downloadUrl;
        if(this.selectedValues.selectedType == 'excel'){
        link.download = templateFileName + '.xlsx';
        } else if(this.selectedValues.selectedType == 'csv'){
          link.download = templateFileName + '.csv';
        }
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      },
      //update needed added latest
      error: (error: { status: number; }) => {
        if (error.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Unauthorized', detail: this.translateService.instant('You_are_not_authorized_to_download_this_template') });
        }
        else if(error.status === 404){
          this.messageService.add({ severity: 'error', summary: 'Not Found', detail: this.translateService.instant('The_requested_template_is_not_found') });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.translateService.instant('An_error_occurred_while_downloading_the_template') });
        }
      }
    });
  }

  resetImportPageValue() {
    this.importBtndisabled = true;
    if (this.fromListPage) {
      this.setDefaultImport()
    }
    else {
      this.importGroup.reset();
      this.clearSelectedFiles();
      if (this.tableDropdown)
        this.tableDropdown.clear();
      if (this.templateDropdown)
        this.templateDropdown.clear();
      Object.assign(this, {
        selectedtablename: null,
        dateformat: null,
        datetimeformat: null,
        numberformat: null
      });
    }
  }
}
