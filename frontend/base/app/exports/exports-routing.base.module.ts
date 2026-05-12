import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportHistoryComponent } from '@app/exports/export-history/export-history/export-history.component';
import { ExportPageComponent } from '@app/exports/export-page/export-page.component';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';


export const routes: Routes = [
  {
    path: 'exports',
    component: ExportPageComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      label: "Exports page",
      breadcrumb: "IP",
      roles: [
        "Development Administrator"
      ]
    }
  },
  {
    path: 'exportspage',
    component: ExportHistoryComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      label: "Exports Page",
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
export class ExportsRoutingModule { }
