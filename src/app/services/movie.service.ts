import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, OperatorFunction, throwError, timer } from 'rxjs';
import { catchError, mergeMap, retry, retryWhen } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export abstract class movieService {

  prefixoUrl = 'api';
  urlFunction: string = '';
  errorCodes: number[] = [500, 404, 400, 401, 502];

  public constructor(protected http: HttpClient) {
  }

  init(api: string, resource: string): void {
    this.prefixoUrl = api;
    this.urlFunction = resource;
  }

  get<T>(metadata?: RequestMetadata): Observable<T> {
    const metadataLocal = metadata || this.getRequestNull();
    const extraUrl = metadataLocal.extraUrl;
    const url = this.mountUrl(this.prefixoUrl, this.urlFunction, extraUrl);
    const options: HttpOptions = { params: metadataLocal.paramns ?? new HttpParams() };

    if (metadata?.timeout) {
      options.headers = { timeout: `${metadata.timeout}` };
    }

    return this.http.get<T>(url, options).pipe(
      retryWhen(genericRetryStrategy({
        scalingDuration: 2000,
        excludedStatusCodes: this.errorCodes,
        maxRetryAttempts: metadataLocal.maxRetryAttempts
      }))
    );
  }

  post<T>(metadata: RequestMetadata): Observable<T> {
    const extraUrl = metadata.extraUrl;
    const url = this.mountUrl(this.prefixoUrl, this.urlFunction, extraUrl);
    const options: HttpOptions = {};

    if (metadata?.timeout) {
      options.headers = { timeout: `${metadata.timeout}` };
    }

    return this.http.post<T>(
      url, metadata.objEnvio || null, options
    ).pipe(
      retryWhen(genericRetryStrategy({
        scalingDuration: 2000,
        excludedStatusCodes: this.errorCodes,
        maxRetryAttempts: 0
      }))
    );
  }

  put<T>(id: string, metadata: RequestMetadata): Observable<T> {
    const extraUrl = metadata.extraUrl;
    const sufixUrl = metadata.sufixUrl;
    const url = this.mountUrl(this.prefixoUrl, this.urlFunction, extraUrl, id, sufixUrl);
    const options: HttpOptions = {};

    if (metadata?.timeout) {
      options.headers = { timeout: `${metadata.timeout}` };
    }

    return this.http.put<T>(
      url, metadata.objEnvio, options
    ).pipe(
      retryWhen(genericRetryStrategy({
        scalingDuration: 2000,
        excludedStatusCodes: this.errorCodes,
        maxRetryAttempts: 0
      }))
    );
  }

  patch<T>(id: string, metadata: RequestMetadata): Observable<T> {
    const extraUrl = metadata.extraUrl;
    const sufixUrl = metadata.sufixUrl;
    const url = this.mountUrl(this.prefixoUrl, this.urlFunction, extraUrl, id, sufixUrl);
    const options: HttpOptions = {};

    if (metadata?.timeout) {
      options.headers = { timeout: `${metadata.timeout}` };
    }

    return this.http.patch<T>(
      url, metadata.objEnvio, options
    ).pipe(
      retryWhen(genericRetryStrategy({
        scalingDuration: 2000,
        excludedStatusCodes: this.errorCodes,
        maxRetryAttempts: 0
      }))
    );
  }

  delete<T>(metadata?: RequestMetadata): Observable<T> {
    const metadataLocal = metadata || this.getRequestNull();
    const extraUrl = metadataLocal.extraUrl;
    const url = this.mountUrl(this.prefixoUrl, this.urlFunction, extraUrl);
    const options: HttpOptions = { params: metadataLocal.paramns ?? new HttpParams() };

    if (metadata?.timeout) {
      options.headers = { timeout: `${metadata.timeout}` };
    }

    return this.http.delete<T>(url, options).pipe(
      retryWhen(genericRetryStrategy({
        scalingDuration: 2000,
        excludedStatusCodes: this.errorCodes,
        maxRetryAttempts: metadataLocal.maxRetryAttempts
      }))
    );
  }

  getRequestNull(): RequestMetadata {
    return {
      paramns: null,
      objEnvio: null,
      extraUrl: null,
      maxRetryAttempts: 2
    };
  }

  mountUrl(...paths: unknown[]): string {
    if (paths) {
      return paths.filter(p => p).join('/');
    }
    return '';
  }

  defaultCatch<T>(t?: T): OperatorFunction<T, T> {
    return catchError(_ => t ? of(t) : of<T>());
  }

  defaultCatchList<T>(t?: T[]): OperatorFunction<T[], T[]> {
    return catchError(_ => of(t || []));
  }
}

export interface HttpOptions {
  params?: HttpParams;
  headers?: { [header: string]: string };
}

export interface RequestMetadata {
  extraUrl?: string | null;
  sufixUrl?: string | null;
  paramns?: HttpParams | null;
  objEnvio?: ObjEnvio | string | null | object | boolean;
  maxRetryAttempts?: number | null;
  timeout?: number;
}

export interface ObjEnvio {
  id: string | number | null | undefined;
}

export const genericRetryStrategy = ({ maxRetryAttempts = 5, scalingDuration = 1000, excludedStatusCodes = [] }: RetryStrategyParams) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error: HttpErrorResponse, i: number) => {

      maxRetryAttempts = maxRetryAttempts || maxRetryAttempts !== 0 ? 5 : 0;
      scalingDuration = scalingDuration || 1000;
      excludedStatusCodes = excludedStatusCodes || [];

      if (error.status === 401) {
        localStorage.clear();
      }

      const retryAttempt: number = i + 1;
      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.find((e: number) => e === error.status)
      ) {
        return throwError(() => error);;
      }

      return timer(retryAttempt * scalingDuration);
    })
  );
};

export interface RetryStrategyParams {
  maxRetryAttempts?: number | null;
  scalingDuration?: number | null;
  excludedStatusCodes?: number[] | null;
}