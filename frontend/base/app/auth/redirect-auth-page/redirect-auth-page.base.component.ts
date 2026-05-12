import { inject, Directive, Inject } from '@angular/core';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { AuthBaseService } from '../auth.base.service';
import { AppGlobalService } from '@baseapp/app-global.service';
import { AppLoaderService } from '@baseapp/app-loader.service';
import { MessageService } from "primeng/api";
import { AuthBaseConstants } from '../auth.base.constants';
import { Title } from '@angular/platform-browser';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { has } from 'lodash';
import { DOCUMENT } from '@angular/common'; 


@Directive({})
export class RedirectAuthPageBaseComponent {

  currentStyles: any;
  config: any;
  isFnFocused: boolean = false;
  isLnFocused: boolean = false;
  isFnDirty: boolean = false;
  isLnDirty: boolean = false;
  isResetPassword: boolean = true;
  loggingIn: boolean = false;
  appTitle: string = 'Enter the details';
  redirectUrl: string = '';
  isSignUp: boolean = false;
  formDetailGroup: UntypedFormGroup = new UntypedFormGroup({
    firstName: new UntypedFormControl('', [Validators.required, Validators.maxLength(50)]),
    lastName: new UntypedFormControl('', [Validators.required, Validators.maxLength(50)])
  });

  public router = inject(Router);
  public route = inject(ActivatedRoute);
  public afAuth = inject(AngularFireAuth);
  public http = inject(HttpClient);
  public authBaseService = inject(AuthBaseService);
  public appGlobalService = inject(AppGlobalService);
  public loader = inject(AppLoaderService);
  public messageService = inject(MessageService);
  public titleService = inject(Title);
  public translateService = inject(TranslateService);
  public appLoaderService = inject(AppLoaderService);

  constructor(@Inject(DOCUMENT) private document: Document) { }
  confirmSignInWithEmailLink() {
    this.loader.show();
    const app = initializeApp(this.config?.firebaseConfig);
    const auth = getAuth(app);
    let tenantId = localStorage.getItem('tenantId');
    if(this.config?.multiTenantProvison && tenantId){
      auth.tenantId = tenantId;
    }
    this.appGlobalService.write('firebaseapp', app);
    const email = window.localStorage.getItem('emailForSignIn');
    const redirectLink = window.location.href;

    if (email && isSignInWithEmailLink(auth, redirectLink)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(async (result: any) => {
          console.log('User signed in:', result.user);
          localStorage.removeItem('tenantId');
          try {
            const user = result?.user;
            const params = {
              email: user?.email,
              token: await user?.getIdToken(),
              passwordless: true
            };
            this.authBaseService.authenticateGci(params).subscribe((res: any) => {
              if (res.isSignUp) {
                this.isSignUp = true;
                this.dirtyCheck();
                this.redirectUrl = res.redirectUrl;
                localStorage.removeItem("emailForSignIn");
              } else {
                localStorage.removeItem("emailForSignIn");
                this.router.navigateByUrl(res.redirectUrl);
                this.loader.hide();
                console.log(res);
              }
            }, (error: any) => {
              localStorage.removeItem("emailForSignIn");
              this.redirectToLoginPage();
              console.log(error);
            }
            );
          } catch (error) {
            localStorage.removeItem("emailForSignIn");
            console.log("Sign-in to the application failed, Please try again:", error);
            this.redirectToLoginPage();
            this.showMessage({ severity: 'error', summary: 'Error', detail: 'Sign-in to the application failed, Please try again', life: 5000 });
          }
        })
        .catch((error: any) => {
          localStorage.removeItem("emailForSignIn");
          localStorage.removeItem('tenantId');
          console.log('Sign-in failed with the email link. Please try again:', error);
          this.redirectToLoginPage();
          this.showMessage({ severity: 'error', summary: 'Error', detail: 'Sign-in failed with the email link. Please try again', life: 5000 });
        });
    } else {
      localStorage.removeItem("emailForSignIn");
      localStorage.removeItem('tenantId');
      this.showMessage({ severity: 'error', summary: 'Error', detail: 'The email link is invalid or has expired, Please try again', life: 5000 });
      this.redirectToLoginPage();
    }
  }

  onSubmit() {
    if (this.formDetailGroup.invalid) {
      const fieldsToCheck = ['firstName', 'lastName'];
      fieldsToCheck.forEach((field) => {
        const control = this.formDetailGroup.get(field);
        const errors = control?.errors;
        if (errors) {
          if (errors['required']) {
            this.showMessage({ severity: 'error', summary: 'Error', detail: `${field == 'firstName' ? 'First name' : 'Last name'} is required`, life: 5000 });
          }
          if (errors['maxlength']) {
            this.showMessage({ severity: 'error', summary: 'Error', detail: `${field == 'firstName' ? 'First name' : 'Last name'} exceeds maximum length`, life: 5000 });
          }
        }
      });
    } else {
      if (this.loggingIn) {
        return;
      }
      this.loggingIn = true;
      const params = {
        firstName: this.formDetailGroup.get('firstName')?.getRawValue(),
        lastName: this.formDetailGroup.get('lastName')?.getRawValue()
      };
      this.authBaseService.updateUserDetails(params).subscribe((res: any) => {
        this.isSignUp = false;
        this.loggingIn = false;
        this.router.navigateByUrl(this.redirectUrl);
        this.loader.hide();
        console.log(res);
      }, (error: any) => {
        this.loggingIn = false;
        this.showMessage({ severity: 'error', summary: 'Error', detail: error, life: 5000 });
        this.redirectToLoginPage();
        console.log(error);
      }
      );
    }
  }

