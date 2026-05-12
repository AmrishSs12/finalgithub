import { Component, OnInit } from '@angular/core';
import { GridBaseComponent } from '@libbase/grid-base/grid-base.component';
@Component({
  selector: 'app-grid',
  templateUrl: '../../base/grid-base/grid-base.component.html',
  styleUrls: ['./grid.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class GridComponent extends GridBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }

}
