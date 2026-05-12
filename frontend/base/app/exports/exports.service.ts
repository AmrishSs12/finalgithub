import { Injectable, inject } from '@angular/core';
import { BaseService } from '@baseapp/base.service';
import { Observable, of } from 'rxjs';
import { ExportsApiConstants } from './exports.api-constants';
import { NotifiactionService } from '@baseapp/notification.service';
import { TranslateService } from '@ngx-translate/core';
import * as ExportData from 'base/assets/export.json';
@Injectable({
  providedIn: 'root'
})
export class ExportsService {
  public baseService = inject(BaseService)
  public notification = inject(NotifiactionService)
  public translateService = inject(TranslateService)

  initiateExport(...args: any): Observable<any> {
    const serviceOpts = ExportsApiConstants.create;
    const params = args[0];

    const subject = new Observable(observer => {
      this.baseService.post(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          let errorMsg = `${this.translateService.instant('Export_Failed')}`;
          this.notification.showMessage({ severity: 'error', icon: '', summary: '', detail: errorMsg, life: 5000 })
          observer.error(err);
        });
    });

    return subject;
  }
  update(...args: any): Observable<any> {
    const serviceOpts = ExportsApiConstants.update;
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

  create(...args: any): Observable<any> {
    const serviceOpts = ExportsApiConstants.create;
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
  getExportConfig(): Observable<any> {
    return of(ExportData);
  }


}

