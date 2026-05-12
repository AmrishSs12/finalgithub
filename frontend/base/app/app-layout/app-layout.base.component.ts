import { inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AppLayoutBaseService } from './app-layout.service.base';
import { debounceTime, fromEvent, Subject, Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

export class AppLayoutBaseComponent {
    isMobile: boolean = BaseAppConstants.isMobile;
    sideBarElements: any = []
    floatItems: any;
    fixedItems: any;
    floatMenuType: any
    fixedMenuType: any;
    displayLeftMenu: any = true;
    displayRightMenu: any = true;
    currentPage: any;

    public bs = inject(AppLayoutBaseService);
    public router = inject(Router)
    public activeRouteComponent!: any;

    public resizeSubscription: Subscription = fromEvent(window, 'resize').pipe(debounceTime(1000))
        .subscribe((_event:any) => {
            this.resizeSubject.next();
        }
    );

    private resizeSubject = new Subject<void>();
    private lastWidth = window.innerWidth;
    public confirmationService = inject(ConfirmationService);
    public translateService = inject(TranslateService);
    

    onInit(): void {
        let values = this.bs.getMenuItems();
        this.sideBarElements.push(values.leftMenu)
        this.sideBarElements.push(values.rightMenu)
        this.bs.getConfigData().subscribe((response: any) => {
            this.sideBarElements?.forEach((sideBarItems: any) => {
                if (sideBarItems?.element == "leftMenu") {
                    sideBarItems["children"] = response?.left
                }
                if (sideBarItems?.element == "rightMenu") {
                    sideBarItems["children"] = response?.right
                }
            })
        })
        if (this.sideBarElements[0]?.menuType == 'float') {
            this.floatItems = this.sideBarElements[0]
            this.floatMenuType = 'left'
        } else if (this.sideBarElements[1]?.menuType == 'float') {
            this.floatItems = this.sideBarElements[1]
            this.floatMenuType = 'right'
        }
        if (this.sideBarElements[0]?.menuType == 'fixed') {
            this.fixedItems = this.sideBarElements[0]
            this.fixedMenuType = 'left'
        } else if (this.sideBarElements[1]?.menuType == 'fixed') {
            this.fixedItems = this.sideBarElements[1]
            this.fixedMenuType = 'right'
        }
        this.bs.getLeftMenuVisibility().subscribe(d => {
            this.displayLeftMenu = d
        });
        this.bs.getRightMenuVisibility().subscribe(d => {
            this.displayRightMenu = d
        });

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.currentPage = event.url
            }
            const url = this.router?.url;
            let urlArray = (url.split("?")[0]).split("/");
            const el = (<HTMLInputElement>document.getElementById("layout-container"));
            if ((urlArray?.pop()) === 'home') {
                el.classList.add('home-layout');
            }
            else {
                el.classList.remove('home-layout');
            }
        });

        this.setupWindowResizeHandler();
    }

    onActivate(component: any): void {
        this.activeRouteComponent = component;
    }

    private setupWindowResizeHandler() {

        // Reload app on window-resize if there is layout change (Mobile/Desktop)
        this.resizeSubject.subscribe(() => {
            const currentWidth = window.innerWidth;
            const isChangedFromDesktopToMobile = currentWidth <= BaseAppConstants.mobileMaxWidth && this.lastWidth > BaseAppConstants.mobileMaxWidth;
            const isChangedFromMobileToDesktop = currentWidth > BaseAppConstants.mobileMaxWidth && this.lastWidth <= BaseAppConstants.mobileMaxWidth;
            const isLayoutChanged =  isChangedFromDesktopToMobile || isChangedFromMobileToDesktop;
            
            this.lastWidth = currentWidth;
            
            if (isLayoutChanged) {

                    this.showConfirmationAndReload();

            }
        });
    }

    showConfirmationAndReload() {
        
        this.confirmationService.confirm({
          message: this.translateService.instant('We_noticed_you_QUOTE_ve_resized_the_window_DOT_To_ensure_everything_displays_correctly_COM_would_you_like_to_refresh_the_page_QUESTION'),
          header: this.translateService.instant('Confirmation'),
          icon: 'pipi-info-circle',
          accept: () => {
            location.reload();
          },
          reject: () => {
          },
        });
    
    }
}
