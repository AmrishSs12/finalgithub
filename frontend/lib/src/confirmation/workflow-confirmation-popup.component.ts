
import { Component, OnInit } from '@angular/core';
import { WorkflowConfirmationPopupBaseComponent } from '@libbase/confirmation-base/workflow-confirmation-popup-base.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-workflow-confirmation-popup',
  templateUrl: '../../base/confirmation-base/workflow-confirmation-popup-base.html',
  styles: [],
  providers: [MessageService]
})

export class WorkflowConfirmationPopupComponent extends WorkflowConfirmationPopupBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}
