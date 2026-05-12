
import { Component, OnInit } from '@angular/core';
import { BreadcrumbBaseComponent } from '@libbase/breadcrumb-base/breadcrumb-base.component';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: '../../base/breadcrumb-base/breadcrumb-base.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent extends BreadcrumbBaseComponent implements OnInit {

  ngOnInit(): void {
    super.onInit();
  }
}
