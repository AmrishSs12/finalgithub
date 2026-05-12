
import { Directive, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadcrumbComponent } from '@libsrc/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '@libsrc/breadcrumb/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';


@Directive({})
export class BreadcrumbBaseComponent {
  bcItems: MenuItem[] = [];
  home: MenuItem = {};
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  private breadcrumbService = inject(BreadcrumbService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translateService = inject(TranslateService);


  onInit(): void {
    this.watchRouteChanges();
    this.translateService.onLangChange.subscribe(() => {
      this.breadcrumbService.breadCrumbItems = this.createBreadcrumbs(this.activatedRoute.root);
    });
    this.breadcrumbService.breadcrumbChanges.subscribe((res: any) => {
      this.bcItems = res;
    });
    this.breadcrumbService.breadCrumbItems = this.createBreadcrumbs(this.activatedRoute.root);
    this.home = this.breadcrumbService.home;
  }

  watchRouteChanges() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbService.breadCrumbItems = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '#', breadcrumbs: MenuItem[] = []): any {

    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }
    
    const child = children[children.length-1];
    const urlSegments = child.snapshot.url;

    if(child.children.length === 0 && urlSegments.length > 0) {
        const lastSegment = urlSegments[urlSegments.length-1];
        url += `/${lastSegment.path}`;

        let label = ((child.snapshot.data.breadcrumb ?
          child.snapshot.data.breadcrumb :
          lastSegment.path).toUpperCase() || '');

        if (label) {
            this.translateService.get(label).subscribe(l => {
                if (!(label == null || label == undefined)) {
                    breadcrumbs.push({ label: l });
                }
            });
        }
        
    }
    
    return this.createBreadcrumbs(child, url, breadcrumbs);
  }

  ngAfterViewChecked(): void {
    //this.watchBreadcrumbChanges();
    //this.watchBreadcrumbConfChanges();
  }

}
