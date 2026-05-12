import { Component, EventEmitter, Output, inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AppConstants } from '@app/app-constants';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProviderMappingBaseService } from '../provider-mapping.base.service';
import { ProviderMappingBase } from '../provider-mapping.base.model';
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.scss']
})
export class ProviderDetailComponent {

  public config = inject(DynamicDialogConfig);
  public dynamicDialogRef = inject(DynamicDialogRef);
  public providerMappingService = inject(ProviderMappingBaseService);
  public messageService = inject(MessageService)
  public appUtilBaseService = inject(AppUtilService);
  public translateService = inject(TranslateService);
  public confirmationService = inject(ConfirmationService);

  detailFormConfig : any = {
    "outline" : false,
    "disabledFieldsByLookup" : [ ],
    "children" : [ {
      "allowEditing" : "yes",
      "fieldName" : "saEmail",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Service_Account_Mail",
      "type" : "formField",
      "mandatory" : "yes",
      "field" : "saEmail",
      "uiType" : "email",
      "name" : "saEmail",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "saEmail"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "clientId",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Client_Id",
      "type" : "clientId",
      "mandatory" : "yes",
      "field" : "clientId",
      "uiType" : "text",
      "name" : "clientId",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "clientId"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "clientSecret",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Client_Secret",
      "type" : "clientSecret",
      "mandatory" : "yes",
      "field" : "clientSecret",
      "uiType" : "text",
      "name" : "clientSecret",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "clientSecret"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "apiKey",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Api_Key",
      "type" : "apiKey",
      "mandatory" : "yes",
      "field" : "apiKey",
      "uiType" : "text",
      "name" : "apiKey",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "apiKey"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "issuerURL",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Issuer_URL",
      "type" : "issuerURL",
      "mandatory" : "yes",
      "field" : "issuerURL",
      "uiType" : "link",
      "name" : "issuerURL",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "issuerURL"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "tokenURL",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Token_URL",
      "type" : "tokenURL",
      "mandatory" : "yes",
      "field" : "tokenURL",
      "uiType" : "link",
      "name" : "tokenURL",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "tokenURL"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "providerName",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Provider_Name",
      "type" : "providerName",
      "mandatory" : "yes",
      "field" : "providerName",
      "uiType" : "text",
      "name" : "providerName",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "providerName"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "authenticationMode",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Authentication_Mode",
      "type" : "authenticationMode",
      "mandatory" : "yes",
      "field" : "authenticationMode",
      "uiType" : "select",
      "name" : "authenticationMode",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "authenticationMode",
      "allowedValues": {
        "values": [
          {
            "label": "OAUTH2",
            "value": "OAUTH2"
          }, {
            "label": "BASIC",
            "value": "BASIC"
          }, {
            "label": "API_KEY",
            "value": "API_KEY"
          }
          , {
            "label": "SERVICE_ACCOUNT",
            "value": "SERVICE_ACCOUNT"
          }, {
            "label": "NO_AUTH",
            "value": "NO_AUTH",
          },
          {
            "label": "RAPPIT_INTRA_COMMUNICATION",
            "value": "RAPPIT_INTRA_COMMUNICATION"
          },
          {
            "label": "RAPPIT_INTRA_COMMUNICATION_KMS",
            "value": "RAPPIT_INTRA_COMMUNICATION_KMS"
          }],
        "conditions": {
          "conditionType": "auto",
          "conditions": []
        }
      }
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "username",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Username",
      "type" : "username",
      "mandatory" : "yes",
      "field" : "username",
      "uiType" : "text",
      "name" : "username",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "username"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "password",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Password",
      "type" : "password",
      "mandatory" : "yes",
      "field" : "password",
      "uiType" : "text",
      "name" : "password",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "password"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "baseURL",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "Base_URL",
      "type" : "baseURL",
      "mandatory" : "yes",
      "field" : "baseURL",
      "uiType" : "link",
      "name" : "baseURL",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "baseURL"
    },
   ],
    "columns" : "2",
    "type" : "form",
  }
  ProviderMappingFormControl: UntypedFormGroup = new UntypedFormGroup({
    saEmail: new UntypedFormControl('', []),
    clientId: new UntypedFormControl('', []),
    clientSecret: new UntypedFormControl('', []),
    apiKey: new UntypedFormControl('', []),
    issuerURL: new UntypedFormControl('', []),
    userContextRequired: new UntypedFormControl('', []),
    tokenURL: new UntypedFormControl('', []),
    baseURL: new UntypedFormControl('', [Validators.required, Validators.pattern(AppConstants.urlRegex)]),
    providerName: new UntypedFormControl('', []),
    authenticationMode: new UntypedFormControl('', []),
    username: new UntypedFormControl('', []),
    password: new UntypedFormControl('', []),
    additionalInfo: new UntypedFormControl('', [])
  });

  id: any;
  rowEvent: any;
  subscriptions: Subscription[] = [];
  currentDefaultValues: any;
  formErrors:any = {};
  inValidFields:any = {};
  formFieldConfig:any = {};
  showFields:any ={};
  validationMessage:string = '';
  loading: boolean = true;


