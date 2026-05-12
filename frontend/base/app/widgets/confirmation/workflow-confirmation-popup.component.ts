
import { inject } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-workflow-confirmation-popup',
  template: `
  <p-messages></p-messages>
  <div class="confirm-popup-container" id="confirmation-popup">
    <div class="confirmation-msg">{{config.data.confirmationMsg}}</div>
    <div [ngClass]="{'required': config.data.isRequired,'error':inValid}">
        <label class="field-label" [innerHTML]="'Comments'"></label>
    </div>
    <textarea [rows]="5" [cols]="70" pInputTextarea [(ngModel)]="comments"></textarea>
    <div class="action-ele">
        <button type="button" class="action-btn" pButton icon="pi pi-times" [label]="'Cancel'"
            (click)="cancel()"></button>
        <button type="button" class="action-btn" pButton icon="pi pi-check" [label]="config.data.action| translate"
            (click)="submit()"></button>
    </div>
</div>
`,
  styles: [],
  providers: [MessageService]
})

export class WorkflowConfirmationPopupComponent implements OnInit {
  comments: string = "";
  inValid: boolean = false;

  public DynamicDialogRef = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public dataConfig: any


  ngOnInit(): void {
    this.dataConfig = this.config.data.config;
  }

  result: any = {
    comments: '',
    accepted: false
  }

  submit() {
    this.result.accepted = true;
    this.result.comments = this.comments;
    if (this.config.data.isRequired && !this.comments) {
      this.inValid = true;
      this.messageService.clear();
      const config = {
        severity: 'error', summary: '', detail: 'comment is required', life: 5000
      }

      this.messageService.add(config);
      return;
    }
    this.DynamicDialogRef.close(this.result);
  }

  cancel() {
    this.result.accepted = false;
    this.DynamicDialogRef.close(this.result);
  }
}
