import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentChartComponent } from './current-chart.component';

describe('CurrentChartComponent', () => {
  let component: CurrentChartComponent;
  let fixture: ComponentFixture<CurrentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
