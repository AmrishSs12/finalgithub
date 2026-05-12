import { Component, Directive, inject, ElementRef } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { catchError, combineLatest, delay, forkJoin, interval, of, take } from 'rxjs';
import { AppBaseService } from '@baseapp/app.base.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AppUtilService } from '@app/app.util.service';

@Directive({
  providers: [MessageService]
})
export class IframeBaseComponent {

  public DynamicDialogRef = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public httpClient = inject(HttpClient);
  public appBaseService = inject(AppBaseService);
  public messageService = inject(MessageService);
  public translateService = inject(TranslateService);
  public appUtilBaseService = inject(AppUtilService);
  public elRef: ElementRef = inject(ElementRef);
  public WFCDomainURL = ""
  authToken: any = {};
  messageData: any = {};
  dataConfig: any = {};
  iframe: any;
  showLoader: boolean = false;
  themeColor = ""

  public Flags: any = {
    isMessageReceivedOnIFrameView: false
  };


  onInit() {
    this.dataConfig = this.config.data.config;
    this.themeColor = this.appUtilBaseService.getThemeColor();
    this.onShowIFrameView();
  }

  onReceivedMessageOnParentWindow(thatEvent: any) {
    if (thatEvent.data.tokenId === "timeline-view" || thatEvent.data.tokenId === "instance-view") {
      if (thatEvent.data.tokenValue?.isMessageReceived === true) {
        this.Flags.isMessageReceivedOnIFrameView = true;
      }
    }
    if (thatEvent.data?.tokenExpired) {
      // this.onRenewToken('timeline-view');
    }
  }

  getStatusMap(translatableLabels: any): object {
    const statusMap: { [key: string]: { label: string } } = {};
    for (const key in translatableLabels) {
      if (translatableLabels.hasOwnProperty(key)) {
        const labelKey = translatableLabels[key].value;
        statusMap[labelKey] = { label: this.translateService.instant(translatableLabels[key].label) };
      }
    }
    return statusMap;
  }

  // Method to get auth token 
  getAuthDetails() {
    return this.appBaseService.getRCToken().pipe(
      catchError((err) => {
        console.error('Failed to fetch auth details', err);
        return of(null);
      })
    );
  }

  getBaseUrl() {
    return this.appBaseService.getRCBaseUrl().pipe(
      catchError((err) => {
        console.error('Failed to fetch base URL', err);
        return of(null);
      })
    );
  }

  onShowIFrameView() {
    this.showLoader = true;
    this.messageData = {
      tokenId: this.dataConfig.workflowInstance ? 'workflow-instance-view-parent' : 'timeline-view-parent',
      tokenValue: {
        resourceDetails: {
          tableId: this.dataConfig.tableId,
          resourceId: this.dataConfig.recordId,
          statusMap: this.getStatusMap(this.dataConfig?.statusMap?.values || {}),
          themeColor: this.themeColor
        },
        authDetails: {},
      },
    };

    this.Flags.isMessageReceivedOnIFrameView = false;
    combineLatest([this.getAuthDetails(), this.getBaseUrl()]).subscribe({
      next: ([authDetails, baseUrl]) => {

        if (authDetails && baseUrl) {
          let url = baseUrl?.base_url;
          this.WFCDomainURL = url.endsWith('/') ? url.slice(0, -1) : url;
          this.messageData.tokenValue.authDetails = authDetails;
          this.setupIframe();
          this.sendMessageToIframe();
        } else {
          this.showLoader = false;
          let errorMessage = '';
          if (!authDetails && !baseUrl?.base_url) {
            errorMessage = "Authentication details and Base URL are missing. Please check your configuration and try again.";
          } else {
            if (!authDetails) {
              errorMessage = 'Authentication details are missing. Please check your access permissions.';
            }
            if (!baseUrl?.base_url) {
              errorMessage = 'Base URL is not configured. Please ensure the correct URL is set up.';
            }
          }
          this.showMessage({
            severity: 'error',
            summary: 'Configuration Error',
            detail: errorMessage,
            life: 5000
          });
        }
      },
      error: () => {
        console.error('Error occurred while fetching details');
        this.showLoader = false;
        this.showMessage({
          severity: 'error',
          summary: 'Unexpected Error',
          detail: 'An unexpected error occurred while fetching authentication details or the base URL. Please try again or contact support.',
          life: 5000
        });
      },
      complete: () => {
        this.showLoader = false;
      },
    });
  }

  setupIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = this.dataConfig.workflowInstance ? `${this.WFCDomainURL}/en/workflow-components/instance-view` : `${this.WFCDomainURL}/en/workflow-components/timeline-view`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.name = this.dataConfig.workflowInstance ? 'instance-view-iframe' : 'timeline-view-iframe';
    iframe.sandbox.add('allow-scripts');
    iframe.sandbox.add('allow-same-origin');

    // Handle successful load
    iframe.onload = () => {
      console.log('Iframe loaded successfully.');
    };

    // Handle loading error
    iframe.onerror = (error) => {
      console.error('Failed to load iframe:', error);
    };

    const container = document.getElementById('iframeContainer');
    if (container) {
      container.appendChild(iframe);
    } else {
      console.error('Container element not found.');
    }

    document.getElementById('iframeContainer')?.appendChild(iframe);
    window.addEventListener('message', this.onReceivedMessageOnParentWindow.bind(this), false);
    this.iframe = iframe;
  }

  sendMessageToIframe() {
    if (!this.iframe) {
      console.error('Iframe is not set up');
      return;
    }

    // Simulate a delay, then send the message to the iframe
    of(this.messageData)
      .pipe(delay(2000))
      .subscribe({
        next: (thatMessageData: any) => {
          const interval$ = interval(500)
            .pipe(take(16))
            .subscribe({
              next: () => {
                try {
                  if (this.Flags.isMessageReceivedOnIFrameView) {
                    this.showLoader = false;
                    interval$.unsubscribe();
                  } else {
                    this.iframe.contentWindow?.postMessage(thatMessageData, this.WFCDomainURL);
                  }
                } catch (err) {
                  console.error('Error inside interval:', err);
                  interval$.unsubscribe();
                }
              },
              error: (err) => {
                console.error('Interval error:', err);
              }
            });
        },
        error: (err) => {
          console.error('Outer observable error:', err);
        }
      });
  }

  showMessage(config: any) {
    this.messageService.clear();
    this.messageService.add(config);
  }
}
