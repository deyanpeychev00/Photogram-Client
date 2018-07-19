import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneysDiscoverComponent } from './journeys-discover.component';

describe('JourneysDiscoverComponent', () => {
  let component: JourneysDiscoverComponent;
  let fixture: ComponentFixture<JourneysDiscoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneysDiscoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneysDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
