import { Directive, inject } from "@angular/core";
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { AppConstants } from "@app/app-constants";
import { AppUtilService } from '@app/app.util.service';
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { LoggerSettingsService } from "../logger-settings.service";
import { environment } from "@env/environment";
import { MessageService } from "primeng/api";

@Directive({
    providers: []
})
export class LoggerSettingsDetailBaseComponent {

    pageViewTitle = 'Logger_Settings';
    hiddenFields: any = {};
    showForm: boolean = true;
    formFieldConfig: any = {};
    isMobile: boolean = AppConstants.isMobile;
    inValidFields: any = {};
    tableaccess: boolean = true;
    detailFormConfig: any = {
        "detailPagePopupWidth": 70,
        "outline": false,
        "disabledFieldsByLookup": [],
        "children": [{
            "allowEditing": "yes",
            "allowedValues": {
                "values": [{
                    "label": "ROOT",
                    "value": "ROOT"
                }]
            },
            "fieldName": "packageName",
            "data": "Package Name",
            "isQueryView": false,
            "isPrimaryKey": false,
            "label": "Package_Name",
            "type": "formField",
            "mandatory": "yes",
            "defaultVal": "root",
            "field": "packageName",
            "transient": false,
            "uiType": "select",
            "name": "packageName",
            "fieldType": "string",
            "allowViewing": "yes",
            "fieldId": "packageName"
        }, {
            "allowEditing": "yes",
            "allowedValues": {
                "values": [{
                    "label": "TRACE",
                    "value": "TRACE"
                }, {
                    "label": "DEBUG",
                    "value": "DEBUG"
                }, {
                    "label": "INFO",
                    "value": "INFO"
                }, {
                    "label": "WARN",
                    "value": "WARN"
                }, {
                    "label": "ERROR",
                    "value": "ERROR"
                }, {
                    "label": "FATAL",
                    "value": "FATAL"
                }, {
                    "label": "OFF",
                    "value": "OFF"
                }]
            },
            "fieldName": "loggingLevel",
            "data": "Logging Level",
            "isQueryView": false,
            "isPrimaryKey": false,
            "label": "Logging_Level",
            "type": "formField",
            "mandatory": "yes",
            "defaultVal": "INFO",
            "field": "loggingLevel",
            "transient": false,
            "uiType": "select",
            "name": "loggingLevel",
            "fieldType": "string",
            "allowViewing": "yes",
            "fieldId": "loggingLevel"
        }, {
            "detailPagePopupWidth": 70,
            "outline": false,
            "buttonType": "icon_on_left",
            "visibility": "show",
            "buttonStyle": "curved",
            "enableOnlyIfRecordSelected": false,
            "name": "submit",
            "buttonEnabled": "yes",
            "label": "Submit",
            "type": "customButton"
        }],
        "columns": "2",
        "tableId": "3c64937f-ac70-486f-bc32-68abb21ac2d8",
        "type": "form",
        "actions": {
            "read": {
                "App Admin": {
                    "access": "yes"
                }
            },
            "create": {
                "App Admin": {
                    "access": "yes"
                }
            },
            "update": {
                "App Admin": {
                    "access": "yes"
                }
            },
            "changelog": {
                "App Admin": {
                    "access": "yes"
                }
            },
            "delete": {
                "App Admin": {
                    "access": "yes"
                }
            }
        },
        "accordionOnFormSection": "no",
    }
    subscriptions: Subscription[] = [];

    detailFormControls: UntypedFormGroup = new UntypedFormGroup({
        packageName: new UntypedFormControl('', [Validators.required]),
        loggingLevel: new UntypedFormControl('', [Validators.required]),
    });

    public appUtilBaseService = inject(AppUtilService);
    public translateService = inject(TranslateService);
    public loggerSettingsService = inject(LoggerSettingsService);
    public messageService = inject(MessageService);

