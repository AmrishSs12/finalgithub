import { Component, Directive, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppGlobalService } from '@baseapp/app-global.service';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';

@Directive({

})
export class LogoutBaseComponent {
  logo: string = ""
  public bs = inject(AppLayoutBaseService);
  public router = inject(Router);
  public appGlobalService = inject(AppGlobalService);

  login() {
    let config = this.appGlobalService.get('firebaseConfig');
    if(config?.loginMethod && config?.loginMethod?.type == 'googleCloudIdentity'){
      if(config?.multiTenantProvison){
      this.router.navigateByUrl('/sign-in');
      } else {
        this.router.navigateByUrl('/google-identity-login');
      }
    }
    else{
      this.router.navigateByUrl('/');
    }
  }

  onInit() {
    const data = this.bs.getTopBarCofiguration();
    let appLogoObj: any = (data.left.find((t: { element: string; }) => t.element === "logo"));
    if (appLogoObj?.urlIconFileName) {
      this.logo = `assets/images/` + appLogoObj.urlIconFileName;
    } else {
      this.logo = `assets/images/` + appLogoObj.logoFileName;
    }
    // this.logo = `assets/images/` + ele.logoFileName;
  }



}
