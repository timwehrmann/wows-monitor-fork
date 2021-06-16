/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { MatchInfo } from '../models/match-info';
import { TempArenaInfo } from '../models/temp-arena-info';

@Injectable({
  providedIn: 'root',
})
export class StatsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation statsSendStats
   */
  static readonly StatsSendStatsPath = '/stats';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statsSendStats()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statsSendStats$Response(params: {
    token?: string;
    body: TempArenaInfo
  }): Observable<StrictHttpResponse<MatchInfo>> {

    const rb = new RequestBuilder(this.rootUrl, StatsService.StatsSendStatsPath, 'post');
    if (params) {
      rb.query('token', params.token, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<MatchInfo>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `statsSendStats$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statsSendStats(params: {
    token?: string;
    body: TempArenaInfo
  }): Observable<MatchInfo> {

    return this.statsSendStats$Response(params).pipe(
      map((r: StrictHttpResponse<MatchInfo>) => r.body as MatchInfo)
    );
  }

}
