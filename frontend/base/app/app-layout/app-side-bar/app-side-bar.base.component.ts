import { AppLayoutBaseService } from '../app-layout.service.base'
import { TranslateService } from '@ngx-translate/core';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AppUtilService } from '@app/app.util.service';
import { Directive, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppGlobalService } from '@baseapp/app-global.service';


@Directive()
export class AppSideBarBaseComponent {
  menuType: string | undefined;
  floatDirection = "top-right";
  displayLeftMenu: any = true;
  displayRightMenu: any = true;
  badgeValue: number = Math.floor(Math.random() * 10);;

  items: any = [];

  isMobile: boolean = BaseAppConstants.isMobile;
  parentClassName: string = "";
  sideBarElements: any = []
  floatItems: any;
  fixedItems: any;
  floatDialog: any
  fixedSideBar: any
  floatMenuType: any
  fixedMenuType: any;
  menuRecursiveCount: number = 0;
  childrenItemINdex: number = 0;
  fixedSidebarOnInit: boolean = true;
  floatDialogOnInit: boolean = true;
  selectFirstMenuByDefault = BaseAppConstants.selectFirstMenuByDefault;
  @Input() currentPage: any;
  svgContents: any;
  svgFiles: string[] = []



  public bs = inject(AppLayoutBaseService);
  public translate = inject(TranslateService);
  public utilBase = inject(AppUtilService);
  public router = inject(Router);
  public location = inject(PlatformLocation);
  public sanitizer = inject(DomSanitizer);
  public appGlobalService = inject(AppGlobalService);


  getBadgeValue() {
    return this.badgeValue;
  }

