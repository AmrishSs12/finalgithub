import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppUtilService } from '@app/app.util.service';
import { ForgotPasswordComponentBase } from "@baseapp/auth/forgot-password/forgot-password.component.base";
import { LoginComponentBase } from "@baseapp/auth/login/login.component.base";
import { MessageService } from "primeng/api";
import { AuthService } from "../auth.service";


@Component({
  selector: 'app-forgot-password',
  templateUrl: '../../../../base/app/auth/forgot-password/forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService]
})
export class ForgotPasswordComponent extends ForgotPasswordComponentBase implements OnInit {

  @ViewChild('submitBtn') private submitBtn: any;

  /** Please override/inject the dependencies to refer here, 
   * Example
      override public router = inject(Router); **/



  ngOnInit(): void {
    super.onInit();
  }

  override resetPassword(): void {
    this.submitBtn.nativeElement.click();
    super.resetPassword();
  }

}
