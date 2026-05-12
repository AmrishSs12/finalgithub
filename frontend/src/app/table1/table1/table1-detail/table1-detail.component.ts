import { Component, OnInit,inject } from '@angular/core';
import { Table1DetailBaseComponent } from '@baseapp/table1/table1/table1-detail/table1-detail.base.component';
import { Table1Service } from '@baseapp/table1/table1/table1.service';


@Component({
  selector: 'app-table1-detail',
  templateUrl: '../../../../../base/app/table1/table1/table1-detail/table1-detail.component.html',
  styleUrls: ['./table1-detail.scss']
})
export class Table1DetailComponent extends Table1DetailBaseComponent implements OnInit {
 
	
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