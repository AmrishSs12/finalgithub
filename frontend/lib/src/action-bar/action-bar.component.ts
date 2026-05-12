import { Component, OnInit } from '@angular/core';
import { ActionBaseItem } from '@libbase/action-bar-base/action-bar-base.component';
import { ActionBarBaseComponent } from '@libbase/action-bar-base/action-bar-base.component';
export interface ActionItem extends ActionBaseItem {

}
@Component({
  selector: 'app-action-bar',
  templateUrl: '../../base/action-bar-base/action-bar-base.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent extends ActionBarBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}

