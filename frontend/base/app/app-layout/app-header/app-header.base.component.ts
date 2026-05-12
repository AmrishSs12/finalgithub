
import { TranslateService } from '@ngx-translate/core';
import { AppLayoutBaseService } from '../app-layout.service.base'
import { BaseAppConstants } from '../../app-constants.base'
import { AfterViewInit, Component, Directive, Input, QueryList, ViewChildren } from '@angular/core';
import { AppUtilService } from '@app/app.util.service';
import { Router } from '@angular/router';
import { inject, Inject } from '@angular/core';
import { ApiConstants } from '@app/api.constants';
import { BaseService } from '@baseapp/base.service';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, catchError, throwError } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { BaseApiConstants } from '@baseapp/api-constants.base';
import { registerLocaleIfNeeded } from '@baseapp/locale-loader';
import { getAuth, signOut } from "firebase/auth";
import { DOCUMENT } from '@angular/common'; 


@Directive()
export abstract class AppHeaderBaseComponent {
  selectedLang: any;
  displayLeftMenu = true;
  displayRightMenu = true;
  menuType!: string;
  headerElements: any;
  logo!: any;
  mobileLogo!: any;
  rightMenu: any;
  hamburgerMenu: any;
  hamburgerMenuRight: any;
  isMiddleMenuNotEmpty: boolean = true
  userLanguage ="";
  isMobile: boolean = BaseAppConstants.isMobile;
  appHeaderContentFloat: boolean = false
  isMenuFixed: Boolean = false;
  currentUserData: any;
  isPrototype = environment.prototype;
  loggedinUserDetails: any = {}
  languageOptions:any[]=[];
  langLabel: any = {
    "English": "English",
    "German": "Deutsch",
    "French": "Français",
    "Dutch": "Nederlands",
    "Chinese": "中国人",
    "Japanese": "ドイツ語",
    "Korean": "한국인",
    "Portuguese": "Português",
    "Spanish": "Español",
    "Polish": "Polski",
    "Russian": "Русский",
    "Ukrainian": "українська",
    "Norwegian": "norsk",
    "Hungarian": "magyar",
    "Romanian": "română",
    "Thai": "แบบไทย",
    "Turkish": "Türkçe"
  }
  subscriptions: Subscription[] = [];
  @Input() displayMenus: boolean | undefined;

  languageCodes:any[]=[];

  public translate = inject(TranslateService);
  public confirmationService = inject(ConfirmationService);
  public bs = inject(AppLayoutBaseService);
  public utilBase = inject(AppUtilService);
  public router = inject(Router);
  public appGlobalService = inject(AppGlobalService);
  public baseService = inject(BaseService);
  constructor(@Inject(DOCUMENT) private document: Document) { }

  @ViewChildren('DropdownWithSubMenu') dropdownsWithSubMenu!: QueryList<NgbDropdown>;
  public translateService = inject(TranslateService);



  setLanguageDefault(obj:any,code:any){
                try {
          if(obj){
            this.userLanguage = obj?.languages[0]?.code;
          }
          else if(code){
            this.userLanguage = code;
          }
          let payload={"languageCode":this.userLanguage}
          const serviceOpts = BaseApiConstants.updateLanguage;
          this.baseService.put(serviceOpts,payload).subscribe((response: any) => {
          },)
        }
        catch(error){
          console.log('error');
        }    
  }


