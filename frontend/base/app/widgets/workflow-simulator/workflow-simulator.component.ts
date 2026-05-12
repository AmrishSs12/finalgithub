import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AppUtilService } from '@app/app.util.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-workflow-simulator',
  templateUrl: './workflow-simulator.component.html',
  styleUrls: ['./workflow-simulator.component.scss'],
  providers: [DialogService]
})
export class WorkflowSimulatorComponent implements OnInit {

  private dialogService = inject(DialogService);
  private dynamicDialogRef = inject(DynamicDialogRef);
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public appUtilBaseService = inject(AppUtilService)
  public messageService = inject(MessageService);


  statusFieldConfig: any;
  actorFieldConfig: any;
  detailFormControls = new UntypedFormGroup({
    actor: new UntypedFormControl('', [Validators.required]),
    status: new UntypedFormControl('', [Validators.required]),
  })

  ngOnInit(): void {
    this.statusFieldConfig = this.dynamicDialogConfig.data?.statusFieldConfig;
    this.actorFieldConfig = this.dynamicDialogConfig.data?.actorFieldConfig;
    this.actorFieldConfig.map((data: any) => {
      data.formattedValue = this.camelize((data.value).toLowerCase());
    })


    // const selectedActors: any = [];
    if (this.dynamicDialogConfig.data?.selectedValues?.userTypes?.length) {
      const selectedActors = this.dynamicDialogConfig.data?.selectedValues.userTypes || [];
      // this.dynamicDialogConfig.data?.selectedValues.userTypes?.map((actor: string) => { selectedActors.push( { label: actor, value: actor }) })
      this.detailFormControls.get('actor')?.patchValue(selectedActors);
      this.detailFormControls.get('status')?.patchValue(this.dynamicDialogConfig.data?.selectedValues.step?.toUpperCase());
    }
  }

  loadWorkflow() {
    const values = this.detailFormControls.getRawValue();
    const finalArr: string[] = [];
    const formErrors = {};
    const inValidFields = {};
    let actors: any = [];

    if (!this.appUtilBaseService.validateNestedForms(this.detailFormControls, formErrors, finalArr, inValidFields)) {
      if (finalArr.length) {
        this.messageService.clear();
        this.messageService.add({ severity: 'error', summary: '', detail: finalArr.join(), life: 5000 });
      }
    } else {
      values.actor?.map((actor: any) => {
        // const formattedValue = this.camelize(actor.value);
        actors.push(actor);
      })
      this.dynamicDialogRef.close({
        userTypes: actors,
        step: values.status?.toLowerCase()
      });
    }

  }
  getSelectedObject(field: string, options: any) {
    if (options) {
      const selectedObj = (options.filter((item: { label: any }) => item.label.includes(field)));
      return selectedObj[0];

    }
  }

  log(data: any) {
    console.log(data)
  }

  camelize(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0
          ? letter.toLowerCase()
          : letter.toUpperCase()
      )
      .replace(/\s+/g, '');
  }

}
