import { Component, OnInit,inject } from '@angular/core';
import { ApplicationUserDetailBaseComponent } from '@baseapp/application-user/application-user/application-user-detail/application-user-detail.base.component';
import { ApplicationUserService } from '@baseapp/application-user/application-user/application-user.service';


@Component({
  selector: 'app-application-user-detail',
  templateUrl: '../../../../../base/app/application-user/application-user/application-user-detail/application-user-detail.component.html',
  styleUrls: ['./application-user-detail.scss']
})
export class ApplicationUserDetailComponent extends ApplicationUserDetailBaseComponent implements OnInit {
 
	
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