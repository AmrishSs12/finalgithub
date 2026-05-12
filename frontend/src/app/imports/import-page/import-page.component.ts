import { Component, OnInit } from '@angular/core';
import { ImportPageBaseComponent } from '@baseapp/imports/import-page/import-page.base.component';

@Component({
  selector: 'app-import-page',
  templateUrl: '../../../../base/app/imports/import-page/import-page.component.html',
  styleUrls: ['./import-page.component.scss']
})
export class ImportPageComponent extends ImportPageBaseComponent {


  ngOnInit(): void {
    super.onInit();
  }

  ngAfterViewInit(): void {
    this.onAfterViewInit()
  }

}
