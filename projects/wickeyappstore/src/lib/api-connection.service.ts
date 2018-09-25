import { throwError as observableThrowError, Subscription, Observable } from 'rxjs';
import { share, catchError, map } from 'rxjs/operators';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, ɵparseCookieValue as parseCookieValue } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { MatDialog } from '@angular/material';
// import { WasAlert } from './ui/popover/wasalert/wasalert.dialog';
import { Review, Inapp } from './app.models';

/**
 * @module
 * @ignore
 */
@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {
  private apiHeaders: HttpHeaders;
  private version = '.2';
  private person_url = 'https://api.wickeyappstore.com/person/update/';
  private person_recover_token_url = 'https://api.wickeyappstore.com/person/recovery/token/';
  private person_recover_verify_url = 'https://api.wickeyappstore.com/person/recovery/verify/';
  private person_auth_url = 'https://api.wickeyappstore.com/person/auth/';
  private favorites_url = 'https://api.wickeyappstore.com/person/favorites/';
  private fav_del_url = 'https://api.wickeyappstore.com/person/favorites/remove/';
  private purchases_url = 'https://api.wickeyappstore.com/purchases/';
  private consumeUrl = 'https://api.wickeyappstore.com/consume/';
  private reviews_url = 'https://api.wickeyappstore.com/reviews/';
  private wasstore_url = 'https://api.wickeyappstore.com/wasstore/';
  private bluesnapTokenUrl = 'https://api.wickeyappstore.com/bluesnap/token/';
  private bluesnapShopperUrl = 'https://api.wickeyappstore.com/bluesnap/shopper/';
  private bluesnapWalletUrl = 'https://api.wickeyappstore.com/bluesnap/wallet/';
  private adVideoStartUrl = 'https://api.wickeyappstore.com/video/start/';
  private adVideoEndUrl = 'https://api.wickeyappstore.com/video/end/';
  private highscoreUrl = 'https://api.wickeyappstore.com/highscore/';
  private leaderboardUrl = 'https://api.wickeyappstore.com/leaderboard/';

  constructor(
    private http: HttpClient,
    // public dialog: MatDialog
  ) {
    this.apiHeaders = new HttpHeaders().set('API-VERSION', this.version);
  }
  cookie_read(name: string): any {
    const result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
    return result ? result[1] : null;
  }
  cookie_write(name: string, value: string, days?: number): void {
    try {
      if (!days) {
        days = 365 * 20;
      }
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = '; expires=' + date.toUTCString();
      document.cookie = name + '=' + value + expires + ';domain=.wickeyappstore.com;secure;path=/;SameSite=Lax';
    } catch (cookieError) {
      console.error('cookie_write', cookieError);
    }
  }
  cookie_remove(name: string): void {
    this.cookie_write(name, undefined, -1);
  }

  handleHeaders(password?: string) {
    // NOTE: This needs to be in each api, so that is updated as soon as logged in
    const _headers = { 'API-VERSION': this.version };
    // NOTE: This needs to be in each api, so that is updated as soon as logged in
    const session_id = this.cookie_read('was_session_id');
    if (session_id) {
      _headers['WAS-SESSION'] = session_id;
    }
    if (password) {
      _headers['Authorization1'] = `Basic ${this.b64EncodeUnicode(password)}`;
    }
    this.apiHeaders = new HttpHeaders(_headers);
  }

  // THE OBSERVABLE WAY //
  private handleError(error: HttpErrorResponse) {
    let errMsg: string;
    console.error('WASAPI: handleError', error);
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
          const _checkIfValue = function (_obj: any, _key: string) {
            if (_obj.hasOwnProperty(_key) && (_obj[_key] !== undefined && _obj[_key] !== null)) {
              return true;
            } else {
              return false;
            }
          };
          if (_checkIfValue(error, 'error') && _checkIfValue(error.error, 'error') && _checkIfValue(error.error.error, 'message')) {
            errMsg = error.error.error.message;  // JSON.parse(error.error)
            // Catch 419 session expired error that will be returned on invalid session id
            // FOR NOW, ONLY HANDLE THE SESSION EXPIRED CASE
            // if (errorObj.error.code === 419) {
            //   this.dialog.open(WasAlert, {
            //     data: { title: 'Attention', body: error, buttons: ['Login', 'Cancel'] }
            //   }).afterClosed().subscribe(result => {
            //     // result is the index of the button pressed
            //     if (result === 0) {
            //       console.log('Open SSO');  // After SSO is a dialog, simply open right here
            //     }
            //   });
            // }
          } else if (_checkIfValue(error, 'message')) {
            errMsg = error.message;
          } else {
            errMsg = error.statusText;
          }
        } catch (locerror) {
          // TODO: Log these type of errors to server. TODO: Create server logger.
          // errMsg = locerror.toString();
          errMsg = error.statusText;
          console.error('API: + LOCAL Error:', error, locerror);
        }
      } else {
        errMsg = 'There is no Internet connection.';
      }
    }
    // TODO: observableThrowError(new Error(errMsg));
    return observableThrowError(errMsg);
  }
  private extractData(res: any) {
    const body = res.data;
    // Add http status to body //
    body.status = res.status;
    try {
      if (body.hasOwnProperty('special_message')) {
        console.log(`ApiConnectionService: extractData: special_message:[${body.special_message}]`);
        // this.dialog.open(WasAlert, {
        //   data: { title: body.special_message.title, body: body.special_message.message }
        // });
      }
    } catch (extractError) {
      console.error('extractData', extractError);
    }
    return body;
  }
  private extractVerifyData(res: any) {
    const body = res.data;
    // Add http status to body //
    body.status = res.status;
    console.log('set session id', body.session_id);
    try {
      this.cookie_write('was_session_id', body.session_id);
      if (body.hasOwnProperty('special_message')) {
        console.log(`ApiConnectionService: extractData: special_message:[${body.special_message}]`);
        // this.dialog.open(WasAlert, {
        //   data: { title: body.special_message.title, body: body.special_message.message }
        // });
      }
    } catch (extractError) {
      console.error('extractVerifyData', extractError);
    }
    return body;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
  b64EncodeUnicode(str: string): string {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode(Number('0x' + p1));
      }));
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

  // Creates or updates person, returns person info
  // person info also includes inapps and app settings
  createPerson(apiobject: any): Observable<any> {
    this.handleHeaders();
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.person_url, apiobject, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }

  /**
  * Return a list of favorite apps.
  *
  * @param [_params] {"user_id": string}
  * @returns Success or failure status code and message. {favorites:[{app},...]}
  */
  getFavorites(_params?: any): Observable<any> {
    this.handleHeaders();
    const _query_string = this.encode_query_string(_params);
    return this.http.get(`${this.favorites_url}?${_query_string}`, { headers: this.apiHeaders }).pipe(
      map((res: any) => {
        return this.extractData(res).favorites;
      }), catchError(this.handleError), share());
  }

  /**
   * Add an app to list of favorite apps.
   *
   * @param user_id The user id.
   * @param [storeapp_id] This is only sent in from WickeyAppStore (on actual app sites it uses the hostname).
   * @returns Success or failure status code and message. {favorites:[{app},...]}
   */
  setFavorite(user_id: string, storeapp_id?: number): Observable<any> {
    this.handleHeaders();
    const apiobject = { user_id: user_id };
    if (storeapp_id) {
      apiobject['storeapp_id'] = storeapp_id;
    }
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.favorites_url, apiobject, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map((res: any) => {
        return this.extractData(res).favorites;
      }), catchError(this.handleError), share());
  }

  /**
   * Remove an app from the list of favorite apps.
   *
   * @param user_id The user id.
   * @param [storeapp_id] This is only sent in from WickeyAppStore (on actual app sites it uses the hostname).
   * @returns Success or failure status code and message. {favorites:[{app},...]}
   */
  deleteFavorite(user_id: string, storeapp_id?: number): Observable<any> {
    this.handleHeaders();
    const apiobject = { user_id: user_id };
    if (storeapp_id) {
      apiobject['storeapp_id'] = storeapp_id;
    }
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.fav_del_url, apiobject, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map((res: any) => {
        return this.extractData(res).favorites;
      }), catchError(this.handleError), share());
  }

  // Sends the email a recovery token
  tokenPerson(email: string, user_id: string): Observable<any> {
    this.handleHeaders();
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.person_recover_token_url, { email: email, user_id: user_id },
      { headers: this.apiHeaders, withCredentials: true }).pipe(
        map(this.extractData),
        catchError(this.handleError), share());
  }
  // Verify the recovery token
  verifyPerson(email: string, user_id: string, verification_token: string, version?: number, password?: string): Observable<any> {
    if (password) {
      this.handleHeaders(password);
    } else {
      this.handleHeaders();
    }
    // DEPRECATE version parameter
    this.handleHeaders();
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.person_recover_verify_url,
      { email: email, user_id: user_id, verification_token: verification_token }, { headers: this.apiHeaders, withCredentials: true }).pipe(
        map((res: any) => {
          return this.extractVerifyData(res);
        }), catchError(this.handleError), share());
  }

  /**
   * Set or change a password of a user.
   *
   * @param user_id string: The user id.
   * @param password string: The raw password.
   * @param new_password string: OPTIONAL The new password on password changes.
   * @returns Success or failure status code and message.
   */
  authPerson(user_id: string, password: string, new_password?: string): Observable<any> {
    this.handleHeaders(password);
    const apiobject = { user_id: user_id };
    if (new_password) {
      apiobject['new_password'] = this.b64EncodeUnicode(new_password);
    }
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.person_auth_url, apiobject, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }

  /**
  * Returns a list of reviews for a store app.
  *
  * @example
  * this.apiConnectionService.getReviews({'storeapp_id': this.selected_app.id}).subscribe((_reviews: any) => { });
  * @param _params {"storeapp_id": number}: OPTIONAL storeapp_id (id of the storeapp)
  * @returns List of reviews [{"id":number,"title":string,"text":string,"rating":number,"last_modified":number},..]
  */
  getReviews(_params?: any): Observable<[Review]> {
    this.handleHeaders();
    const _query_string = this.encode_query_string(_params);
    return this.http.get(`${this.reviews_url}?${_query_string}`, { headers: this.apiHeaders }).pipe(
      map((res: any) => {
        return this.extractData(res).reviews;
      }), catchError(this.handleError), share());
  }

  /**
   * Creates a new review or edits an existing one.
   *
   * @example
   * this.apiConnectionService.setReview({'user_id':string,'title':string,'text':string,'rating':number}).subscribe((_data: any) => { });
   * @param _review {'user_id':string,'title':string,'text':string,'rating':number}
   */
  setReview(_params: any): Observable<any> {
    this.handleHeaders();
    return this.http.post(this.reviews_url, _params, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }

  /**
  * Returns a list of inapps for the app.
  *
  * @example
  * this.apiConnectionService.getInapps().subscribe((_inapps: any) => { });
  * @param [_params] {user_id: <string>}.
  * @returns List of inapps
  */
  getInapps(_params?: any): Observable<any> {
    this.handleHeaders();
    const _query_string = this.encode_query_string(_params);
    return this.http.get(`${this.purchases_url}?${_query_string}`, { headers: this.apiHeaders }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }

  /**
   * Creates a new purchase.
   *
   * @example
   * this.apiConnectionService.setPurchase(
   * {'user_id':string,'purchase_id':string,'receipt':string,'pay_amount':number,'email':string,'first_name':string,
   * 'last_name':string,'zip_code':string,'apple_wallet_token'?:string}
   * ).subscribe((_data: any) => { });
   * @param _params {*}: The parameters listed in the example.
   * @returns Returns a standard user object (same as createPerson)
   */
  setPurchase(_params: any): Observable<any> {
    this.handleHeaders();
    return this.http.post(this.purchases_url, _params, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map(this.extractData),
      catchError(this.handleError), share());
  }

  /**
   * Consumes coins recieved from purchases or videos.
   *
   * @example
   * this.apiConnectionService.consumeCoins({'user_id':string,'coins':number,'reason'?:string}).subscribe((_data: any) => { });
   * @param _params {user_id: string, coins: number, reason?: string}
   * @returns Returns a standard user object (same as createPerson)
   */
  consumeCoins(_params: { user_id: string, coins: number, reason?: string }): Observable<any> {
    this.handleHeaders();
    return this.http.post(this.consumeUrl, _params, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map(this.extractData),
      catchError(this.handleError), share());
  }

  /**
  * Returns a BlueSnap hosted field token
  */
  getBluesnapToken(): Observable<{ token: string }> {
    return this.http.post(this.bluesnapTokenUrl, {}).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }
  /**
   * Returns an encrypted shopper token in `token`, post to to BlueSnap via `enc=this_returned_token`
   */
  getBluesnapShopper(_shopper_id: number): Observable<{ token: string }> {
    return this.http.post(this.bluesnapShopperUrl, { shopper_id: _shopper_id }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }

  /**
   * Returns a BlueSnap Wallet token. (Used with ApplePay)
   * https://developers.bluesnap.com/v8976-Basics/docs/apple-pay#section-step-4-verify-your-domain
   *
   * @param _validation_url The `event.validationURL` from the BlueSnap onvalidatemerchant callback
   * @returns the auth token, an object.
   */
  getBluesnapWallet(_validation_url: string): Observable<{ token: string }> {
    return this.http.post(this.bluesnapWalletUrl, { validation_url: _validation_url }).pipe(
      map((res: any) => {
        return res;
      }), catchError(this.handleError), share());
  }
  /**
  * Notifies the server that a video ad has started by this user and video id.
  */
  adVideoStart(user_id: string, video_id: string): Observable<any> {
    this.handleHeaders();
    return this.http.post(this.adVideoStartUrl, { user_id: user_id, video_id: video_id },
      { headers: this.apiHeaders }).pipe(
        map((res: any) => {
          return this.extractData(res);
        }), catchError(this.handleError), share());
  }
  /**
  * Notifies the server that a video ad has ended by this user and video id.
  */
  adVideoEnd(user_id: string, video_id: string): Observable<any> {
    this.handleHeaders();
    return this.http.post(this.adVideoEndUrl, { user_id: user_id, video_id: video_id }, { headers: this.apiHeaders }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }
  /**
   * Gets a value(s) for requested key(s).
   *
   * @example
   * this.apiConnectionService.getWASStore(
   * {'user_id':string,'keys':string}
   * ).subscribe((_data: any) => { });
   * @param _params string: user_id, string: keys where keys is a single key or a comma separated string of keys (keys='key1,')
   * @returns Returns a standard user object with was_data.
   */
  getWASStore(_params: { user_id: string, keys: string }): Observable<{}> {
    this.handleHeaders();
    // NOTE: Use share to avoid duplicate calls
    const _query_string = this.encode_query_string(_params);
    return this.http.get(`${this.wasstore_url}?${_query_string}`, { headers: this.apiHeaders }).pipe(
      map((res: any) => {
        return this.extractData(res).was_data;
      }), catchError(this.handleError), share());
  }
  /**
   * Stores/Updates all values to respective key in passed in json was_data.
   *
   * @example
   * this.apiConnectionService.setWASStore(
   * {'user_id':string,'was_data':{key:value,...}}
   * ).subscribe((_data: any) => { });
   * @param _params string: user_id, json: was_data where was_data is format {key:value,...}
   * @returns Returns a standard user object with was_data.
   */
  setWASStore(_params: { user_id: string, was_data: {} }): Observable<any> {
    this.handleHeaders();
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.wasstore_url, _params, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }
  /**
   * Deletes a value(s) for the requested key(s).
   *
   * @example
   * this.apiConnectionService.deleteWASStore(
   * {'user_id':string,'keys':string}
   * ).subscribe((_data: any) => { });
   * @param _params string: user_id, string: keys where keys is a single key or a comma separated string of keys (keys='key1,')
   * @returns Returns a standard user object.
   */
  deleteWASStore(_params: { user_id: string, keys: string }): Observable<any> {
    this.handleHeaders();
    // NOTE: Use share to avoid duplicate calls
    const _query_string = this.encode_query_string(_params);
    return this.http.delete(`${this.wasstore_url}?${_query_string}`, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }

  /**
   * Get the leaderboard for app. Optional pass in username to return rank of user.
   *
   * @example
   * this.apiConnectionService.getLeaderboard().subscribe((_data: any) => { });
   * @param _params string: username,
   * @returns Returns a leaderboard list (optional: and rank of passed in username).
   */
  getLeaderboard(_params: { username?: string }): Observable<{ leaderboard: [any], rank?: number }> {
    this.handleHeaders();
    // NOTE: Use share to avoid duplicate calls
    const _query_string = this.encode_query_string(_params);
    return this.http.get(`${this.leaderboardUrl}?${_query_string}`, { headers: this.apiHeaders }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }
  /**
   * Stores/Updates the highscore of user.
   *
   * @example
   * this.apiConnectionService.setHighscore(
   * {'user_id':string,'highscore':number}
   * ).subscribe((_data: any) => { });
   * @param _params string: user_id, json: was_data where was_data is format {key:value,...}
   * @returns Returns rank of user.
   */
  setHighscore(_params: { user_id: string, highscore: number }): Observable<{ rank?: number }> {
    this.handleHeaders();
    // NOTE: Use share to avoid duplicate calls
    return this.http.post(this.highscoreUrl, _params, { headers: this.apiHeaders, withCredentials: true }).pipe(
      map((res: any) => {
        return this.extractData(res);
      }), catchError(this.handleError), share());
  }

}
