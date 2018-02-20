import { Injectable } from '@angular/core';
import { ApiConnectionService } from './api-connection.service';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MatDialog } from '@angular/material';  // MatDialogRef, MAT_DIALOG_DATA
import { WasSSO } from './ui/popover/wassso/wassso.dialog';
import { WasAlert } from './ui/popover/wasalert/wasalert.dialog';
import { User, Review, Inapp } from './app.models';
export * from './app.models';

export interface UserParams {
  coins?: number;
  data?: any;
  email?: string;
  token_email?: string;
  token?: string;
  freebie_used?: boolean;
  rated_app?: boolean;
  logging_in?: boolean;
  push_id?: string;
}
// TODO: ADD PURCHASES

/**
 * The service to get/set a user.
 * Following the example given here:
 * http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
 * Full code: https://github.com/jhades/angular2-rxjs-observable-data-services
 * Thanks @jhades
 *
 * @example
 * Import the service in the base `app.module.ts
 * import { UserService, UserParams } from './user.service';
 *
 * Add to the providers:
 * providers: [UserService, ...],
 *
 * Import in any component this is to be used:
 * import { UserService } from './user.service';
 *
 * Inject it in the constructor
 * constructor(private userService: UserService) { }
 *
 * Get user:
 * this.userService.user();
 *
 * Update user:
 * this.userService.updateUser(_user_obj);
 */
@Injectable()
export class UserService {
  private _user: ReplaySubject<User> = new ReplaySubject(1);
  private _loginChange: ReplaySubject<boolean> = new ReplaySubject(1);
  private _userObj: User;
  private _createNewUser = false;
  private _isLoggedIn = false;
  private standalone: boolean;
  private lut = [];

  constructor(
    private apiConnectionService: ApiConnectionService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) {
    this.loadUser();
    // TODO: Check if logging in
    this._user.subscribe( (usr: User) => {
      if (this.isEmpty( usr.email ) === false) {
        // Check if flag changed
        if (this._isLoggedIn === false) {
          console.warn('UserService LOGGED IN');
          this._isLoggedIn = true;
          this._loginChange.next(this._isLoggedIn);
        }
      } else {
        if (this._isLoggedIn === true) {
          console.warn('UserService LOGGED OUT');
          this._isLoggedIn = false;
          this._loginChange.next(this._isLoggedIn);
        }
      }
    });
  }
  // TODO: Handle SSO open/close here

  // test if the string is empty or null
  isEmpty(str: string): boolean {
    return (!str || 0 === str.length);
  }
  /**
   * Pushes boolean to all subscribers on login status changes.
   *
   * @example
   * Use in angular template with the `async` pipe
   * userService.loginChange | async
   * Subscribe in ts: userService.loginChange.subscribe
   *
   * @readonly
   */
  get loginChange() {
    return this._loginChange;
  }
  /**
   * Returns true if user is logged in and else false.
   * NOTE: This should only be used if UserService has already loaded the User, otherwise the result is un-reliable (Check out loginChange).
   */
  get isLoggedInVal() {
    return this._isLoggedIn;
  }
  get isLoggedInObs() {
    return this._user.map((usr: User) => {
      if (this.isEmpty( usr.email ) === false) {
        return true;
      } else {
        return false;
      }
    });
  }
  /**
   * Returns promise of user login status (true if logged in).
   * NOTE: It also on page load it emits the login status.
   *
   * @readonly
  */
  isLoggedIn(): Promise<boolean> {
    // NOTE: Directly checking if user object is in storage. If using UserService, the initial user was `undefined`,
    // thus it looked as if it was not logged in.
    return this.localStorageService.get('was-user')
    .then((value: any): boolean => {
      let _islog = this._isLoggedIn;
      if (typeof value !== 'undefined' && value.user_id !== undefined) {
        const _localUser = value as User;
        if (this.isEmpty( _localUser.email ) === false) {
          _islog = true;
        } else {
          _islog = false;
        }
      } else {
        _islog = false;
      }
      return _islog;
    }).catch(() => {
      return this._isLoggedIn;
    });
  }

