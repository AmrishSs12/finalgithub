import { Component, OnInit } from '@angular/core';
import { WorkflowHistoryBaseComponent } from '@libbase/workflow-history-base/workflow-history-base.component';

@Component({
  selector: 'app-workflow-history',
  templateUrl: '../../base/workflow-history-base/workflow-history-base.component.html',
  styleUrls: ['./workflow-history.component.scss']
})
export class WorkflowHistoryComponent extends WorkflowHistoryBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}
