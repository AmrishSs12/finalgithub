import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

  public loading = false;
  public showMask = true;

  public show() {
    if (!this.loading) {
      this.loading = true;
    }
  }

  public showSpinnerWithoutOverlay() {
    this.showMask = false;
    this.show();
  }

  public hide() {
    if (this.loading) {
      this.loading = false;
    }
  }

}