  onInit(): void {
    // this.items = this.bs.getMenuItems();
    let values = this.bs.getMenuItems();
    this.showGcipMenuBasedOnEnv(values?.leftMenu?.children);
    this.sideBarElements.push(values.leftMenu)
    this.sideBarElements.push(values.rightMenu)
    let response = this.bs.getMenu();
    this.showGcipMenuBasedOnEnv(response?.left);
    this.sideBarElements?.forEach((sideBarItems: any) => {
      if (sideBarItems?.element == "leftMenu") {
        sideBarItems["children"] = response?.left
      }
      if (sideBarItems?.element == "rightMenu") {
        sideBarItems["children"] = response?.right
      }
    })
    if (this.sideBarElements[0]?.menuType == 'float') {
      this.floatItems = this.sideBarElements[0]
      this.floatMenuType = 'left'
      this.floatDirection = 'top-left'
    } else if (this.sideBarElements[1]?.menuType == 'float') {
      this.floatItems = this.sideBarElements[1]
      this.floatMenuType = 'right'
      this.floatDirection = 'top-right'
    }
    if (this.sideBarElements[0]?.menuType == 'fixed') {
      this.fixedItems = this.sideBarElements[0]
      this.fixedMenuType = 'left'
    } else if (this.sideBarElements[1]?.menuType == 'fixed') {
      this.fixedItems = this.sideBarElements[1]
      this.fixedMenuType = 'right'
    }
    this.menuType = this.bs.getMenuType();
    let pageLink = window.location.href.split('#')[1];
    this.bs.getLeftMenuVisibility().subscribe(d => {
      this.displayLeftMenu = d
      if (this.fixedMenuType == 'left') {
        this.fixedSideBar = this.displayLeftMenu
        if (this.fixedSidebarOnInit && this.fixedSideBar) {
          this.fixedSidebarOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.fixedItems?.children, "fixed", pageLink);
        }
      }
      if (this.floatMenuType == 'left') {
        this.floatDialog = this.displayLeftMenu
        if (this.floatDialogOnInit && this.floatDialog) {
          this.floatDialogOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.floatItems?.children, "float", pageLink);
        }
      }
    });
    this.bs.getRightMenuVisibility().subscribe(d => {
      this.displayRightMenu = d
      if (this.fixedMenuType == 'right') {
        this.fixedSideBar = this.displayRightMenu
        if (this.fixedSidebarOnInit && this.fixedSideBar) {
          this.fixedSidebarOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.fixedItems?.children, "fixed", pageLink);
        }
      }
      if (this.floatMenuType == 'right') {
        this.floatDialog = this.displayRightMenu
        if (this.floatDialogOnInit && this.floatDialog) {
          this.floatDialogOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.floatItems?.children, "float", pageLink);
        }
      }
    });
    if (this.isMobile || this.sideBarElements[0]?.menuType == "float" || this.sideBarElements[1]?.menuType == "float") {
      this.floatDialog = false
      if (this.floatMenuType == 'left' || this.isMobile) {
        this.displayLeftMenu = false
        this.bs.updateLeftMenuVisibility(this.displayLeftMenu);
      }
      if (this.floatMenuType == 'right' || this.isMobile) {
        this.displayRightMenu = false
        this.bs.updateRightMenuVisibility(this.displayRightMenu);
      }
    }
    this.iterateRecursiveArray(this.fixedItems?.children, "fixed", pageLink);
    this.childrenItemINdex = 0
    this.iterateRecursiveArray(this.floatItems?.children, "float", pageLink);
    this.closeSidebar();
    this.findSVGFiles();
    this.fetchMultipleSVGs(this.svgFiles).then(contents => {
      this.svgContents = contents;
      this.sanitizeSVGs();
    }).catch(error => console.error('Error loading SVGs:', error));
  }
  
  // Removing gcip role mapping menu if passwordbased is present in that env and tenant domain config menu if multi-tenant is false
  showGcipMenuBasedOnEnv(items: any){
    const config = this.appGlobalService.get('firebaseConfig'); 
    if(config){
      if(config?.loginMethod?.emailSubAuthenticationType == 'passwordBased' && items){
        for (let childMenu of items) {
          if (childMenu?.label === "ADMIN_CONTROLS" && Array.isArray(childMenu?.children)) {
            childMenu.children = childMenu.children.filter(
              (adminMenu: any) =>
                adminMenu?.customUrl !== '/admin/gcip-role-mapping'
            );
          }
        }
      } else if(!config?.multiTenantProvison && items){
        for (let childMenu of items) {
          if (childMenu?.label === "ADMIN_CONTROLS" && Array.isArray(childMenu?.children)) {
            childMenu.children = childMenu.children.filter(
              (adminMenu: any) =>
                adminMenu?.customUrl !== '/admin/tenant-domain-configuration'
            );
          }
        }
      }
    }
  }

  findSVGFiles() {
    this.svgFiles = [];
    this.sideBarElements.forEach((item: any) => {
      this.recursivelyFindSVGs(item);
    });
  }
  
  recursivelyFindSVGs(item: any) {
    if (!item) {
      return;
    }
  
    if (item.iconFileName && this.isSvgImage(item)) {
      this.svgFiles.push(item.iconFileName);
    }
  
    if (item.children) {
      item.children.forEach((childItem: any) => {
        this.recursivelyFindSVGs(childItem);
      });
    }
  }

  sanitizeSVGs() {
    Object.keys(this.svgContents).forEach(fileName => {
      this.svgContents[fileName] = this.utilBase.sanitizeSvg(this.svgContents[fileName]);
    });
  }
  fetchMultipleSVGs(fileNames: string[]): Promise<{ [key: string]: string }> {
    const fetchPromises = fileNames.map(file =>
      fetch(`assets/images/${file}`)
        .then(response => response.text())
        .then(content => ({ [file]: content })) // Return object with filename as key
    );

    return Promise.all(fetchPromises).then(results => {
      return results.reduce((acc, result) => {
        return { ...acc, ...result };
      }, {});
    });
  }

  isSvgImage(item: any): boolean {
    const imageName = item?.iconFileName;
    return imageName && imageName.endsWith('.svg');
  }

  onBeforeDialogHide() {
    if (this.floatMenuType == 'left' || this.isMobile) {
      this.bs.updateLeftMenuVisibility(this.displayLeftMenu = false);
    }
    if (this.floatMenuType == 'right' || this.isMobile) {
      this.bs.updateRightMenuVisibility(this.displayRightMenu = false);
    }
  }

  toggleList(rootIndex: any, level: any, itemIndex: any, sideBarMenuType: any, item: any) {
    if (level != 0) {
      itemIndex = rootIndex
    }

    $('#sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).toggle();
    if ($('#sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).css('display') == 'none') {
      if (this.selectFirstMenuByDefault && item.children) {
        $('.collapse').css('display', 'none')
        $('.sidebar-menu-items').addClass('collapsed');
      }
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).addClass('collapsed');
    } else {
      if (this.selectFirstMenuByDefault && item.children) {
        $('.collapse').css('display', 'none')
        $('.sidebar-menu-items').addClass('collapsed');
        $('#sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).css('display', 'block');
        if (item.children[0].page?.url) {
          this.highlightActiveMenu(item.children[0], itemIndex, sideBarMenuType);
          this.router.navigateByUrl(item.children[0].page?.url);
        }
      }
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).removeClass('collapsed');
    }
    if (!item.children) {
      this.onBeforeDialogHide()
      /* if (item?.page?.url) {
        item?.pathsInvolved?.forEach((obj: any) => {
          if (obj.indexOf(item?.page?.url) >= 0 || obj.indexOf(item?.link) >= 0) {
            this.highlightActiveMenu(item, itemIndex, sideBarMenuType)
          }
        })
      } else */
      if (item?.link || item?.url) {
        let customUrl = (item?.link || item?.url)
        window.open(customUrl, "_blank");
      }
    }
  }

  togglePopupShow() {
    $('.popover-content').show()
  }

  togglePopupHide() {
    $('.popover-content').hide()
  }

  mainMenuClick(event: any) {
    let menu = event.target.closest('a').className?.indexOf('menu-active')
    if (menu >= 0) {
      Array.from(document.querySelectorAll('.sidebar-heading-menu-items')).forEach((el) => el.classList.remove('menu-active'));
      setTimeout(() => {
        event.target.closest('a').className += ' menu-active'
      }, 100);
    }
  }

  highlightActiveMenu(item: any, itemIndex: any, sideBarMenuType: any, onInit: any = "") {
    if (onInit != 'onInit') {
      this.removeMenuActiveClasses()
    }
    setTimeout(() => {
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).addClass('menu-active')
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-1').addClass('menu-active')
    }, 100)
  }

  removeMenuActiveClasses() {
    Array.from(document.querySelectorAll('.sidebar-menu-items')).forEach((el) => el.classList.remove('menu-active'));
  }

  showSideBar(showSideBar: any) {
    if (showSideBar == 0) {
      return ((this.fixedMenuType == 'left') ? !this.displayLeftMenu : !this.displayRightMenu);
    } else {
      return ((this.floatMenuType == 'left') ? !this.displayLeftMenu : !this.displayRightMenu);
    }
  }

  getMenuImage(item: any) {
    return "assets/images/" + item?.iconFileName
  }

  iterateRecursiveArray(children: any, menuType: string, pageLink: any) {
    if (children && children?.length > 0) {
      children?.forEach((items: any) => {
        if (menuType == "fixed") {
          if (this.fixedItems.children == children) {
            this.menuRecursiveCount = 0
            ++this.childrenItemINdex
          }
        }
        if (menuType == "float") {
          if (this.floatItems.children == children) {
            this.menuRecursiveCount = 0
            ++this.childrenItemINdex
          }
        }
        items["menuRecursiveCount"] = ++this.menuRecursiveCount
        /* if (!items?.children && pageLink != "/") {
          items?.pathsInvolved?.forEach((obj: any) => {
            if (obj.indexOf(pageLink) >= 0) {
              this.highlightActiveMenu(items, this.childrenItemINdex - 1, menuType == 'fixed' ? 0 : 1, "onInit")
            }
          })
        } */
        if (items?.children && items?.children?.length > 0) {
          this.iterateRecursiveArray(items.children, menuType, pageLink)
        }
      })
    }
  }




  ngOnChanges(changes: SimpleChanges) {
    if (changes?.currentPage?.currentValue) {
      this.highlightRootMenu()
    }
  }


  handleActiveRoute(item: any) {
    const currPage = window.location.hash?.slice(1)?.split('?')[0];
    if (item.pathsInvolved?.includes(currPage) && (item.element === "menuItem" || item.element == "menuGroup")) {
      return 'menu-active';
    }
    else
      return '';

  }
  activeChange(item: any, enabled: boolean, level: number) {
      const currPage = window.location.hash?.slice(1)?.split('?')[0];
    const eleId = `${item.label}${level}`;
      if (enabled === false) {
          if (item.pathsInvolved?.includes(currPage) && item.element === "menuItem") {
              $('#' + eleId).addClass('menu-active');
          }
      }
      this.highlightRootMenu();
  }


  highlightRootMenu() {
    let activeMenuElementClassList: any = document.querySelector('.sidebar-submenu-menu-items.menu-active')?.classList?.value?.split(' ')
    if (activeMenuElementClassList) {
      let classNameIndex = activeMenuElementClassList?.findIndex((element: any) => element.includes("sidebar-item-level"));
      const className = activeMenuElementClassList[classNameIndex];
      this.parentClassName = (className.split('-').slice(0, -1).join('-')) + "-1";
      Array.from(document.querySelectorAll('.sidebar-heading-menu-items')).forEach((el) => el.classList.remove('menu-active'));
      $('.' + this.parentClassName).addClass('menu-active');
    }
    else if (this.parentClassName) {
      $('.' + this.parentClassName).removeClass('menu-active');
    }
  }

  onMouseEnter(event: any, level: number) {
    let ele = event.target;
    if (ele && event.target?.className.includes('popover-wrapper' + level)) {
      let menus = event.target?.children[2];
      if (menus) {
        // to display the arrow
        ele.style.setProperty("--pseudo-visibility", 'visible');
        // For floated menu display
        let menuHeight = menus.clientHeight;
        let eleTop = ele.getBoundingClientRect().top;
        let eleRight = ele.getBoundingClientRect().right;
        let eleHeight = ele.clientHeight;
        event.target.children[2].style.left = eleRight + 'px';
        if ((eleTop < menuHeight / 2) || ((window.innerHeight - eleTop) < menuHeight / 2)) {
          if (eleTop > menuHeight) {
            // display on top of the icon if the overlay height can be occupied.
            event.target.children[2].style.top = (eleTop - menuHeight + ele.clientHeight) + 'px'
          } else if ((window.innerHeight - eleTop) > menuHeight) {
            // display on bottom of the icon if the overlay height can be occupied.
            event.target.children[2].style.top = eleTop + 'px'
          } else {
            // display from the top
            event.target.children[2].style.top = '60px';
          }
        } else {
          // display center aligned to the icon
          event.target.children[2].style.top = ((eleTop + (eleHeight / 2)) - (menuHeight / 2)) + 'px';
          event.target.children[2].style.left = eleRight + 'px';
        }
      } else {
        ele.style.setProperty("--pseudo-visibility", 'hidden');
      }
    }
  }


  closeSidebar() {
    this.router.events.subscribe((event: any) => {
      this.location.onPopState(() => { this.onBeforeDialogHide() });
    });
  }

  getCurrentContextPath(): string {
    return this.utilBase.getCurrentContextPath();
  }

  /**
   * Navigate to a URL with context path support
   * Handles suite to member, member to member, and member to suite navigation
   */
  navigateWithContextPath(item: any): void {
    this.utilBase.navigateWithContextPath(item);
  }

  navigateToApp(contextPath: string, url: string): void {
    this.utilBase.navigateToApp(contextPath, url);
  }

  isCrossAppNavigation(item: any): boolean {
    return this.utilBase.isCrossAppNavigation(item);
  }

  getPageUrl(item: any) {
    return this.utilBase.getTabPageUrl(item);
  }

}