  /**
   * Pushes User Object to all subscribers on every user update.
   *
   * @example
   * Use in angular template with the `async` pipe
   * userService.user | async
   * Subscribe in ts: userService.user.subscribe
   *
   * @readonly
   */
  get user() {
    return this._user;  // NOTE: This is only neccessary if _user was not an observable .asObservable();
  }
  get userObject() {
    return this._userObj;
  }
  get coins() {
    return this._userObj.coins;
  }
  get data() {
    return this._userObj.data;
  }
  // TODO: Possibly create a userService.messages
  private pushSubscribers(_usr: User) {
    this._userObj = _usr;
    this._user.next(_usr);
    // NOTE: This is only used with Async to push the last value: this._user.complete();
  }
  private saveLocal(_usr: User) {
    this.localStorageService.set('was-user', _usr);
  }
  loadUser() {
    this.localStorageService.get('was-user')
      .then((value: any): void => {
        if (typeof value !== 'undefined' && value.user_id !== undefined) {
          const _localUser = value as User;
          this.pushSubscribers(_localUser);
          // show the SSO iff logging in
          if (_localUser.logging_in) {
            this.dialog.open(WasSSO, {
              data: { email: _localUser.token_email }
            });
          }
          // normal load
          console.log('UserService loadUser: load user from db', _localUser);
          this._createNewUser = false;
          this.updateUser({});
        } else {
          // create new user
          this._createNewUser = true;
          this.updateUser({});
        }
      }
      ).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    // .catch(this.handleError);
    console.error('UserService: An error occurred', error);  // for demo purposes
    return Promise.reject(error.message || error);
  }

