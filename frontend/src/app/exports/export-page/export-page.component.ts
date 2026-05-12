import { Component } from '@angular/core';
import { ExportPageBaseComponent } from '@baseapp/exports/export-page/export-page.base.component';

@Component({
  selector: 'app-export-page',
  templateUrl: '../../../../base/app/exports/export-page/export-page.base.component.html',
  styleUrls: ['./export-page.component.scss']
})
export class ExportPageComponent extends ExportPageBaseComponent {

  ngOnInit(): void {
    super.onInit()
  }

  ngAfterViewInit(): void {
    super.onAfterViewInit()
  }

}
