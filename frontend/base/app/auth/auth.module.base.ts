import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TranslateModule } from '@ngx-translate/core';
import { LoginDetailComponent } from '@app/auth/login/login.component';
import { ForgotPasswordComponent } from '@app/auth/forgot-password/forgot-password.component';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { LogoutComponent } from '@app/auth/logout/logout.component';
import { GoogleCloudIdentityComponent } from '@app/auth/google-cloud-identity/google-cloud-identity.component';
import { RedirectAuthPageComponent } from '@app/auth/redirect-auth-page/redirect-auth-page.component';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FirebaseUIModule } from 'firebaseui-angular';
import { AppGlobalService } from '@baseapp/app-global.service';
import { signInComponent } from '@app/auth/sign-in/sign-in.component';
import { MultiTenantLoginComponent } from '@app/auth/multi-tenant-login/multi-tenant-login.component';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ButtonModule } from 'primeng/button';

export function initializeApp(appGlobalService: AppGlobalService) {
  return appGlobalService.get('firebaseConfig')
}
@NgModule({
  declarations: [
    LoginDetailComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    GoogleCloudIdentityComponent,
    RedirectAuthPageComponent,
    MultiTenantLoginComponent,
    signInComponent
  ],
  providers: [CanDeactivateGuard, MessageService, AppGlobalService,
    {
      provide: FIREBASE_OPTIONS,
      useFactory: initializeApp,
      deps: [AppGlobalService]
    }
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,

    MessagesModule,
    MessageModule,
    CheckboxModule,
    AngularFireModule,
    AngularFireAuthModule,
    FirebaseUIModule,
    ProgressSpinnerModule,
    ButtonModule
  ],
  exports: [
    FormsModule,
    MessagesModule,
    MessageModule,
    CheckboxModule,
    ProgressSpinnerModule,
    ButtonModule
  ]
})
export class AuthBaseModule { }
