import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FetchUrlsService {
  constructor(private http: HttpClient) {}

  public fetchUrls<T>(
    urls: string[],
    MAX_CONCURRENCY: number
  ): Observable<T[]> {
    return from(urls).pipe(
      mergeMap((url) => this.http.get<T>(url), MAX_CONCURRENCY),
      toArray()
    );
  }
}
