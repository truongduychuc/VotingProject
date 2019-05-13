import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardManagementComponent } from './award-management.component';

describe('AwardManagementComponent', () => {
  let component: AwardManagementComponent;
  let fixture: ComponentFixture<AwardManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
