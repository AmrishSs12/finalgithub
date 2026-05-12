import { inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AppLoaderService } from './app-loader.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="spinner-container" [ngClass]="{'disable-mask': !loader.showMask}" *ngIf="loader.loading == true">
      <p-progressSpinner styleClass="spinner" strokeWidth="1"></p-progressSpinner>
    </div>
  `,
  styles: []
})
export class AppLoaderComponent implements OnInit {
  public loader = inject(AppLoaderService);


  ngOnInit() {
  }

}