import { inject } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { speedDialFabAnimations } from './speed-dial.animations';

export enum Symbols {
  boven = 'column-reverse',
  onder = 'column',
  links = 'row-reverse',
  rechts = 'row'
}

@Component({
  selector: 'app-speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss'],
  animations: speedDialFabAnimations,
})
export class SpeedDialComponent {

  private router = inject(Router);


  buttons: any = [];

  buttons2: any = []

  fabTogglerState = 'inactive';

  @Input() fabButtons: any[] = [];
  @Output() actionClick: EventEmitter<any> = new EventEmitter();
  isMobile: boolean = BaseAppConstants.isMobile;




  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }


  hideActions(btn: any) {
    return ((btn.visibility === 'hide' || btn.visible === false) && !(btn.showOn !== 'both' && (btn.showOn == 'mobile_only' && !this.isMobile) || (btn.showOn == 'desktop_only' && this.isMobile)))
  }


  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }



  onClick(btn: { information: any; route: any; }) {
    console.log(btn.information);

    this.actionClick.emit(btn);
    // this.onToggleFab();
  }

  // keys = Object.keys;
  // symbols = Symbols;
  // selectedOption: string ="";


}
