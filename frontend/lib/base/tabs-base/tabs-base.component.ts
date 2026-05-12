import { inject, Directive } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppGlobalService } from '@baseapp/app-global.service';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { TabsService } from '@libsrc/tabs/tabs.service';
import { AppUtilService } from '@app/app.util.service';

@Directive({})
export class TabsBaseComponent {

  tabContents: any[] = [];

  tabConfig: any[] = [];

  currentUrl: string = '';

  readonly TABGROUP = "tabGroup";
  readonly TABITEM = "tabItem";
  readonly DEFAULTTAB = "default";
  readonly DEFAULTIMAGEPATH = "assets/images/";

  readonly NAVIGATION = {
    INTERNALPAGE: "navigate_to_page",
    EXTERNALPAGE: "open_external_url",
    MEMBERAPP: "navigate_to_member_app",
    SUITEAPP: "navigate_to_suite_app"
  }
  public router = inject(Router);
  public appLayoutService = inject(AppLayoutBaseService);
  public tabService = inject(TabsService)
  public appGlobalService = inject(AppGlobalService)
  public utilBase = inject(AppUtilService)


  getSelectedTab(tabs: any) {
    let selectedIndex = 0;
    tabs?.forEach((item: any, index: number) => {
      if (item.pathsInvolved?.includes(this.currentUrl)) {
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
        if (d.content?.paths) {
          defaultPathsInvolved.push(...d.content.paths);
        }
      }
    })

    if (!this.currentUrl || this.currentUrl === '/' || defaultPathsInvolved.includes(this.currentUrl)) {
      this.tabContents = [...defaultContents];
      const defaultTabProps: any = this.getDefaultTabUrl(this.tabContents) || {};
      if (defaultTabProps.navigation === this.NAVIGATION.INTERNALPAGE && (!this.currentUrl || this.currentUrl === '/'))
        this.router.navigateByUrl(defaultTabProps.url);
      else if (defaultTabProps.navigation === this.NAVIGATION.EXTERNALPAGE) {

        if (!this.utilBase.isSafeUrl(defaultTabProps.url)) {
            console.warn("Naviagtion blocked to unsafe url ",defaultTabProps.url);
            return;
        }
        window.location.href = defaultTabProps.url;
      }
    }
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

  onInit(): void {
    this.router.events.subscribe((event: any) => {
      const url = this.router.url;
      this.currentUrl = url.split("?")[0];
      // if (event instanceof NavigationEnd) {
      this.bindTabItems();
      // };
    });

    this.tabService.getTabItems();
    console.log(this.appGlobalService.get('tabs'));
    // this.bindTabItems();
  }

  navigateTo(event: { index: number; }, config: any) {
    let activeIndex = event.index;
    const currentConfig = config[activeIndex];

    if (currentConfig.element === this.TABITEM) {
      this.handleTabNavigation(currentConfig);
    }
    else if (currentConfig.element === this.TABGROUP) {
      const nestedEle: any = this.getDefaultTabUrl(currentConfig?.children);
      if (nestedEle?.navigation) {
        this.handleTabNavigation({
          onClick: nestedEle.navigation,
          url: nestedEle.url,
          page: { url: nestedEle.url },
          customUrl: nestedEle.url,
          contextPath: currentConfig.contextPath
        });
      }
    }
  }


  handleTabNavigation(tabConfig: any): void {
    const onClick = tabConfig.onClick;
    const url = tabConfig.customUrl || tabConfig.page?.url || tabConfig.url || '';

    // Check for cross-app navigation
    if (onClick === this.NAVIGATION.MEMBERAPP || onClick === this.NAVIGATION.SUITEAPP) {
      // Cross-app navigation using utility service
      this.utilBase.navigateWithContextPath(tabConfig);
    }
    // Check if contextPath differs from current context
    else if (tabConfig.contextPath && this.utilBase.isCrossAppNavigation(tabConfig)) {
      // Cross-app navigation detected
      this.utilBase.navigateWithContextPath(tabConfig);
    }
    // Internal page navigation
    else if (onClick === this.NAVIGATION.INTERNALPAGE) {
      this.router.navigateByUrl(url);
    }
    // External page navigation
    else if (onClick === this.NAVIGATION.EXTERNALPAGE) {
      if (!this.utilBase.isSafeUrl(url)) {
         console.warn("Naviagtion blocked to unsafe url ",url);
         return;
      }

      window.location.href = url;
    }
    // Default: internal navigation
    else if (url) {
      this.router.navigateByUrl(url);
    }
  }

  getMenuImage(item: any) {
    return this.DEFAULTIMAGEPATH + item?.iconFileName
  }

}

