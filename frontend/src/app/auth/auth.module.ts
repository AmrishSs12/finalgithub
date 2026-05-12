import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthBaseModule } from '@baseapp/auth/auth.module.base';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AuthBaseModule,
    AuthRoutingModule,
  ],
  providers: [CookieService]
})
export class AuthModule { }
