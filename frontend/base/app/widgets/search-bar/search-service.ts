import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchService {

  private globalSearchSubject = new BehaviorSubject('');
  public gSearchObj = this.globalSearchSubject.asObservable();

  private advSearchSubject = new BehaviorSubject('');
  public advSearchObj = this.advSearchSubject.asObservable();

  public changeGlobalSearchKey(key: string) {
    this.globalSearchSubject.next(key);
  }

  public changeAdvSearchObj(obj: any) {
    this.advSearchSubject.next(obj);
  }

}