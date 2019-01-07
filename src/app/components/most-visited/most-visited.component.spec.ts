import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostVisitedComponent } from './most-visited.component';

describe('MostVisitedComponent', () => {
  let component: MostVisitedComponent;
  let fixture: ComponentFixture<MostVisitedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostVisitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostVisitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
