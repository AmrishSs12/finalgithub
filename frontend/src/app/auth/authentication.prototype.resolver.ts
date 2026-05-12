import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Resolve, Router } from '@angular/router';
import { PrototypeVariables } from '@baseapp/auth/prototype.variables';
import { Guid } from 'guid-typescript';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AppUtilService } from '@app/app.util.service';
import { DOCUMENT } from '@angular/common'; 
import {Inject} from '@angular/core'; 

const authpresetInfoVar: string = "PROTO_PRESET";
const authInfoVar: string = "PROTO_AUTH";

@Injectable()
export class AuthenticationResolver implements Resolve<any> {
  prototypeUrl = new URL(PrototypeVariables.DESIGN_STUDIO_URL).origin;

  lsAuthInfo: any = localStorage.getItem(authInfoVar);
  presetAuthInfo: any = localStorage.getItem(authpresetInfoVar);
  authenticated: any = {}

  public router = inject(Router);
  public auth = inject(AuthService);
  public route = inject(ActivatedRoute);
  public appUtil = inject(AppUtilService);
  constructor(@Inject(DOCUMENT) private document: Document) { }


  public authenticate(): Observable<any> {

    let authenticated = false;

    let params = this.document.location.href;
    let appauthInfo = `authInfo_${PrototypeVariables.APP_ID}`
    const currentUserSubject = new Observable((observer: any) => {
      let authId;
      let paramValue;
      const currentAppInfo: any = localStorage.getItem(appauthInfo);

      if (currentAppInfo) {
        let info = JSON.parse(currentAppInfo);
        if (info.expires && (new Date(info.expires).getTime() > new Date().getTime() && info.isAuthenticated)) {
          authenticated = true;
        }
      }

      if (params.includes('?')) {
        const httpParams = new HttpParams({ fromString: params.split('?')[1] });
        authId = httpParams.get("token");
      }

      if (authId != null && !authenticated) {
        let authGuid;

        if (Object.keys(this.presetAuthInfo).length) {
          let presetGuid = this.presetAuthInfo[PrototypeVariables.APP_ID];

          if (presetGuid == authId) {
            authenticated = true;
            delete this.presetAuthInfo[PrototypeVariables.APP_ID];
            localStorage.setItem(authpresetInfoVar, JSON.stringify(this.presetAuthInfo));

            //setting the appId authentication in local storage
            let info = JSON.parse(currentAppInfo);
            if (!localStorage.getItem(appauthInfo) || (info.expires && (new Date(info.expires).getTime() < new Date().getTime() && info.isAuthenticated))) {
              const currentTime = new Date().getTime()
              const expires = new Date(currentTime + 2 * 60 * 60 * 1000);
              let authenticatedAppInfo = {
                appId: PrototypeVariables.APP_ID,
                isAuthenticated: true,
                expires: expires
              }
              localStorage.setItem(appauthInfo, JSON.stringify(authenticatedAppInfo));
            }
            else {
              let authInfo: any = localStorage.getItem(appauthInfo);
              let info = JSON.parse(authInfo);
              if (info.expires && (new Date(info.expires).getTime() < new Date().getTime())) {
                localStorage.remove(appauthInfo);
              }
            }
            /* this.lsAuthInfo[PrototypeVariables.APP_ID] = {
               guid: authId,
               from: new Date().getTime()
             }
             localStorage.setItem(authInfoVar, JSON.stringify(this.lsAuthInfo));*/
          }


        }
      } /*else if (Object.keys(this.lsAuthInfo).length) {
          let authDetail: any = this.lsAuthInfo[PrototypeVariables.APP_ID];

          if (authDetail) {
            authGuid = authDetail.guid;

            let validTime = this.getValidTime(authDetail.from);
            if (new Date().getTime() < validTime) {
              if (authGuid == authId) {
                authenticated = true;
              }
            } else {
              delete this.lsAuthInfo[PrototypeVariables.APP_ID];
              localStorage.setItem(authInfoVar, JSON.stringify(this.lsAuthInfo));
            }
          }

        }*/


      /*else {

       if (Object.keys(this.lsAuthInfo).length) {
         let authDetail: any = this.lsAuthInfo[PrototypeVariables.APP_ID];

         let validTime = this.getValidTime(authDetail.from);
         if (new Date().getTime() < validTime) {
           authenticated = true;
         } else {
           delete this.lsAuthInfo[PrototypeVariables.APP_ID];
           localStorage.setItem(authInfoVar, JSON.stringify(this.lsAuthInfo));
         }

       }

     }*/




      if (authenticated) {
        observer.next(true);
      } else {
        observer.error({});
      }


    });

    return currentUserSubject;
  }

  getValidTime(from: any) {
    return from + (1 * 60 * 60 * 1000);
  }
  resolve() {
    if (this.lsAuthInfo) {
      if (typeof this.lsAuthInfo == "string")
        this.lsAuthInfo = JSON.parse(this.lsAuthInfo);
    } else {
      this.lsAuthInfo = {};
    }

    if (this.presetAuthInfo) {
      if (typeof this.presetAuthInfo == "string") {
        this.presetAuthInfo = JSON.parse(this.presetAuthInfo);
      }
    } else {
      this.presetAuthInfo = {};
    }

    return this.authenticate().pipe(
      take(1),
      catchError((error: any) => {

        let guid: any = Guid.create();

        //Token : remove 
        let protoUrl = location.href;

        if (protoUrl.indexOf('token') > -1) {
          let splittedParams = protoUrl.split("?");

          if (splittedParams.length > 1 && splittedParams[1].indexOf('token') > -1) {
            let params = splittedParams[1].split("&");
            for (var i = 0; i < params.length; i++) {
              if (params[i].indexOf('token') == 0) {
                params.splice(i, 1);

                if (params.length) {
                  let paramString = params.join("&");
                  protoUrl = splittedParams[0] + "?" + paramString;
                  break;
                } else {
                  protoUrl = splittedParams[0];
                }

              }
            }
          }
        }

        let redirectUrl = `${this.prototypeUrl}/#/login?appId=${PrototypeVariables.APP_ID}&tenantId=${PrototypeVariables.TENANT_ID}&redirectUrl=${encodeURIComponent(protoUrl)}&token=${encodeURIComponent(guid.value)}`;
        redirectUrl = redirectUrl.replace("http://", "https://");

        if (!this.appUtil.isSafeUrl(redirectUrl)) {
          console.log("Navigation blocked to unsafe url ",redirectUrl);
          return;
        }
        this.presetAuthInfo[PrototypeVariables.APP_ID] = guid.value;
        localStorage.setItem(authpresetInfoVar, JSON.stringify(this.presetAuthInfo));

        this.document.location.href = redirectUrl;
        return error;
      })
    );
  }
}