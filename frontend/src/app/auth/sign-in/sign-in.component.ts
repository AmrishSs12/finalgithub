import { Component } from '@angular/core';
import { signInBaseComponent } from '@baseapp/auth/sign-in/sign-in.base.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: '../../../../base/app/auth/sign-in/sign-in.base.component.html',
  styleUrls: ['../../../../base/app/auth/sign-in/sign-in.base.component.scss']
})
export class signInComponent extends signInBaseComponent {

    ngOnInit(): void {
    super.onInit();
  }
  
}
