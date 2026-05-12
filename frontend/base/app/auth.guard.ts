import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppGlobalService } from './app-global.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private appGlobalService: AppGlobalService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currRoles = this.appGlobalService.getCurrentUserData()?.userRoles;
    const allowedRoles = route.data?.roles;
    const allIndex = allowedRoles.findIndex((role: string) => role.toLowerCase() === 'all');
    if (allIndex > -1) {
      return true;
    }
    else {
      const hasRole = currRoles?.some((role: string) => allowedRoles?.includes(role));
      return hasRole;
    }
  }
}
