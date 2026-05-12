import { Component, OnInit } from '@angular/core';
import { SoftDeleteFilterBaseComponent } from '@libbase/soft-delete-filter-base/soft-delete-filter-base.component';

@Component({
  selector: 'app-soft-delete-filter',
  templateUrl: '../../base/soft-delete-filter-base/soft-delete-filter-base.component.html',
  styleUrls: ['./soft-delete-filter.component.scss']
})
export class SoftDeleteFilterComponent extends SoftDeleteFilterBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}

