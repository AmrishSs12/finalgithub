import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbBaseService {

  private _home: MenuItem = { label: 'Home', url: '#/home', target: '_self' };
  private _breadCrumbItems: MenuItem[] = [];
  //private subject = new BehaviorSubject(this._breadCrumbItems);
  private subject = new BehaviorSubject(this._breadCrumbItems);
  private _breadcrumbChanges = this.subject.asObservable();



  get breadcrumbChanges() {
    return this._breadcrumbChanges;
  }
  get home() {
    return this._home;
  }

  set home(value) {
    this._home = value;
  }

  get breadCrumbItems() {
    return this._breadCrumbItems;
  }

  set breadCrumbItems(value) {
    this._breadCrumbItems = value;
    this.onChangeBreadCrumb();
  }

  push(item: MenuItem) {
    if (item) {
      this._breadCrumbItems.push(item);
      this.onChangeBreadCrumb();
    }
  }

  pop() {
    this._breadCrumbItems.pop();
    this.onChangeBreadCrumb();
  }

  insert(item: MenuItem, index: number) {
    if (item) {
      this._breadCrumbItems.splice(index, 0, item);
      this.onChangeBreadCrumb();
    };
  }

  remove(index: number) {
    this._breadCrumbItems.splice(index, 1);
    this.onChangeBreadCrumb();
  }

  onChangeBreadCrumb() {
    this.subject.next(this.breadCrumbItems);
  }

}
