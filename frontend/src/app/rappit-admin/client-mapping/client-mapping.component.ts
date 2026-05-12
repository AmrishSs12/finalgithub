import { Component, OnInit } from '@angular/core';
import { ClientMappingBaseComponent } from '@baseapp/rappit-admin/client-mapping/client-mapping/client-mapping.base.component';

@Component({
  selector: 'app-client-mapping',
  templateUrl: '../../../../base/app/rappit-admin/client-mapping/client-mapping/client-mapping.component.html',
  styleUrls: ['./client-mapping.component.scss']
})


// templateUrl: '../../../../base/app/exports/export-history/export-history/export-history.base.component.html',

export class ClientMappingComponent extends ClientMappingBaseComponent implements OnInit {

  ngOnInit(): void {
    super.onInit()
  }

  ngAfterViewInit(): void {
    super.onAfterViewInit()
  }

}


