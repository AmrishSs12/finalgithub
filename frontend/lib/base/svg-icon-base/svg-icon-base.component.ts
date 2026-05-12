import { Component, Directive, HostBinding, Input } from '@angular/core';

@Directive({})
export class SvgIconBaseComponent {
  @HostBinding('style.background-image')
  private _path!: string;

  @Input()
  public set path(filePath: string) {
    this._path = `url("${filePath}")`;
  }
  onInit(): void { }

}
