import { Component, OnInit, SimpleChange } from '@angular/core';
import { WorkflowStatusBaseComponent } from '@libbase/workflow-status-base/workflow-status-base.component';

@Component({
  selector: 'app-workflow-status',
  templateUrl: '../../base/workflow-status-base/workflow-status-base.component.html',
  styleUrls: ['./workflow-status.component.scss']
})
export class WorkflowStatusComponent extends WorkflowStatusBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }

  ngOnChanges(changes: SimpleChange) {
    super.onChanges(changes);
  }
}

