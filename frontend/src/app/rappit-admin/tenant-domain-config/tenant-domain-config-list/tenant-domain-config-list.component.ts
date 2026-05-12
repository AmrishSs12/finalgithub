import { Component } from '@angular/core';
import { TenantDomainConfigListBaseComponent } from '@baseapp/rappit-admin/tenant-domain-config/tenant-domain-config-list/tenant-domain-config-list.base.component';


@Component({
  selector: 'app-tenant-domain-config-list',
  templateUrl: '../../../../../base/app/rappit-admin/tenant-domain-config/tenant-domain-config-list/tenant-domain-config-list.base.component.html',
  styleUrls: ['../../../../../base/app/rappit-admin/tenant-domain-config/tenant-domain-config-list/tenant-domain-config-list.base.component.scss']
})
export class TenantDomainConfigListComponent extends TenantDomainConfigListBaseComponent{

  ngOnInit(): void {
    super.onInit();
  }
}
