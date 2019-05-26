import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingBreakdownComponent } from './voting-breakdown.component';

describe('VotingBreakdownComponent', () => {
  let component: VotingBreakdownComponent;
  let fixture: ComponentFixture<VotingBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
