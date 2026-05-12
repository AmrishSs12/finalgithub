import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS, HttpBackend, HttpClientXsrfModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { AppLayoutComponent } from '@app/app-layout/app-layout.component';
import { AppHeaderComponent } from '@app/app-layout/app-header/app-header.component';
import { AppSideBarComponent } from '@app/app-layout/app-side-bar/app-side-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthenticationResolver } from '@app/auth/authentication.resolver';
import { DirectiveModule } from './directive/directive.module';
import { SidebarModule } from 'primeng/sidebar';
import { AppHomePageComponent } from "@app/app-home-page/app-home-page.component";
import { AuthModule } from '@app/auth/auth.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';

import { AppLoaderComponent } from './app-loader.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AppBaseService } from './app.base.service';
import { DialogService } from 'primeng/dynamicdialog';
import { WidgetsBaseModule } from '@libbase/widgets.base.module';
import { SharedModule } from '@app/shared/shared.module';
import { HttpRequestInterceptorService } from './http-request-interceptor.service';
import { registerLocaleData } from '@angular/common';
import { BaseAppConstants } from './app-constants.base';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalErrorHandler } from './globalErrorHandler';
import { CalendarLocaleService } from './calendar-locale.service';
import { registerLocaleIfNeeded } from './locale-loader';


const userLang = BaseAppConstants.defaultLocale.substring(0, 2) || 'en';
registerLocaleIfNeeded(userLang);



export function HttpLoaderFactory(http: HttpBackend) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n-base/', suffix: '.json' },
    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}
@NgModule({
  declarations: [
    AppLayoutComponent,
    AppHeaderComponent,
    AppSideBarComponent,
    AppHomePageComponent,
    AppLoaderComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
          cookieName: 'XSRF-TOKEN',
          headerName: 'X-XSRF-TOKEN'
        }),
    DirectiveModule,
    WidgetsBaseModule,
    NgbDropdownModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend]
      }
    }),
    SidebarModule,
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    //   // Register the ServiceWorker as soon as the application is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: "registerImmediately"
    // }),
    AuthModule


  ],
  exports: [
    BrowserAnimationsModule,
    TranslateModule,
    AuthModule,
    SharedModule
  ],
  providers: [ConfirmationService, AuthenticationResolver, MessageService, DatePipe, AppBaseService, DialogService, DecimalPipe,CalendarLocaleService,
    [
      { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptorService, multi: true },
      { provide: ErrorHandler, useClass: GlobalErrorHandler }
    ],
  ],
  bootstrap: []
})
export class AppBaseModule {

}

