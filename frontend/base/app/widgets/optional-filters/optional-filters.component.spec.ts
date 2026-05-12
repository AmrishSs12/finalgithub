import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalFiltersComponent } from './optional-filters.component';

describe('OptionalFiltersComponent', () => {
  let component: OptionalFiltersComponent;
  let fixture: ComponentFixture<OptionalFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionalFiltersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OptionalFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
