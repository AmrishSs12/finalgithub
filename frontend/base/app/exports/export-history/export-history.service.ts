import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@baseapp/base.service';
import { ExportHistoryBase } from './export-history.base.model';
import { ExportHistoryApiConstants } from './export-history.api-constants';
import * as ExportHistoryData from 'base/assets/static-sample-data/export-history.json';


@Injectable({
  providedIn: 'root'
})
export class ExportHistoryService {

  public baseService = inject(BaseService);


  getProtoTypingData(): Observable<any> {
    return of(ExportHistoryData);
  }

  getDatatableData(...args: any): Observable<any> {
    const serviceOpts = ExportHistoryApiConstants.getDatatableData;
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