  ngOnInit() {
    this.ProviderMappingFormControl.get("providerName")?.disable({ emitEvent: false });
    this.ProviderMappingFormControl.get("authenticationMode")?.disable({ emitEvent: false });

    this.id = this.config.data.id;
    this.rowEvent = this.config.data.event;
    this.getDefaultValues();
    this.formFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig);
    this.appUtilBaseService.configureValidators(this.ProviderMappingFormControl, this.formFieldConfig);
  }

  onDestroy() {
    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  }

  getDefaultValues() { //get the values of a specific record
    if (environment.prototype && this.id) {
      const params = {
        sid: this.id
      };
      const getByIdSubscription = this.providerMappingService.getProtoTypingDataById(params).subscribe((res: any) => {
        res = JSON.parse(JSON.stringify(res))
        this.setDefaultValues(res);
        this.loading = false;
      });
      this.subscriptions.push(getByIdSubscription);
    } else if (this.id) {
      const params = {
        sid: this.id
      };
      const dataSubscription = this.providerMappingService.getById(params).subscribe((res: ProviderMappingBase[]) => {
        this.setDefaultValues(res);
        this.loading = false;
      });
      this.subscriptions.push(dataSubscription);
    }
    else {
      this.setDefaultValues({});
      this.loading = false;
    }

  }
  setDefaultValues(data: any) {
    // Use the actual authenticationMode from data
    const authMode = data.authenticationMode;
    if (authMode === "OAUTH2") {
      this.showFields = ["tokenURL", "issuerURL", "clientId", "clientSecret"];
    } else {
      this.showFields = [];
    }
    // Show baseURL only when sysGen is false
    if (!data?.sysGen) {
      this.showFields.push("baseURL");
    }
    // Set required validators for these fields only
    this.showFields.forEach((field: any) => {
      const control = this.ProviderMappingFormControl.get(field);
      if (control) {
        if (field === 'baseURL') {
          control.setValidators([Validators.required, Validators.pattern(AppConstants.urlRegex)]);
        } else {
          control.setValidators([Validators.required]);
        }
        control.updateValueAndValidity();
      }
    });
    // Remove validators from fields not in showFields
    Object.keys(this.ProviderMappingFormControl.controls).forEach((field) => {
      if (!this.showFields.includes(field)) {
        const control = this.ProviderMappingFormControl.get(field);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      }
    });
    this.ProviderMappingFormControl.patchValue({
      providerName: data.providerName,
      saEmail: data.saEmail,
      authenticationMode: data.authenticationMode,
      additionalInfo: JSON.stringify(data.additionalInfo),
      clientId: data.clientId,
      clientSecret: data.clientSecret,
      apiKey: data.apiKey,
      issuerURL: data.issuerURL,
      tokenURL: data.tokenURL,
      username: data.username,
      password: data.password,
      baseURL: data.baseURL,

    });
    this.currentDefaultValues = data;
  }
  cancel() {
    if(this.ProviderMappingFormControl.dirty){
      this.confirmationService.confirm({
		    message:this.translateService.instant('Do_you_want_to_discard_all_unsaved_changes_QUESTION'),
			header: this.translateService.instant('Confirmation'),

			icon:'pipi-info-circle',
			accept:()=>{
                this.dynamicDialogRef.close();
			},
			reject:()=>{
			},
		});
	}
    else
        this.dynamicDialogRef.close();
  }
  updateValues() { //to update the record
    let updateData = this.ProviderMappingFormControl.value;
    if (environment.prototype) {
      this.dynamicDialogRef.close("saved");
    }
    else if (this.checkValidations()) {
      if(this.validateJSON()){
      let updateparams = this.showFields.reduce((acc:any, field:any) => {
        acc[field] = updateData[field];
        return acc;
      }, {});
      let params = { ...this.currentDefaultValues };

      this.showFields.forEach((field: any) => {
        if (updateparams[field] !== undefined) {
          params[field] = updateparams[field];
        }
      });
      params = {
        ...params,
        additionalInfo: updateData.additionalInfo ? JSON.parse(updateData.additionalInfo) : {}
      }
      const updateSubscription = this.providerMappingService.update(params).subscribe((res: any) => {
        if (res) {
            this.showMessage({ severity: 'success', summary: '', detail: this.translateService.instant('Record_Updated_Successfully') });
            this.dynamicDialogRef.close("saved");
        }
      });
      this.subscriptions.push(updateSubscription);
    }
    }
  }
  showMessage(config: any) {
    this.messageService.clear();
    this.messageService.add(config);
  }
  validateJSON() {
    let isValid = true;
    if(this.ProviderMappingFormControl.value.additionalInfo){
    try {
      JSON.parse(this.ProviderMappingFormControl.value.additionalInfo);
      isValid = true;
    } catch (error:any) {
      isValid = false;
      this.validationMessage = 'Invalid JSON: ' + error.message;
      this.showMessage({ severity: 'error', summary: '', detail: this.validationMessage, life: 5000 });

    }
    }
    return isValid

  }
  checkValidations(): boolean {
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    if (!this.appUtilBaseService.validateNestedForms(this.ProviderMappingFormControl, this.formErrors, finalArr, this.inValidFields,this.formFieldConfig)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), life: 5000 });
      }
      return false;
    }
    if(this.detailFormConfig.children) {
      let multComp = this.detailFormConfig.children.filter((ele: any) => ele.multipleValues && ele.columns);
      if(multComp.length) {
        let mulFormErrors: string[] = [];
        multComp.forEach((config: any) => {
          let colnames = config.columns.filter((col: any) => col.name !== 'jid').map((col: any) => col.name);
          let values = this.ProviderMappingFormControl.value[config.field];
          values = values.filter((row: any) => {
            return Object.keys(row) && Object.keys(row).find(key => colnames.includes(key));
          });
          this.ProviderMappingFormControl.get(config.field)?.patchValue(values);
          mulFormErrors = [...mulFormErrors, ...this.appUtilBaseService.validateMultipleComp(this.ProviderMappingFormControl.value, config)];
        });
        if(mulFormErrors.length) {
          this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(mulFormErrors), life: 5000 });
          return false;
        }
      }
    }
    return true;
  }
}
