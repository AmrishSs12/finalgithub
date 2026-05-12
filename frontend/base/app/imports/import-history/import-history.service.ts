import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@baseapp/base.service';
import { ImportHistoryBase } from './import-history.base.model';
import { ImportHistoryApiConstants } from './import-history.api-constants';
import * as ImportHistoryData from 'base/assets/static-sample-data/import-history.json';


@Injectable({
  providedIn: 'root'
})
export class ImportHistoryService {

  public baseService = inject(BaseService);


  getProtoTypingData(): Observable<any> {
    return of(ImportHistoryData);
  }

  getDatatableData(...args: any): Observable<any> {
    const serviceOpts = ImportHistoryApiConstants.getDatatableData;
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

}
