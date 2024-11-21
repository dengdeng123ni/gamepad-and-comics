import { TestBed } from '@angular/core/testing';

import { DownloadEventService } from './download-event.service';

describe('DownloadEventService', () => {
  let service: DownloadEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
