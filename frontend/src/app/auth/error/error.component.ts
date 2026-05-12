import { Component, inject } from '@angular/core';
import { ErrorBaseComponent } from '@baseapp/auth/error/error.base.component';

@Component({
    selector: 'app-error',
    templateUrl: '../../../../base/app/auth/error/error.component.html',
    styleUrls: ['../../../../base/app/auth/error/error.base.component.scss']
})
export class ErrorComponent extends ErrorBaseComponent {
    ngOnInit() {
        super.onInit()
    }
}
