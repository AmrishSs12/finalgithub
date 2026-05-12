import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutboxListComponent } from '@app/outbox/outbox-list/outbox-list.component';

const routes: Routes = [
  {
    path: '',
    component: OutboxListComponent
  },
  {
    path: 'list',
    component: OutboxListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutboxRoutingBaseModule { }
