import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiConstants } from './api-constants.base';
import { AppLoaderComponent } from './app-loader.component';
import { AppLoaderService } from './app-loader.service';
import { BaseAppConstants } from './app-constants.base';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  private http = inject(HttpClient);
  private loader = inject(AppLoaderService);


  private actualUpload(file: any, url: string, description: string, objectId: any, fieldName: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };

    if (!url) {
      url = BaseApiConstants.uploadAttachment.url;
    }

    const fileData = new FormData();
    if (file instanceof Array) {
      for (const singleFile of file) {
        if (singleFile instanceof File || (singleFile.file && singleFile.file instanceof File)) {
          fileData.append('files', singleFile.file)
        }
      }
    }
    else {
      fileData.append('files', file.file);
    }

    fileData.append('modelKey', objectId);
    if (fieldName == "rappitImport") {
      fileData.append('fieldName', "rappit-import");
    }
    else {
      fileData.append('fieldName', fieldName);
    }
    fileData.append('fileDesc', description || '');
    return this.http.post(
      url,
      fileData);
  }


  // tslint:disable-next-line:variable-name
  uploadFile(file: File | any, url: string, description: string, objectId: any, fieldName: string, form?: any): Observable<any> {
    const allFileUploadArray = [];
    if (file instanceof File || file instanceof Array) {
      allFileUploadArray.push(this.actualUpload(file, url, description, objectId, fieldName).pipe(catchError((err: any) => {
        return of({ isError: true, error: err })
      })));

    }
    if (allFileUploadArray.length === 0) {
      allFileUploadArray.push(of([]));
    }
    return combineLatest(allFileUploadArray);
  }

  getData(url: string): Observable<any> {
    return this.http.get(url);
  }

  saveAddedFiles(splittedData: any, id: any, form: any) {
    this.loader.show();
    return Observable.create((observer: any) => {
      const dataToResend: any = {};
      const error: any = {};
      if (splittedData) {

        const totalFiles = Object.values(splittedData).filter(obj => obj != null).length;
        let index = 1;
        for (const file in splittedData) {
          // Skip fields with null values
          if (splittedData.hasOwnProperty(file) && splittedData[file] != null && splittedData[file].length > 0) {
            let url = splittedData[file]['uploadUrl'];
            if (!url && splittedData.cUrl) {
              url = splittedData.cUrl;
            }
            delete splittedData[file]['uploadUrl'];

            this.uploadFile(splittedData[file], url, '', id, file, form)
              .subscribe((response: any) => {
                dataToResend[file] = [];
                response.map((res: any) => {
                  if (res && !res.isError) {
                    dataToResend[file].push(res || []);
                  }
                  else {
                    error[file] = res.error;
                  }
                })

                if (index === totalFiles) {
                  // const finalData = { data: { ...splittedData.data, ...dataToResend } };
                  this.loader.hide();
                  observer.next({ dataToResend: dataToResend, error: error });
                  observer.complete();
                }
                index = index + 1;
              },
              );
          }
          else {
            observer.next({ dataToResend: dataToResend, error: error });
            observer.complete();
          }
        }
      }
    });

  }
}
