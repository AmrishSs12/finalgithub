import { Component, OnInit, inject } from '@angular/core';
import { LoggerSettingsDetailBaseComponent } from '@baseapp/rappit-admin/logger-settings/logger-settings-detail/logger-settings-detail.base.component';


@Component({
    selector: 'app-logger-settings',
    templateUrl: '../../../../../base/app/rappit-admin/logger-settings/logger-settings-detail/logger-settings-detail.base.component.html',
    styleUrls: ['./logger-settings-detail.scss']
})
export class LoggerSettingsDetailComponent extends LoggerSettingsDetailBaseComponent implements OnInit {

    ngOnInit(): void {
        super.onInit();
    }

    ngAfterViewInit(): void {
        this.onAfterViewInit()
    }

    ngOnChanges(changes: any) {
        super.onChanges(changes);
    }

    ngOnDestroy() {
        super.onDestroy();
    }

}
