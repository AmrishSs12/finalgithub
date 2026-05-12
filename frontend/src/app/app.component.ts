import { Component } from '@angular/core';
import { AppBaseComponent } from '@baseapp/app.component.base';
import { TranslateService } from '@ngx-translate/core';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from '@baseapp/loader.service';
import { NotifiactionService } from '@baseapp/notification.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[]
})
export class AppComponent extends AppBaseComponent {
  override title = 'baseProject';

  public notification = inject(NotifiactionService);


  msgs: any = []

  ngOnInit(): void {
    super.onInit();
  }

  ngDoCheck() {
    this.msgs = this.notification.msgs;
  }
}
