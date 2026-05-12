import { Component, OnInit,inject } from '@angular/core';
import { Table1ListBaseComponent } from '@baseapp/table1/table1/table1-list/table1-list.base.component';
import { Table1Service } from '@baseapp/table1/table1/table1.service';


@Component({
  selector: 'app-table1-list',
  templateUrl: '../../../../../base/app/table1/table1/table1-list/table1-list.component.html',
  styleUrls: ['./table1-list.scss']
})
export class Table1ListComponent extends Table1ListBaseComponent implements OnInit {
 
	
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