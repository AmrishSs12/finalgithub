import { NgModule } from "@angular/core";
import { RouterModule,Routes} from "@angular/router";
import { ForgotPasswordComponent } from "@app/auth/forgot-password/forgot-password.component";
import { LoginDetailComponent } from "@app/auth/login/login.component";
import { LogoutComponent } from "@app/auth/logout/logout.component";
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';

export const routes:Routes = [
  {
    path: 'login',
    component: LoginDetailComponent,
    data: {}
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {}
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingBaseModule {

}