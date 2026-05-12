import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';
import { RwftaskListComponent } from '@app/rwftask/rwftask/rwftask-list/rwftask-list.component';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [
    RwftaskListComponent
  ],
  imports: [
    SharedModule,
    WidgetsBaseModule,
    OverlayPanelModule
  ],
  exports: [
    SharedModule,
	WidgetsBaseModule,
    RwftaskListComponent,
    OverlayPanelModule
  ],
  providers: [
  DynamicDialogConfig,
  DynamicDialogRef,
	CanDeactivateGuard
  ],
  
})
export class RwftaskBaseModule { }