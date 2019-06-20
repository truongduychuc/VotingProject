import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingNewSurveyComponent } from './adding-new-survey.component';

describe('AddingNewSurveyComponent', () => {
  let component: AddingNewSurveyComponent;
  let fixture: ComponentFixture<AddingNewSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddingNewSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingNewSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
