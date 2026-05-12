import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@baseapp/base.service';
import { TenantDomainConfigApiConstants } from './tenant-domain-config.api-constants';
import * as TenantDomainConfigData from 'base/assets/static-sample-data/tenant-domain-config.json';

@Injectable({
  providedIn: 'root'
})
export class TenantDomainConfigService {

  public baseService = inject(BaseService);

  getProtoTypingData(): Observable<any> {
    return of(TenantDomainConfigData);
  }

  getProtoTypingDataById(...args: any): Observable<any> {
    const params = args[0];
    const key = Object.keys(params);
    let foundData: boolean = false;
    let data: any = {};
    const subject: Observable<any> = new Observable((observer: any) => {
      const response = TenantDomainConfigData;
      response.map((o: any) => {
        foundData = key.every((d: string) => {
          return o[d] == params[d];
        })
        if (foundData) {
          data = o;
        }
      })
      observer.next(data as any);
    });
    return subject;
  }

  getById(...args: any): Observable<any> {
    const serviceOpts = TenantDomainConfigApiConstants.getById;
    const params = args[0];

    const subject = new Observable((observer: any) => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }

  getAllDatatableData(...args: any): Observable<any> {
    const serviceOpts = TenantDomainConfigApiConstants.getAllDatatableData;
    const params = args[0];

    const subject = new Observable((observer: any) => {
      this.baseService.post(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }
  update(...args: any): Observable<any> {
    const serviceOpts = TenantDomainConfigApiConstants.update;
    const params = args[0];

    const subject = new Observable((observer: any) => {
      this.baseService.put(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }
  create(...args: any): Observable<any> {
    const serviceOpts = TenantDomainConfigApiConstants.create;
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

  activate(...args: any): Observable<any> {
    const serviceOpts = TenantDomainConfigApiConstants.activate;
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
  deactivate(...args: any): Observable<any> {
    const serviceOpts = TenantDomainConfigApiConstants.deactivate;
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
  delete(...args: any): Observable<any> {
    const serviceOpts = TenantDomainConfigApiConstants.delete;
    const params = args[0];

    const subject = new Observable(observer => {
      this.baseService.delete(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }

  getDatatableData(...args: any): Observable<any> {
    const serviceOpts = TenantDomainConfigApiConstants.getDatatableData;
    const params = args[0];

    const subject = new Observable((observer: any) => {
      this.baseService.post(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }

  getTenants(...args: any): Observable<any> {
    const serviceOpts = TenantDomainConfigApiConstants.getTenants;
    const params = args[0];

    const subject = new Observable((observer: any) => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }
}
