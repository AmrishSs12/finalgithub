import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogsComponent } from './change-logs.component';

describe('ChangeLogsComponent', () => {
  let component: ChangeLogsComponent;
  let fixture: ComponentFixture<ChangeLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeLogsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