  onInit(): void {
    this.headerElements = this.bs.getTopBarCofiguration();
    localStorage.setItem("formChanged", JSON.stringify(false));
    this.getMenuElement();
    this.getLoggedInUsedDetails();
    let response = this.bs.getMenu();
if (response?.topBarRight) {
      response.topBarRight.forEach((item: any) => {
        if (item?.languages?.length > 0) {
          item.languages = item.languages.map((language:any) => ({
            ...language,
            label: this.langLabel[language.name] || language.name // Adding label for respective language
          }));
        }
      });
    }
      this.headerElements?.middle?.forEach((headerItems: any) => {
        if (headerItems?.element == "leftPane") {
          headerItems["children"] = response?.topBarLeft
        }
        if (headerItems?.element == "middlePane") {
          headerItems["children"] = response?.topBarMiddle
        }
        if (headerItems?.element == "rightPane") {
                    headerItems["children"] = response?.topBarRight
          if (headerItems["children"]?.length > 0) {
            headerItems["children"]?.forEach((obj: any) => {
              if (obj?.languages?.length > 0) {
                this.languageCodes = [...obj?.languages];
                let selectedLanguage = this.currentUserData?.languageCode;
                if (selectedLanguage && this.languageCodes.some(l => l.code === selectedLanguage)) {        
                  this.selectedLang = this.languageCodes.find(l=>l.code==selectedLanguage);
                    this.changeLanguage(this.selectedLang.code);
                }
                else {
                  selectedLanguage = localStorage.getItem('selectedLanguage');
                  try {
                    const parsedLanguage = JSON.parse(selectedLanguage);
                    if (parsedLanguage) {
                      this.selectedLang = parsedLanguage;
                      this.changeLanguage(this.selectedLang.code);
                      if (!this.isPrototype) {
                        this.setLanguageDefault(null,this.selectedLang.code);
                      }
                    } else {
                      this.changeLanguage(obj?.languages[0].code);
                      if(!this.isPrototype) {
                        this.setLanguageDefault(obj,null);
                      }
                    }
                  } catch (error) {
                    console.error('Error parsing selected language from localStorage:', error);
                    this.changeLanguage(obj?.languages[0].code);
                    if(!this.isPrototype) {
                      this.setLanguageDefault(obj,null);
                    }
                  }
                }
              }
            })
          }
      }
    })
    this.headerElements?.left?.forEach((headerItems: any) => {
      if (headerItems?.element == "leftMenu") {
        headerItems["children"] = response?.left
        this.isMenuFixed = (response.left.length > 0 && headerItems.menuType == 'fixed');
      }
    })
    this.headerElements?.right?.forEach((headerItems: any) => {
      if (headerItems?.element == "rightMenu") {
        headerItems["children"] = response?.right
        this.rightMenu["children"] = response?.right
      }
    })
    if (response?.topBarLeft?.length <= 0 && response?.topBarMiddle?.length <= 0 && response?.topBarRight?.length <= 0) {
      this.isMiddleMenuNotEmpty = false
    }
    this.menuType = this.bs.getMenuType();
    this.getLogo();
    this.getMenuBar();
    this.bs.getLeftMenuVisibility().subscribe(d => { this.displayLeftMenu = d });
    this.bs.getRightMenuVisibility().subscribe(d => { this.displayRightMenu = d });
  }

ngAfterViewInit() {

    // Set offset for submenus to fix positioning
    this.dropdownsWithSubMenu?.forEach((dropdown: NgbDropdown, index: number) => {
      dropdown.popperOptions = (options) => ({
        ...options,
        modifiers: [
          ...(options.modifiers || []),
          {
            name: 'offset',
            options: {
              offset: [16, 16]
            },
          },
        ],
      });
    });

  }

  public showMenu(menuType: any): void {
    if (menuType == 'left') {
      this.bs.updateLeftMenuVisibility(this.displayLeftMenu = !this.displayLeftMenu);
    } else {
      this.bs.updateRightMenuVisibility(this.displayRightMenu = !this.displayRightMenu);
    }
  }

  getLogo() {
    const ele = (this.headerElements.left.find((t: { element: string; }) => t.element === "logo"));
    this.logo = `assets/images/` + ele.logoFileName;
    this.mobileLogo = `assets/images/` + ele.mobileLogoFileName;
    if (!this.mobileLogo) {
      this.mobileLogo = this.logo
    }
  }

  getMenuElement() {
    this.rightMenu = this.headerElements.right.find((t: { element: string; }) => t.element === "rightMenu");
  }

  onLanguageSwitch(lang: any) {
    if (!this.isPrototype) {
      this.callConfirmationService(lang);
    } else {
      localStorage.setItem('selectedLanguage', lang);
      this.selectedLang = lang;
      this.changeLanguage(lang.code)
    }
  }
  async changeLanguage(code:any) {
    this.translate.use(code);
    await registerLocaleIfNeeded(code);
  }

  callConfirmationService(lang:any){
    let formChanged = localStorage.getItem("formChanged");
      if (formChanged && JSON.parse(formChanged)) {
        this.confirmationService.confirm({
          message: this.translateService.instant('Do_you_want_to_discard_all_unsaved_changes_and_reload_QUESTION'),
          header: this.translateService.instant('Confirmation'),
          icon: 'pi pi-info-circle',
          accept: () => {
            this.setLanguageDefault(null,lang.code);
            window.location.reload();
          },
          reject: () => {
            if(this.currentUserData['languageCode']){
              this.selectedLang = this.languageCodes.find(l=>l.code==this.currentUserData['languageCode']);
            }
          },
        });
    }
    else if (!this.isPrototype){
      this.setLanguageDefault(null,lang.code);
      window.location.reload();
        }
  }

