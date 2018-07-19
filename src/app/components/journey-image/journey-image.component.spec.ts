import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyImageComponent } from './journey-image.component';

describe('JourneyImageComponent', () => {
  let component: JourneyImageComponent;
  let fixture: ComponentFixture<JourneyImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneyImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
