import { Component, OnInit } from '@angular/core';
import { GcipRoleMappingListBaseComponent } from '@baseapp/rappit-admin/gcip-role-mapping/gcip-role-mapping-list/gcip-role-mapping-list.base.component';

@Component({
  selector: 'app-gcip-role-mapping-list',
  templateUrl: '../../../../../base/app/rappit-admin/gcip-role-mapping/gcip-role-mapping-list/gcip-role-mapping-list.base.component.html',
  styleUrls: ['./gcip-role-mapping-list.component.scss']
})
export class GcipRoleMappingListComponent extends GcipRoleMappingListBaseComponent implements OnInit {

  ngOnInit(): void {
    super.onInit();
  }

}
