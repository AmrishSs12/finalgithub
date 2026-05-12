
import { Component, OnInit } from '@angular/core';
import { ConfirmationPopupBaseComponent } from '@libbase/confirmation-base/confirmation-popup-base.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: "../../base/confirmation-base/confirmation-popup-base.html",
  styles: [],
  providers: [MessageService]
})
export class ConfirmationPopupComponent extends ConfirmationPopupBaseComponent implements OnInit {
  ngOnInit(): void {
    super.onInit();
  }
}
