import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditingModalComponent } from './editing-modal.component';

describe('EditingModalComponent', () => {
  let component: EditingModalComponent;
  let fixture: ComponentFixture<EditingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
