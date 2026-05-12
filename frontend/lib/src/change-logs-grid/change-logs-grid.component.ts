import { Component, OnInit } from '@angular/core';
import { ChangeLogsGridBaseComponent } from '@libbase/change-logs-grid-base/change-logs-grid-base.component';


@Component({
  selector: 'change-logs-grid',
  templateUrl: '../../base/change-logs-grid-base/change-logs-grid-base.component.html',
  styleUrls: ['./change-logs-grid.component.scss'],

})
export class ChangeLogsGridComponent extends ChangeLogsGridBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}
