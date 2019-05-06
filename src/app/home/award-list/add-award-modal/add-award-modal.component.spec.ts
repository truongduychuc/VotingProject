import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAwardModalComponent } from './add-award-modal.component';

describe('AddAwardModalComponent', () => {
  let component: AddAwardModalComponent;
  let fixture: ComponentFixture<AddAwardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAwardModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAwardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
