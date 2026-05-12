import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportHistoryComponent } from '@app/imports/import-history/import-history/import-history.component';
import { ImportPageComponent } from '@app/imports/import-page/import-page.component';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';

export const routes: Routes = [
  {
    path: 'import',
    component: ImportPageComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      label: "Imports page",
      breadcrumb: "IP",
      roles: [
        "Development Administrator"
      ]
    }
  },
  {
    path: 'importspage',
    component: ImportHistoryComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      label: "Imports Page",
      breadcrumb: "IH",
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
export class ImportsRoutingBaseModule { }
