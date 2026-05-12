import { EventEmitter, Input, Output, inject, Directive, SimpleChange } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AppUtilService } from '@app/app.util.service';
import { skip } from 'rxjs';

@Directive({})
export class WorkflowStatusBaseComponent {
  @Input() workflowStatusFormFieldConfig: any = '';
  @Input() defaultValue: any = '';
  @Output() onWorkflowStatusSelection: EventEmitter<any> = new EventEmitter();

  formFieldConfig: any = {
    "status": ""
  };
  inValidFields: any = {};
  detailFormControls: UntypedFormGroup = new UntypedFormGroup({
    status: new UntypedFormControl('')
  });
  public appUtilBaseService = inject(AppUtilService);

  onInit(): void {
    if (this.defaultValue) {
      this.detailFormControls.controls.status.setValue(this.defaultValue)
    }
    this.formFieldConfig.status = this.workflowStatusFormFieldConfig;
    this.detailFormControls.valueChanges?.pipe(skip(1))?.subscribe((value: { status: any; }) => {
      this.onWorkflowStatusSelection.emit(value?.status)
    })
  }

  // Get value of the Form control using the control and field name
  getValue(formControl: FormGroup, ele: string) {
    const parent = ele.split('?.')[0];
    if (formControl.controls[parent] instanceof FormGroup) {
      const child = ele.split('?.')[1];
      return formControl.controls[parent].value[child];
    } else {
      return formControl.controls[parent].value;
    }
  }

  // Get selected object of the Dropdown using the field name and allowed values
  getSelectedObject(field: string, options: any) {
    const selectedObj = (options.filter((item: { label: any }) => (item.label)?.toUpperCase() === field?.toUpperCase()));
    return selectedObj[0];
  }

  // Executes when changes in `@Input` properties 
  onChanges(changes: SimpleChange) {
    if (this.defaultValue) {
      this.detailFormControls.controls.status.setValue(this.defaultValue)
    }
  }
}

