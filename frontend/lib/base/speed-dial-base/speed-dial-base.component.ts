import { AppGlobalService } from '@baseapp/app-global.service';
import { Directive, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseAppConstants } from '@baseapp/app-constants.base';

export enum Symbols {
  boven = 'column-reverse',
  onder = 'column',
  links = 'row-reverse',
  rechts = 'row'
}

@Directive({})
export class SpeedDialBaseComponent {

  private router = inject(Router);

  buttons: any = [];

  buttons2: any = []

  fabTogglerState = 'inactive';

  @Input() fabButtons: any[] = [];
  @Output() actionClick: EventEmitter<any> = new EventEmitter();
  isMobile: boolean = BaseAppConstants.isMobile;

  constructor(public appGlobalService: AppGlobalService) {}

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
    this.appGlobalService.write('fabButtonsComponent', this);
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  hideActions(btn: any) {
    return ((btn.visibility === 'hide' || btn.visible === false) && !(btn.showOn !== 'both' && (btn.showOn == 'mobile_only' && !this.isMobile) || (btn.showOn == 'desktop_only' && this.isMobile)))
  }

  onToggleFab() {
    let fabBtnComp = this.appGlobalService.get('fabButtonsComponent');

    // Close previous button if open
    if (fabBtnComp != this && fabBtnComp.buttons?.length > 0){
      fabBtnComp.buttons.length = 0;
      fabBtnComp.fabTogglerState = 'inactive';
    }
    
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  onClick(btn: { information: any; route: any; }) {
    console.log(btn.information);

    this.actionClick.emit(btn);
  }

}
