import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingUserModalComponent } from './creating-user-modal.component';

describe('CreatingUserModalComponent', () => {
  let component: CreatingUserModalComponent;
  let fixture: ComponentFixture<CreatingUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatingUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatingUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
