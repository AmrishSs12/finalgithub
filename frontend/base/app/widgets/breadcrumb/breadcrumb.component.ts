
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  bcItems: MenuItem[] = [];
  home: MenuItem = {};
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';

  private breadcrumbService = inject(BreadcrumbService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translateService = inject(TranslateService);


  ngOnInit(): void {
    this.watchRouteChanges();
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

    for (const child of children) {
      let routeURL: string;
      routeURL = child.snapshot.url.map(segment => segment.path).join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      //const usePageId = child.snapshot.data.usePageId ? true : false;

      let label = ((child.snapshot.data[BreadcrumbComponent.ROUTE_DATA_BREADCRUMB] ?
        child.snapshot.data[BreadcrumbComponent.ROUTE_DATA_BREADCRUMB] :
        child.snapshot?.routeConfig?.path) || '').toUpperCase();
      if (label) {
        this.translateService.get(label).subscribe(l => {
          if (!(label == null || label == undefined)) {
            // breadcrumbs.push({ label: l, url });
            breadcrumbs.push({ label: l });
          }
        })

      }
      //breadcrumbs.push({ label, url });

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

  ngAfterViewChecked(): void {
    //this.watchBreadcrumbChanges();
    //this.watchBreadcrumbConfChanges();
  }

}
