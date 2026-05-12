import { Injectable,inject } from '@angular/core';
import { Subject, Observable, take, of } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import * as menuData from 'base/assets/menu.json';

@Injectable({
  providedIn: 'root'
})
export class AppLayoutBaseService {
  private displayMenu = new Subject<boolean>();
  private menuType: string = 'float';
  private displayLeftMenu = new Subject<boolean>();
  private displayRightMenu = new Subject<boolean>();
  
   public titleService = inject(Title);
   public translateService = inject(TranslateService);
   public appGlobalService = inject(AppGlobalService);
  config : any = {"left":[{"defaultDetailPageEnabled":false,"infiniteScroll":false,"urlIconFileName":"e938d203-e1f4-46fb-8fd3-334102133689.svg","logoFileName":"f6f364db-3321-469d-8af8-eca6d7e40242.svg","currentNode":"ef02a6bd-f371-4bb0-bc4f-3e93a3f5badc","mobileLogoFileName":"7d81c433-9b1c-41d8-899a-000e82d69dbb.svg","enableLookup":false,"detailPagePopupWidth":70,"outline":false,"valueChange":true,"autoFillLookup":false,"displayAsToggleSwitch":false,"hideListPageTitle":false,"element":"logo"},{"detailPagePopupWidth":70,"defaultDetailPageEnabled":false,"outline":false,"autoFillLookup":false,"displayAsToggleSwitch":false,"menuType":"fixed","hideListPageTitle":false,"hideSidebarOnCollapse":false,"enableLookup":false,"element":"leftMenu"},{"detailPagePopupWidth":70,"defaultDetailPageEnabled":false,"outline":false,"autoFillLookup":false,"displayAsToggleSwitch":false,"hideListPageTitle":false,"enableLookup":false,"element":"appTitle"}],"middle":[{"detailPagePopupWidth":70,"defaultDetailPageEnabled":false,"outline":false,"autoFillLookup":false,"displayAsToggleSwitch":false,"hideListPageTitle":false,"enableLookup":false,"element":"leftPane"},{"detailPagePopupWidth":70,"defaultDetailPageEnabled":false,"outline":false,"autoFillLookup":false,"displayAsToggleSwitch":false,"hideListPageTitle":false,"enableLookup":false,"element":"middlePane"},{"detailPagePopupWidth":70,"defaultDetailPageEnabled":false,"outline":false,"autoFillLookup":false,"displayAsToggleSwitch":false,"hideListPageTitle":false,"enableLookup":false,"element":"rightPane"}],"right":[{"children":[{"detailPagePopupWidth":70,"defaultDetailPageEnabled":false,"outline":false,"autoFillLookup":false,"displayAsToggleSwitch":false,"link":"/logout","hideListPageTitle":false,"label":"Logout","enableLookup":false,"element":"logout"}],"element":"user"},{"detailPagePopupWidth":70,"defaultDetailPageEnabled":false,"outline":false,"autoFillLookup":false,"displayAsToggleSwitch":false,"menuType":"float","hideListPageTitle":false,"enableLookup":false,"element":"rightMenu"}]};

  public getLeftMenuVisibility(): Observable<boolean> {
    return this.displayLeftMenu.asObservable();
  }

  public updateLeftMenuVisibility(displayLeftMenu: boolean): void {
    this.displayLeftMenu.next(displayLeftMenu);
  }

  public getRightMenuVisibility(): Observable<boolean> {
    return this.displayRightMenu.asObservable();
  }

  public updateRightMenuVisibility(displayRightMenu: boolean): void {
    this.displayRightMenu.next(displayRightMenu);
  }

  public getMenuType(): string {
    return this.menuType;
  }

  public getTopBarCofiguration() {
    return this.config;
  }

  public getMenuItems() {

    const leftMenu: any = (this.config.left.find((t: { element: string; }) => t.element === "leftMenu"))
    const rightMenu: any = (this.config.right.find((t: { element: string; }) => t.element === "rightMenu"));
    let left = (leftMenu?.children ? leftMenu : false)
    // return (left || rightMenu);
    return { leftMenu: leftMenu, rightMenu: rightMenu }
  }

  public getStyles(item: any) {
    let properties = ['fontsize', 'font-family', 'color', 'background-color', 'height', 'width', 'margin', 'padding'];
    let styleObj: any = {};
    if (item) {
      for (const key in item) {
        if (key != "backgroundColor") {
          if (properties.includes((key.toLowerCase()))) {
            styleObj[key] = item[key];
          }
        }
        else if(key == "backgroundColor") {
          styleObj['background-color'] = item['backgroundColor'];
        }
      }
    }
    return styleObj;
  }

  getConfigData(): Observable<any> {
    return of(menuData);
  }
  
  public setAppTitle() {
    let appTitleObj: any = (this.config.left.find((t: { element: string; }) => t.element === "appTitle"))
    if (appTitleObj?.title) {
    this.translateService.get(appTitleObj.title).pipe(take(1)).subscribe((translatedTitle: string) => {this.titleService.setTitle(translatedTitle)});
   }
  }
  
  public setAppLogo() {
    let appLogoObj: any = (this.config.left.find((t: { element: string; }) => t.element === "logo"));
    let favIcon: any = document.querySelector('#appLogo');
    if (appLogoObj?.urlIconFileName) {
      favIcon.href = `assets/images/` + appLogoObj.urlIconFileName;
    } else {
      favIcon.href = `assets/images/` + appLogoObj.logoFileName;
    }
  }
getMenu() {
    let menuData: any;
    if (environment.prototype) {
      this.getConfigData().subscribe((response) => {
        menuData = response;
      })
    }
    else {
      let currentUserData = this.appGlobalService.getCurrentUserData();
      menuData = currentUserData ? JSON.parse(currentUserData.menuRole) : {};
    }
    menuData = this.customizeMenuContent(menuData);
    return menuData;
  }
customizeMenuContent(menu: any) {
    return menu;
  }
}