import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private showSpinner: boolean = false;

  private spinnerObsr$ = new BehaviorSubject(this.showSpinner);
  public spinnerChanges = this.spinnerObsr$.asObservable();


  show() {
    this.spinnerObsr$.next(true);
  }

  hide() {
    this.spinnerObsr$.next(false);
  }
}
