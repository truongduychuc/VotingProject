import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingSurveyComponent } from './voting-survey.component';

describe('VotingSurveyComponent', () => {
  let component: VotingSurveyComponent;
  let fixture: ComponentFixture<VotingSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
