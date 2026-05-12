import { Directive, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthBaseConstants } from '../auth.base.constants';
import { Router } from '@angular/router';
import { AppConstants } from '@app/app-constants';
import { MessageService } from 'primeng/api';
import { AuthBaseService } from '../auth.base.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { AppGlobalService } from '@baseapp/app-global.service';
import { has } from 'lodash';

@Directive({})
export class signInBaseComponent {

  public authBaseService = inject(AuthBaseService);
  public router = inject(Router);
  private fb = inject(FormBuilder);
  public titleService = inject(Title);
  public messageService = inject(MessageService);
  public translateService = inject(TranslateService);
  public appGlobalService = inject(AppGlobalService);

  signinForm!: FormGroup;
  currentStyles: any;
  emailSent = false;
  isContinueDisabled = false;
  userEmail = '';
  showEmailInstructions = false;
  appTitle: string = 'Login page';
  emailRegex: RegExp = AppConstants.emailRegexForAuthentication;

  onSubmit() {
    this.isContinueDisabled = true;
    if (this.signinForm.value.email && this.emailRegex.test(this.signinForm.value.email)) {
      this.userEmail = this.signinForm.value.email;
      this.authBaseService.fetchTenantInfo({ email: this.userEmail }).subscribe((res: any) => {
        if (res?.providersInfo && res?.providersInfo.length > 0 && has(res, 'tenantId')) {
          this.isContinueDisabled = false;
          this.appGlobalService.write('tenantId', res.tenantId);
          this.appGlobalService.write('providersInfo', res.providersInfo);
          this.router.navigateByUrl('/multi-tenant-login');
        } else {
          if(res.providersInfo.length === 0){
            this.showMessage({ severity: 'error', summary: 'Error', detail: 'No providers are configured for this tenant.', life: 5000 });
          }
          this.isContinueDisabled = false;
          this.signinForm.reset();
        }
      }, (error: any) => {
        this.isContinueDisabled = false;
        this.signinForm.reset();
      });
      // localStorage.setItem('userEmail', this.userEmail);
      // this.authBaseService.sendEmailVerification({ email: this.userEmail }).subscribe((res: any) => {
      //   this.emailSent = true;
      //   this.isContinueDisabled = false;
      // }, (error: any) => {
      //   this.showMessage({ severity: 'error', summary: 'Error', detail: 'Failed to send email. Please try again', life: 5000 });
      //   localStorage.removeItem('userEmail');
      //   this.emailSent = false;
      //   this.signinForm.reset();
      //   this.isContinueDisabled = false;
      // });
    } else {
      this.showMessage({ severity: 'error', summary: 'Error', detail: 'Please enter a valid email address.', life: 5000 });
      this.isContinueDisabled = false;
    }
  }

  signInWithProject() {
    this.router.navigate(['/google-identity-login']);
  }

  goBack() {
    this.emailSent = false;
    this.showEmailInstructions = false;
    this.signinForm.reset();
  }

  openInstructions() {
    this.showEmailInstructions = true;
  }


  showMessage(config: any) {
    this.messageService.clear();
    this.messageService.add(config);
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
    this.translateService.get(this.titleService.getTitle()).subscribe((translatedTitle: string) => {
      this.appTitle = translatedTitle;
    });
  }


  onInit() {
    this.authBaseService.isUserLoggedIn();
    this.setTranslationForLabels();
    this.appTitle = this.translateService.instant(this.titleService.getTitle());
    this.signinForm = this.fb.group({
      email: ['', [Validators.required]]
    });
    this.currentStyles = this.convertStyle(AuthBaseConstants.loginStylesMap['dev']);
  }

}
