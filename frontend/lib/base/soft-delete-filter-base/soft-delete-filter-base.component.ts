import { EventEmitter, Input, Output, inject, Directive } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AppConstants } from '@app/app-constants';
import { AppUtilService } from '@app/app.util.service';

@Directive({})
export class SoftDeleteFilterBaseComponent {
  @Output() onFilterSelectionClick: EventEmitter<any> = new EventEmitter();
  @Input() localStorageStateKey: any = 'Filter';
  @Input() defaultValue: any = '';

  ngOnChanges(changes: any): void {
    if (changes.defaultValue?.currentValue) {
      this.quickFilterControls.controls.show.setValue(this.defaultValue);
    }
  } 

  quickFilterFieldConfig: any = {}
  inValidFields: any = {};
  hiddenFields: any = {};
  quickFilterConfig: any = {
    "outline": false,
    "disabledFieldsByLookup": [],
    "children": [{
      "allowedValues": {
        "values": [{
          "label": "ACTIVE_RECORDS_ONLY",
          "value": "ACTIVE_RECORDS_ONLY"
        }, {
          "label": "INACTIVE_RECORDS_ONLY",
          "value": "INACTIVE_RECORDS_ONLY"
        }, {
          "label": "ALL_RECORDS",
          "value": "ALL_RECORDS"
        }]
      },
      "defaultVal": "ACTIVE_RECORDS_ONLY",
      "fieldName": "show",
      "data": "show",
      "field": "show",
      "name": "show",
      "uiType": "select",
      "isPrimaryKey": false,
      "label": "SHOW",
      "type": "filterField",
      "fieldType": "string",
      "fieldId": "show"
    }],
    "type": "quickFilter",
    "queryViewMapping": {}
  }

  quickFilterControls: UntypedFormGroup = new UntypedFormGroup({
    show: new UntypedFormControl(AppConstants.softDeleteFilterDefaultValue, []),
  });
  public appUtilBaseService = inject(AppUtilService);

  onInit(): void {
    if (this.defaultValue) {
      this.quickFilterControls.controls.show.setValue(this.defaultValue)
    }
    this.quickFilterFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.quickFilterConfig);
    this.quickFilterControls.valueChanges.subscribe((value) => {
      this.onFilterSelectionClick.emit(value?.show)
    })
  }

  getValue(formControl: FormGroup, ele: string) {
    const parent = ele.split('?.')[0];
    if (formControl.controls[parent] instanceof FormGroup) {
      const child = ele.split('?.')[1];
      return formControl.controls[parent].value[child];
    }
    else
      return formControl.controls[parent].value;
  }

  getSelectedObject(field: string, options: any) {
    const selectedObj = (options.filter((item: { label: any }) => (item.label)?.toUpperCase() === field?.toUpperCase()));
    return selectedObj[0];
  }

}

