import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[tooltipActive]'
})
export class tooltipDirective implements AfterViewInit {

  private elementRef = inject(ElementRef);



  ngAfterViewInit(): void {
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      if (element.offsetWidth < element.scrollWidth) {
        element.title = element.innerText;
      }
    }, 5000);
  }
}
