import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@baseapp/base.service';
import { GcipRoleMappingApiConstants } from './gcip-role-mapping.api-constants';
import * as GcipRoleMappingData from 'base/assets/static-sample-data/gcip-role-mapping.json';

@Injectable({
  providedIn: 'root'
})
export class GcipRoleMappingService {

  public baseService = inject(BaseService);

  getProtoTypingData(): Observable<any> {
    return of(GcipRoleMappingData);
  }

  getProtoTypingDataById(...args: any): Observable<any> {
    const params = args[0];
    const key = Object.keys(params);
    let foundData: boolean = false;
    let data: any = {};
    const subject: Observable<any> = new Observable((observer: any) => {
      const response = GcipRoleMappingData;
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
    const serviceOpts = GcipRoleMappingApiConstants.getById;
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
    const serviceOpts = GcipRoleMappingApiConstants.getAllDatatableData;
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
    const serviceOpts = GcipRoleMappingApiConstants.update;
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
    const serviceOpts = GcipRoleMappingApiConstants.create;
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
    const serviceOpts = GcipRoleMappingApiConstants.activate;
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
    const serviceOpts = GcipRoleMappingApiConstants.deactivate;
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
    const serviceOpts = GcipRoleMappingApiConstants.delete;
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
    const serviceOpts = GcipRoleMappingApiConstants.getDatatableData;
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

  setupCall(...args: any): Observable<any> {
    const serviceOpts = GcipRoleMappingApiConstants.setup;
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
}
