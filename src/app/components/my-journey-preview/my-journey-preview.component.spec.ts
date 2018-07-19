import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJourneyPreviewComponent } from './my-journey-preview.component';

describe('MyJourneyPreviewComponent', () => {
  let component: MyJourneyPreviewComponent;
  let fixture: ComponentFixture<MyJourneyPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyJourneyPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyJourneyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
