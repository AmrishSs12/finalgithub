import { Injectable,inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@baseapp/base.service';
import { Table1Base} from './table1.base.model';
import { Table1ApiConstants } from './table1.api-constants';


@Injectable({
  providedIn: 'root'
})
export class Table1Service {

public baseService = inject(BaseService);

  
	  getProtoTypingData(): Observable<any> {
	      if (!this.isValidTableFolderName('table1')) {
	        return new Observable(observer => {
	          observer.error(new Error(`Invalid Table folder name: table1`));
	        });
	      }
	      const subject:Observable<Table1Base> = new Observable(observer => {
	        const data =  require('base/assets/sample-data/table1.json');
	        observer.next(data as Table1Base);
	      });
	      return subject;
	  }
	 
		getProtoTypingDataById(...args: any): Observable<any> {
			const params = args[0];
			const key = Object.keys(params);
			let foundData: boolean = false;
			let data: any = {};
			if (!this.isValidTableFolderName('table1')) {
				return new Observable(observer => {
					observer.error(new Error(`Invalid Table folder name: table1`));
				});
			}
			const subject: Observable<Table1Base> = new Observable(observer => {
			const response = require('base/assets/sample-data/table1.json');
			response.map((o: any) => {
				foundData = key.every((d: string) => {
				return o[d] == params[d];
				})
				if (foundData) {
				data = o;
				}
			})
			observer.next(data as Table1Base);
			});
	    	return subject;
	  	}


	  getProtoTypingDataByParams(...args: any): Observable<any> {
	    const params = args[0];
	    const key = Object.keys(params);
	    let foundData: boolean = false;
	    let data: any = {};
	    if (!this.isValidTableFolderName('table1')) {
	      return new Observable(observer => {
	        observer.error(new Error(`Invalid Table folder name: table1`));
	      });
	    }
	    const subject: Observable<Table1Base> = new Observable(observer => {
	      const response = require('base/assets/sample-data/table1.json');
	      response.map((o: any) => {
	        foundData = key.every((d: string) => {
	          return o[d] == params[d];
	        })
	        if (foundData) {
	          data = o;
	        }
	      })
	      observer.next(data as Table1Base);
	    });
	    return subject;
	  }

	  isValidTableFolderName(tableFolderName: string): boolean {
        const validatedName = tableFolderName.replace(/[^a-zA-Z0-9_-]/g, '');
        return validatedName === tableFolderName;
      }
	  
    update(...args: any):Observable<any>{
        const serviceOpts = Table1ApiConstants.update;
        const params= args[0];
        
        const subject = new Observable(observer => {
          this.baseService.put(serviceOpts,params).subscribe((response: any) => {
            observer.next(response);
          },
          (err:any) => {
            observer.error(err);
          });
        });
    
        return subject;
    }
    create(...args: any):Observable<any>{
        const serviceOpts = Table1ApiConstants.create;
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
    delete(...args: any):Observable<any>{
        const serviceOpts = Table1ApiConstants.delete;
        const params= args[0];
        
        const subject = new Observable(observer => {
          this.baseService.delete(serviceOpts,params).subscribe((response: any) => {
            observer.next(response);
          },
          (err:any) => {
            observer.error(err);
          });
        });
    
        return subject;
    }
    getDatatableData(...args: any):Observable<any>{
        const serviceOpts = Table1ApiConstants.getDatatableData;
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
    getById(...args: any):Observable<any>{
        const serviceOpts = Table1ApiConstants.getById;
        const params= args[0];
        
        const subject = new Observable(observer => {
          this.baseService.get(serviceOpts,params).subscribe((response: any) => {
            observer.next(response);
          },
          (err:any) => {
            observer.error(err);
          });
        });
    
        return subject;
    }
}
