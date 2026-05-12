import { Component, OnInit } from '@angular/core';
import { SvgIconBaseComponent } from '@libbase/svg-icon-base/svg-icon-base.component';

@Component({
  selector: 'app-svg-icon',
  templateUrl: '../../base/svg-icon-base/svg-icon-base.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent extends SvgIconBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}
