import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgIconBaseComponent } from './svg-icon-base.component';

describe('SvgIconBaseComponent', () => {
  let component: SvgIconBaseComponent;
  let fixture: ComponentFixture<SvgIconBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgIconBaseComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SvgIconBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
