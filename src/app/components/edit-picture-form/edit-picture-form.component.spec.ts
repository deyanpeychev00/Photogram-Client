import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPictureFormComponent } from './edit-picture-form.component';

describe('EditPictureFormComponent', () => {
  let component: EditPictureFormComponent;
  let fixture: ComponentFixture<EditPictureFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPictureFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPictureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
