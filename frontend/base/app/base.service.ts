import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, Observable, Observer, of, Subscription, throwError } from 'rxjs';
import { tap, catchError, map, take, finalize, share } from 'rxjs/operators';
import { NotifiactionService } from './notification.service';
import { TranslateService } from '@ngx-translate/core';
import { inject, Inject } from '@angular/core';
import { AuthenticationResolver } from '@app/auth/authentication.resolver';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AppGlobalService } from './app-global.service';
import { BaseAppConstants } from './app-constants.base';
import { AppLoaderService } from './app-loader.service';
import { DOCUMENT } from '@angular/common'; 

@Injectable({
  providedIn: 'root'
})

export class BaseService {
  private readonly defaultContentType = 'application/json'
  public http = inject(HttpClient);
  private loader = inject(AppLoaderService);
  
  private notification = inject(NotifiactionService)
  private translateService = inject(TranslateService);
  public router = inject(Router);
  // public auth = inject(AuthService);
  public appGlobalService = inject(AppGlobalService);
  public cookieService = inject(CookieService);
  // private authenticationResolver = inject(AuthenticationResolver)
  private activeRequests: Subscription[] = [];
  constructor(@Inject(DOCUMENT) private document: Document) { }


  public get(options: any, params?: any): Observable<any> {
    
    const url = this.normalizeUrl(options.url, params);
    const httpReq = this.http.get(url).pipe(
      catchError((err: any, caught: Observable<any>) => {
        if (options.handleError === false) {
          return throwError(err);
        }
        else {
          return throwError(this.handleError(options, err));
        }
      }),
      share()
    );

    if (options.showloading) {
      this.showLoader(httpReq);
    }

    return httpReq;
  }

  public post(options: any, params?: any, data?: any): Observable<any> {
   
    const httpOptions = this.getHttpHeaders(options);
    const url = this.normalizeUrl(options.url, params);
    const httpReq = this.http.post(url, params, httpOptions).pipe(
      catchError((err: any, caught: Observable<any>) => {
        if (options.handleError === false) {
          return throwError(err);
        }
        else {
          return throwError(this.handleError(options, err));
        }
      }),
      share()
    );
    
    if (options.showloading) {
      this.showLoader(httpReq);
    }

    return httpReq;
  }

  public put(options: any, params?: any, data?: any): Observable<any> {
    
    const httpOptions = this.getHttpHeaders(options);
    const url = this.normalizeUrl(options.url, params);
    const httpReq = this.http.put(url, params, httpOptions).pipe(
      catchError((err: any, caught: Observable<any>) => {
        if (options.handleError === false) {
          return throwError(err);
        }
        else {
          return throwError(this.handleError(options, err));
        }
      }),
      share()
    );

    if (options.showloading) {
      this.showLoader(httpReq);
    }

    return httpReq;
  }

  public delete(options: any, params?: any): Observable<any> {
    
    const httpOptions = this.getHttpHeaders(options);
    const url = this.normalizeUrl(options.url, params);
    const httpReq = this.http.delete(url, httpOptions).pipe(
      catchError((err: any, caught: Observable<any>) => {
        if (options.handleError === false) {
          return throwError(err);
        }
        else {
          return throwError(this.handleError(options, err));
        }
      }),
      share()
    );
    
    if (options.showloading) {
      this.showLoader(httpReq);
    }

    return httpReq;    
  }

  public deletewithBodyParams(options: any, params?: any): Observable<any> {

    const httpOptions = this.getHttpHeaders(options);
    const url = this.normalizeUrl(options.url, params);

    // If params are provided, include them in the body of the request
    const bodyParams = params ? [...params] : []; // Clone params to avoid mutation

    const httpReq = this.http.delete(url, { ...httpOptions, body: bodyParams }).pipe(
      catchError((err: any, caught: Observable<any>) => {
        if (options.handleError === false) {
          return throwError(err);
        } else {
          return throwError(this.handleError(options, err));
        }
      }),
      share()
    );
    
    if (options.showloading) {
      this.showLoader(httpReq);
    }

    return httpReq;
  }