  redirectToLoginPage() {
    this.router.navigateByUrl('/google-identity-login');
  }

  dirtyCheck() {
    this.formDetailGroup.get('firstName')?.valueChanges.subscribe((value: any) => {
      this.isFnDirty = !!value && value.trim().length > 0;
    });

    this.formDetailGroup.get('lastName')?.valueChanges.subscribe((value: any) => {
      this.isLnDirty = !!value && value.trim().length > 0;
    });
  }

  showMessage(config: any) {
    this.messageService.clear();
    this.messageService.add(config);
  }

  redirectToFirebaseResetPage(authDomain: string, oobCode: string, apiKey: string): void {
    const resetPasswordUrl = new URL(`https://${authDomain}/__/auth/action`);
    resetPasswordUrl.searchParams.set('mode', 'resetPassword');
    resetPasswordUrl.searchParams.set('oobCode', oobCode);
    resetPasswordUrl.searchParams.set('apiKey', apiKey);
    resetPasswordUrl.searchParams.set('lang', 'en');
    this.loader.hide();
    this.document.location.href = resetPasswordUrl.toString();
  }

  getEmailFromSignInLink(link: string): string {
    const url = new URL(link);
    return url.searchParams.get('email') || '';
  }

  convertStyle(style: any) {
    const converted: any = {};
    for (const key in style) {
      switch (key) {
        case 'backgroundColor':
          converted['background-color'] = style[key];
          break;
        case 'backgroundImage':
          converted['background-image'] = `url("../../../assets/images/${style[key]}")`;
          break;
        default:
          converted[key] = style[key];
      }
    }

    return converted;
  }

  setTranslationForLabels() {
    this.translateService.onLangChange.subscribe(() => {
      this.subscribeToTranslation();
    });
  }


  subscribeToTranslation() {
    this.translateService.get(this.titleService.getTitle()).subscribe((translation: string) => {
      this.appTitle = translation;
    });
  }

  onInit(): void {
    this.setTranslationForLabels();
    this.appTitle = this.translateService.instant(this.titleService.getTitle());
    this.config = this.appGlobalService.get('firebaseConfig');
    this.currentStyles = this.convertStyle(AuthBaseConstants.loginStylesMap[this.config.env]);

    this.appLoaderService.show();
    this.route.queryParams.subscribe((params: any) => {
      const oobCode = params['oobCode'];
      const apiKey = params['apiKey'];
      const authDomain = this.config?.firebaseConfig?.authDomain;
      const continueUrl = params['continueUrl'];
      let hasOtpLogin;

      if (continueUrl) {
        const decodedUrl = decodeURIComponent(continueUrl);
        hasOtpLogin = decodedUrl.includes('otpLogin');
      }

      if (oobCode) {
        if (params?.['mode'] === 'resetPassword') {
          this.loader.show();
          this.isResetPassword = true;
          this.redirectToFirebaseResetPage(authDomain, oobCode, apiKey);
        } else if (hasOtpLogin) {
          let userEmail = localStorage.getItem('userEmail');
          this.authBaseService.fetchTenantInfo({ email: userEmail, oobCode: oobCode }).subscribe((res: any) => {
            localStorage.removeItem('userEmail');
            if (res?.providerInfo && res?.providerInfo.length > 0 && has(res, 'tenantId')) {
              this.appGlobalService.write('tenantId', res.tenantId);
              this.appGlobalService.write('providerInfo', res.providerInfo);
              this.router.navigateByUrl('/multi-tenant-login');
            } else {
              this.showMessage({ severity: 'error', summary: 'Error', detail: 'No providers found for the tenant', life: 3000 });
              this.router.navigateByUrl('/sign-in');
            }
          }, (error: any) => {
            localStorage.removeItem('userEmail');
            this.showMessage({ severity: 'error', summary: 'Error', detail: 'Failed to fetch tenant information', life: 3000 });
            this.router.navigateByUrl('/sign-in');
          });
        } else {
          this.confirmSignInWithEmailLink();
          this.isResetPassword = false;
        }
      } else {
        console.error('Invalid URL or missing oobCode');
        localStorage.removeItem('userEmail');
        this.showMessage({ severity: 'error', summary: 'Error', detail: 'Invalid URL or missing oobCode', life: 5000 });
        this.redirectToLoginPage();
      }
    });
    this.isResetPassword = true;
    this.isSignUp = false;
  }

  onDestroy() { }

}