  checkStandalone(): void {
    // THIS ONLY WORKS ON iOS
    if ('standalone' in window.navigator) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Navigator
      this.standalone = (<any>window.navigator).standalone;
      console.log('homescreen iOS', this.standalone);
    } else {
      // https://developers.google.com/web/updates/2015/10/display-mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.standalone = true;
      } else {
        this.standalone = false;
      }
      console.log('homescreen chrome', this.standalone);
    }
  }

  /**
   * Fast UUID generator, RFC4122 version 4 compliant.
   * @author Jeff Ward (jcward.com).
   * @license MIT license
   * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
   **/
  guid(): string {
    /* tslint:disable: no-bitwise */
    for (let i = 0; i < 256; i++) { this.lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
    let d0;
    let d1;
    let d2;
    let d3;
    if (typeof (window) !== 'undefined' && typeof (window.crypto) !== 'undefined'
      && typeof (window.crypto.getRandomValues) !== 'undefined') {
      const dvals = new Uint32Array(4);
      window.crypto.getRandomValues(dvals);
      d0 = dvals[0];
      d1 = dvals[1];
      d2 = dvals[2];
      d3 = dvals[3];
    } else {
      d0 = Math.random() * 0xffffffff | 0;
      d1 = Math.random() * 0xffffffff | 0;
      d2 = Math.random() * 0xffffffff | 0;
      d3 = Math.random() * 0xffffffff | 0;
    }
    return this.lut[d0 & 0xff] + this.lut[d0 >> 8 & 0xff] + this.lut[d0 >> 16 & 0xff] + this.lut[d0 >> 24 & 0xff] + '-' +
      this.lut[d1 & 0xff] + this.lut[d1 >> 8 & 0xff] + '-' + this.lut[d1 >> 16 & 0x0f | 0x40] + this.lut[d1 >> 24 & 0xff] + '-' +
      this.lut[d2 & 0x3f | 0x80] + this.lut[d2 >> 8 & 0xff] + '-' + this.lut[d2 >> 16 & 0xff] + this.lut[d2 >> 24 & 0xff] +
      this.lut[d3 & 0xff] + this.lut[d3 >> 8 & 0xff] + this.lut[d3 >> 16 & 0xff] + this.lut[d3 >> 24 & 0xff];
  }

  /**
   * Update User object, saves locally and to server.
   *
   * @param [userParams] OPTIONAL object of parameters to update user.
   */
  updateUser(userParams: UserParams): Observable<User> {
    let currentUser;
    if (this._createNewUser === true) {
      this._createNewUser = false;
      // NOTE: Check if user_id is in a cookie, to share user_id accross all wickeyappstore apps
      const _cookie_userid = this.localStorageService.cookie_read('was_user_id')
      if (_cookie_userid !== null && _cookie_userid !== '') {
        console.warn('UserService: FOUND USER ID IN COOKIE');
        currentUser = {user_id: _cookie_userid};
        this._userObj = currentUser;
      } else {
        console.warn('UserService: NO USER, CREATE USER');
        currentUser = {user_id: this.guid()};
      }
    } else {
      currentUser = this._userObj;
    }
    console.log('UserService: updateUser:', currentUser);
    // NOTE: Set params to current user, then update to sent in userParams, if any exist
    const apiobject = {user_id: currentUser.user_id, version: .1, standalone: false, app_coins: null, app_data: null,
      email: null, freebie_used: currentUser.freebie_used, rated_app: currentUser.rated_app, push_id: currentUser.push_id};
    // TODO: Deprecate sending email here, only send in on email verification.
    if (userParams.email) {
      apiobject.email = userParams.email;
    }
    if (userParams.freebie_used) {
      apiobject.freebie_used = userParams.freebie_used;
    }
    if (userParams.rated_app) {
      apiobject.rated_app = userParams.rated_app;
    }
    if (userParams.coins) {
      apiobject.app_coins = userParams.coins;
    }
    if (userParams.data) {
      apiobject.app_data = userParams.data;
    }
    if (userParams.push_id) {
      apiobject.push_id = userParams.push_id;
    }
    // GET IF LAUNCHED FROM HOMESCREEN //
    this.checkStandalone();
    if (this.standalone) {
      apiobject.standalone = this.standalone;
    }
    const _obs = this.apiConnectionService.createPerson(apiobject);
    _obs.subscribe((res) => {
      if (res.status === 201) {
        console.log('UserService: updateUser: NEW RETURN:', res);
        // On new user/recover
        // TODO: Add more of a verification
        // UPDATE USER //
        this.localStorageService.cookie_write('was_user_id', res.user_id);
        this.pushSubscribers(res);
        this.saveLocal(res);
      } else {
        console.log('UserService: updateUser: RETURN:', res);
        currentUser = this._userObj;
        // NOTE: If a user has an email, the account was either verified by token or doesn't belong to someone else.
        if (res.email && res.user_id) {
          currentUser.user_id = res.user_id;
          this.localStorageService.cookie_write('was_user_id', res.user_id);
        }
        if (res.email) {
          currentUser.email = res.email;
        }
        if (res.bs_id) {
          currentUser.bs_id = res.bs_id;
        }
        if (res.pro_user) {
          currentUser.pro_user = res.pro_user;
        }
        if (res.first_name) {
          currentUser.first_name = res.first_name;
        }
        if (res.last_name) {
          currentUser.last_name = res.last_name;
        }
        if (res.zip_code) {
          currentUser.zip_code = res.zip_code;
        }
        if (res.coins) {
          currentUser.coins = res.coins;
        }
        if (res.data) {
          currentUser.data = res.data;
        }
        if (res.rated_app) {
          currentUser.rated_app = res.rated_app;
        }
        if (res.push_id) {
          currentUser.push_id = res.push_id;
        }
        currentUser.created_time = res.created_time;
        currentUser.freebie_used = res.freebie_used;
        currentUser.settings = res.settings;
        this.pushSubscribers(currentUser);
        this.saveLocal(currentUser);
      }
      // Add user context in sentry
      // Raven.setUserContext({email: this._user.email, id: this._user.user_id});
    }, (error) => {
      console.log(`UserService: updateUser: error:[${error}]`);
      // NOTE: Handle errors in calling component.
      // alert(`Attention!\n${error}`);
      // <any>error | this casts error to be any
    });
    return _obs;
  }

  /**
   * Add/Update a user's pin/pass code used in faster or more secure logins.
   *
   * @param password The password, or current password if updating.
   * @param new_password OPTIONAL: New password.
   */
  setPassword(password: string, new_password?: string): Observable<any> {
    console.log('============UserService setPassword=========');
    let _updatedUsr = this._userObj;
    const _obs = this.apiConnectionService.authPerson(_updatedUsr.user_id, password, new_password);
    _obs.subscribe((res) => {
      _updatedUsr = this._userObj;
      _updatedUsr.secured = true;
      this.pushSubscribers(_updatedUsr);
      this.saveLocal(_updatedUsr);
    }, (error) => {
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }

  /**
   * Step 1 of email verification.
   * Sends token to email, to begin email verification process.
   *
   * @param userParams {token_email: string}
   */
  sendToken(userParams: UserParams): Observable<any> {
    console.log('============UserService sendToken=========');
    let _updatedUsr = this._userObj;
    _updatedUsr.token_email = userParams.token_email;
    this.pushSubscribers(_updatedUsr);
    const _obs = this.apiConnectionService.tokenPerson(userParams.token_email, _updatedUsr.user_id);
    _obs.subscribe((res) => {
      _updatedUsr = this._userObj;
      _updatedUsr.logging_in = true;
      this.pushSubscribers(_updatedUsr);
      this.saveLocal(_updatedUsr);
    }, (error) => {
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }

  stopToken() {
    let _updatedUsr = this._userObj;
    _updatedUsr.logging_in = false;
    this.pushSubscribers(_updatedUsr);
    this.saveLocal(_updatedUsr);
  }

  /**
   * Step 2 of email verification.
   * Send token that was sent via email to complete email verification.
   *
   * @param userParams {token_email: string, token: string}
   */
  verifyToken(userParams: UserParams): Observable<any> {
    console.log('============UserService verifyToken=========');
    let _updatedUsr = this._userObj;
    const _obs = this.apiConnectionService.verifyPerson(_updatedUsr.token_email, _updatedUsr.user_id, userParams.token);
    _obs.subscribe((res) => {
      console.log('WASlogin: verifyPerson RETURN:', res);
      // Set logging in process off //
      _updatedUsr = this._userObj;
      _updatedUsr.logging_in = false;
      _updatedUsr.user_id = res.user_id;
      _updatedUsr.email = res.email;
      if (res.secured) {
        _updatedUsr.secured = res.secured;
      }
      if (res.pro_user) {
        _updatedUsr.pro_user = res.pro_user;
      }
      if (res.first_name) {
        _updatedUsr.first_name = res.first_name;
      }
      if (res.last_name) {
        _updatedUsr.last_name = res.last_name;
      }
      if (res.zip_code) {
        _updatedUsr.zip_code = res.zip_code;
      }
      // Add user_data
      if (res.coins) {
        _updatedUsr.coins = res.coins;
      }
      if (res.data) {
        _updatedUsr.data = res.data;
      }
      if (res.rated_app) {
        _updatedUsr.rated_app = res.rated_app;
      }
      if (res.push_id) {
        _updatedUsr.push_id = res.push_id;
      }
      _updatedUsr.created_time = res.created_time;
      _updatedUsr.freebie_used = res.freebie_used;
      _updatedUsr.settings = res.settings;
      // UPDATE USER //
      this.pushSubscribers(_updatedUsr);
      this.saveLocal(_updatedUsr);
    }, (error) => {
      // Set logging in process off //
      _updatedUsr = this._userObj;
      _updatedUsr.logging_in = false;
      this.pushSubscribers(_updatedUsr);
      this.saveLocal(_updatedUsr);
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }

  /**
   * Add a review to this app (uses the calling hostname to determine app).
   *
   * @param _title string: The review title.
   * @param _text string: The review text/body.
   * @param _rating number: The review reating 0-5.
   */
  createReview(_title: string, _text: string, _rating: number): Observable<any> {
    console.log('============UserService createReview=========');
    let _updatedUsr = this._userObj;
    let _review = {'user_id': _updatedUsr.user_id, 'title': _title, 'text': _text, 'rating': _rating}
    const _obs = this.apiConnectionService.setReview(_review);
    _obs.subscribe((res) => {
      console.log('UserService: createReview RETURN:', res);
      _updatedUsr = this._userObj;
      // NOTE: If a user has an email, the account was either verified by token or doesn't belong to someone else.
      if (res.email && res.user_id) {
        _updatedUsr.user_id = res.user_id;
      }
      if (res.secured) {
        _updatedUsr.secured = res.secured;
      }
      if (res.pro_user) {
        _updatedUsr.pro_user = res.pro_user;
      }
      if (res.coins) {
        _updatedUsr.coins = res.coins;
      }
      if (res.data) {
        _updatedUsr.data = res.data;
      }
      if (res.created_time) {
        _updatedUsr.created_time = res.created_time;
      }
      if (res.rated_app) {
        _updatedUsr.rated_app = res.rated_app;
      }
      if (res.freebie_used) {
        _updatedUsr.freebie_used = res.freebie_used;
      }
      if (res.settings) {
        _updatedUsr.settings = res.settings;
      }
      if (res.push_id) {
        _updatedUsr.push_id = res.push_id;
      }
      // UPDATE USER //
      this.pushSubscribers(_updatedUsr);
      this.saveLocal(_updatedUsr);
    }, (error) => {
      console.log(`UserService: createReview: error:[${error}]`);
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }
  // TODO: TEST create purchase
  createPurchase(_purchase_id: string, _receipt: string, _amount: number,
    _first_name?: string, _last_name?: string, _zip_code?: string, _wallet_token?: string): Observable<any> {
    console.log('============UserService createPurchase=========');
    let _updatedUsr = this._userObj;
    let _purchase = {'user_id': _updatedUsr.user_id, 'purchase_id': _purchase_id, 'receipt': _receipt,
    'pay_amount': _amount, 'email': _updatedUsr.email, 'first_name': _first_name, 'last_name': _last_name,
    'zip_code': _zip_code, 'apple_wallet_token': _wallet_token}
    const _obs = this.apiConnectionService.setPurchase(_purchase);
    _obs.subscribe((res) => {
      console.log('UserService: createPurchase RETURN:', res);
      _updatedUsr = this._userObj;
      // NOTE: If a user has an email, the account was either verified by token or doesn't belong to someone else.
      if (res.email && res.user_id) {
        _updatedUsr.user_id = res.user_id;
      }
      if (res.secured) {
        _updatedUsr.secured = res.secured;
      }
      if (res.email) {
        _updatedUsr.email = res.email;
      }
      if (res.pro_user) {
        _updatedUsr.pro_user = res.pro_user;
      }
      if (res.first_name) {
        _updatedUsr.first_name = res.first_name;
      }
      if (res.last_name) {
        _updatedUsr.last_name = res.last_name;
      }
      if (res.zip_code) {
        _updatedUsr.zip_code = res.zip_code;
      }
      if (res.coins) {
        _updatedUsr.coins = res.coins;
      }
      if (res.data) {
        _updatedUsr.data = res.data;
      }
      if (res.created_time) {
        _updatedUsr.created_time = res.created_time;
      }
      if (res.rated_app) {
        _updatedUsr.rated_app = res.rated_app;
      }
      if (res.freebie_used) {
        _updatedUsr.freebie_used = res.freebie_used;
      }
      if (res.settings) {
        _updatedUsr.settings = res.settings;
      }
      if (res.push_id) {
        _updatedUsr.push_id = res.push_id;
      }
      // UPDATE USER //
      this.pushSubscribers(_updatedUsr);
      this.saveLocal(_updatedUsr);
    }, (error) => {
      console.log(`UserService: createPurchase: error:[${error}]`);
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }

  /**
   * Get value(s) from key val store.
   *
   * @param _keys [string]: A list of keys to get from the key val store.
   */
  getStore(_keys: string[]): Observable<{}> {
    console.log('============UserService getStore=========');
    let _updatedUsr = this._userObj;
    let _apiobject = {'user_id': _updatedUsr.user_id, 'keys': _keys.join(',')}
    const _obs = this.apiConnectionService.getWASStore(_apiobject);
    // _obs.subscribe((res) => {
    //   console.log('UserService: getStore RETURN:', res);
    // }, (error) => {
    //   console.log(`UserService: getStore: error:[${error}]`);
    // });
    return _obs;
  }
  /**
   * Set data in the key val store.
   *
   * @param _was_data {key:val, ...}: A key val dict of data to save.
   */
  setStore(_was_data: {}): Observable<any> {
    console.log('============UserService setStore=========');
    // TODO: Update local list too
    let _updatedUsr = this._userObj;
    let _apiobject = {'user_id': _updatedUsr.user_id, 'was_data': _was_data}
    const _obs = this.apiConnectionService.setWASStore(_apiobject);
    // _obs.subscribe((res) => {
    //   console.log('UserService: setStore RETURN:', res);
    // }, (error) => {
    //   console.log(`UserService: setStore: error:[${error}]`);
    // });
    return _obs;
  }
  /**
   * Delete value(s) from key val store.
   *
   * @param _keys [string]: A list of keys to delete from the key val store.
   */
  deleteStore(_keys: string[]): Observable<any> {
    console.log('============UserService deleteStore=========');
    // TODO: Update local list too
    let _updatedUsr = this._userObj;
    let _apiobject = {'user_id': _updatedUsr.user_id, 'keys': _keys.join(',')}
    const _obs = this.apiConnectionService.deleteWASStore(_apiobject);
    // _obs.subscribe((res) => {
    //   console.log('UserService: deleteStore RETURN:', res);
    // }, (error) => {
    //   console.log(`UserService: deleteStore: error:[${error}]`);
    // });
    return _obs;
  }

  /**
   * Log user out, this deletes all local storage and cookies.
  */
  logOut() {
    console.warn('UserService:logOut');
    // Delete user from local storage
    this.localStorageService.delete('was-user');
    // Delete was_user_id cookie
    this.localStorageService.cookie_remove('was_user_id');
    // Delete was_session_id cookie
    this.localStorageService.cookie_remove('was_session_id');
    this._isLoggedIn = false;
    this._loginChange.next(this._isLoggedIn);
    // Reload as anonymouse user
    this.loadUser();
  }

  opensso() {
    if (this._isLoggedIn) {
      this.dialog.open(WasAlert, {
        data: { title: 'Do you wish to log out?', body: 'Log out of your WickeyAppStore SSO account?', buttons: ['Yes', 'No'] }
      }).afterClosed().subscribe(result => {
        if (result === 0) {
          console.log('log out this user');
          this.logOut();
        }
      });
    } else {
      this.dialog.open(WasSSO);
    }
  }
  // TODO: Add BlueSnap APIS

  // addTodo(newTodo:Todo):Observable {
  //   let obs = this.todoBackendService.saveTodo(newTodo);
  //   obs.subscribe(
  //           res => {
  //               this._todos.next(this._todos.getValue().push(newTodo));
  //           });
  //   return obs;
  // }

}
