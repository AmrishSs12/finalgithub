import { inject } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent, RouterOutlet } from '@angular/router';
import { AppGlobalService } from '@baseapp/app-global.service';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { TabsService } from './tabs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  tabContents: any[] = [];

  tabConfig: any[] = [];

  currentUrl: string = '';

  readonly TABGROUP = "tabGroup";
  readonly TABITEM = "tabItem";
  readonly DEFAULTTAB = "default";
  readonly DEFAULTIMAGEPATH = "assets/images/";

  readonly NAVIGATION = {
    INTERNALPAGE: "navigate_to_page",
    EXTERNALPAGE: "open_external_url"
  }
  public router = inject(Router);
  public appLayoutService = inject(AppLayoutBaseService);
  public tabService = inject(TabsService)
  public appGlobalService = inject(AppGlobalService)


  getSelectedTab(tabs: any) {
    let selectedIndex = 0;
    tabs?.forEach((item: any, index: number) => {
      if (item.pathsInvolved.includes(this.currentUrl)) {
        selectedIndex = index;
      }
    })
    return selectedIndex;
  }

  bindTabItems() {
    let hasDefaultTabs: boolean = false;
    const defaultContents: any = [];
    const defaultPathsInvolved: any = [];
    this.tabContents = [];
    const tabContents = this.appGlobalService.get('tabs') ? this.appGlobalService.get('tabs') : [];


    tabContents?.forEach((d: any) => {
      if (d.content.paths?.includes(this.currentUrl) && d.content.from === "menu") {
        this.tabContents.push(...d.content.item);
      }
      else if (d.content.from === 'default') {
        defaultContents.push(d.content.item);
        defaultPathsInvolved.push(...d.content.paths);
      }
    })

    if (!this.currentUrl || this.currentUrl === '/' || defaultPathsInvolved.includes(this.currentUrl)) {
      this.tabContents = [...defaultContents];
      const defaultTabProps: any = this.getDefaultTabUrl(this.tabContents) || {};
      if (defaultTabProps.navigation === this.NAVIGATION.INTERNALPAGE && (!this.currentUrl || this.currentUrl === '/'))
        this.router.navigateByUrl(defaultTabProps.url);
      else if (defaultTabProps.navigation === this.NAVIGATION.EXTERNALPAGE) {
        window.location.href = defaultTabProps.url;
      }
    }
    console.log(this.tabContents);
  }


  getDefaultTabUrl(tabContents: any) {
    const firstEl = tabContents[0];
    if (firstEl?.element === this.TABITEM) {
      return (
        {
          url: firstEl.page ? firstEl.page.url : (firstEl.url || ''),
          navigation: firstEl.onClick
        });
    }
    else {
      if (firstEl?.element === this.TABGROUP && firstEl.children) {
        this.getDefaultTabUrl(firstEl.children);
      }
      else {
        return ({
          url: '',
          navigation: ''
        });
      }
    }
    return;
  }


  ngOnInit(): void {
    this.tabService.getTabItems();
    console.log(this.appGlobalService.get('tabs'));
    this.bindTabItems();

    this.router.events.subscribe((event: any) => {
      const url = this.router.url;
      this.currentUrl = url.split("?")[0];
      if (event instanceof NavigationEnd) {
        this.bindTabItems();
      };
    });
  }

  navigateTo(event: { index: number; }, config: any) {
    let activeIndex = event.index;
    const currentConfig = config[activeIndex];

    if (currentConfig.element === this.TABITEM) {
      if (currentConfig.onClick === this.NAVIGATION.INTERNALPAGE) {
        this.router.navigateByUrl(currentConfig.page.url);
      }
      else if (currentConfig.onClick === this.NAVIGATION.EXTERNALPAGE) {
        // window.location.replace("");
        window.location.href = currentConfig.url;
      }
    }
    else if (currentConfig.element === this.TABGROUP) {
      const nestedEle: any = this.getDefaultTabUrl(currentConfig?.children);
      if (nestedEle.navigation === this.NAVIGATION.INTERNALPAGE) {
        this.router.navigateByUrl(nestedEle.url);
      }
      else if (nestedEle.navigation === this.NAVIGATION.EXTERNALPAGE) {
        // window.location.replace("");
        window.location.href = nestedEle.url;
      }

    }
  }

  getMenuImage(item: any) {
    return this.DEFAULTIMAGEPATH + item?.iconFileName
  }

}

