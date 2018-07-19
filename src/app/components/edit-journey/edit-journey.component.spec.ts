import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJourneyComponent } from './edit-journey.component';

describe('EditJourneyComponent', () => {
  let component: EditJourneyComponent;
  let fixture: ComponentFixture<EditJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
