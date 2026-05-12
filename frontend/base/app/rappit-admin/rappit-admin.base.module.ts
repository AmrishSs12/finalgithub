import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { RappitAdminRoutingBaseModule } from './rappit-admin-routing.base.module';
import { ClientMappingComponent } from '@app/rappit-admin/client-mapping/client-mapping.component';
import { DataTablesModule } from 'angular-datatables';
import { ClientDetailComponent } from './client-mapping/client-detail/client-detail.component';
import { ProviderDetailComponent } from './provider-mapping/provider-detail/provider-detail.component';
import { ProviderListBaseComponent } from './provider-mapping/provider-list/provider-list.base.component';
import { ProviderListComponent } from '@app/rappit-admin/provider-mapping/provider-list.component';
import { LoggerSettingsDetailComponent } from '@app/rappit-admin/logger-settings/logger-settings-detail/logger-settings-detail.component';
import { GcipRoleMappingDetailComponent } from '@app/rappit-admin/gcip-role-mapping/gcip-role-mapping-detail/gcip-role-mapping-detail.component';
import { GcipRoleMappingListComponent } from '@app/rappit-admin/gcip-role-mapping/gcip-role-mapping-list/gcip-role-mapping-list.component';
import { TenantDomainConfigListComponent } from '@app/rappit-admin/tenant-domain-config/tenant-domain-config-list/tenant-domain-config-list.component';
import { TenantDomainConfigDetailComponent } from '@app/rappit-admin/tenant-domain-config/tenant-domain-config-detail/tenant-domain-config-detail.component';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';

@NgModule({
  declarations: [
    ClientMappingComponent,
    ClientDetailComponent,
    ProviderDetailComponent,
    ProviderListComponent,
    LoggerSettingsDetailComponent,
    GcipRoleMappingDetailComponent,
    GcipRoleMappingListComponent,
    TenantDomainConfigListComponent,
    TenantDomainConfigDetailComponent
  ],
  imports: [
    SharedModule,
    WidgetsBaseModule,
    RappitAdminRoutingBaseModule,
    DataTablesModule
  ],
  exports: [
    SharedModule,
    WidgetsBaseModule,
    ClientMappingComponent,
    ClientDetailComponent,
    ProviderDetailComponent,
    ProviderListComponent,
    LoggerSettingsDetailComponent,
    GcipRoleMappingDetailComponent,
    GcipRoleMappingListComponent,
    TenantDomainConfigListComponent,
    TenantDomainConfigDetailComponent
  ],
  providers: [
    CanDeactivateGuard
  ]

})
export class RappitAdminBaseModule { }
