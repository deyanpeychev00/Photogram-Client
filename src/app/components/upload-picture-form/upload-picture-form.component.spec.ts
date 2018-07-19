import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPictureFormComponent } from './upload-picture-form.component';

describe('UploadPictureFormComponent', () => {
  let component: UploadPictureFormComponent;
  let fixture: ComponentFixture<UploadPictureFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPictureFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPictureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
