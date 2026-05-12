import { inject, Directive, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "@app/auth/auth.service";
import { AppUtilService } from '@app/app.util.service';
import { MessageService } from "primeng/api";
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT } from '@angular/common'; 

@Directive({})
export class LoginComponentBase {

    public authService = inject(AuthService);
    public messageService = inject(MessageService);
    public appUtilService = inject(AppUtilService);
    public router = inject(Router);
    constructor(@Inject(DOCUMENT) private document: Document) {}
    onInit() {
        this.initForm();
    }

    initForm() {

    }

    authenticate() {
        this.authService.isAuthenticating = true;

        this.document.location.href = "/oauth2/authorization/google";
        // this.authService.getGoogleAuthorized().subscribe((res: any) => {
        //     this.showMessage({ severity: 'success', summary: '', detail: 'User authenticated Successfully' });
        // })
    }

    showMessage(config: any) {
        this.messageService.clear();
        this.messageService.add(config);
    }

    loadForgotPasswordPage() {
        this.router.navigateByUrl('auth/forgot-password')
    }

}
