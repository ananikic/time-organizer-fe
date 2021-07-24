import { TestBed } from '@angular/core/testing';

import { MockActivitiesApiService } from './mock-activities-api.service';

describe('MockActivitiesApiService', () => {
  let service: MockActivitiesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockActivitiesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
