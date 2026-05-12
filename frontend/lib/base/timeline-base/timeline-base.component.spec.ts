import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineBaseComponent } from './timeline-base.component';

describe('TimelineBaseComponent', () => {
  let component: TimelineBaseComponent;
  let fixture: ComponentFixture<TimelineBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
