import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppLayoutService } from '@app/app-layout/app-layout.service';
import { AppGlobalService } from '@baseapp/app-global.service';

@Injectable({
  providedIn: 'root'
})
export class TabsBaseService {
  readonly MENUGROUP = "menuGroup";
  readonly TABITEM = "tabItem"
  readonly TABGROUP = "tabGroup"
  tabContents: any = [];

  public router = inject(Router);
  public appLayoutService = inject(AppLayoutService);
  public appGlobalService = inject(AppGlobalService);




  //Get the tab Contents
  getTabItems() {
    const defaultTabs: any[] = [];
    const menuItems = this.appLayoutService.getMenu();
    const keys = Object.keys(menuItems);
    keys.forEach((key: string) => {
      this.separateTabContents(menuItems[key], key);
    })
    this.appGlobalService.write('tabs', []);
    this.appGlobalService.write('tabs', this.tabContents);


  }

  separateTabContents(menu: any, key: string) {
    menu?.forEach((o: any) => {
      if (o.element === this.MENUGROUP) {
        if (o?.children?.length > 0 && (o.children[0]?.element == this.TABGROUP || o.children[0]?.element == this.TABITEM)) {
          this.tabContents.push({
            label: o.label,
            content: {
              paths: o.pathsInvolved,
              item: o.children,
              from: 'menu'
            }
          });
        } else if (o.element === this.MENUGROUP && o?.children?.length > 0) {
          this.separateTabContents(o?.children, key);
        }
      } else if (o.element === this.TABITEM || o.element === this.TABGROUP) {
        this.tabContents.push({
          label: o.label,
          content: {
            paths: o.pathsInvolved,
            item: o,
            from: 'default'
          }
        })
      }
    })
  }

}
