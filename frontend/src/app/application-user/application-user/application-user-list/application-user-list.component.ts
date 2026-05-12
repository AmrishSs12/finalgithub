import { Component, OnInit,inject } from '@angular/core';
import { ApplicationUserListBaseComponent } from '@baseapp/application-user/application-user/application-user-list/application-user-list.base.component';
import { ApplicationUserService } from '@baseapp/application-user/application-user/application-user.service';


@Component({
  selector: 'app-application-user-list',
  templateUrl: '../../../../../base/app/application-user/application-user/application-user-list/application-user-list.component.html',
  styleUrls: ['./application-user-list.scss']
})
export class ApplicationUserListComponent extends ApplicationUserListBaseComponent implements OnInit {
 
	
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