  getMenuBar() {
    const ele = (this.headerElements.left.find((t: { element: string; }) => t.element === "leftMenu"));
    if (ele) {
      this.hamburgerMenu = `assets/images/` + ((ele.iconFileName) ? ele.iconFileName : 'hamburger_menu.svg');
    }
    const eleRight = (this.headerElements.right.find((t: { element: string; }) => t.element === "rightMenu"));
    if (eleRight) {
      this.hamburgerMenuRight = `assets/images/` + ((eleRight.menuIconFileName) ? eleRight.menuIconFileName : 'hamburger_menu.svg');
    }
  }

  navigateToHomePage() {
    this.router.navigateByUrl('/')
  }


  logoutUser(e: any, defaultLink: string) {
    let config = this.appGlobalService.get('firebaseConfig');
    const logoutUrl = "/logout";
    if(config && config?.loginMethod && config?.loginMethod?.type == 'googleCloudIdentity'){
      if(this.appGlobalService.get('firebaseapp')){
        let auth = getAuth(this.appGlobalService.get('firebaseapp'));
        signOut(auth)
        .then(() => {
          console.log("User signed out.");
          this.document.location.href = logoutUrl;
        })
        .catch((error: any) => {
          console.error("Sign out error:", error);
          this.document.location.href = logoutUrl;
        });
      } else {
        this.document.location.href = logoutUrl;
      }
    } else {
      this.document.location.href = logoutUrl;
    }
  }

  getLoggedInUsedDetails() {
    this.currentUserData = this.appGlobalService.getCurrentUserData() || {};
    this.loggedinUserDetails.userName = this.currentUserData?.firstName || 'Prototype User';
    this.loggedinUserDetails.email = this.currentUserData?.email || 'Prototype User'
  }

  checkSVG(fileName: any) {
    return fileName?.toLowerCase().includes('.svg')
  }

  isMenuDropdownActive(item: any): boolean {
  if (!item?.children?.length) return false;
  
  const currentUrl = this.router.url.split(/[?#]/)[0].toLowerCase();
  const hasActiveChild = item.children.some((childItem: any) => {
    const childUrl = this.getItemUrl(childItem);
    if (childUrl && currentUrl.includes(childUrl.toLowerCase())) {
      return true;
    }
    
    if (childItem?.children?.length) {
      return childItem.children.some((subChild: any) => {
        const subChildUrl = this.getItemUrl(subChild);
        return subChildUrl && currentUrl.includes(subChildUrl.toLowerCase());
      });
    }
    
    return false;
  });
  
    return hasActiveChild;  
  }

  getItemUrl(item: any): string | null {
    return item?.page?.url || item?.customUrl || item?.link || item?.url || null;
  }

  getCurrentContextPath(): string {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    // If there's a segment before the hash, it's the context path
    return segments.length > 0 ? segments[0] : '';
  }

  /**
   * Navigate to a URL with context path support
   * Handles suite to member, member to member, and member to suite navigation
   */
  navigateWithContextPath(item: any): void {
    const targetContextPath = item?.contextPath || '';
    const currentContextPath = this.getCurrentContextPath();
    const targetUrl = item?.customUrl || item?.page?.url || '';

    // Determine navigation type
    if (item?.onClick === 'navigate_to_member_app' || targetContextPath) {
      // Navigate to member app
      this.utilBase.navigateToApp(targetContextPath, targetUrl);
    } else if (item?.onClick === 'navigate_to_suite_app') {
      // Navigate to suite app (no context path)
      this.utilBase.navigateToApp('', targetUrl);
    } else {
      // Default behavior - check if cross-app navigation is needed
      if (targetContextPath !== this.utilBase.getCurrentContextPath()) {
        this.utilBase.navigateToApp(targetContextPath, targetUrl);
      }
      // else: same app navigation handled by routerLink in template
    }
  }


  navigateToApp(contextPath: string, url: string): void {
    this.utilBase.navigateToApp(contextPath, url);
  }

  isCrossAppNavigation(item: any): boolean {
    return this.utilBase.isCrossAppNavigation(item);
  }

  getPageUrl(item: any): string | null {
    return this.utilBase.getTabPageUrl(item);
  }
}