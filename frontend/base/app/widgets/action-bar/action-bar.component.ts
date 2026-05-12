import { inject } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';


export interface ActionItem extends MenuItem {

  name?: string
  type?: string,
  action?: string,
  collapsible?: boolean,
  label?: string,
  disabled?: boolean,
  visibility?: boolean,
  service?: string,
  defaultAction?: string,
  customAction?: string,
  icon?: string,
  showOnlyIcon?: boolean,
  showOn?: string,
  buttonType?: string
  styleClass?: string,
  tooltipMessage?: string
  backgroundColor?: string
  buttonEnabled?: boolean
  font?: object
  hoverFont?: object
  click?: (event?: any) => any
}

export enum ActionBar {
  BUTTON = "button",
  BUTTONGROUP = "buttonGroup"
}

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})


export class ActionBarComponent implements OnInit {
  @Input() buttons: any = [];
  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();
  conditionBasedButtons: any = { //list - enable only if records selected
    disableButtons: []
  };
  @Input()
  isRowSelected: boolean = false;

  @Input() isChildListpage: boolean = false;
  @Input() isListPage: boolean = false;
  @Input() detailConditionalButtons: any = {  // conditional hide and disable
    hideActions: [],
    disableActions: []
  }

  isMobile: boolean = BaseAppConstants.isMobile;
  secondaryActions: any = []


  public translateService = inject(TranslateService);

  ngOnChanges(changes: any) {
    this.loadButtons();
  }

  ngOnInit(): void {
    this.loadButtons();
  }

  evaluateButtonRights(btn: any, selected: boolean) {
    if (btn) {
      // Only disable buttons with enableOnlyIfRecordSelected when no row is selected
      if (!selected) {
        if (btn.type === ActionBar.BUTTON && btn.enableOnlyIfRecordSelected) {
          if (btn.buttonId && this.conditionBasedButtons?.disableButtons?.indexOf(btn.buttonId) === -1) {
            this.conditionBasedButtons?.disableButtons?.push(btn.buttonId);
          }
        }
        if (btn.type === ActionBar.BUTTONGROUP) {
          btn.children?.forEach((o: any) => {
            if (o.enableOnlyIfRecordSelected && o.buttonId && this.conditionBasedButtons?.disableButtons?.indexOf(o.buttonId) === -1) {
              this.conditionBasedButtons?.disableButtons?.push(o.buttonId);
            }
          })
        }
      }
    }
  }

  loadButtons() {
      // Reset disabled buttons at start, then re-evaluate based on selection state
    this.conditionBasedButtons.disableButtons = [];
    let arr: any = [];
    this.buttons?.forEach((btn: any) => {
      this.evaluateButtonRights(btn, this.isRowSelected);
      if (btn.type === ActionBar.BUTTONGROUP && btn.hasOwnProperty('children')) {
        let tempArr = [...btn.children];
        if (btn.displayCount || typeof btn.displayCount == 'number') {
          let displayActions = tempArr.slice(0, btn.displayCount);
          let actionsCount: number = 0;
          displayActions?.map((btn: any) => {
            if ((this.hideActions(btn))) {
              actionsCount = actionsCount + 1;
            }
          })
          btn.displayActions = tempArr.splice(0, (btn.displayCount + actionsCount));
          btn.dropdownActions = this.updateDropdownActions(tempArr);
        }
        else {
          btn.displayActions = tempArr;

        }
      }
      else if (btn.type === ActionBar.BUTTON) {
        if (btn.onMobile === 'secondary' && this.isMobile) {
          arr.push(btn);
        }
      }
    });
    if (this.buttons)
      this.secondaryActions = this.updateDropdownActions(arr);
  }


