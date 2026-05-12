import { Component } from '@angular/core';
import { IframeBaseComponent } from '@libbase/iframe-base/iframe-base.component';

@Component({
  selector: 'app-iframe',
  templateUrl: '../../base/iframe-base/iframe-base.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent extends IframeBaseComponent {
  ngOnInit() {
    this.onInit();
  }
}
