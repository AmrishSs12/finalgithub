import { Component, OnInit } from '@angular/core';
import { ImportErrorDetailsBaseComponent } from '@baseapp/imports/import-error-details/import-error-details.base.component';

@Component({
  selector: 'app-import-error-details',
  templateUrl: '../../../../base/app/imports/import-error-details/import-error-details.base.component.html',
  styleUrls: ['./import-error-details.component.scss']
})
export class ImportErrorDetailsComponent extends ImportErrorDetailsBaseComponent {

  ngOnInit(): void {
    super.onInit();
  }

  ngAfterViewInit(): void {
    this.onAfterViewInit()
  }

}
