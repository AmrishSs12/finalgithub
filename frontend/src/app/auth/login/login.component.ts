import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppUtilService } from '@app/app.util.service';
import { LoginComponentBase } from "@baseapp/auth/login/login.component.base";
import { MessageService } from "primeng/api";
import { AuthService } from "../auth.service";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: '../../../../base/app/auth/login/login.component.html',
  styleUrls: ['../../../../base/app/auth/login/login.component.scss'],
  providers: [MessageService]
})
export class LoginDetailComponent extends LoginComponentBase implements OnInit {

  @ViewChild('submitBtn') private submitBtn: any;

  /** Please override/inject the dependencies to refer here, 
   * Example
      override public router = inject(Router); **/

  ngOnInit(): void {
    super.onInit();
  }

  // override authenticate (): void {
  //   this.submitBtn.nativeElement.click();
  //   super.authenticate();
  // }

}
