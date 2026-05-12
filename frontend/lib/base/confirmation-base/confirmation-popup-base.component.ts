
import { inject, Directive } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AppConstants } from '@app/app-constants';
import { AppUtilService } from '@app/app.util.service';
import { BaseService } from '@baseapp/base.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { fromEvent, map } from 'rxjs';



@Directive({})
export class ConfirmationPopupBaseComponent {
  comments: string = "";
  inValid: boolean = false;
  confirmationForm: any;
  fields: any = []
  fieldConfig: any = {};
  hiddenFields: any = {};
  lookupData: any = {};
  autoSuggestPageNo: number = 0;

  public DynamicDialogRef = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public appUtilBaseService = inject(AppUtilService);
  public baseService = inject(BaseService);
  public dataConfig: any


  onInit(): void {
    this.dataConfig = this.config.data.config;
    this.buildForm();
  }


  getFormControlsFields() {
    const formGroupFields: any = {};
    for (const field of Object.keys(this.fieldConfig)) {
      formGroupFields[field] = new UntypedFormControl(null, []);
      this.updateFieldTypes(field);
    }
    return formGroupFields;
  }

  buildForm() {
    this.fields = [];
    this.fieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.dataConfig.fields);
    const formGroupFields = this.getFormControlsFields();
    this.confirmationForm = new UntypedFormGroup(formGroupFields);
  }


  updateFieldTypes(field: string) {
    if (this.fieldConfig[field].uiType == 'autosuggest') {
      this.initiateLookupFields(field);
    }
    else if (this.fieldConfig[field]?.isDouble) {
      this.fieldConfig[field].uiType = 'double';
    }
    else if (this.fieldConfig[field]?.isBooleanField) {
      this.fieldConfig[field].uiType = 'yesno';
    }
    this.fields.push(this.fieldConfig[field]);
  }

  initiateLookupFields(fieldName: string) {
    const apiTriggerProp = `callFiredfor${fieldName}`;
    const responseDataProp = `filteredItemsfor${fieldName}`;
    this.lookupData[fieldName] = {
      [apiTriggerProp]: false,
      [responseDataProp]: []
    }
    this.autoSuggestPageNo = 0;
  }

  submit() {
    this.DynamicDialogRef.close(this.confirmationForm.getRawValue());
  }

  cancel() {
    this.DynamicDialogRef.close();
  }


  //Lookup

  timeFormatPrimeNG: string = AppConstants.timeFormatPrimeNG;
  dateFormatPrimeNG: string = AppConstants.dateFormatPrimeNG;
  minFraction = AppConstants.minFraction;
  maxFraction = AppConstants.maxFraction;
  currency = AppConstants.currency;
  currencyDisplay = AppConstants.currencyDisplay;
  defaultLocale: string = AppConstants.defaultLocale;


  attachInfiniteScrollForAutoComplete(fieldName: string, url: any) {
    const tracker = (<HTMLInputElement>document.getElementsByClassName('p-autocomplete-panel')[0])
    if (tracker) {
      let windowYOffsetObservable = fromEvent(tracker, 'scroll').pipe(map(() => {
        return Math.round(tracker.scrollTop);
      }));
      const autoSuggestScrollSubscription = windowYOffsetObservable.subscribe((scrollPos: number) => {
        if ((tracker.offsetHeight + scrollPos >= tracker.scrollHeight)) {
          this.lookupData[fieldName][`callFiredfor${fieldName}`] = false;
          if (this.lookupData[fieldName][`filteredItemsfor${fieldName}`].length >= this.autoSuggestPageNo * AppConstants.defaultPageSize) {
            this.autoSuggestPageNo = this.autoSuggestPageNo + 1;
          }
          this.autoSuggestSearch(fieldName, '', '', url,);
        }
      });
    }
  }


  autoSuggestSearch(fieldName: string, event?: any, col?: any, url?: any,) {
    if (!this.lookupData[fieldName][`callFiredfor${fieldName}`]) {
      this.lookupData[fieldName][`callFiredfor${fieldName}`] = true;
      let apiObj: any = {
        url: `rest/${url}`,
        method: 'GET',
        showloading: false
      };
      const urlObj = {
        url: apiObj.url,
        searchText: (event && this.confirmationForm.controls[fieldName].value) ? event.query == this.confirmationForm.controls[fieldName].value[col.displayField] ? ' ' : event.query : (event ? event.query : ' '),
        colConfig: col,
        value: this.confirmationForm.getRawValue(),
        pageNo: this.autoSuggestPageNo
      }
      apiObj.url = this.appUtilBaseService.generateDynamicQueryParams(urlObj);

      this.baseService.get(apiObj).subscribe((res: any) => {
        this.lookupData[fieldName][`callFiredfor${fieldName}`] = false;
        let updateRecords = [];
        if (event && event.query) {
          updateRecords = [...res];
        } else {
          updateRecords = [...this.lookupData[fieldName][`filteredItemsfor${fieldName}`], ...res];
        }
        const ids = updateRecords.map(o => o.sid)
        this.lookupData[fieldName][`filteredItemsfor${fieldName}`] = updateRecords.filter(({ sid }, index) => !ids.includes(sid, index + 1));
      }, (err: any) => {
        this.lookupData[fieldName][`callFiredfor${fieldName}`] = false;

      })

    }
  }


  clearSearchData(fieldName: string) {
    this.autoSuggestPageNo = 0;
    this.lookupData[fieldName][`filteredItemsfor${fieldName}`] = [];
    this.lookupData[fieldName][`callFiredfor${fieldName}`] = false;
  }

  formatAutoComplete(item: any, displayField: string, formControlName: string) {
    return ((item && item[displayField]) ? item[displayField] : '');
  }

  getSelectedObject(field: string, options: any) {
    const selectedObj = (options.filter((item: { label: any }) => (item.label)?.toUpperCase() === field?.toUpperCase()));
    return selectedObj[0];
  }

  getDisabled(formControl: FormGroup, ele: string) {
    const parent = ele.split('?.')[0];
    if (formControl.controls[parent] instanceof FormGroup) {
      return formControl.get(ele)?.disabled
    }
    else
      return formControl.controls[parent].disabled;
  }


  getValue(formControl: FormGroup, ele: string) {
    // const parent = ele.split('?.')[0];
    // if (formControl.controls[parent] instanceof FormGroup){
    //   const child = ele.split('?.')[1];
    //   return formControl.controls[parent].value[child];
    // }
    // else
    return formControl.controls[ele].value;
  }


  getSelectedMultipleObjects(field: any[], options: any) {
    let arr: any[] = [];
    if (field) {
      field?.forEach((ele: any) => {
        const selectedObj: any = (options.filter((item: { label: any }) => item.label.toUpperCase() === ele.toUpperCase()));
        arr.push(selectedObj[0]);
      })
    }
    return arr;
  }

}
