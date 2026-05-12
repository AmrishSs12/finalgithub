
import { Component, Input, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppUtilService } from '@app/app.util.service';

@Component({
  selector: 'app-caption-bar',
  templateUrl: './caption-bar.component.html',
  styleUrls: ['./caption-bar.component.scss']
})
export class CaptionBarComponent implements OnInit {
  @Input() captionbarConfig: any;
  data!: SafeHtml;

  private sanitizer = inject(DomSanitizer);
  private utilService = inject(AppUtilService);

  ngOnInit(): void {
  }

  renderHtml(item: any) {
    if (item.render) {
      let html = item.render(item);
      return this.utilService.sanitizeHtml(html);
    }
    return this.utilService.sanitizeHtml(item.html);
  };

}
