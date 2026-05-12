
import { Component, OnInit } from '@angular/core';
import { CaptionBarBaseComponent } from '@libbase/caption-bar-base/caption-bar-base.component';

@Component({
  selector: 'app-caption-bar',
  templateUrl: '../../base/caption-bar-base/caption-bar-base.component.html',
  styleUrls: ['./caption-bar.component.scss']
})
export class CaptionBarComponent extends CaptionBarBaseComponent implements OnInit {
  ngOnInit(): void {
  }
}
