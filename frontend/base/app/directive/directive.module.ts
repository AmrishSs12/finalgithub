import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgClassDirective } from './vgClass.directive';
import { VgStyleDirective } from './vgStyle.directive';
import { tooltipDirective } from './tooltip/tooltip.directive';

@NgModule({
  declarations: [
    VgClassDirective,
    VgStyleDirective,
    tooltipDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VgClassDirective,
    VgStyleDirective,
    tooltipDirective
  ]
})
export class DirectiveModule { }
