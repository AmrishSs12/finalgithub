import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientMappingComponent } from '@app/rappit-admin/client-mapping/client-mapping.component';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { ProviderListComponent } from '@app/rappit-admin/provider-mapping/provider-list.component';
import { LoggerSettingsDetailComponent } from '@app/rappit-admin/logger-settings/logger-settings-detail/logger-settings-detail.component';
import { GcipRoleMappingListComponent } from '@app/rappit-admin/gcip-role-mapping/gcip-role-mapping-list/gcip-role-mapping-list.component';
import { GcipRoleMappingDetailComponent } from '@app/rappit-admin/gcip-role-mapping/gcip-role-mapping-detail/gcip-role-mapping-detail.component';
import { TenantDomainConfigDetailComponent } from '@app/rappit-admin/tenant-domain-config/tenant-domain-config-detail/tenant-domain-config-detail.component';
import { TenantDomainConfigListComponent } from '@app/rappit-admin/tenant-domain-config/tenant-domain-config-list/tenant-domain-config-list.component';

export const routes: Routes = [

     {
          path: 'client',
          component: ClientMappingComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "CLIENT_MAPPING",
               breadcrumb: "CLIENT_MAPPING",
               roles: [
                    "Development Administrator"
               ]
          }
     },
     {
          path: 'provider',
          component: ProviderListComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "PROVIDER_MAPPING",
               breadcrumb: "PROVIDER_MAPPING",
               roles: [
                    "Development Administrator"
               ]
          }
     },
     {
          path: 'logger-settings',
          component: LoggerSettingsDetailComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "LOGGGER_SETTINGS",
               breadcrumb: "LOGGGER_SETTINGS",
               roles: [
                    "Development Administrator"
               ]
          }
     },
     {
          path: 'gcipdetail',
          component: GcipRoleMappingDetailComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "GCI",
               breadcrumb: "GCIP_ROLE_MAPPING",
               roles: [
                    "Development Administrator"
               ]
          }
     },
     {
          path: 'gcip-role-mapping',
          component: GcipRoleMappingListComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "GCIP_ROLE_MAPPING",
               breadcrumb: "GCIP_ROLE_MAPPING",
               roles: [
                    "Development Administrator"
               ]
          }
     },
     {
          path: 'tenant-domain-config-detail',
          component: TenantDomainConfigDetailComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "Tenant Domain Configuration",
               breadcrumb: "Tenant Domain Configuration",
               roles: [
                    "Development Administrator"
               ]
          }
     },
     {
          path: 'tenant-domain-configuration',
          component: TenantDomainConfigListComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "Tenant Domain Configuration",
               breadcrumb: "Tenant Domain Configuration",
               roles: [
                    "Development Administrator"
               ]
          }
     }
];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class RappitAdminRoutingBaseModule { }
