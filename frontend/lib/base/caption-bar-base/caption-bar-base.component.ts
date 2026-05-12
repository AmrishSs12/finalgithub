
import { Input, inject, Directive } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';

@Directive({})
export class CaptionBarBaseComponent {
  @Input() captionbarConfig: any;
  data!: SafeHtml;

  private utilBase = inject(AppUtilBaseService);

  onInit(): void {
  }

  renderHtml(item: any) {
    if (item.render) {
      return this.utilBase.sanitizeHtml(item.render(item));
    }
    return this.utilBase.sanitizeHtml(item.html || '');
  }

}