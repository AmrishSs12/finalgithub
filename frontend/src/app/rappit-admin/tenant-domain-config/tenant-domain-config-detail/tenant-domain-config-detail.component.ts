import { Component } from "@angular/core";
import { TenantDomainConfigDetailBaseComponent } from "@baseapp/rappit-admin/tenant-domain-config/tenant-domain-config-detail/tenant-domain-config-detail.base.component";

@Component({
  selector: 'app-tenant-domain-config-detail',
  templateUrl: '../../../../../base/app/rappit-admin/tenant-domain-config/tenant-domain-config-detail/tenant-domain-config-detail.base.component.html',
  styleUrls: ['../../../../../base/app/rappit-admin/tenant-domain-config/tenant-domain-config-detail/tenant-domain-config-detail.base.component.scss']
})
export class TenantDomainConfigDetailComponent  extends TenantDomainConfigDetailBaseComponent{
  
  ngOnInit(): void {
    super.onInit();
  }
}