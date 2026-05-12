import { Component } from '@angular/core';
import { ExportHistoryBaseComponent } from '@baseapp/exports/export-history/export-history/export-history.base.component';
@Component({
  selector: 'app-export-history',
  templateUrl: '../../../../../base/app/exports/export-history/export-history/export-history.base.component.html',
  styleUrls: ['./export-history.component.scss']
})
export class ExportHistoryComponent extends ExportHistoryBaseComponent {


  ngOnInit(): void {
    super.onInit()
  }

  ngAfterViewInit(): void {
    super.onAfterViewInit()
  }

}
