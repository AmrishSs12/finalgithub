import { Component } from '@angular/core';
import { speedDialFabAnimations } from '@libbase/speed-dial-base/speed-dial-base.animations';
import { SpeedDialBaseComponent } from '@libbase/speed-dial-base/speed-dial-base.component';


@Component({
  selector: 'app-speed-dial',
  templateUrl: '../../base/speed-dial-base/speed-dial-base.component.html',
  styleUrls: ['./speed-dial.component.scss'],
  animations: speedDialFabAnimations,
})
export class SpeedDialComponent extends SpeedDialBaseComponent {
}
