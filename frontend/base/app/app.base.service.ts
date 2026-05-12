import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseApiConstants } from './api-constants.base';
import { BaseService } from './base.service';
import { AppGlobalService } from './app-global.service';
import { AppUtilBaseService } from './app-util.base.service';
import * as roleData from 'base/assets/role.json';

@Injectable({
  providedIn: 'root'
})
export class AppBaseService {
  public baseService = inject(BaseService);
  public appGlobalService = inject(AppGlobalService);
  public appUtilService = inject(AppUtilBaseService);

  getWorkFlowConfig(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.workFlowConfig;
    const params = args[0];

    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }

  getUserRoles(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.getUserRoles;
    const params = args[0];
    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });
    return subject;
  }

  getPrototypingworkflow(workflowType: string): Observable<any> {
    if (!this.appUtilService.isValidInput(workflowType)) {
      return new Observable(observer => {
        observer.error(new Error(`Invalid workflow type: ${workflowType}`));
      });
    }
    const folderName: string = 'workflow';
    const subject: Observable<any> = new Observable(observer => {
      const data = require(`base/assets/${folderName}/${workflowType}.json`);
      observer.next(data as any);
    });
    return subject;
  }

  getRoles(): Observable<any> {
    return of(roleData);
  }

  getWorkflowHistoryTable(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.workflowHistory;
    const params = args[0];
    const subject = new Observable(observer => {
      this.baseService.post(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }

  getRCToken(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.getRCToken;
    const params = args[0];
    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });
    return subject;
  }

  getRCBaseUrl(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.getRCBaseUrl;
    const params = args[0];
    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });
    return subject;
  }

  getRWFTableInfo(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.getRWFTableInfo;
    const params = args[0];
    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });
    return subject;
  }

  getFirebaseConfig() {
    let config: any = {};
    let request = new XMLHttpRequest();
    if (this.appGlobalService.get('firebaseConfig')) {
      config = this.appGlobalService.get('firebaseConfig');
      return config;
    }
    try {
      let headerConfig = BaseApiConstants.getFirebaseConfig;
      request.open(headerConfig.method, headerConfig.url, false);  // `false` makes the request synchronous
      request.send(null);

      if (request.status === 200) {
        const res = JSON.parse(request.responseText);
        this.appGlobalService.write('firebaseConfig', res);
      } else if (request.status === 401) {
        console.log(request.status);
      }
      return config;
    } catch (e) {
      console.error('getFirebaseConfig: unable to get api key : ', e);
    }

  }

}


