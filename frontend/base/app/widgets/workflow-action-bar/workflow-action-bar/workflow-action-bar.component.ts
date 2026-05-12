import { inject } from '@angular/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'app-workflow-action-bar',
  templateUrl: './workflow-action-bar.component.html',
  styleUrls: ['./workflow-action-bar.component.scss']
})
export class WorkflowActionBarComponent implements OnInit {

  @Input() buttons: any = [];
  @Input() workflow: any = {};

  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();

  isMobile: boolean = BaseAppConstants.isMobile;
  secondaryActions: any = []


  private translateService = inject(TranslateService)

  ngDoCheck(changes: any) {
    this.loadButtons();
  }

  ngOnInit(): void {
    this.loadButtons();
  }

  loadButtons() {
    let arr: any = [];
    this.buttons?.forEach((btn: any) => {
      if (btn.type === 'buttonGroup' && btn.hasOwnProperty('children')) {
        let tempArr = [...btn.children];
        if (btn.displayCount) {
          let actionsCount: number = 0;
          const visibleActions: any = [];
          tempArr?.map((btn: any) => {
            if (!(this.hideActions(btn))) {
              visibleActions.push(btn);

            }
          })
          btn.displayActions = visibleActions.splice(0, (btn.displayCount + actionsCount));
          btn.dropdownActions = this.updateDropdownActions(visibleActions);
        }
        else {
          btn.displayActions = tempArr;

        }
      }
      else if (btn.type === 'splitButton') {
        btn.dropdownActions = this.updateDropdownActions(btn.children);
      }
      else if (btn.type === 'button' && this.isMobile) {
        if (btn.onMobile === 'secondary') {
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
        disabled: this.disableActions(item),
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
          this.onButtonClick(e, item)
        }
      };
    })

  }


  onButtonClick($event?: any, btn?: any) {
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


  disableActions(btn: any) {
    return (this.workflow.disableActions.includes(btn.wfAction) &&
      !(this.workflow.enableActions.includes(btn.wfAction)));
  }

  hideActions(btn: any) {
    return (btn.showOn !== 'both' && (btn.showOn == 'mobile_only' && !this.isMobile) || (btn.showOn == 'desktop_only' && this.isMobile))
      || (this.workflow?.hideActions.includes(btn.wfAction) && !this.workflow?.showActions.includes(btn.wfAction));

  }

  hideBtnGroup(btngrp: any) {
    let hasChildren = false;
    if (btngrp?.length > 0) {
      btngrp.forEach((btn: any) => {
        if ((btn.visibility === 'show' || btn.visible === true) && !(this.hideActions(btn))) {
          hasChildren = true;
        }
      })
    }
    return hasChildren;
  }
}

