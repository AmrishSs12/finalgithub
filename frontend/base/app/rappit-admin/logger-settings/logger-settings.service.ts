import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoggerSettingsConstants } from "./logger-settings.api-constants";
import { BaseService } from "@baseapp/base.service";

@Injectable({
    providedIn: 'root'
})
export class LoggerSettingsService {

    public baseService = inject(BaseService);
    saveLogger(...args: any): Observable<any> {
        const serviceOpts = LoggerSettingsConstants.saveLogger;
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

    getPackages(...args: any): Observable<any> {
        const serviceOpts = LoggerSettingsConstants.getPackages;
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
}