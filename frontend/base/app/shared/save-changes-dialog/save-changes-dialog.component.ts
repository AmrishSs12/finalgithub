import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export type SaveChangesDialogResult = 'cancel' | 'dontSave' | 'save';

export interface SaveChangesDialogData {
  message?: string;
  header?: string;
  cancelLabel?: string;
  dontSaveLabel?: string;
  saveLabel?: string;
}

@Component({
  selector: 'app-save-changes-dialog',
  templateUrl: './save-changes-dialog.component.html',
  styleUrls: ['./save-changes-dialog.component.scss']
})
export class SaveChangesDialogComponent implements OnInit {
  message: string = 'You have unsaved changes in this document. Do you want to save your changes before leaving?';
  cancelLabel: string = 'Cancel';
  dontSaveLabel: string = 'Exit Without Saving';
  saveLabel: string = 'Save';

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    const data = this.config.data as SaveChangesDialogData;
    if (data) {
      if (data.message) this.message = data.message;
      if (data.cancelLabel) this.cancelLabel = data.cancelLabel;
      if (data.dontSaveLabel) this.dontSaveLabel = data.dontSaveLabel;
      if (data.saveLabel) this.saveLabel = data.saveLabel;
    }
  }

  onCancel(): void {
    this.dialogRef.close('cancel' as SaveChangesDialogResult);
  }

  onDontSave(): void {
    this.dialogRef.close('dontSave' as SaveChangesDialogResult);
  }

  onSave(): void {
    this.dialogRef.close('save' as SaveChangesDialogResult);
  }
}
