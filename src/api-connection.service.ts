import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiConnectionService {
  private app_api_url = 'https://api.wickeyappstore.com/apps';

  constructor(
    private http: Http
  ) { }

  // THE OBSERVABLE WAY //
  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      if (err.message) {
        errMsg = `${err.message}`;
      } else {
        // http://stackoverflow.com/questions/39571231/how-to-check-whether-user-has-internet-connection-or-not-in-angular2
        if (navigator.onLine) {
          errMsg = `${error.status} - ${error.statusText || ''} ${err.message}`;
        } else {
          errMsg = 'There is no Internet connection.';
        }
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  private extractData(res: Response) {
    const body = res.json().data;
    // Add http status to body //
    body.status = res.status;
    if (body.settings) {
      if (body.settings.price_list && typeof body.settings.price_list === 'string') {
        // PARSE this json, it is a json string
        body.settings.price_list = JSON.parse(body.settings.price_list);
      }
    }
    return body;
  }

  encode_query_string(_obj): string {
    // http://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
    const q_str = [];
    for (const _p in _obj) {
      if (_obj.hasOwnProperty(_p)) {
        q_str.push(encodeURIComponent(_p) + '=' + encodeURIComponent(_obj[_p]));
      }
    }
    return q_str.join('&');
  }

// Returns app store apps {name: string, category: number, ordering: number}
  get_apps(_params?: any): Observable<[any]> {
    const _query_string = this.encode_query_string(_params);
    console.log('get_apps', _query_string);
    return this.http.get(`${this.app_api_url}/?${_query_string}`)
               .map((res: Response) => {
                 return this.extractData(res).apps;
                })
               .catch(this.handleError);
  }

}
