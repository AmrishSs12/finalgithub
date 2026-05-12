import { inject, Directive } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthBaseService } from '../auth.base.service';
import { AppBaseService } from '@baseapp/app.base.service';
import { AppConstants } from '@app/app-constants';
import { AuthBaseConstants } from '../auth.base.constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { Title } from '@angular/platform-browser';
import { MessageService } from "primeng/api";
import { TranslateService } from '@ngx-translate/core';

@Directive({})
export class MultiTenantLoginBaseComponent {

  public router = inject(Router);
  public afAuth = inject(AngularFireAuth);
  public authBaseService = inject(AuthBaseService);
  public appBaseService = inject(AppBaseService);
  public appGlobalService = inject(AppGlobalService);
  public titleService = inject(Title);
  public messageService = inject(MessageService);
  public translateService = inject(TranslateService);

  ui!: any;
  app!: any;
  config!: any;
  currentStyles: any;
  appTitle: string = 'Login page';
  providersInfo: any = [];

  emailLogin: any = {
    'passwordless': {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      emailLinkSignIn: {
        url: `${window.location.origin}/#/home`, // Should match what’s in Firebase Console
        handleCodeInApp: true
      },
    },
    'passwordBased': {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
    }
  }
  providers: any = {
    google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    facebook: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    github: firebase.auth.GithubAuthProvider.PROVIDER_ID,
    twitter: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    microsoft: { provider: 'microsoft.com', providerName: 'Microsoft' }
  }
  ssoProtocolProviders: any = {
    oidc: {
      provider: 'oidc',
      providerName: "OIDC",
      customParameters: {
        scopes: 'openid email profile'
      }
    },
    saml: {
      provider: 'saml',
      providerName: "SAML",
    }
  }

  data: any;

  getUiConfig(config: any): any {
    let uiConfig: any = {
      signInOptions: [],
      signInFlow: 'popup',
      signInSuccessUrl: null,
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      callbacks: {
        signInSuccessWithAuthResult: async (authResult: any, redirectUrl: any) => {
          const user = authResult?.user;
          const params = {
            email: this.decodeEmail(authResult),
            token: await user?.getIdToken(),
            passwordless: false
          };
          setTimeout(() => {
            const infoBar = document.querySelector('.firebaseui-info-bar.firebaseui-id-info-bar');
            if (infoBar instanceof HTMLElement) {
              infoBar.style.display = 'none';
            }
          }, 1);
          this.authBaseService.authenticateGci(params).subscribe((res: any) => {
            this.router.navigateByUrl(res.redirectUrl);
          }
            , (error: any) => {
              setTimeout(() => {
                location.reload();
              }, 3000);
              console.log(error);
            }
          );
          return false;
        },
        signInFailure: (error: any) => {
          this.showMessage({ severity: 'error', summary: 'Error', detail: 'Signin Failed , Please try again', life: 5000 });
          setTimeout(() => {
            location.reload();
          }, 3000);
          console.log('Signin Failed , Please try again', error);
          return Promise.resolve();
        }
      }
    };
    this.addSignInOptions(uiConfig, config);
    return uiConfig;
  }

  addSignInOptions(uiConfig: any, config: any) {
    if (this.providersInfo && this.providersInfo.length > 0) {
      const hasPasswordless = this.providersInfo.includes('passwordless');

      for (let provider of this.providersInfo) {
        let formattedProvider: any;
        if (provider === 'passwordBased' && !hasPasswordless && config?.loginMethod?.emailSubAuthenticationType === 'passwordBased') {
          formattedProvider = this.emailLogin['passwordBased'];
        } else if (provider === 'passwordless' && config?.loginMethod?.emailSubAuthenticationType === 'passwordless') {
          formattedProvider = this.emailLogin['passwordless'];
        } else if (provider === 'google' && config?.loginMethod?.federatedSubAuthenticationType?.includes(provider)) {
          formattedProvider = {
            provider: this.providers[provider],
            scopes: ['profile', 'email']
          };
        } else if (provider === 'microsoft' && config?.loginMethod?.federatedSubAuthenticationType?.includes(provider)) {
          formattedProvider = {
            provider: this.providers[provider].provider,
            providerName: this.providers[provider].providerName,
            customParameters: {
              scopes: 'email profile'
            }
          };
        } else if (config?.loginMethod?.ssoProtocolSubAuthenticationType?.includes('oidc') &&provider.startsWith(this.ssoProtocolProviders.oidc.provider)) {
          this.ssoProtocolProviders.oidc.provider = provider;
          formattedProvider = this.ssoProtocolProviders.oidc;
        } else if (config?.loginMethod?.ssoProtocolSubAuthenticationType?.includes('saml') && provider.startsWith(this.ssoProtocolProviders.saml.provider)) {
          this.ssoProtocolProviders.saml.provider = provider;
          formattedProvider = this.ssoProtocolProviders.saml;
        }
        if (formattedProvider) {
          uiConfig.signInOptions.push(formattedProvider);
        }
      }
    }
  }

