import { Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
@Directive({
  selector: '[appVgClass]'
})
export class VgClassDirective implements OnInit {

  @Input() appVgClass: any;

  private el = inject(ElementRef);

  ngOnInit() {

    if (Array.isArray(this.appVgClass)) {
      //['btn','btn-primary','btn-secondary']
      this.el.nativeElement.classList.add(...this.appVgClass)
    }
    else {
      // btn btn-primary btn-secondary
      this.el.nativeElement.className = this.appVgClass;
    }

  }
}

