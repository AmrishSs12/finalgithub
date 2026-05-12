import { Component, OnInit } from '@angular/core';
import { ChangeLogsBaseComponent } from '@libbase/change-logs-base/change-logs-base.component';

@Component({
  selector: 'app-change-logs',
  templateUrl: '../../base/change-logs-base/change-logs-base.component.html',
  styleUrls: ['./change-logs.component.scss']
})
export class ChangeLogsComponent extends ChangeLogsBaseComponent implements OnInit {
  ngOnInit() {
    super.onInit();
  }
}
