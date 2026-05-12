import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-url-edit',
  templateUrl: './url-edit.component.html',
  styleUrls: ['./url-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UrlEditComponent),
      multi: true
    }
  ]
})

export class UrlEditComponent implements OnInit, ControlValueAccessor {
  @Input('label') label: string = '';
  @Input('fieldName') fieldName: string = '';
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

  ngOnInit(): void {
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
