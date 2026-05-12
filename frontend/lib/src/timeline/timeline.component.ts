import { Component } from '@angular/core';
import { TimelineBaseComponent } from '@libbase/timeline-base/timeline-base.component';

@Component({
  selector: 'app-timeline',
  templateUrl:'../../base/timeline-base/timeline-base.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent extends TimelineBaseComponent {


  ngOnInit(){
    this.onInit();
  }
}
