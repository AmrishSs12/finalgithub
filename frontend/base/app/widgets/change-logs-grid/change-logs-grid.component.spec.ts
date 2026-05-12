import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogsGridComponent } from './change-logs-grid.component';

describe('ChangeLogsGridComponent', () => {
  let component: ChangeLogsGridComponent;
  let fixture: ComponentFixture<ChangeLogsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeLogsGridComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLogsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
