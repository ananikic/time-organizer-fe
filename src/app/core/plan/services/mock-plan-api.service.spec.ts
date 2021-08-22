import { TestBed } from '@angular/core/testing';

import { MockPlanApiService } from './mock-plan-api.service';

describe('MockPlanApiService', () => {
  let service: MockPlanApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockPlanApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
