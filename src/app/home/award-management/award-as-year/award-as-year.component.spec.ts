import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardAsYearComponent } from './award-as-year.component';

describe('AwardAsYearComponent', () => {
  let component: AwardAsYearComponent;
  let fixture: ComponentFixture<AwardAsYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardAsYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardAsYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
