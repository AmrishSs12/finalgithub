import { Directive, ElementRef, inject, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appVgStyle]'
})
export class VgStyleDirective implements OnInit {
  @Input() appVgStyle: any;

  private el = inject(ElementRef);

  ngOnInit() {
    if (this.appVgStyle !== null && typeof this.appVgStyle === 'object') {
      //{color:'red',border:'none',background-color:'white'}
      let toString = (obj: any) => Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('; ');
      this.el.nativeElement.style.cssText = toString(this.appVgStyle);
    }
    else {
      // color:red; font-size:12px ; border:1px;
      this.el.nativeElement.style.cssText = this.appVgStyle;
    }

  }

}