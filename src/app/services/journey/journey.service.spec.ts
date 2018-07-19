import { TestBed, inject } from '@angular/core/testing';

import { JourneyService } from './journey.service';

describe('JourneyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JourneyService]
    });
  });

  it('should be created', inject([JourneyService], (service: JourneyService) => {
    expect(service).toBeTruthy();
  }));
});
