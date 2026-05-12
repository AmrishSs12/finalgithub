import { Component, OnInit,inject } from '@angular/core';
import { RwftaskListBaseComponent } from '@baseapp/rwftask/rwftask-list/rwftask-list.base.component';



@Component({
  selector: 'app-rwftask-list',
  templateUrl: '../../../../../base/app/rwftask/rwftask-list/rwftask-list.component.html', 
  styleUrls: ['./rwftask-list.scss']
})
export class RwftaskListComponent extends RwftaskListBaseComponent implements OnInit {
 
	
  ngAfterViewInit(): void {
    this.onAfterViewInit()
  }

  ngOnInit(): void {
    super.onInit();
  }

  ngOnChanges(changes:any){
    super.onChanges(changes);
  }
 
}