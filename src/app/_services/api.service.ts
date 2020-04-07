import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverURL = 'http://localhost:4000';

  constructor(private httpClient: HttpClient) {
  }

  private mapServerToApi(serverUrl: string, api: string): string {
    if (!serverUrl.endsWith('/') && !serverUrl.startsWith('/')) {
      return serverUrl + '/' + api;
    } else {
      return serverUrl + api;
    }
  }

  get<T>(url: string, options?: object): Observable<T> {
    return this.httpClient.get<T>(this.mapServerToApi(this.serverURL, url), options);
  }
}
