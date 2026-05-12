import { Component, OnInit } from '@angular/core';
import { ProviderListBaseComponent } from '@baseapp/rappit-admin/provider-mapping/provider-list/provider-list.base.component';

@Component({
  selector: 'app-provider-list',
  templateUrl: '../../../../base/app/rappit-admin/provider-mapping/provider-list/provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})


export class ProviderListComponent extends ProviderListBaseComponent implements OnInit {

  ngOnInit(): void {
    super.onInit()
  }

  ngAfterViewInit(): void {
    super.onAfterViewInit()
  }

}


