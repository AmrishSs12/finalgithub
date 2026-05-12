import { Input, Directive } from '@angular/core';

@Directive({})
export class UrlEditBaseComponent {
  @Input('label') label: string = '';
  @Input('fieldName') fieldName: string = '';
  @Input('infoBubble') infoBubble: string = '';
  @Input('placeHolder') placeHolder: string = '';

  disabled: boolean = false;
  link: string = '';

  isEditMode = false;
  bkData: string = '';

  onChange: any = () => { }
  onTouch: any = () => { }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(link: string) {
    this.link = link;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInit(): void {
  }



  openLink(e: any) {
    window.open(this.link, '_blank')
  }
  toggleEditor(mode: string) {
    switch (mode) {
      case 'edit':
        this.bkData = this.link;
        break;
      case 'save':
        this.bkData = this.link
        break;
      case 'cancel':
        this.link = this.bkData
        break;

      default:
        break;
    }
    this.isEditMode = !this.isEditMode
  }
}
