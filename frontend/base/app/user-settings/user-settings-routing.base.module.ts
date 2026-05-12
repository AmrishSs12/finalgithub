import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSettingsComponent } from '@app/user-settings/user-settings/user-settings.component';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';

export const routes: Routes = [

     {
          path: 'usersettings',
          component: UserSettingsComponent,
          canDeactivate: [CanDeactivateGuard],
          data: {
               label: "USER_SETTINGS",
               breadcrumb: "USER_SETTINGS",
               roles: [
                    "Development Administrator"
               ]
          }
     },

];

@NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
})
export class UserSettingsBaseRoutingModule {
}
