import { Component, OnInit } from '@angular/core';
import { WorkflowSimulatorBaseComponent } from '@libbase/workflow-simulator-base/workflow-simulator-base.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-workflow-simulator',
  templateUrl: '../../base/workflow-simulator-base/workflow-simulator-base.component.html',
  styleUrls: ['./workflow-simulator.component.scss'],
  providers: [DialogService]
})
export class WorkflowSimulatorComponent extends WorkflowSimulatorBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}
