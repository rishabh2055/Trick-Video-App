import { TestBed } from '@angular/core/testing';

import { LoggedOut.GuardService } from './logged-out.guard.service';

describe('LoggedOut.GuardService', () => {
  let service: LoggedOut.GuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggedOut.GuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
