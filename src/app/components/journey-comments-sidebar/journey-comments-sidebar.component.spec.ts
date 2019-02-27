import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyCommentsSidebarComponent } from './journey-comments-sidebar.component';

describe('JourneyCommentsSidebarComponent', () => {
  let component: JourneyCommentsSidebarComponent;
  let fixture: ComponentFixture<JourneyCommentsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneyCommentsSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyCommentsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
