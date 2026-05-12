import { Component, OnInit } from '@angular/core';
import { ImportHistoryBaseComponent } from '@baseapp/imports/import-history/import-history/import-history.base.component';

@Component({
  selector: 'app-import-history',
  templateUrl: '../../../../../base/app/imports/import-history/import-history/import-history.component.html',
  styleUrls: ['./import-history.component.scss']
})
export class ImportHistoryComponent extends ImportHistoryBaseComponent implements OnInit {

  ngOnInit(): void {
    super.onInit()
  }

  ngAfterViewInit(): void {
    super.onAfterViewInit()
  }

}
