import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes } from '@baseapp/app-routing.base.module';
/**
 * Extend routes here 
 * Example, 
 * 
 *  routes.push({
 *    path: 'projectsublist',
 *    component: ProjectsSubListComponent,
 *    data: {
 *       label: "PROJECTS_SUB_LIST",
 *       expectedRoles: ["business_owner"],
 *      breadcrumb: "PROJECTS_SUB_LIST",
 *     }
 *  })
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
