import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { OutboxListBaseComponent } from '@baseapp/outbox/outbox-list/outbox-list.base.component';

@Component({
  selector: 'app-outbox-list',
  templateUrl: '../../../../base/app/outbox/outbox-list/outbox-list.component.html',
  styleUrls: ['./outbox-list.component.scss']
})
export class OutboxListComponent extends OutboxListBaseComponent implements OnInit, OnDestroy, AfterViewInit {

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  ngAfterViewInit(): void {
    this.onAfterViewInit();
  }
}
