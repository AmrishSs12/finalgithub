import { Component, OnInit } from '@angular/core';
import { WorkflowActionBarBaseComponent } from '@libbase/workflow-action-bar-base/workflow-action-bar-base.component';
@Component({
  selector: 'app-workflow-action-bar',
  templateUrl: '../../base/workflow-action-bar-base/workflow-action-bar-base.component.html',
  styleUrls: ['./workflow-action-bar.component.scss']
})
export class WorkflowActionBarComponent extends WorkflowActionBarBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}

