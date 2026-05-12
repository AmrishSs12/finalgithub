import { Injectable,inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@baseapp/base.service';
import { RwftaskBase} from './rwftask.base.model';
import { RwftaskApiConstants } from './rwftask.api-constants';
import * as RwftaskData from 'base/assets/static-sample-data/rwftask.json';


@Injectable({
  providedIn: 'root'
})
export class RwftaskService {

public baseService = inject(BaseService);


	  getProtoTypingData(): Observable<any> {
	      return of(RwftaskData);
	  }

	  getProtoTypingDataByParams(...args: any): Observable<any> {
	    const params = args[0];
	    const key = Object.keys(params);
	    let foundData: boolean = false;
	    let data: any = {};
	    const subject: Observable<RwftaskBase> = new Observable(observer => {
      const response = RwftaskData;
	      response.map((o: any) => {
	        foundData = key.every((d: string) => {
	          return o[d] == params[d];
	        })
	        if (foundData) {
	          data = o;
	        }
	      })
	      observer.next(data as RwftaskBase);
	    });
	    return subject;
	  }

    getDatatableData(...args: any):Observable<any>{
        const serviceOpts = RwftaskApiConstants.getDatatableData;
        const params= args[0];

        const subject = new Observable(observer => {
          this.baseService.post(serviceOpts,params).subscribe((response: any) => {
            observer.next(response);
          },
          (err:any) => {
            observer.error(err);
          });
        });

        return subject;
    }
  getTablesInfo(...args: any): Observable<any> {
    const serviceOpts = RwftaskApiConstants.getTablesInfo;
    const params = args[0];

    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe(
        (response: any) => {
          observer.next(response);
        },
        (err: any) => {
          observer.error(err);
        }
      );
    });

    return subject;
  }

    performActionTaskList (...args: any): Observable<any> {
      const serviceOpts = { ...RwftaskApiConstants.performActionTaskList  }; // clone to avoid side effects
      const params = args[0];

      serviceOpts.url = serviceOpts.url.replace('{actionEndpoint}', params.actionEndpoint);

      // Build query string manually
      const queryString = new URLSearchParams({
        actionId: params.actionId,
        tableId: params.tableId,
        resourceId: params.resourceId
      }).toString();

      // Append query string to URL
      serviceOpts.url = `${serviceOpts.url}?${queryString}`;

      // Call baseService with empty body for RC
      return new Observable(observer => {
        this.baseService.post(serviceOpts, {}).subscribe({
          next: (response: any) => observer.next(response),
          error: (err: any) => observer.error(err)
        });
      });
    }
}
