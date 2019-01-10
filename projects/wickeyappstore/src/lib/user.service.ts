// import * as Raven from 'raven-js';
import { Injectable, NgZone } from '@angular/core';
import { ApiConnectionService } from './api-connection.service';
import { LocalStorageService } from './local-storage.service';
import { of as observableOf, from, Observable, ReplaySubject } from 'rxjs';
import { map, mergeMap, catchError, share } from 'rxjs/operators';
import { MatDialog } from '@angular/material';  // MatDialogRef, MAT_DIALOG_DATA
import { WasSSO } from './ui/popover/wassso/wassso.dialog';
import { WasReview } from './ui/popover/wasreview/wasreview.dialog';
import { WasShop } from './ui/popover/wasshop/wasshop.dialog';
import { WasLeaderboard } from './ui/popover/wasleaderboard/wasleaderboard.dialog';
import { WasAlert } from './ui/popover/wasalert/wasalert.dialog';
import { WasUp } from './ui/popover/wasup/wasup.dialog';
import { WasProfile } from './ui/popover/wasprofile/wasprofile.dialog';
import { WasPay } from './ui/popover/waspay/waspay.dialog';
import { User, Review, Inapp, App, AppGroup } from './app.models';
export * from './app.models';
/**@ignore*/
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
  username?: string;
}

// Following the example given here:
// http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
// Full code: https://github.com/jhades/angular2-rxjs-observable-data-services
// Thanks @jhades

