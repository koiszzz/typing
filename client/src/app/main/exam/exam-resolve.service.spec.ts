import { TestBed } from '@angular/core/testing';

import { ExamResolveService } from './exam-resolve.service';

describe('ExamResolveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExamResolveService = TestBed.get(ExamResolveService);
    expect(service).toBeTruthy();
  });
});