  decodeEmail(authResult: any): string {
    let email = '';
    if (authResult?.user) {
      email = authResult?.user?.email || authResult?.user?.providerData?.[0]?.email || '';
    }
    if (!email && (authResult?.user?.providerData?.[0]?.providerId.startsWith('saml') || authResult?.user?.providerData?.[0]?.providerId.startsWith('oidc'))) {
      const keyPattern = /email|emailaddress/i;
      for (const key in authResult?.additionalUserInfo?.profile) {
        if (keyPattern.test(key) && AppConstants.emailRegex.test(authResult?.additionalUserInfo?.profile[key])) {
          email = authResult?.additionalUserInfo?.profile[key];
          break;
        }
      }
    }
    return email;
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

  goBack() {
    this.router.navigate(['/sign-in']);
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
    this.config = this.appGlobalService.get('firebaseConfig');
    this.currentStyles = this.convertStyle(AuthBaseConstants.loginStylesMap[this.config.env]);
    if (this.config) {
      this.app = initializeApp(this.config.firebaseConfig);
      this.appGlobalService.write('firebaseapp', this.app);
      const auth = getAuth(this.app);
      auth.tenantId = this.appGlobalService.get('tenantId');
      this.providersInfo = this.appGlobalService.get('providersInfo');
      this.ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
      this.ui.start("#firebaseui-auth-container", this.getUiConfig(this.config));
    }
  }

  onDestroy() {
    // Cleanup: Make sure to destroy the instance when component is destroyed
    // if (this.ui) {
    //   this.ui.cleanup();  // Ensure cleanup of AuthUI instance
    //   this.ui = null;
    // }
  }

  onAfterViewInit() {
    const container = document.getElementById('firebaseui-auth-container');
    const backButton = document.getElementById('back-btn');

    const isInitialScreen = () => {
      // Detect the initial provider screen (Google, Email, etc.)
      return container?.querySelector('.firebaseui-idp-button') !== null;
    };

    const updateBackButtonVisibility = () => {
      if (backButton) {
        backButton.style.display = isInitialScreen() ? 'block' : 'none';
      }
    };

    const bindEvents = () => {
      const emailInput = container?.querySelector<HTMLInputElement>('input[type="email"]');
      const sendButton = container?.querySelector('button[type="submit"]');
      const cancelButton = container?.querySelector('button[type="button"]');

      if (
        emailInput &&
        sendButton &&
        this.config?.loginMethod?.emailSubAuthenticationType === 'passwordless'
      ) {
        const setEmailToLocalStorageHandler = (event: Event) => {
          const keyboardEvent = event as KeyboardEvent;
          if (
            (keyboardEvent.key === 'Enter' || event.type === 'click') &&
            emailInput.value
          ) {
            localStorage.setItem('emailForSignIn', emailInput.value);
            localStorage.setItem('tenantId', this.appGlobalService.get('tenantId'));
          }
        };
        $(emailInput).off().on('keypress', setEmailToLocalStorageHandler);
        $(sendButton).off().on('keydown click', setEmailToLocalStorageHandler);
      }

      if (cancelButton) {
        cancelButton.addEventListener('click', () => {
          localStorage.removeItem('emailForSignIn');
        });
      }
    };

    updateBackButtonVisibility();
    bindEvents();

    const observer = new MutationObserver(() => {
      bindEvents();
    });

    const observerTwo = new MutationObserver(() => {
      // // Delay slightly to ensure new FirebaseUI content is rendered
      setTimeout(updateBackButtonVisibility, 50);
    });

    if (container) {
      observer.observe(container, { childList: true, subtree: true });
      observerTwo.observe(container, { childList: true, subtree: true });
    }
  }

}