/**
 * The UserService.
 *
 * ```typescript
 * // Import in any component this is to be used:
 * import { UserService } from 'WickeyAppStore';
 *
 * // Inject it in the constructor
 * constructor(userService: UserService) { }
 *
 * // Get user:
 * this.userService.user().subscribe();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
 * @property
 * @ignore
 */
  private readonly merchantID = '1105404'; // your BlueSnap Merchant ID;
  private _user: ReplaySubject<User> = new ReplaySubject(1);
  private _loginChange: ReplaySubject<boolean> = new ReplaySubject(1);
  private _onAccountCreate: ReplaySubject<boolean> = new ReplaySubject(1);
  private _inapps: ReplaySubject<[Inapp]> = new ReplaySubject(1);
  private _favorites: ReplaySubject<AppGroup> = new ReplaySubject(1);
  private _favoritesObj: AppGroup;
  private _is_favorite: ReplaySubject<Boolean> = new ReplaySubject(1);
  private _is_favoriteObj: Boolean;
  private _freebieSettings: ReplaySubject<any> = new ReplaySubject(1);
  private _freebieSettingsObj: any;
  private _inappsObj: [Inapp];
  private _userObj: User;
  private _createNewUser = false;
  private _isLoggedIn = false;
  private _loaded = false;
  private standalone: boolean;
  private lut = [];
  /**@ignore*/
  constructor(
    private apiConnectionService: ApiConnectionService,
    private localStorageService: LocalStorageService,
    private _ngZone: NgZone,
    public dialog: MatDialog
  ) {
    this.loadUser();
    // Track login status
    this._user.subscribe((usr: User) => {
      if (this.isEmpty(usr.email) === false) { // Logged in
        if (this._isLoggedIn === false) { // Check if status changed
          console.warn('UserService LOGGED IN');
          this._isLoggedIn = true;
          this._loaded = true;
          this._loginChange.next(this._isLoggedIn);
        } else if (this._loaded === false) {  // Ensure initial load update
          this._loaded = true;
          this._loginChange.next(this._isLoggedIn);
        }
      } else { // Logged out
        if (this._isLoggedIn === true) { // Check if status changed
          console.warn('UserService LOGGED OUT');
          this._isLoggedIn = false;
          this._loaded = true;
          this._loginChange.next(this._isLoggedIn);
        } else if (this._loaded === false) { // Ensure initial load update
          this._loaded = true;
          this._loginChange.next(this._isLoggedIn);
        }
      }
    });
    this._loginChange.subscribe((_loggedIn: boolean) => {
      // Load inapps on all login changes (also ensures user object exists)
      this.loadInapps();
      this.loadFreebieSettings();
      this.loadIfFavorite();
    });
  }


  /**
  *  // test if the string is empty or null
  * @ignore
  */
  isEmpty(str: string): boolean {
    return (!str || 0 === str.length);
  }
  /**
   * Pushes boolean to all subscribers on login status changes and also on initial load.
   * So this can be used to monitor login status changes to route url, or to check login status on user load.
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
  get onAccountCreate() {
    return this._onAccountCreate;
  }
  /**
   * Returns true if user is logged in and else false.
   * NOTE: This should only be used if UserService has already loaded the User, otherwise the result is un-reliable (Check out loginChange).
   */
  get isLoggedInVal() {
    return this._isLoggedIn;
  }
  get isLoggedInObs() {
    return this._user.pipe(map((usr: User) => {
      if (this.isEmpty(usr.email) === false) {
        return true;
      } else {
        return false;
      }
    }));
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
          if (this.isEmpty(_localUser.email) === false) {
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
    return this._user;
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
  get inapps() {
    return this._inapps;
  }
  get inappsObject() {
    return this._inappsObj;
  }
  get isLoaded() {
    return this._loaded;
  }
  get favorites() {
    return this._favorites;
  }
  get favoritesObject() {
    return this._favoritesObj;
  }
  get isFavorite() {
    return this._is_favorite;
  }
  get isFavoriteObject() {
    return this._is_favoriteObj;
  }
  get freebieSettings() {
    return this._freebieSettings;
  }


  private pushSubscribers(_usr: User) {
    // TODO: Only push if object values changed. This does not work, need to store a copy of last, else it simply sets a reference,
    //  thus both are updated.
    // if (this._userObj) {
    //   if (JSON.stringify(this._userObj) === JSON.stringify(_usr)) {
    //     console.log('pushSubscribers:NO CHANGES');
    //   } else {
    //     console.log('pushSubscribers:CHANGES');
    //   }
    // } else {
    //   console.log('pushSubscribers:INIT');
    // }
    this._userObj = _usr;
    this._user.next(_usr);
    // NOTE: This is only used with Async to push the last value: this._user.complete();
  }
  private pushInappSubscribers(_inobj: any) {
    this._inappsObj = _inobj;
    this._inapps.next(_inobj);
  }
  private saveLocal(_key: string, _obj: any) {
    this.localStorageService.set(_key, _obj);
  }
  /**
   * @ignore
   */
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
          // console.log('UserService loadUser: load user from db', _localUser);
          this._createNewUser = false;
          this.updateUser({});
        } else {
          this._onAccountCreate.next(true);
          // create new user
          this._createNewUser = true;
          this.updateUser({});
        }
      }
      ).catch(this.handleError);
  }
  /**
 * @ignore
 */
  loadInapps() {
    this.localStorageService.get('was-inapps')
      .then((value: any): void => {
        if (value && typeof value !== 'undefined') {
          this._inappsObj = value as [Inapp];
          this.pushInappSubscribers(this._inappsObj);
          // normal load
          // console.log('UserService loadInapps: load inapps from db', this._inappsObj);
          this.getInapps();
        } else {
          this.getInapps();
        }
      }
      ).catch(this.handleError);
  }
  /**
 * @ignore
 */
  loadFreebieSettings() {
    this.localStorageService.get('was-freesettings')
      .then((value: any): void => {
        if (value && typeof value !== 'undefined') {
          this._freebieSettingsObj = value;
          this._freebieSettings.next(this._freebieSettingsObj);
          // normal load
          // console.log('UserService loadFreebieSettings: load freebie settings from db', this._freebieSettingsObj);
        }
      }).catch(this.handleError);
  }
  /** @ignore */
  loadIfFavorite() {
    this.localStorageService.get('was-isfavorite')
      .then((value: any): void => {
        if (value && typeof value !== 'undefined') {
          this._is_favoriteObj = value as Boolean;
          this._is_favorite.next(this._is_favoriteObj);
          // normal load
          console.log('UserService loadFavorites: load favorites from db', this._is_favoriteObj);
          this.getFavoriteCheck();
        } else {
          this.getFavoriteCheck();
        }
      }
      ).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    // .catch(this.handleError);
    console.error('UserService: An error occurred', error);  // for demo purposes
    return Promise.reject(error.message || error);
  }
  /**
   * @ignore
   */
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
   * @ignore
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
   * @ignore
   */
  checkIfValue(_obj: any, _key: string): boolean {
    let hasValue = false;
    if (_obj.hasOwnProperty(_key)) {
      if (_obj[_key] !== undefined && _obj[_key] !== null) {
        hasValue = true;
      }
    }
    return hasValue;
  }

  /**
   * Update User object, saves locally and to server.
   *
   * @param [userParams] OPTIONAL object of parameters to update user.
   * @ignore
   */
  updateUser(userParams: UserParams): Observable<User> {
    if (this._createNewUser === true) {
      this._createNewUser = false;
      // NOTE: Check if user_id is in a cookie, to share user_id accross all wickeyappstore apps
      const _cookie_userid = this.localStorageService.cookie_read('was_user_id');
      if (_cookie_userid !== null && _cookie_userid !== '') {
        console.warn('UserService: FOUND USER ID IN COOKIE');
        this._userObj = { user_id: _cookie_userid };
      } else {
        console.warn('UserService: NO USER, CREATE USER');
        this._userObj = { user_id: this.guid() };
      }
    } else {
      if (this._userObj.account_verified === false && this._userObj.has_data === false && this._userObj.coins === 0) {
        // user exists, but is still anonymous and does not have any data saved
        const _cookie_userid = this.localStorageService.cookie_read('was_user_id');
        if (_cookie_userid !== null && _cookie_userid !== '') {
          console.warn('UserService2: FOUND USER ID IN COOKIE');
          this._userObj.user_id = _cookie_userid;
          // this._userObj = { user_id: _cookie_userid, push_id: this._userObj.push_id,  };
        }
      }
    }
    // console.log('============UserService updateUser=========', this._userObj);
    // NOTE: Set params to current user, then update to sent in userParams, if any exist
    const apiobject = {
      user_id: this._userObj.user_id, version: .1, standalone: false, app_coins: null, app_data: null, username: null,
      email: null, freebie_used: this._userObj.freebie_used, rated_app: this._userObj.rated_app, push_id: this._userObj.push_id
    };
    if (this.checkIfValue(userParams, 'username')) {
      apiobject.username = userParams.username;
    }
    if (this.checkIfValue(userParams, 'freebie_used')) {
      apiobject.freebie_used = userParams.freebie_used;
    }
    if (this.checkIfValue(userParams, 'rated_app')) {
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
        // On new user/recover
        // UPDATE USER //
        this.localStorageService.cookie_write_multi('was_user_id', res.user_id);
        this.pushSubscribers(res);
        this.saveLocal('was-user', res);
      } else {
        // NOTE: If a user has an email, the account was either verified by token or doesn't belong to someone else.
        if (res.email && res.user_id) {
          this._userObj.user_id = res.user_id;
          this.localStorageService.cookie_write_multi('was_user_id', res.user_id);
        }
        if (this.checkIfValue(res, 'email')) {
          this._userObj.email = res.email;
        }
        if (this.checkIfValue(res, 'username')) {
          this._userObj.username = res.username;
        }
        if (this.checkIfValue(res, 'secured')) {
          this._userObj.secured = res.secured;
        }
        if (this.checkIfValue(res, 'bs_id')) {
          this._userObj.bs_id = res.bs_id;
        }
        if (this.checkIfValue(res, 'coins')) {
          this._userObj.coins = res.coins;
        }
        if (this.checkIfValue(res, 'data')) {
          this._userObj.data = res.data;
        }
        if (this.checkIfValue(res, 'rated_app')) {
          this._userObj.rated_app = res.rated_app;
        }
        if (this.checkIfValue(res, 'push_id')) {
          this._userObj.push_id = res.push_id;
        }
        if (this.checkIfValue(res, 'has_data')) {
          this._userObj.has_data = res.has_data;
        }
        if (this.checkIfValue(res, 'account_verified')) {
          this._userObj.account_verified = res.account_verified;
        }
        this._userObj.created_time = res.created_time;
        this._userObj.freebie_used = res.freebie_used;
        this._userObj.settings = res.settings;
        this.pushSubscribers(this._userObj);
        this.saveLocal('was-user', this._userObj);
      }
      // Add user context in sentry
      // Raven.setUserContext({id: res.user_id});
    }, (error) => {
      console.log(`UserService: updateUser: error:[${error}]`);
      // NOTE: Handle errors in calling component.
      // alert(`Attention!\n${error}`);
      // <any>error | this casts error to be any
    });
    return _obs;
  }

  /**
   * Update the user's push_id only if this id is different than the currenly saved id.
   *
   * @param push_id The OneSignal user_id (push_id)
   * @ignore
   */
  updateUserPushId(push_id: string) {
    if (this._userObj.push_id !== push_id) {
      console.log('UserService updateUserPushId: CHANGE:', push_id);
      this.updateUser({ 'push_id': push_id })
        .subscribe((usr) => {
          // console.log('UserService updateUserPushId: RETURN:', usr);
        }, (error) => {
          // console.log('UserService updateUserPushId: RETURN ERROR:', error);
        });
    } else {
      // console.log('UserService updateUserPushId: NO CHANGE:', push_id);
    }
  }
  /**
   * Updates the user's username only if this username is different than the currenly saved username and is acceptable.
   * Returns an error if username is not acceptable (e.g. not unique).
   *
   * @param username The globally unique username.
   * @ignore
   */
  updateUsername(username: string): Observable<User | null> {
    let _obs;
    if (this._userObj.username !== username) {
      console.log('UserService updateUsername: CHANGE:', username);
      _obs = this.updateUser({ 'username': username });
      _obs.subscribe((usr) => {
        // console.log('UserService updateUsername: RETURN:', usr);
        if (this.checkIfValue(usr, 'username')) {
          this._userObj.username = usr.username;
          this.pushSubscribers(this._userObj);
          this.saveLocal('was-user', this._userObj);
        }
      }, (error) => {
        // console.log('UserService updateUsername: RETURN ERROR:', error);
      });
    } else {
      // console.log('UserService updateUsername: NO CHANGE:', username);
      _obs = observableOf(null);
    }
    return _obs;
  }

  /**
   * Return if the current app is a favorite is_favorite
   */
  getFavoriteCheck(): Observable<{ is_favorite: boolean }> {
    let _obs;
    if (this._isLoggedIn) {
      _obs = this.apiConnectionService.checkFavorite({'user_id': this._userObj.user_id});
      _obs.subscribe((res) => {
        this._is_favoriteObj = res.is_favorite;
        this._is_favorite.next(this._is_favoriteObj);
        this.saveLocal('was-isfavorite', this._is_favoriteObj);
      }, (error) => {
      });
    } else {
      this._is_favoriteObj = false;
      this._is_favorite.next(this._is_favoriteObj);
      _obs = observableOf(this._is_favoriteObj);
    }
    return _obs;
  }

  /**
   * Return a list of favorite apps {favorites:[{app},...]}
   */
  getFavorites(): Observable<{ apps: [App] }> {
    let _obs;
    if (this._isLoggedIn) {
      _obs = this.apiConnectionService.getFavorites({'user_id': this._userObj.user_id});
      _obs.subscribe((res) => {
        this._favoritesObj = res;
        this._favorites.next(this._favoritesObj);
        this.saveLocal('was-favorites', this._favoritesObj);
      }, (error) => {
      });
    } else {
      this._favoritesObj = (<any>{ apps: {apps: []} });
      this._favorites.next(this._favoritesObj);
      this.saveLocal('was-favorites', this._favoritesObj);
      _obs = observableOf(this._favoritesObj);
    }
    return _obs;
  }

  /**
   * Add an app to the favorites list.
   * Returns {favorites:[{app},...]}
   *
   * @param [storeapp_id] This is only sent in from WickeyAppStore (on actual app sites it uses the hostname).
   */
  setFavorite(storeapp_id?: number): Observable<{ apps: [App] }> {
    const _obs = this.apiConnectionService.setFavorite(this._userObj.user_id, storeapp_id);
    _obs.subscribe((res) => {
      // SET IS FAVORITE (on successful return)
      this._is_favoriteObj = true;
      this._is_favorite.next(this._is_favoriteObj);
      this.saveLocal('was-isfavorite', this._is_favoriteObj);
      // UPDATE FAVORITE STREAM
      this._favoritesObj = res;
      this._favorites.next(this._favoritesObj);
      this.saveLocal('was-favorites', this._favoritesObj);
    }, (error) => {
    });
    return _obs;
  }

  /**
   * Remove an app from the list of favorite apps.
   * Returns {favorites:[{app},...]}
   *
   * @param [storeapp_id] This is only sent in from WickeyAppStore (on actual app sites it uses the hostname).
   */
  deleteFavorite(storeapp_id?: number): Observable<{ apps: [App] }> {
    const _obs = this.apiConnectionService.deleteFavorite(this._userObj.user_id, storeapp_id);
    _obs.subscribe((res) => {
      // DELETE IS FAVORITE (on successful return)
      this._is_favoriteObj = false;
      this._is_favorite.next(this._is_favoriteObj);
      this.saveLocal('was-isfavorite', this._is_favoriteObj);
      // UPDATE FAVORITE STREAM
      this._favoritesObj = res;
      this._favorites.next(this._favoritesObj);
      this.saveLocal('was-favorites', this._favoritesObj);
    }, (error) => {
    });
    return _obs;
  }

  /**
   * Pipe save favorite through login alert.
   * @ignore
  */
  savefavoriteLogin(storeapp_id?: number): Observable<any | null> {
    const _obs = this.dialog.open(WasAlert, {
      data: { title: 'Only verified users can leave save favorites',
      body: 'Want to log in/create account?', buttons: 'WasAlertStyleConfirm' }
    }).afterClosed().pipe(map(retVal => retVal), mergeMap(result => {
      if (result === 1) {
        return this.dialog.open(WasSSO).afterClosed().pipe(map(_retVal => _retVal), mergeMap(_result => {
          if (this._isLoggedIn) {
            return this.setFavorite(storeapp_id);
          } else {
            return observableOf(null);
          }
        }));
      } else {
        return observableOf(null);
      }
    }), share());
    return _obs;
  }
  /**
   * Update favorite and show alert.
   * @ignore
  */
  updateFavorite() {
    let _msgtitle = 'Favorite Added';
    let _msgbody = 'App added to favorites!';
    let _apiCall;
    if (this._is_favoriteObj) {
      // this.selected_app.favorite = false;
      _msgtitle = 'Favorite Removed';
      _msgbody = 'App removed from favorites!';
      _apiCall = this.deleteFavorite();
    } else {
      // this.selected_app.favorite = true;
      _apiCall = this.setFavorite();
    }
    const loadingdialogRef = this.dialog.open(WasUp, {
      width: '300px', data: { title: 'Updating Favorites', icon: 'spinner', body: 'Updating...', stayopen: true }
    });
    _apiCall.subscribe((res) => {
        loadingdialogRef.close();
        this.dialog.open(WasUp, {data: { title: _msgtitle, icon: 'done', body: _msgbody} });
      }, (error) => {
        // <any>error | this casts error to be any
        loadingdialogRef.close();
        this.dialog.open(WasAlert, {
          data: { title: 'Attention', body: error }
        });
      });
  }
  /**
   * Save favorite if logged in, else asks to login/create account, then saves to favorite.
  */
  saveFavorite() {
    if (this._isLoggedIn === true) {
      this.updateFavorite();
    } else {
      this.savefavoriteLogin().subscribe(val => {
        if (val) {
          console.log('updateFav', val);
          this.dialog.open(WasUp, {data: { title: 'Favorite Added', icon: 'done', body: 'App added to favorites!'} });
        } else {
          console.log('updateFav canceled', val);
          // this.dialog.open(WasUp, {data: { title: 'Canceled?', icon: 'done', body: 'Oh no, it no work'} });
        }
      });
    }
  }

  /**
   * Add/Update a user's pin/pass code used in faster or more secure logins.
   *
   * @param password The password, or current password if updating.
   * @param new_password OPTIONAL: New password.
   * @ignore
   */
  setPassword(password: string, new_password?: string): Observable<any> {
    const _obs = this.apiConnectionService.authPerson(this._userObj.user_id, password, new_password);
    _obs.subscribe((res) => {
      this._userObj.secured = true;
      this.pushSubscribers(this._userObj);
      this.saveLocal('was-user', this._userObj);
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
   * @ignore
   */
  sendToken(userParams: UserParams): Observable<any> {
    this._userObj.token_email = userParams.token_email;
    this.pushSubscribers(this._userObj);
    this.saveLocal('was-user', this._userObj);
    const _obs = this.apiConnectionService.tokenPerson(userParams.token_email, this._userObj.user_id);
    _obs.subscribe((res) => {
      this._userObj.logging_in = true;
      this.pushSubscribers(this._userObj);
      this.saveLocal('was-user', this._userObj);
    }, (error) => {
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }
  /**
   * @ignore
   */
  stopToken() {
    this._userObj.logging_in = false;
    this.pushSubscribers(this._userObj);
    this.saveLocal('was-user', this._userObj);
  }

  /**
   * Step 2 of email verification.
   * Send token that was sent via email to complete email verification.
   *
   * @param userParams {token_email: string, token: string}
   * @ignore
   */
  verifyToken(userParams: UserParams): Observable<any> {
    const _obs = this.apiConnectionService.verifyPerson(this._userObj.token_email, this._userObj.user_id, userParams.token);
    _obs.subscribe((res) => {
      // Set logging in process off //
      this._userObj.logging_in = false;
      this._userObj.user_id = res.user_id;
      this._userObj.email = res.email;
      this.localStorageService.cookie_write_multi('was_user_id', res.user_id);
      if (this.checkIfValue(res, 'username')) {
        this._userObj.username = res.username;
      }
      if (this.checkIfValue(res, 'secured')) {
        this._userObj.secured = res.secured;
      }
      if (this.checkIfValue(res, 'bs_id')) {
        this._userObj.bs_id = res.bs_id;
      }
      if (this.checkIfValue(res, 'coins')) {
        this._userObj.coins = res.coins;
      }
      if (this.checkIfValue(res, 'data')) {
        this._userObj.data = res.data;
      }
      if (this.checkIfValue(res, 'rated_app')) {
        this._userObj.rated_app = res.rated_app;
      }
      if (this.checkIfValue(res, 'push_id')) {
        this._userObj.push_id = res.push_id;
      }
      if (this.checkIfValue(res, 'has_data')) {
        this._userObj.has_data = res.has_data;
      }
      if (this.checkIfValue(res, 'account_verified')) {
        this._userObj.account_verified = res.account_verified;
      }
      this._userObj.created_time = res.created_time;
      this._userObj.freebie_used = res.freebie_used;
      this._userObj.settings = res.settings;
      // UPDATE USER //
      this.pushSubscribers(this._userObj);
      this.saveLocal('was-user', this._userObj);
      // Add user context in sentry
      // Raven.setUserContext({ email: this._userObj.email, id: this._userObj.user_id });
    }, (error) => {
      // Set logging in process off //
      this._userObj.logging_in = false;
      this.pushSubscribers(this._userObj);
      this.saveLocal('was-user', this._userObj);
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
   * @ignore
   */
  createReview(_title: string, _text: string, _rating: number): Observable<any> {
    const _review = { 'user_id': this._userObj.user_id, 'title': _title, 'text': _text, 'rating': _rating };
    const _obs = this.apiConnectionService.setReview(_review);
    _obs.subscribe((res) => {
      // NOTE: If a user has an email, the account was either verified by token or doesn't belong to someone else.
      if (res.email && res.user_id) {
        this._userObj.user_id = res.user_id;
      }
      if (res.secured !== undefined && res.secured !== null) {
        this._userObj.secured = res.secured;
      }
      if (res.coins !== undefined && res.coins !== null) {
        this._userObj.coins = res.coins;
      }
      if (res.data !== undefined && res.data !== null) {
        this._userObj.data = res.data;
      }
      if (res.created_time) {
        this._userObj.created_time = res.created_time;
      }
      if (res.freebie_used !== undefined && res.freebie_used !== null) {
        this._userObj.freebie_used = res.freebie_used;
      }
      if (res.rated_app !== undefined && res.rated_app !== null) {
        this._userObj.rated_app = res.rated_app;
      }
      if (res.settings) {
        this._userObj.settings = res.settings;
      }
      if (res.push_id !== undefined && res.push_id !== null) {
        this._userObj.push_id = res.push_id;
      }
      // UPDATE USER //
      this.pushSubscribers(this._userObj);
      this.saveLocal('was-user', this._userObj);
    }, (error) => {
      console.log(`UserService: createReview: error:[${error}]`);
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }

  /**
   * Creates a purchase on the server. It processed the payment for the following services:
   * - ApplePay
   *
   * Coming soon:
   * - GooglePay
   * - Credit Card
   * @ignore
   * @param _purchase_id The id of the inapp.
   * @param _receipt The purchase receipt, if purchase handled locally (not used right now, can use empty string).
   * @param _amount The inapp coins purchased.
   * @param [_email] The email of the purchaser person.
   * @param [_first_name] The billing first name of the purchaser person.
   * @param [_last_name] The billing last name of the purchaser person.
   * @param [_zip_code] The billing zip code of the purchaser person.
   * @param [_wallet_token] The applepay wallet token, this is used to process the payment.
   * @param [_address] The billing address.
   * @param [_city] The billing city.
   * @param [_state] The billing state.
   * @param [_country] The billing country.
   * @returns The same as updateUser.
   */
  createPurchase(_purchase_id: number, _receipt: string, _amount: number, _email?: string,
    _first_name?: string, _last_name?: string, _zip_code?: string, _wallet_token?: string,
    _address?: any, _city?: string, _state?: string, _country?: string, _store_id?: string): Observable<any> {
    const _purchase = {
      'user_id': this._userObj.user_id, 'purchase_id': _purchase_id, 'receipt': _receipt,
      'pay_amount': _amount, 'email': this._userObj.email, 'first_name': _first_name, 'last_name': _last_name,
      'zip_code': _zip_code, 'apple_wallet_token': _wallet_token,
      'address': _address, 'city': _city, 'state': _state, 'country': _country, 'store_id': _store_id
    };
    if (_email) {
      _purchase['email'] = _email;
    }
    const _obs = this.apiConnectionService.setPurchase(_purchase);
    _obs.subscribe((res) => {
      // NOTE: If a user has an email, the account was either verified by token or doesn't belong to someone else.
      if (res.email && res.user_id) {
        this._userObj.user_id = res.user_id;
        this.localStorageService.cookie_write_multi('was_user_id', res.user_id);
      }
      if (this.checkIfValue(res, 'secured')) {
        this._userObj.secured = res.secured;
      }
      if (this.checkIfValue(res, 'bs_id')) {
        this._userObj.bs_id = res.bs_id;
      }
      if (this.checkIfValue(res, 'coins')) {
        this._userObj.coins = res.coins;
      }
      if (this.checkIfValue(res, 'data')) {
        this._userObj.data = res.data;
      }
      if (this.checkIfValue(res, 'rated_app')) {
        this._userObj.rated_app = res.rated_app;
      }
      if (this.checkIfValue(res, 'push_id')) {
        this._userObj.push_id = res.push_id;
      }
      if (this.checkIfValue(res, 'has_data')) {
        this._userObj.has_data = res.has_data;
      }
      if (this.checkIfValue(res, 'account_verified')) {
        this._userObj.account_verified = res.account_verified;
      }
      if (this.checkIfValue(res, 'created_time')) {
        this._userObj.created_time = res.created_time;
      }
      if (this.checkIfValue(res, 'freebie_used')) {
        this._userObj.freebie_used = res.freebie_used;
      }
      if (res.settings) {
        this._userObj.settings = res.settings;
      }
      // UPDATE USER //
      this.pushSubscribers(this._userObj);
      this.saveLocal('was-user', this._userObj);

      // Update local inapps
      for (const _inapp of this._inappsObj) {
        if (_inapp.purchaseId === _purchase_id) {
          _inapp.isOwned = true;
          break;
        }
      }
      this.pushInappSubscribers(this._inappsObj);
      this.saveLocal('was-inapps', this._inappsObj);
      // Re-get inapps from server
      this.getInapps();
    }, (error) => {
      console.log(`UserService: createPurchase: error:[${error}]`);
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }

  /**
   * Consumes coins recieved from purchases or videos.
   *
   * @param coins The number of coins charged for this item.
   * @param [reason] An identifier for this item (e.g. LEVEL_ONE, BONUS_CHEST, etc.).
   * @returns The same as updateUser.
   */
  consumeCoins(coins: number, reason?: string): Observable<any> {
    const _params = {'user_id': this._userObj.user_id, 'coins': coins, 'reason': null};
    if (reason) {
      _params['reason'] = reason;
    }
    const _obs = this.apiConnectionService.consumeCoins(_params);
    _obs.subscribe((res) => {
      if (this.checkIfValue(res, 'coins')) {
        this._userObj.coins = res.coins;
      }
      this.pushSubscribers(this._userObj);
      this.saveLocal('was-user', this._userObj);
    }, (error) => {
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }

  /**
  * Returns the inapp object, given the purchaseId.
  * @param _purchaseId The id of the inapp, found in developer.wickeyappstore.com
  * @returns Returns the inapp object, if found, else it returns null.
  */
  getInapp(_purchaseId: number): Inapp | null {
    let retobj = null;
    for (const _inapp of this._inappsObj) {
      if (_inapp.purchaseId === _purchaseId) {
        retobj = _inapp;
        break;
      }
    }
    return retobj;
  }
  /**
  * This returns true if the inapp was purchased. NOTE: This only works with non-consumables.
  * @param _purchaseId The id of the inapp, found in developer.wickeyappstore.com
  * @returns A boolean, true if purchased, and false if not.
  */
  checkIfPurchased(_purchaseId: number): Observable<boolean> {
    return this._inapps.pipe(map(_inapps => {
      let _hasPurchased = false;
      for (const _inapp of _inapps) {
        if (_inapp.purchaseId === _purchaseId && _inapp.isOwned === true) {
          _hasPurchased = true;
          break;
        }
      }
      return _hasPurchased;
    }));
  }
  /**
  * @ignore
  */
  getInapps(): Observable<any> {
    const _obs = this.apiConnectionService.getInapps({ user_id: this._userObj.user_id });
    _obs.subscribe((res) => {
      this._inappsObj = res.inapps;
      this.pushInappSubscribers(this._inappsObj);
      this.saveLocal('was-inapps', this._inappsObj);
      // Push freebie settings object
      this._freebieSettingsObj = { 'hasAds': res.has_ads, 'hasOfferwall': res.has_offerwall };
      this._freebieSettings.next(this._freebieSettingsObj);
      this.saveLocal('was-freesettings', this._freebieSettingsObj);
    }, (error) => {
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }

  /**
   * Performs the merchant validation in ApplePay.
   * https://developers.bluesnap.com/v8976-Basics/docs/apple-pay#section-step-4-set-up-the-onvalidatemerchant-callback
   *
   * @ignore
   * @param validationURL The `event.validationURL` from the BlueSnap onvalidatemerchant callback
   * @returns The token object.
   */
  getBluesnapWallet(validationURL: string): Observable<any> {
    const currentUser = this._userObj;
    const _obs = this.apiConnectionService.getBluesnapWallet(validationURL);
    return _obs;
  }
  /**
  * @ignore
  */
  getBluesnapShopper(): Observable<any> {
    let _obs;
    if (this._userObj.bs_id) {
      _obs = this.apiConnectionService.getBluesnapShopper(this._userObj.bs_id);
      _obs.subscribe((res) => {
        this._userObj.bs_id = res.token;
        // UPDATE USER //
        this.pushSubscribers(this._userObj);
        this.saveLocal('was-user', this._userObj);
      }, (error) => {
        console.log(`UserService: getBluesnapShopper: error:[${error}]`);
        this.dialog.open(WasAlert, {
          data: { title: 'Attention!', body: error }
        });
      });
    } else {
      // check if this works, maybe throw error instead
      _obs = observableOf({ token: undefined });
    }
    return _obs;
  }

  /**
  * Notifies the server that a video ad has started by this user and video id.
  * @ignore
  */
  adVideoStart(_video_id: string): Observable<any> {
    const _obs = this.apiConnectionService.adVideoStart(this._userObj.user_id, _video_id);
    _obs.subscribe((res) => {
      // console.log('UserService: adVideoStart RETURN:', res);
    }, (error) => {
      this.dialog.open(WasAlert, {
        data: { title: 'Attention', body: error, buttons: ['Ok', 'Cancel'] }
      });
    });
    return _obs;
  }
  /**
  * Notifies the server that a video ad has ended by this user and video id.
  * @ignore
  */
  adVideoEnd(_video_id: string): Observable<any> {
    const _obs = this.apiConnectionService.adVideoEnd(this._userObj.user_id, _video_id);
    _obs.subscribe((res) => {
      // console.log('UserService: adVideoEnd RETURN:', res);
      // NOTE: If a user has an email, the account was either verified by token or doesn't belong to someone else.
      if (res.email && res.user_id) {
        this._userObj.user_id = res.user_id;
        this._userObj.email = res.email;
      }
      if (res.coins) {
        this._userObj.coins = res.coins;
      }
      // UPDATE USER //
      this.pushSubscribers(this._userObj);
      this.saveLocal('was-user', this._userObj);
      // this.dialog.open(WasUp,
      //   {data: {title: 'Thank you!', icon: 'attach_money', body: 'You have received two coins for watching a video.'}});
    }, (error) => {
      this.dialog.open(WasAlert, {
        data: { title: 'Attention', body: error, buttons: ['Ok', 'Cancel'] }
      });
    });
    return _obs;
  }

  /**
   * Get the leaderboard for app. Optional pass in username to return rank of user.
   *
   * @param [username] OPTIONAL: Returns rank of username.
   * @returns returns {leaderboard: [{score: number, username: string}, ...], rank?: number}
   */
  getLeaderboard(username?: string): Observable<{leaderboard: [any], rank?: number, name?: string, icon?: string}> {
    const _obs = this.apiConnectionService.getLeaderboard({username: username});
    _obs.subscribe((res) => {
      // console.log('getLeaderboard: return', res);
    }, (error) => {
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }

  /**
   * Stores/Updates the highscore of user.
   *
   * @param setHighscore The user's high score.
   * @returns returns {rank?: number}
   */
  setHighscore(highscore: number): Observable<{status: number, rank?: number}> {
    const _obs = this.apiConnectionService.setHighscore({user_id: this._userObj.user_id, highscore: highscore});
    _obs.subscribe((res) => {
      // console.log('setHighscore: return', res);
      // this.pushSubscribers(this._userObj);
      // this.saveLocal('was-user', this._userObj);
    }, (error) => {
      // <any>error | this casts error to be any
      // NOTE: Handle errors in calling component.
    });
    return _obs;
  }
  private _handleleaderboardnotification(_res: {status: number, rank?: number}) {
    if (_res.status === 201) {
      if (this.checkIfValue(_res, 'rank') && _res.rank === 0) {
        this.dialog.open(WasUp, {
          width: '300px', data: { title: 'Added to Leaderboard!', icon: 'edit', body: 'You are number 1!' }
        });
      } else if (this.checkIfValue(_res, 'rank')) {
        this.dialog.open(WasUp, {
          width: '300px', data: { title: 'Added to Leaderboard!', icon: 'edit', body: `Added high score, rank: ${_res.rank + 1}.` }
        });
      }
    }
  }

  /** @ignore */
  _addToLeaderboard(highscore: number, _alreadyTaken?: boolean): Observable<boolean> {
    let _showMsg = null;
    if (_alreadyTaken) {
        _showMsg = 'Username already taken!';
    } else {
        _showMsg = 'Username for Leaderboard';
    }
    let _obs;
    if (this._userObj.username === this._userObj.user_id) {
      const _inputUsername = this._userObj.username;

      _obs = this.dialog.open(WasAlert, {
        data: { title: _showMsg, input: true, input_value: _inputUsername,
        buttons: 'WasAlertStyleConfirm' }
      }).afterClosed().pipe(map(retVal => retVal), mergeMap(result => {
        if (result !== undefined) {
          return this.updateUsername(result).pipe(map(_retVal => _retVal), mergeMap(usr => {
            // Updated username
            return this.setHighscore(highscore).pipe(map(_res => {
              this._handleleaderboardnotification(_res);
            }));
          }), catchError(error => {
              console.warn('app:username', error);
              if (error === 'Username already taken') {
                  return this._addToLeaderboard(highscore, true);
              } else {
                return observableOf(null);
              }
          }), share());
        } else {
          return observableOf(null);
        }
      }), share());
    } else {
      // Updated username
      _obs = this.setHighscore(highscore).pipe(map(_res => {
        this._handleleaderboardnotification(_res);
      }));
    }
    return _obs;
  }
  /**
   * Get/Update username, then add score to the leaderboard.
   */
  addToLeaderboard(highscore: number): Observable<boolean> {
    const _obs = this._addToLeaderboard(highscore);
    _obs.subscribe(res => {});
    return _obs;
  }
  /**
   * Get/Update username, then add score to the leaderboard.
   * NOTE: If using WASjs.
   */
  addToLeaderboardjs(highscore: number): Observable<boolean> {
    return this._ngZone.runTask(() => {
      const _obs = this._addToLeaderboard(highscore);
      _obs.subscribe(res => {});
      return _obs;
    });
  }

  /**
   * Get value(s) from key val store.
   * NOTE: Deprecated, use WasDataService
   *
   * @param _keys [string]: A list of keys to get from the key val store.
   */
  getStore(_keys: string[]): Observable<{}> {
    const _apiobject = { 'user_id': this._userObj.user_id, 'keys': _keys.join(',') };
    const _obs = this.apiConnectionService.getWASStore(_apiobject);
    _obs.subscribe((res) => {
      // console.log('UserService: getStore RETURN:', res);
    }, (error) => {
      // console.log(`UserService: getStore: error:[${error}]`);
    });
    return _obs;
  }
  /**
   * Set data in the key val store.
   * NOTE: Deprecated, use WasDataService
   *
   * @param _was_data {key:val, ...}: A key val dict of data to save.
   */
  setStore(_was_data: {}): Observable<any> {
    const _apiobject = { 'user_id': this._userObj.user_id, 'was_data': _was_data };
    const _obs = this.apiConnectionService.setWASStore(_apiobject);
    _obs.subscribe((res) => {
      // console.log('UserService: setStore RETURN:', res);
    }, (error) => {
      // console.log(`UserService: setStore: error:[${error}]`);
    });
    return _obs;
  }
  /**
   * Delete value(s) from key val store.
   * NOTE: Deprecated, use WasDataService
   *
   * @param _keys [string]: A list of keys to delete from the key val store.
   */
  deleteStore(_keys: string[]): Observable<any> {
    const _apiobject = { 'user_id': this._userObj.user_id, 'keys': _keys.join(',') };
    const _obs = this.apiConnectionService.deleteWASStore(_apiobject);
    _obs.subscribe((res) => {
      // console.log('UserService: deleteStore RETURN:', res);
    }, (error) => {
      // console.log(`UserService: deleteStore: error:[${error}]`);
    });
    return _obs;
  }

  /**
   * Log user out, this deletes all local storage and cookies.
   * @ignore
  */
  logOut() {
    console.warn('UserService:logOut');
    // Delete user from local storage
    this.localStorageService.delete('was-user');
    // Delete Inapps from local storage
    this.localStorageService.delete('was-inapps');
    // Delete was_user_id cookie
    this.localStorageService.cookie_remove('was_user_id');
    this.localStorageService.cookie_remove_multi('was_user_id');
    // Delete was_session_id cookie
    this.localStorageService.cookie_remove('was_session_id');
    this.localStorageService.cookie_remove_multi('was_session_id');
    this._isLoggedIn = false;
    this._loginChange.next(this._isLoggedIn);
    // Reload as anonymouse user
    this.loadUser();
  }

  /**
   * Open SSO if not logged in, else confirm logout.
   * @ignore
  */
  opensso() {
    if (this._isLoggedIn) {
      this.dialog.open(WasAlert, {
        data: { title: 'Do you wish to log out?', body: 'Log out of your WickeyAppStore SSO account?', buttons: 'WasAlertStyleWarning' }
      }).afterClosed().subscribe(result => {
        if (result === 1) {
          console.log('log out this user');
          this.logOut();
        }
      });
    } else {
      this.dialog.open(WasSSO);
    }
  }
  /**
 * Open WasProfile which shows Help or Account Info
 * @ignore
*/
  openuserinfo() {
    this.dialog.open(WasProfile);
  }

  /** @ignore */
  _leavereview(): Observable<any> {
    let _obs;
    if (this._isLoggedIn) {
      _obs = this.dialog.open(WasReview).afterClosed();
    } else {
      _obs = this.dialog.open(WasAlert, {
        data: { title: 'Only verified users can leave a review', body: 'Want to log in/create account?', buttons: 'WasAlertStyleConfirm' }
      }).afterClosed().pipe(map(retVal => retVal), mergeMap(result => {
        if (result === 1) {
          return this.dialog.open(WasSSO).afterClosed().pipe(map(_retVal => _retVal), mergeMap(_result => {
            if (this._isLoggedIn) {
              return this.dialog.open(WasReview).afterClosed();
            } else {
              return observableOf(null);
            }
          }), share());
        } else {
          return observableOf(null);
        }
      }), share());
    }
    return _obs;
  }
  /**
   * Open review if logged in, else ask to login/create account.
   * NOTE: If using WASjs.
   */
  leavereviewjs(): Observable<any> {
    return this._ngZone.runTask(() => {
      const _obs = this._leavereview();
      _obs.subscribe(_ret => {});
      return _obs;
    });
  }
  /**
   * Open review if logged in, else ask to login/create account.
  */
  leavereview(): Observable<any> {
    const _obs = this._leavereview();
    _obs.subscribe(_ret => {});
    return _obs;
  }
  /** @ignore */
  _showLeaderboard(): Observable<any> {
    // https://stackoverflow.com/questions/48688614/angular-custom-style-to-mat-dialog
    const _obs = this.dialog.open(WasLeaderboard, {width: '100%', height: '100%', panelClass: 'was-leaderboard-modal'}).afterClosed();
    _obs.subscribe(_ret => {});
    return _obs;
  }
  /**
   * Open your app's leaderboard.
   * NOTE: If using WASjs.
   */
  showLeaderboardjs(): Observable<any> {
    return this._ngZone.runTask(() => {
      const _obs = this._showLeaderboard();
      _obs.subscribe(_ret => {});
      return _obs;
    });
  }
  /**
   * Open your app's leaderboard.
  */
  showLeaderboard(): Observable<any> {
    const _obs = this._showLeaderboard();
    _obs.subscribe(_ret => {});
    return _obs;
  }
  /**
   * Open WickeyAppStore.
   * @ignore
  */
  openstore() {
    // this.dialog.open(WasStore, { panelClass: 'was-dialog-nopadding' });
  }
  /**
   * Open WasShop.
   * @ignore
  */
  openshop() {
    this.dialog.open(WasShop, {width: '100%', height: '100%'});
  }

  /**
   * Open WasPay to the selected inapp, and returns true if successful.
   */
  openpay(_inapp: Inapp): Observable<boolean> {
    const _obs = this.dialog.open(WasPay, { data: _inapp }).afterClosed();
    _obs.subscribe(_isSuccess => {});
    return _obs;
  }
  /**
   * Open WasPay to the selected inapp, and returns true if successful.
   * NOTE: If using WASjs.
   */
  openpayjs(_inapp: Inapp): Observable<boolean> {
    return this._ngZone.runTask(() => {
      const _obs = this.dialog.open(WasPay, { data: _inapp }).afterClosed();
      _obs.subscribe(_isSuccess => {});
      return _obs;
    });
  }

  /**
  * Returns true if this is an apple device, else false.
  * @ignore
  */
  isAppleDevice() {
    const iDevices = [
      'Mac',
      'iPad',
      'iPhone',
      'iPod'
    ];
    if (!!navigator.platform) {
      while (iDevices.length) {
        while (iDevices.length) {
          const test = iDevices.pop();
          if (navigator.platform.indexOf(test) !== -1) { return true; }
        }
      }
    }
    // console.log('this is not ios');
    return false;
  }

  /**
  * Returns true if this ApplePay is available, else false.
  * @ignore
  */
  isApplePayAvailable(): boolean {
    let _isAvail;
    try {
      if ((<any>window).ApplePaySession) {
        console.log('has ApplePaySession');
        _isAvail = true;
        if ((<any>window).ApplePaySession && (<any>window).ApplePaySession.canMakePayments()) {
          _isAvail = true;
          console.log('apple pay is available');
        } else {
          console.log('apple pay is NOT available');
          _isAvail = false;
        }
      } else {
        _isAvail = false;
      }
    } catch (error) {
      console.warn('isApplePayAvailable', error);
      _isAvail = false;
    }
    return _isAvail;
  }

  /**
  * Makes a purchase via ApplePay.
  * @ignore
  */
  makeApplePurchase(_inapp: Inapp) {
    return new Promise<boolean>((resolve, reject) => {
      const productDescription = _inapp.title;
      let walletToken = null;
      const request = {
        countryCode: 'US',
        currencyCode: 'USD',
        total: { label: 'WickeyAppStore', amount: _inapp.price, type: 'final' },
        supportedNetworks: ['amex', 'discover', 'jcb', 'masterCard', 'visa'],
        merchantCapabilities: ['supports3DS'],
        requiredBillingContactFields: ['postalAddress'],
        requiredShippingContactFields: ['email', 'name']
      };
      const session = new (<any>window).ApplePaySession(2, request);
      session.oncancel = (event) => {
        console.log('Apple Pay cancelled');
        reject('cancelled');
      };
      session.onvalidatemerchant = (event) => {
        const validationURL = event.validationURL;
        this.getBluesnapWallet(validationURL)
          .subscribe((res) => {
            walletToken = res;
            session.completeMerchantValidation(walletToken);
          }, (error) => {
            console.warn('getBluesnapWallet NO walletToken: ABORT', error);
            session.abort();
            reject('payment auth failed');
          });
      };
      session.onpaymentauthorized = (event) => {
        const paymentToken = event.payment;
        this.createPurchase(_inapp.purchaseId, walletToken, _inapp.price, event.payment.shippingContact.emailAddress,
          event.payment.billingContact.givenName, event.payment.billingContact.familyName,
          event.payment.billingContact.postalCode, (<any>window).btoa(JSON.stringify(paymentToken)), undefined, undefined, undefined,
          undefined, 'applepay')
          .subscribe((res) => {
            session.completePayment((<any>window).ApplePaySession.STATUS_SUCCESS);
            resolve(true);
          }, (error) => {
            session.completePayment((<any>window).ApplePaySession.STATUS_FAILURE);
            reject('payment failed');
          });
      };
      session.begin();
    });
  }

  /**
  * Makes a purchase via PaymentRequest (not implemented).
  * @ignore
  */
  makePaymentRequestPurchase(_inapp: Inapp) {
    return new Promise<boolean>((resolve, reject) => {
      const bluesnap = (<any>window).bluesnap;
      // (<any>window).PaymentRequest
      if (bluesnap.isSupported('PaymentRequest')) {
        this.apiConnectionService.getBluesnapToken().subscribe(res => {
          let paymentRequest;
          bluesnap.paymentRequest(res.token, instance => {
            console.log('paymentRequest', instance);
            paymentRequest = instance;
            // const googlePayPaymentMethod = {
            //   supportedMethods: ['https://google.com/pay'],
            //   data: {
            //     'environment': 'TEST',
            //     'apiVersion': 1,
            //     'allowedPaymentMethods': ['CARD', 'TOKENIZED_CARD'],
            //     'paymentMethodTokenizationParameters': {
            //       'tokenizationType': 'PAYMENT_GATEWAY',
            //       // Check with your payment gateway on the parameters to pass.
            //       'parameters': {}
            //     },
            //     'cardRequirements': {
            //       'allowedCardNetworks': ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
            //       'billingAddressRequired': true,
            //       'billingAddressFormat': 'MIN'
            //     },
            //     'emailRequired': true
            //   },
            // };
            const creditCardPaymentMethod = {
              supportedMethods: ['basic-card'],
              data: {
                supportedNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
                supportedTypes: ['debit', 'credit'],
                emailRequired: true
              }
            };
            // const applePayPaymentMethod = {
            //   supportedMethods: ['https://apple.com/apple-pay'],
            //   data: {
            //     supportedNetworks: [
            //       'amex', 'discover', 'masterCard', 'visa'
            //     ],
            //     total: { label: 'WickeyAppStore', amount: _inapp.price, type: 'final' },
            //     merchantCapabilities: ['supports3DS'],
            //     countryCode: 'US',
            //     currencyCode: 'USD',
            //     version: 3,
            //     validationEndpoint: 'https://api.wickeyappstore.com/bluesnap/wallet/',
            //     merchantIdentifier: this.merchantID
            //   }
            // };
            const _supportedPaymentMethods = <PaymentMethodData[]>[
              creditCardPaymentMethod,
              // googlePayPaymentMethod,
              // applePayPaymentMethod
            ];
            const _paymentDetails = {
              displayItems: [{
                label: _inapp.title,
                amount: { currency: 'USD', value: _inapp.price.toString() }
              }],
              total: { label: 'Total', amount: { currency: 'USD', value: _inapp.price.toString() } }
            };
            // Options isn't required.
            const _options = { requestPayerEmail: true, requestPayerName: true };
            const _detailsObj = {
              'details': _paymentDetails,
              'options': _options,
              'methodData': _supportedPaymentMethods
            };
            // Use Payment Request API
            paymentRequest.init(_detailsObj, 'PaymentRequest').then(() => {
              console.log('paymentRequest init');
              paymentRequest.on('shippingaddresschange', function (ev) {
                console.log('shippingaddresschange', ev);
              });
              // Initialization was successful
              paymentRequest.canMakePayment().then(result => {
                if (result) {
                  // The shopper has a supported card, show the Payment Request button
                  paymentRequest.show()
                    .then(ev => {
                      console.log('paymentRequest.showButton confirmed', ev);
                      // The shopper confirmed the purchase
                      // Send ev.token to your server and process the transaction...
                      const _idx = ev.billingAddress.recipient.lastIndexOf(' ');
                      let _fname;
                      let _lname;
                      if (_idx === -1) {
                        _fname =  ev.billingAddress.recipient;
                        _lname =  '';
                      } else {
                        _fname =  ev.billingAddress.recipient.substring(0, _idx);
                        _lname =  ev.billingAddress.recipient.substring(_idx + 1);
                      }
                      // NOTE: Change store_id (bluesnap) if other payment types are added, like googlepay.
                      this.createPurchase(_inapp.purchaseId, ev.token, _inapp.price, ev.payerEmail,
                        _fname, _lname, ev.billingAddress.postalCode, undefined, ev.billingAddress.addressLine,
                        ev.billingAddress.city, ev.billingAddress.region, ev.billingAddress.country, 'bluesnap')
                        .subscribe(purchres => {
                          ev.complete('success');
                          resolve(true);
                        }, (error) => {
                          ev.complete('fail');
                          reject('payment failed');
                        });
                    }).catch(err => {
                      // The shopper closed the payment UI
                      console.log('paymentRequest.showButton cancel', err);
                      reject('canceled');
                    });
                } else {
                  console.log('no payment credit card available', result);
                  // The shopper doesn't have a supported card. Set up traditional checkout flow
                  reject('no payment credit card available');
                }
              }).catch(err => {
                console.log(err);
                // Either call showButton() or fallback to traditional checkout flow
                reject('payment method not available');
              });
            }).catch((err) => {
              // Initialization failed
              console.log(err);
              reject('payment initialization failed');
            });
          });
        }, (error) => {
          console.log(`UserService: getBluesnapToken: error:`, error);
          reject('payment auth failed');
        });
      } else {
        // Fallback to traditional checkout
        this.dialog.open(WasAlert, {
          data: { title: 'Attention', body: 'No Web Pay, currently only ApplePay is available.' }
        });
        reject('no payment option available');
      }
    });
  }

  /**
  * Shows either ApplePay or PaymentRequest pending on the device.
  * @ignore
  */
  showWebPay(_inapp: Inapp) {
    if (this.isApplePayAvailable()) {
      console.log('Show ApplePay');
      return this.makeApplePurchase(_inapp);
    } else {
      console.log('Show PaymentRequest');
      return this.makePaymentRequestPurchase(_inapp);
    }
  }

}
