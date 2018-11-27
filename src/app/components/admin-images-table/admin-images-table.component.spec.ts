import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminImagesTableComponent } from './admin-images-table.component';

describe('AdminImagesTableComponent', () => {
  let component: AdminImagesTableComponent;
  let fixture: ComponentFixture<AdminImagesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminImagesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminImagesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
