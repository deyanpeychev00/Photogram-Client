import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJourneysTableComponent } from './admin-journeys-table.component';

describe('AdminJourneysTableComponent', () => {
  let component: AdminJourneysTableComponent;
  let fixture: ComponentFixture<AdminJourneysTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminJourneysTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminJourneysTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
