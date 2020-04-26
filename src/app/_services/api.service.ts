import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpHeaders} from '@angular/common/http/src/headers';
import {HttpParams} from '@angular/common/http/src/params';
import {Injectable} from '@angular/core';
import { IMeta } from '../_models/meta';

type HttpOptions = {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
};
type APIMeta = {
  [key: string]: number | string;
};

export interface IAPIResponse {
  message?: string;
  data?: any;
  error?: string | object;
  code?: string;
  meta?: IMeta;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  serverURL = environment.serverUrl;

  constructor(private httpClient: HttpClient) {
  }

  private static mapServerToApi(serverUrl: string, api: string): string {
    if (!serverUrl.endsWith('/') && !api.startsWith('/')) {
      return serverUrl + '/' + api;
    } else if (serverUrl.endsWith('/') && api.startsWith('/')) {
      return serverUrl + api.substring(1);
    } else {
      return serverUrl + api;
    }
  }

  get(url: string, params?: HttpParams): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(ApiService.mapServerToApi(this.serverURL, url), {params});
  }

  post(url: string, data: any, options?: HttpOptions): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(ApiService.mapServerToApi(this.serverURL, url), data, options);
  }

  put(url: string, data: any, options?: HttpOptions): Observable<IAPIResponse> {
    return this.httpClient.put<IAPIResponse>(ApiService.mapServerToApi(this.serverURL, url), data, options);
  }

  patch(url: string, data: any, options?: HttpOptions): Observable<IAPIResponse> {
    return this.httpClient.patch<IAPIResponse>(ApiService.mapServerToApi(this.serverURL, url), data, options);
  }

  delete(url: string, options?: HttpOptions): Observable<IAPIResponse> {
    return this.httpClient.delete<IAPIResponse>(ApiService.mapServerToApi(this.serverURL, url), options);
  }
}
