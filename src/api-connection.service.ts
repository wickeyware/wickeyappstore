import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
// import { Headers, RequestOptions, Response, Http } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Review, Inapp } from './app.models';

@Injectable()
export class ApiConnectionService {
  private person_url = 'https://api.wickeyappstore.com/person/update/';
  private person_recover_token_url = 'https://api.wickeyappstore.com/person/recovery/token/';
  private person_recover_verify_url = 'https://api.wickeyappstore.com/person/recovery/verify/';
  private app_url = 'https://api.wickeyappstore.com/apps/';
  private featured_url = 'https://api.wickeyappstore.com/apps/featured/';
  private purchases_url = 'https://api.wickeyappstore.com/purchases/';
  private reviews_url = 'https://api.wickeyappstore.com/reviews/';
  private wasstore_url = 'https://api.wickeyappstore.com/wasstore/';
  // TODO: Add BlueSnap APIS
  // bluesnap
  // bluesnap/wallet/
  // bluesnap/token/
  // bluesnap/shopper/


  constructor(
    private http: HttpClient
  ) { }

  // THE OBSERVABLE WAY //
  private handleError (error: HttpErrorResponse) {
    let errMsg: string;
    console.log('WASAPI: handleError', error);
    if (error.error instanceof Error) {
      // A client-side or network error occurred.
      // http://stackoverflow.com/questions/39571231/how-to-check-whether-user-has-internet-connection-or-not-in-angular2
      if (navigator.onLine) {
        errMsg = `${error.status} - ${error.statusText || ''} ${error.error.message}`;
      } else {
        errMsg = 'There is no Internet connection.';
      }
    } else {
      if (navigator.onLine) {
        // The backend returned an unsuccessful response code.
        // {"error": {"message": string, code: number}} // where code is a http status code as-well as an internal error code.
        try {
          const errorObj = error.error;  // JSON.parse(error.error)
          errMsg = errorObj.error.message;
        } catch (locerror) {
          // errMsg = locerror.toString();
          errMsg = error.message;
          console.error('API: + LOCAL Error:', error, locerror);
        }
      } else {
        errMsg = 'There is no Internet connection.';
      }
    }
    return Observable.throw(errMsg);
  }
  private extractData(res: any) {
    // console.log('WASAPI: extractData', res);
    const body = res.data;
    // Add http status to body //
    body.status = res.status;
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
  getApps(_params?: any): Observable<[any]> {
    // NOTE: Use share to avoid duplicate calls
    const _query_string = this.encode_query_string(_params);
    console.log('WASAPI: getApps', _query_string);
    return this.http.get(`${this.app_url}?${_query_string}`)
          .map((res: any) => {
            return this.extractData(res).apps;
          }).catch(this.handleError).share();
  }

  /**
   * This returns a list of featured groups of apps.
   *
   * @param {*} [_params] None needed, just future proofing.
   * @returns {Observable<[any]>} {"groups": [{"id": number, "title": string, "created_time": number, "apps": [_app, _app, ...]}, {}, ...]}
   * @memberof ApiConnectionService
   */
  getFeaturedGroups(_params?: any): Observable<[any]> {
    // NOTE: Use share to avoid duplicate calls
    const _query_string = this.encode_query_string(_params);
    console.log('WASAPI: getFeaturedGroups', _query_string);
    return this.http.get(`${this.featured_url}?${_query_string}`)
          .map((res: any) => {
            return this.extractData(res).groups;
          }).catch(this.handleError).share();
  }

  // Creates or updates person, returns person info
  // person info also includes inapps and app settings
  createPerson(apiobject: any): Observable<any> {
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.person_url, apiobject)
               .map(this.extractData)
               .catch(this.handleError).share();
  }
  // Sends the email a recovery token
  tokenPerson(email: string, user_id: string): Observable<any> {
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.person_recover_token_url, {email: email, user_id: user_id})
               .map(this.extractData)
               .catch(this.handleError).share();
  }
  // Verify the recovery token
  verifyPerson(email: string, user_id: string, verification_token: string, version: number): Observable<any> {
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.person_recover_verify_url,
      {email: email, user_id: user_id, verification_token: verification_token, version: version})
               .map(this.extractData)
               .catch(this.handleError).share();
  }

  /**
  * Returns a list of reviews for a store app.
  *
  * @example
  * this.apiConnectionService.getReviews({'storeapp_id': this.selected_app.id}).subscribe((_reviews: any) => {
  *  console.log(_reviews);
  * });
  * @param {"storeapp_id": number} [_params] storeapp_id (id of the storeapp)
  * @returns {Observable<[Review]>} [{"id":number,"title":string,"text":string,"rating":number,"last_modified":number},..]
  * @memberof ApiConnectionService
  */
  getReviews(_params?: any): Observable<[Review]> {
    const _query_string = this.encode_query_string(_params);
    console.log('getReviews', _query_string);
    return this.http.get(`${this.reviews_url}?${_query_string}`)
          .map((res: any) => {
            return this.extractData(res).reviews;
          }).catch(this.handleError).share();
  }

  /**
   * Creates a new review or edits an existing one.
   *
   * @example
   * this.apiConnectionService.setReview({'user_id':string,'title':string,'text':string,'rating':number}).subscribe((_data: any) => {
   *  console.log(_data);
   * });
   * @param {*} _review {'user_id':string,'title':string,'text':string,'rating':number}
   * @returns {Observable<any>}
   * @memberof ApiConnectionService
   */
  setReview(_params: any): Observable<any> {
    return this.http.post(this.reviews_url, _params)
          .map(this.extractData)
          .catch(this.handleError).share();
  }

  /**
  * Returns a list of inapps for the app.
  *
  * @example
  * this.apiConnectionService.getInapps().subscribe((_inapps: any) => {
  *  console.log(_inapps);
  * });
  * @param @param {*} [_params] None needed, just future proofing.
  * @returns {Observable<[Inapp]>} List of inapps
  * @memberof ApiConnectionService
  */
  getInapps(_params?: any): Observable<[Review]> {
    const _query_string = this.encode_query_string(_params);
    return this.http.get(`${this.purchases_url}?${_query_string}`)
          .map((res: any) => {
            return this.extractData(res).inapps;
          }).catch(this.handleError).share();
  }

  /**
   * Creates a new purchase.
   *
   * @example
   * this.apiConnectionService.setPurchase(
   * {'user_id':string,'purchase_id':string,'receipt':string,'pay_amount':number,'email':string,'first_name':string,
   * 'last_name':string,'zip_code':string,'apple_wallet_token'?:string}
   * ).subscribe((_data: any) => {
   *  console.log(_data);
   * });
   * @param {*} _params The parameters listed in the example.
   * @returns {Observable<any>} Returns a standard user object (same as createPerson)
   * @memberof ApiConnectionService
   */
  setPurchase(_params: any): Observable<any> {
    return this.http.post(this.purchases_url, _params)
          .map(this.extractData)
          .catch(this.handleError).share();
  }

  /**
   * Gets a value(s) for requested key(s).
   *
   * @example
   * this.apiConnectionService.getWASStore(
   * {'user_id':string,'keys':string}
   * ).subscribe((_data: any) => {
   *  console.log(_data);
   * });
   * @param {*} _params string: user_id, string: keys where keys is a single key or a comma separated string of keys (keys='key1,')
   * @returns {Observable<any>} Returns a standard user object with was_data.
   * @memberof ApiConnectionService
   */
  getWASStore(_params: {user_id: string, keys: string}): Observable<{}> {
    console.log('WASAPI: getWASStore _params', _params);
    // NOTE: Use share to avoid duplicate calls
    const _query_string = this.encode_query_string(_params);
    console.log('WASAPI: getWASStore', _query_string);
    return this.http.get(`${this.wasstore_url}?${_query_string}`)
          .map((res: any) => {
            return this.extractData(res).was_data;
          }).catch(this.handleError).share();
  }
  /**
   * Stores/Updates all values to respective key in passed in json was_data.
   *
   * @example
   * this.apiConnectionService.setWASStore(
   * {'user_id':string,'was_data':{key:value,...}}
   * ).subscribe((_data: any) => {
   *  console.log(_data);
   * });
   * @param {*} _params string: user_id, json: was_data where was_data is format {key:value,...}
   * @returns {Observable<any>} Returns a standard user object with was_data.
   * @memberof ApiConnectionService
   */
  setWASStore(_params: {user_id: string, was_data: {}}): Observable<any> {
    // NOTE: Use share to avoid duplicate calls
    const _query_string = this.encode_query_string(_params);
    console.log('WASAPI: getWASStore', _query_string);
    return this.http.post(this.wasstore_url, _params)
          .map((res: any) => {
            return this.extractData(res);
          }).catch(this.handleError).share();
  }
  /**
   * Deletes a value(s) for the requested key(s).
   *
   * @example
   * this.apiConnectionService.deleteWASStore(
   * {'user_id':string,'keys':string}
   * ).subscribe((_data: any) => {
   *  console.log(_data);
   * });
   * @param {*} _params string: user_id, string: keys where keys is a single key or a comma separated string of keys (keys='key1,')
   * @returns {Observable<any>} Returns a standard user object.
   * @memberof ApiConnectionService
   */
  deleteWASStore(_params: {user_id: string, keys: string}): Observable<any> {
    // NOTE: Use share to avoid duplicate calls
    const _query_string = this.encode_query_string(_params);
    console.log('WASAPI: deleteWASStore', _query_string);
    return this.http.delete(`${this.wasstore_url}?${_query_string}`)
          .map((res: any) => {
            return this.extractData(res);
          }).catch(this.handleError).share();
  }

}
