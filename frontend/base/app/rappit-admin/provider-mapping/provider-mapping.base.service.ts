import { Injectable, inject } from '@angular/core';
import { BaseService } from '@baseapp/base.service';
import { Observable, of } from 'rxjs';
import { ProviderMappingBase } from './provider-mapping.base.model';
import { ProviderMappingApiConstants } from './provider-mapping.api-constants';
import * as ProviderMappingData from 'base/assets/static-sample-data/provider-mapping.json';

@Injectable({
  providedIn: 'root'
})
export class ProviderMappingBaseService {

  public baseService = inject(BaseService);

  getProtoTypingData(): Observable<any> {
    return of(ProviderMappingData);
  }

  getProtoTypingDataById(...args: any): Observable<any> {
    const params = args[0];
    const key = Object.keys(params);
    let foundData: boolean = false;
    let data: any = {};
    const subject: Observable<ProviderMappingBase> = new Observable(observer => {
      const response = ProviderMappingData;
      response.map((o: any) => {
        foundData = key.every((d: string) => {
          return o[d] == params[d];
        })
        if (foundData) {
          data = o;
        }
      })
      observer.next(data as ProviderMappingBase);
    });
    return subject;
  }

  getDatatableData(...args: any): Observable<any> {
    const serviceOpts = ProviderMappingApiConstants.getDatatableData;
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
  setupCall(...args: any): Observable<any> {
    const serviceOpts = ProviderMappingApiConstants.setup;
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

  getById(...args: any): Observable<any> {
    const serviceOpts = ProviderMappingApiConstants.getById;
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
  update(...args: any): Observable<any> {
    const serviceOpts = ProviderMappingApiConstants.update;
    const params = args[0];

    const subject = new Observable(observer => {
      this.baseService.put(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }

}
