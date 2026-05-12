import { inject } from "@angular/core";
import { Injectable } from "@angular/core";
import { BaseService } from "@baseapp/base.service";
import { environment } from "@env/environment";
import { Observable, Subject } from "rxjs";
import { AuthApiConstants } from './auth.api-constants';
import { PrototypeVariables } from "./prototype.variables";
import { Router } from "@angular/router";
import { AppGlobalService } from "@baseapp/app-global.service";

@Injectable({
  providedIn: 'root',
})
export class AuthBaseService {
  public baseService = inject(BaseService)
  public appGlobalService = inject(AppGlobalService);
  public router = inject(Router);
  private isAuthenticated: boolean = false;

  protected authObsr$ = new Subject<boolean>();
  public authChanges = this.authObsr$.asObservable();


  isAuthenticating: boolean = false;
  login(params: any) {
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get(AuthApiConstants.login).subscribe(
        (data: any) => {
          observer.next(data);
        },
        (error: any) => {
          observer.error(error);
        }
      );
    });

    return currentUserSubject;
  }
  authenticate(params?: any) {
    // const url = AuthApiConstants.authenticate.url.replace('{APP_ID}',PrototypeVariables.APP_ID);
    this.isAuthenticating = true;
    const url = AuthApiConstants.authenticate.url;
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: url }).subscribe(
        (data: any) => {
          observer.next(data);
          this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error);
          this.isAuthenticating = false;
        }
      );
    });

    return currentUserSubject;

  }

  authenticateGci(params: any) {
    this.isAuthenticating = true;
    const url = AuthApiConstants.authenticateGci.url;
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.post({ url: url }, params).subscribe(
        (data: any) => {
          observer.next(data);
          this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error);
          this.isAuthenticating = false;
        }
      );
    });

    return currentUserSubject;

  }

  sendEmailVerification(params?: any) {
    const url = AuthApiConstants.sendEmailVerification.url;
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.post({ url: url }, params).subscribe(
        (data: any) => {
          observer.next(data);
        },
        (error: any) => {
          observer.error(error);
        }
      );
    });

    return currentUserSubject;

  }

  fetchTenantInfo(params?: any) {
    const url = AuthApiConstants.fetchTenantInfo.url;
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.post({ url: url }, params).subscribe(
        (data: any) => {
          observer.next(data);
        },
        (error: any) => {
          observer.error(error);
        }
      );
    });

    return currentUserSubject;

  }

  updateUserDetails(params: any) {
    this.isAuthenticating = true;
    const url = AuthApiConstants.updateUserDetails.url;
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.put({ url: url }, params).subscribe(
        (data: any) => {
          observer.next(data);
          this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error);
          this.isAuthenticating = false;
        }
      );
    });

    return currentUserSubject;

  }

  recoverPassword(params: any) {
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: '/login' }, params).subscribe(
        (data: any) => {
          observer.next(data);
        },
        (error: any) => {
          observer.error(error);
        }
      );
    });

    return currentUserSubject;
  }


  getGoogleAuthorized() {
    const url = '/rest/oauth2/authorization/google';
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: url }).subscribe(
        (data: any) => {
          observer.next(data);
          this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error);
          this.isAuthenticating = false;
        }
      );
    });

    return currentUserSubject;
  }


  getUserInfo(params?: any) {
    this.isAuthenticating = true;
    const url = AuthApiConstants.getUserData.url;
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: url, handleError: false }).subscribe(
        (data: any) => {
          observer.next(data);
          this.authObsr$.next(data);
          this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error);
          this.authObsr$.next(error);
          this.isAuthenticating = false;
          let config = this.appGlobalService.get('firebaseConfig');
          if (config?.loginMethod && config?.loginMethod?.type == 'googleCloudIdentity') {
            if (config?.multiTenantProvison) {
              this.router.navigateByUrl('/sign-in');
            } else {
              this.router.navigateByUrl('/google-identity-login');
            }
          }
        }
      );
    });

    return currentUserSubject;
  }

  getLoginMethod() {
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: '/login' }).subscribe(
        (data: any) => {
          observer.next(data);
          // this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error);
          // this.isAuthenticating = false;
        }
      );
    });

    return currentUserSubject;
  }

  isUserLoggedIn() {
    try {
      const rapplCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('RAPPL='))
        ?.split('=')[1];
      if (rapplCookie == 'yes') {
        this.getUserInfo().subscribe((res: any) => {
          if(res){
            this.router.navigate(['/home']);
          }
        });
      }
    } catch (err) {
      console.log('Error checking login status:', err);
    }
  }

  authSuccess() {
    this.authObsr$.next(true);
  }

  authFail() {
    this.authObsr$.next(false);
  }

}