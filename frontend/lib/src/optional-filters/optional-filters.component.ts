import { Component, OnInit } from '@angular/core';
import { OptionalFiltersBaseComponent } from '@libbase/optional-filters-base/optional-filters-base.component';


@Component({
  selector: 'app-optional-filters',
  templateUrl: '../../base/optional-filters-base/optional-filters-base.component.html',
  styleUrls: ['./optional-filters.component.scss']
})
export class OptionalFiltersComponent extends OptionalFiltersBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}
