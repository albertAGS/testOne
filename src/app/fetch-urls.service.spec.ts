import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FetchUrlsService } from './fetch-urls.service';

describe('FetchUrlsService', () => {
  let service: FetchUrlsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FetchUrlsService],
    });
    service = TestBed.inject(FetchUrlsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all URLs with maximum concurrency', fakeAsync(() => {
    const urls = [
      'https://api.example.com/1',
      'https://api.example.com/2',
      'https://api.example.com/3',
      'https://api.example.com/4',
      'https://api.example.com/5',
    ];
    const maxConcurrency = 3;
    const mockResponses = urls.map((url) => ({ data: `Response from ${url}` }));

    let activeRequests = 0;
    let maxActiveRequests = 0;

    service
      .fetchUrls<{ data: string }>(urls, maxConcurrency)
      .subscribe((responses) => {
        expect(responses).toEqual(mockResponses);
        expect(maxActiveRequests).toBe(maxConcurrency);
      });

    for (let processed = 0; processed < urls.length; ) {
      const batchSize = Math.min(maxConcurrency, urls.length - processed);
      const requests: any[] = [];

      for (let i = 0; i < batchSize; i++) {
        const url = urls[processed + i];
        requests.push(httpMock.expectOne(url));
      }

      activeRequests += batchSize;
      maxActiveRequests = Math.max(maxActiveRequests, activeRequests);

      requests.forEach((req, index) => {
        req.flush(mockResponses[processed + index]);
        activeRequests--;
      });

      processed += batchSize;
      tick();
    }
  }));
});
