import { Component, OnChanges, OnInit } from '@angular/core';
import { GcipRoleMappingDetailBaseComponent } from '@baseapp/rappit-admin/gcip-role-mapping/gcip-role-mapping-detail/gcip-role-mapping-detail.base.component';

@Component({
  selector: 'app-gcip-role-mapping',
  templateUrl: '../../../../../base/app/rappit-admin/gcip-role-mapping/gcip-role-mapping-detail/gcip-role-mapping-detail.base.component.html',
  styleUrls: ['../../../../../base/app/rappit-admin/gcip-role-mapping/gcip-role-mapping-detail/gcip-role-mapping-detail.base.component.scss']
})
export class GcipRoleMappingDetailComponent extends GcipRoleMappingDetailBaseComponent implements OnInit, OnChanges {

  ngOnInit(): void {
    super.onInit();
  }

  ngOnChanges(changes: any) {
    super.onChanges(changes);
  }

}
