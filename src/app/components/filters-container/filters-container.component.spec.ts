import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersContainerComponent } from './filters-container.component';

describe('FiltersContainerComponent', () => {
  let component: FiltersContainerComponent;
  let fixture: ComponentFixture<FiltersContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
