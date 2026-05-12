import { Injectable,inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@baseapp/base.service';
import { ApplicationUserBase} from './application-user.base.model';
import { ApplicationUserApiConstants } from './application-user.api-constants';


@Injectable({
  providedIn: 'root'
})
export class ApplicationUserService {

public baseService = inject(BaseService);

  
	  getProtoTypingData(): Observable<any> {
	      if (!this.isValidTableFolderName('application-user')) {
	        return new Observable(observer => {
	          observer.error(new Error(`Invalid Table folder name: application-user`));
	        });
	      }
	      const subject:Observable<ApplicationUserBase> = new Observable(observer => {
	        const data =  require('base/assets/sample-data/application-user.json');
	        observer.next(data as ApplicationUserBase);
	      });
	      return subject;
	  }
	 
		getProtoTypingDataById(...args: any): Observable<any> {
			const params = args[0];
			const key = Object.keys(params);
			let foundData: boolean = false;
			let data: any = {};
			if (!this.isValidTableFolderName('application-user')) {
				return new Observable(observer => {
					observer.error(new Error(`Invalid Table folder name: application-user`));
				});
			}
			const subject: Observable<ApplicationUserBase> = new Observable(observer => {
			const response = require('base/assets/sample-data/application-user.json');
			response.map((o: any) => {
				foundData = key.every((d: string) => {
				return o[d] == params[d];
				})
				if (foundData) {
				data = o;
				}
			})
			observer.next(data as ApplicationUserBase);
			});
	    	return subject;
	  	}


	  getProtoTypingDataByParams(...args: any): Observable<any> {
	    const params = args[0];
	    const key = Object.keys(params);
	    let foundData: boolean = false;
	    let data: any = {};
	    if (!this.isValidTableFolderName('application-user')) {
	      return new Observable(observer => {
	        observer.error(new Error(`Invalid Table folder name: application-user`));
	      });
	    }
	    const subject: Observable<ApplicationUserBase> = new Observable(observer => {
	      const response = require('base/assets/sample-data/application-user.json');
	      response.map((o: any) => {
	        foundData = key.every((d: string) => {
	          return o[d] == params[d];
	        })
	        if (foundData) {
	          data = o;
	        }
	      })
	      observer.next(data as ApplicationUserBase);
	    });
	    return subject;
	  }

	  isValidTableFolderName(tableFolderName: string): boolean {
        const validatedName = tableFolderName.replace(/[^a-zA-Z0-9_-]/g, '');
        return validatedName === tableFolderName;
      }
	  
    delete(...args: any):Observable<any>{
        const serviceOpts = ApplicationUserApiConstants.delete;
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
    getById(...args: any):Observable<any>{
        const serviceOpts = ApplicationUserApiConstants.getById;
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
    getBysiduniqueIndex(...args: any):Observable<any>{
        const serviceOpts = ApplicationUserApiConstants.getBysiduniqueIndex;
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
    getByemailprimaryIndex(...args: any):Observable<any>{
        const serviceOpts = ApplicationUserApiConstants.getByemailprimaryIndex;
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
    create(...args: any):Observable<any>{
        const serviceOpts = ApplicationUserApiConstants.create;
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
    update(...args: any):Observable<any>{
        const serviceOpts = ApplicationUserApiConstants.update;
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
    getDatatableData(...args: any):Observable<any>{
        const serviceOpts = ApplicationUserApiConstants.getDatatableData;
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
}
