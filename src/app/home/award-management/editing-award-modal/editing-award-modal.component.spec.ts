import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditingAwardModalComponent } from './editing-award-modal.component';

describe('EditingAwardModalComponent', () => {
  let component: EditingAwardModalComponent;
  let fixture: ComponentFixture<EditingAwardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditingAwardModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditingAwardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
