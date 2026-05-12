import { Component, OnInit } from '@angular/core';
import { TabsBaseComponent } from '@libbase/tabs-base/tabs-base.component';

@Component({
  selector: 'app-tabs',
  templateUrl: '../../base/tabs-base/tabs-base.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent extends TabsBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit()
  }
}

