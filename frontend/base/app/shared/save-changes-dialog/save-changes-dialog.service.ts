import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { SaveChangesDialogComponent, SaveChangesDialogData, SaveChangesDialogResult } from './save-changes-dialog.component';
import { TranslateService } from '@ngx-translate/core';

// Re-export the type for external use
export { SaveChangesDialogResult } from './save-changes-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class SaveChangesDialogService {

  constructor(
    private dialogService: DialogService,
    private translateService: TranslateService
  ) {}

  /**
   * Opens a save changes confirmation dialog with three options: Cancel, Don't Save, and Save.
   *
   * @param data Optional configuration for the dialog (message, button labels, header)
   * @returns Observable that emits the user's choice: 'cancel', 'dontSave', or 'save'
   */
  confirm(data?: SaveChangesDialogData): Observable<SaveChangesDialogResult> {
    return new Observable<SaveChangesDialogResult>((observer) => {
      const dialogData: SaveChangesDialogData = {
        message: data?.message || this.translateService.instant('You_have_unsaved_changes_in_this_document_DOT_Do_you_want_to_save_your_changes_before_leaving_QUESTION'),
        header: data?.header || this.translateService.instant('Unsaved_Changes'),
        cancelLabel: data?.cancelLabel || this.translateService.instant('Cancel'),
        dontSaveLabel: data?.dontSaveLabel || this.translateService.instant('Exit_Without_Saving'),
        saveLabel: data?.saveLabel || this.translateService.instant('Save')
      };

      const ref = this.dialogService.open(SaveChangesDialogComponent, {
        header: dialogData.header,
        width: '450px',
        contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
        baseZIndex: 10000,
        closable: true,
        closeOnEscape: true,
        dismissableMask: true,
        styleClass: 'save-changes-dialog',
        data: dialogData
      });

      ref.onClose.subscribe((result: SaveChangesDialogResult | undefined) => {
        // If dialog is closed without a selection (e.g., clicking X or pressing Escape), treat as cancel
        observer.next(result || 'cancel');
        observer.complete();
      });
    });
  }
}