  private normalizeUrl(baseUrl: string, params?: any): string {
    if (BaseAppConstants.contextPath) {
      baseUrl = BaseAppConstants.contextPath + baseUrl;
    }
    if ((baseUrl.indexOf('{') === -1 || !params) && !params?.isQueryStringParametersAvailable) {
      return `${baseUrl}`;
    }
    const splitUrl = baseUrl.split('/');
    let buildUrl: string = '';

    if (splitUrl.length > 1) {
      let tempUrl: string;
      for (let index = 0, length = splitUrl.length; index < length; index++) {

        tempUrl = splitUrl[index];
        if (!tempUrl) { continue; }

        if (tempUrl[0] === '{' && tempUrl[tempUrl.length - 1] === '}') {

          const param = tempUrl.replace('{', '').replace('}', '');
          const urlParameter = params[param];
          delete params[param];
          if (urlParameter !== undefined && urlParameter != null) {
            buildUrl = buildUrl + '/' + urlParameter;
          }

        } else {

          if (buildUrl[buildUrl.length - 1] !== '/') {
            buildUrl = buildUrl + '/';
          }
          buildUrl = buildUrl + tempUrl;
        }
      }


      // return encodeURI(buildUrl);
    }
    if(params.isQueryStringParametersAvailable) {
      const queryParams = new URLSearchParams();
      Object.keys(params?.data).forEach(key => {
        const value = params?.data[key];
        queryParams.set(key, value);
      })
      const queryString = queryParams.toString();
      const finalURL = buildUrl ? buildUrl : baseUrl;
      return `${finalURL}?${queryString}`
    } else {
      return buildUrl;
    }

  }

  public getServiceUrl(url: string) {
    const serviceUrl = this.normalizeUrl(url);
    return serviceUrl;
  }

