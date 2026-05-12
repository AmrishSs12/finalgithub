import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AppUtilService } from '@app/app.util.service';
import { fromEvent, map } from 'rxjs';
import { AppConstants } from '@app/app-constants';
import { BaseService } from '@baseapp/base.service';


@Component({
  selector: 'app-optional-filters',
  templateUrl: './optional-filters.component.html',
  styleUrls: ['./optional-filters.component.scss']
})
export class OptionalFiltersComponent implements OnInit {


  // Below mentioned code can be added in the parent component to get the form data from child.
  // @ViewChild(OptionalFiltersComponent)
  // private filters:any = OptionalFiltersComponent
  // this.filters.dynamicFilterForm.getRawValue()



  @Input() title: string = "CHOOSE_FILTERS";
  @Input() filterConfig: any;

  public appUtilBaseService = inject(AppUtilService);
  public baseService = inject(BaseService);

  fields: any = [];
  lookupData: any = {};
  autoSuggestPageNo: number = 0;
  filterFieldConfig: any = {};
  dynamicFilterForm: any;
  hiddenFields: any = [];



  // defaultConstants

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
        searchText: (event && this.dynamicFilterForm.controls[fieldName].value) ? event.query == this.dynamicFilterForm.controls[fieldName].value[col.displayField] ? ' ' : event.query : (event ? event.query : ' '),
        colConfig: col,
        value: this.dynamicFilterForm.getRawValue(),
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

  getFormControlsFields() {
    const formGroupFields: any = {};
    for (const field of Object.keys(this.filterFieldConfig)) {
      if (this.filterFieldConfig[field].uiType == 'number' || this.filterFieldConfig[field].uiType == 'double') {
        formGroupFields[field] = new UntypedFormGroup({ min: new UntypedFormControl(null, []), max: new UntypedFormControl(null, []) })
      } else {
        formGroupFields[field] = new UntypedFormControl(null, []);
      }
      this.updateFieldTypes(field);
    }
    return formGroupFields;
  }


  updateFieldTypes(field: string) {
    // if (this.filterFieldConfig[field].uiType == 'select' && this.filterFieldConfig[field].multipleValues) {
    // this.filterFieldConfig[field].uiType = 'multidropdown';
    // }
    if (this.filterFieldConfig[field].uiType == 'autosuggest') {
      this.initiateLookupFields(field);
    }
    else if (this.filterFieldConfig[field]?.isDouble) {
      this.filterFieldConfig[field].uiType = 'double';
    }
    else if (this.filterFieldConfig[field]?.isBooleanField) {
      this.filterFieldConfig[field].uiType = 'yesno';
    }
    this.fields.push(this.filterFieldConfig[field]);
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


  accessControlCheck() {
    for (const field of Object.keys(this.filterFieldConfig)) {
      const config: any = this.filterFieldConfig[field];
      if (config.allowViewing == "no") {
        this.hiddenFields.push(config.name);
      }
      else if (config.allowEditing == "no") {
        this.dynamicFilterForm.get(config.name).disabled();
      }
    }
  }

  buildForm() {
    this.fields = [];
    this.filterFieldConfig = this.appUtilBaseService.getControlsFromFormConfig({})
    this.filterFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.filterConfig);
    const formGroupFields = this.getFormControlsFields();
    this.dynamicFilterForm = new UntypedFormGroup(formGroupFields);
    this.accessControlCheck();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges() {
    this.buildForm();
  }

}