    onInit() {
        this.formFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig);
        this.setDefaultValues();
        if (!environment.prototype) {
            this.getPackages();
        }
    }

    getDisabled(formControl: any, ele: string) {
        const parent = ele.split('?.')[0];
        if (formControl.controls[parent] instanceof FormGroup) {
            return formControl.get(ele)?.disabled
        } else {
            return formControl.controls[parent].disabled;
        }
    }

    getSelectedObject(field: string, options: any) {
        const selectedObj = (options.filter((item: { label: any }) => (item.label)?.toUpperCase() === field?.toUpperCase()));
        return selectedObj[0];
    }

    getValue(formControl: FormGroup, ele: string) {
        const parent = ele.split('?.')[0];
        if (formControl.controls[parent] instanceof FormGroup) {
            const child = ele.split('?.')[1];
            return formControl.controls[parent].value[child];
        } else {
            return formControl.controls[parent].value;
        }
    }

    setDefaultValues(edit?: boolean) {
        for (const ele in this.formFieldConfig) {
            if (this.formFieldConfig[ele]?.transient && edit || !edit) {
                if (this.formFieldConfig[ele].defaultVal && (this.formFieldConfig[ele].uiType === 'select' || this.formFieldConfig[ele].uiType === 'checkboxgroup' || this.formFieldConfig[ele].uiType === 'radio')) {
                    let defaultValue: any = (this.formFieldConfig[ele].defaultVal);
                    let defaultLabel: any;
                    if (typeof defaultValue == 'string') {
                        defaultLabel = (defaultValue?.trim()?.replace(/ /g, "_"))?.toUpperCase()
                    } else if (Array.isArray(defaultValue)) {
                        defaultValue?.forEach((obj: any, index: any, a: any) => {
                            a[index] = (obj?.trim()?.replace(/ /g, "_"))?.toUpperCase();
                        })
                        defaultLabel = defaultValue
                    } else {
                        defaultLabel = defaultValue
                    }
                    if (this.formFieldConfig[ele].multiple || this.formFieldConfig[ele].uiType === 'checkboxgroup' || Array.isArray(defaultValue)) {
                        this.detailFormControls.controls[ele].patchValue(defaultLabel, { emitEvent: true });
                    } else {
                        this.detailFormControls.controls[ele]?.patchValue(defaultLabel, { emitEvent: true });
                    }
                } else if ((typeof this.formFieldConfig[ele]?.defaultVal === 'string'
                    ? this.formFieldConfig[ele]?.defaultVal?.trim() !== ''
                    : true) && this.formFieldConfig[ele].defaultVal !== undefined && this.formFieldConfig[ele].defaultVal !== null) {
                    const defaultValue = (this.formFieldConfig[ele].defaultVal);
                    this.detailFormControls.controls[ele].patchValue(defaultValue, { emitEvent: true });
                }
            }
        }
    }

    getPackages() {
        const dataSubscription = this.loggerSettingsService.getPackages().subscribe((res: any) => {
            if (res && res?.length > 0) {
                res?.forEach((obj: any) => {
                    this.formFieldConfig.packageName.options.push({ label: obj, value: obj });
                })
            }
        });
        this.subscriptions.push(dataSubscription);
    }

    onSubmitAction() {
        if (!environment.prototype && this.detailFormControls.status == 'VALID') {
            const params = {
                packageName: this.detailFormControls.controls['packageName'].value,
                logLevel: this.detailFormControls.controls['loggingLevel'].value
            }
            const dataSubscription = this.loggerSettingsService.saveLogger(params).subscribe((res: any) => {
                this.showMessage({ severity: 'success', summary: '', detail: res?.message ? res?.message : this.translateService.instant('Record_Saved_Successfully') });
            });
            this.subscriptions.push(dataSubscription);
        }
    }

    showMessage(config: any) {
        this.messageService.clear();
        this.messageService.add(config);
    }

    onAfterViewInit() {
    }
    onChanges(changes: any) {
    }
    onDestroy() {
        this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
    }
}