  private getHttpHeaders(options: any) {

    let contentTypeHeader: string = (options.headers ? options.headers.get('Content-Type') : '');

    if (!contentTypeHeader) {
      contentTypeHeader = this.defaultContentType;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': contentTypeHeader
      })
    };

    return httpOptions;
  }

  toCamelCase(value: string): string {
    return value.toLowerCase().replace(/_([a-z])/g, (_, char) => char.toUpperCase());
  }

  public handleError(options: any, err: any) {
    const urlarray = (options.url?.split("/"));
    if (err.status == "401" && !(urlarray.includes("user-details"))) {
      this.resolve();
    }
    if (err.error instanceof ErrorEvent) {
      console.error('An error occurred:', err.error.message);
    } else if (options.showErrorMsg !== false) {
      let errorMsg = '';
      const errorKeys = ['DETAIL', 'MESSAGE', 'VALIDATION_ERRORS','FORMATTED_MSG','APPLICATION_MESSAGE'];

      errorKeys.forEach((key) => {
        const camelCaseKey = this.toCamelCase(key);
        const errorValue = err.error?.[key] || err.error?.[camelCaseKey] || err.data?.[key] || err.data?.[camelCaseKey];

        if (Array.isArray(errorValue)) {
          errorValue.forEach((e: any) => {
            const message = e.MESSAGE || e.message;
            if (message) {
              errorMsg += `${this.translateService.instant(message)}`;
            }
          });
        } else if (errorValue) {
          errorMsg += `${this.translateService.instant(errorValue)}`;
        }
      });

      if (errorMsg) {
        this.notification.showMessage({ severity: 'error', icon: '', summary: '', detail: errorMsg });
      }
    }

    // return error for runtime workflow  to handle confirmation popup
    if(err?.error?.ARGS?.isWorkflowError) {
      return err;
    }
  }

  public getPrototypingData(options: any, params?: any): any {

    const url = options.url;

    const httpReq = this.http.get(url).pipe(
      catchError((err: any, caught: Observable<any>) => {
        // this.handleError(options, err);
        return throwError(this.handleError(options, err));
      }),
      share()
    );

    if (options.showloading) {
      this.showLoader(httpReq);
    }
    return httpReq;
  }


  getUrl(url: string, queryString: string): string {
    return url + queryString;
  }

  search(url: string, queryString: string): Observable<any> {
    let _URL = this.getUrl(url, queryString);
    return this.http.get(_URL);
  }



  //Login



  public authenticate(): Observable<any> {
    const latest = combineLatest([this.isUserLoggedIn()])
    return latest;
  }


  getUserInfo(params?: any) {
    const url = '/rest/applicationusers/user-details';
    const currentUserSubject = new Observable((observer: any) => {
      this.get({ url: url, handleError: false }).subscribe(
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

  getLoginMethod() {
    const currentUserSubject = new Observable((observer: any) => {
      this.get({ url: '/rest/login-providers/oauth-login-providers', handleError: false }).subscribe(
        (data: any) => {
          const url = data.login_urls[0];
          this.redirectToLogin(url).subscribe((res) => {
            observer.next(data);
            observer.complete();
          }, (error: any) => {
            observer.error(error);
            observer.complete();
          })
        },
        (error: any) => {
          observer.error(error);
          observer.complete();
        }
      );
    });

    return currentUserSubject;
  }



  redirectToLogin(url: any): Observable<boolean> {
    return Observable.create((obsr$: Observer<boolean>) => {
      if(!url || typeof url !== 'string'  || !url.startsWith('/') || url.startsWith('//')) {
         console.error('Invalid login redirect URL');
         return of(false);
      }
      this.document.location.href = url;
      return of(true);
    })
  }


  isUserLoggedIn(): Observable<boolean> {
    const isUserLoggedIn = this.cookieService.get('RAPPL');
    return Observable.create((obsr$: Observer<boolean>) => {
      if (isUserLoggedIn == 'yes') {
        obsr$.next(true);
        obsr$.complete();
      }
      else {
        this.getLoginMethod().subscribe(() => {
          obsr$.next(true);
          obsr$.complete();
        }, (err: any) => {
          obsr$.error('authentication failed');
          obsr$.complete();
        })

      }

    })
  }

  resolve() {
    this.authenticate().subscribe((res) => {
      this.appGlobalService.write('currentUser', res[1]);
    }, (err: any) => { })

    // this.authenticate().pipe(map((res: any[]) => {
    //   this.appGlobalService.write('currentUser', res[1]);
    // }),
    //   take(1),
    //   catchError((error) => {
    // const isUserLoggedIn = this.cookieService.get('RAPPL');
    // if(isUserLoggedIn == 'yes' && !this.appGlobalService.get('currentUser')){
    //   let redirectUrl = window.location.hash;
    //   let loginUrl = '/login';
    //   if (redirectUrl.indexOf("login") == -1) {
    //     loginUrl += "?redirectUrl=" + encodeURIComponent(redirectUrl);
    //   }
    //   this.router.navigateByUrl(loginUrl);
    // }
    // else{
    //   let redirectUrl = window.location.hash;
    //   let loginUrl = '/login';
    //   if (redirectUrl.indexOf("login") == -1) {
    //     loginUrl += "?redirectUrl=" + encodeURIComponent(redirectUrl);
    //   }
    //   this.router.navigateByUrl(loginUrl);
    // }
    //   return of(false);
    // }))
  }
  
  showLoader(request: Observable<any>) {
    this.loader.show();
    this.addRequest(request);
  }

  addRequest(request: Observable<any>) {
    const subscription = request
      .pipe(
        finalize(() => {
          this.activeRequests = this.activeRequests.filter((req) => req !== subscription);

          if (this.activeRequests.length === 0) {
            this.onAllRequestsComplete();
          }
        })
      )
      .subscribe({
        next: (_) => { },
        error: (_) => { },
      });

    this.activeRequests.push(subscription);
  }

  onAllRequestsComplete() {
    this.hideLoader();
  }

  hideLoader() {
    setTimeout(
      () => {
        if (this.activeRequests?.length === 0) {
          this.loader.hide();
        }
      },
      0
    );
  }

}
