import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RwftaskListComponent } from '@app/rwftask/rwftask/rwftask-list/rwftask-list.component';

import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { AuthGuard } from '@baseapp/auth.guard';



export const routes: Routes = [

{
     path: 'rwftasklist',
     component: RwftaskListComponent,
     canDeactivate: [ CanDeactivateGuard ],
     canActivate: [ AuthGuard ],
     data: {
     	label: "Runtime_Workflow_Tasklist",
        breadcrumb: "Runtime_Workflow_Tasklist",
        roles : [
        			"all",
]
     }
}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WftaskBaseRoutingModule
{
}