  updateDropdownActions(arr: any) {
    return arr.map((item: any) => {
      return {
        label: (item.buttonType !== 'icon_only') ? this.translateService.instant(item.label) || '' : '',
        icon: (item.buttonType !== 'text_only') ? item.icon?.icon?.value : '',
        visible: !(this.hideActions(item)),
        disabled: (item.buttonEnabled == 'no'),
        iconStyle: { color: '', },
        style: {
          // backgroundColor: item.backgroundColor,
          fontFamily: item.font?.fontFamily?.code,
          fontSize: item.font?.fontSize,
          fontWeight: item.font?.fontWeight,
          color: item.font?.fontColor
        },
        title: item.tooltipMessage,
        command: (e: any) => {
          this.onButtonClick(item)
        }
      };
    })

  }


  onButtonClick(btn?: any) {
    // if(typeof btn?.action === 'function'){
    this.onBtnClick.emit(btn);
    // btn.click($event, btn);
    // }
  }

  test(i: any) {
    return JSON.stringify(i)
  }

  getLabel(label: string) {
    this.translateService.instant(label);
  }

  addHoverProperty(btn: any) {
    const ele = (<HTMLInputElement>document.getElementById(btn.label))
    ele.style.fontFamily = btn.hoverFont?.fontFamily?.code;
    ele.style.fontSize = btn.hoverFont?.fontSize;
    ele.style.fontWeight = btn.hoverFont?.fontWeight;
    ele.style.color = btn.hoverFont?.fontColor
    ele.style.backgroundColor = btn.hoverBackground || '';
  }


  removeHoverProperty(btn: any) {
    const ele = (<HTMLInputElement>document.getElementById(btn.label))
    ele.style.fontFamily = btn.font?.fontFamily?.code;
    ele.style.fontSize = btn.font?.fontSize;
    ele.style.fontWeight = btn.font?.fontWeight;
    ele.style.color = btn.font?.fontColor;
    ele.style.backgroundColor = btn.backgroundColor || '';
  }

  hideActions(btn: any) {
    return ((btn.visibility === 'hide' || btn.visible === false) ||
      (btn.showOn !== 'both' && (btn.showOn == 'mobile_only' && !this.isMobile) || (btn.showOn == 'desktop_only' && this.isMobile))
      || this.detailConditionalButtons.hideActions.includes(btn.action))

  }

  hideBtnGroup(btngrp: any) {
    let hasChildren = false;
    if (btngrp?.length > 0) {
      btngrp.forEach((btn: any) => {
        if (!this.hideActions(btn)) {
          hasChildren = true;
        }
      })
    }
    return hasChildren;
  }


  getButtonListForMobile(btns: any) {
    const buttons: any = [];
    btns.forEach((ele: any) => {
      if (ele.type === "buttonGroup") {
        ele?.children?.forEach((el: any) => {
          el.backgroundColor = ele.backgroundColor;
          el.outlineColor = ele.outlineColor;
          el.font = ele.font;
          buttons.push(el);
        })
      }
      else {
        buttons.push(ele);
      }
    })
    return buttons;
  }

  getChildListForMobile(btns: any) {
    const buttons: any = [];
    btns.forEach((ele: any) => {
      if (ele.type === "buttonGroup") {
        ele.children.forEach((el: any) => {
          buttons.push(this.updateActions(el));
        })
      }
      else {
        buttons.push(this.updateActions(ele));
      }
    })
    return buttons;
  }


  updateActions(item: any) {
    return {
      label: (item.buttonType !== 'icon_only') ? this.translateService.instant(item.label) || '' : '',
      icon: (item.buttonType !== 'text_only') ? item.icon?.icon?.value : '',
      visible: !(this.hideActions(item)),
      disabled: (item.buttonEnabled == 'no' || this.conditionBasedButtons.disableButtons.includes(item?.buttonId)) || this.detailConditionalButtons.disableActions.includes(item?.buttonId),
      iconStyle: { color: '', },
      style: {
        // backgroundColor: item.backgroundColor,
        fontFamily: item.font?.fontFamily?.code,
        fontSize: item.font?.fontSize,
        fontWeight: item.font?.fontWeight,
        color: item.font?.fontColor
      },
      title: item.tooltipMessage,
      command: (e: any) => {
        this.onButtonClick(item)
      }
    }
  }
}

