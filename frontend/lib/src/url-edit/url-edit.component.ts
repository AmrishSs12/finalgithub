import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UrlEditBaseComponent } from '@libbase/url-edit-base/url-edit-base.component';

@Component({
  selector: 'app-url-edit',
  templateUrl: '../../base/url-edit-base/url-edit-base.component.html',
  styleUrls: ['./url-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UrlEditComponent),
      multi: true
    }
  ]
})

export class UrlEditComponent extends UrlEditBaseComponent implements OnInit, ControlValueAccessor {
  ngOnInit(): void {
    super.onInit();
  }
}
