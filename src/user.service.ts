import { Injectable } from '@angular/core';
import { ApiConnectionService } from './api-connection.service';
import { LocalStorageService } from './local-storage.service';
// import {Observable} from 'rxjs/Observable';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { User } from './app.models';
export * from './app.models';

export interface UserParams {
  coins?: number;
  data?: any;
  email?: string;
  token_email?: string;
  freebie_used?: boolean;
  rated_app?: boolean;
  logging_in?: boolean;
}

/**
 * The service to get/set a user.
 * Following the example given here:
 * http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
 * Full code: https://github.com/jhades/angular2-rxjs-observable-data-services
 * Thanks @jhades
 *
 * @example
 * Import the service in the base `app.module.ts`
 * ```import { UserService, UserParams } from './user.service';```
 * Add to the providers:
 * ```providers: [UserService, ...],```
 * Import/Inject in any component this is to be used:
 * ```import { UserService } from './user.service';```
 * Add to the local providers list, then inject it in the constructor
 * ```constructor(private userService: UserService) { }
 * Get user:
 * ```this.userService.user();```
 * Update user:
 * ```this.userService.updateUser(_user_obj);```
 *
 * @export
 * @class UserService
 */
@Injectable()
export class UserService {
  private _user: BehaviorSubject<User> = new BehaviorSubject({user_id: undefined});
  private _createNewUser = false;
  private standalone: boolean;
  private lut = [];

  constructor(
    private apiConnectionService: ApiConnectionService,
    private localStorageService: LocalStorageService
  ) {
    this.loadUser();
  }

  /**
   * Returns an user object as an observable.
   *
   * @example
   * Use in angular template with the `async` pipe
   * userService.user | async
   * Subscribe in ts: userService.user.subscribe
   *
   * @readonly
   * @memberof UserService
   */
  get user() {
    return this._user.asObservable();
  }
  get userObject() {
    return this._user.getValue();
  }
  get coins() {
    return this._user.getValue().coins;
  }
  get data() {
    return this._user.getValue().data;
  }
  // TODO: Possibly create a userService.messages

  loadUser() {
    this.localStorageService.get('was-user')
      .then((value: any): void => {
        if (typeof value !== 'undefined' && value.user_id !== undefined) {
          const _localUser = value as User;
          this._user.next(_localUser);
          // normal load
          console.log('UserService loadUser: load user from db', _localUser);
          this.updateUser({});
          this._createNewUser = false;
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
    if (('standalone' in window.navigator) && !(<any>window.navigator).standalone) {
      this.standalone = false;
    } else {
      this.standalone = true;
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
    return this.lut[d0 & 0xff] + this.lut[d0>> 8 & 0xff] + this.lut[d0 >> 16 & 0xff] + this.lut[d0 >> 24 & 0xff] + '-' +
      this.lut[d1 & 0xff] + this.lut[d1 >> 8 & 0xff] + '-' + this.lut[d1 >> 16 & 0x0f | 0x40] + this.lut[d1 >> 24 & 0xff] + '-' +
      this.lut[d2 & 0x3f | 0x80] + this.lut[d2 >> 8 & 0xff] + '-' + this.lut[d2 >> 16 & 0xff] + this.lut[d2 >> 24 & 0xff] +
      this.lut[d3 & 0xff] + this.lut[d3 >> 8 & 0xff] + this.lut[d3 >> 16 & 0xff] + this.lut[d3 >> 24 & 0xff];
  }

  /**
   * Update User object, saves locally and to server.
   *
   * @param {number} [app_coins] OPTIONAL coins number, use it wherever/however.
   * @param {string} [app_data] OPTIONAL data string, use it wherever/however (e.g. save JSON or other string encoded objects).
   * @returns {Observable<any>}
   * @memberof UserService
   */
  updateUser(userParams: UserParams): Observable<User> {
    console.log('UserService\n==============\nUPDATE USER\n==============');
    const currentUser = this._user.getValue();
    if (this._createNewUser === true) {
      this._createNewUser = false;
      console.warn('UserService: NO USER, CREATE USER');
      currentUser.user_id = this.guid();
    }
    console.log('updateUser:', currentUser);
    const apiobject = {user_id: currentUser.user_id, version: .1, standalone: false, app_coins: undefined, app_data: undefined,
      email: undefined, freebie_used: undefined, rated_app: undefined};
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
    } else {
      apiobject.app_coins = currentUser.coins;
    }
    if (userParams.data) {
      apiobject.app_data = userParams.data;
    } else {
      apiobject.app_data = currentUser.data;
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
          this._user.next(res);
        } else {
          console.log('UserService: updateUser: RETURN:', res);
          // NOTE: If a user has an email, the account was either verified by token or doesn't belong to someone else.
          if (res.email && res.user_id) {
            currentUser.user_id = res.user_id;
          }
          currentUser.email = res.email;
          if (res.coins) {
            currentUser.coins = res.coins;
          }
          if (res.data) {
            currentUser.data = res.data;
          }
          currentUser.created_time = res.created_time;
          currentUser.freebie_used = res.freebie_used;
          currentUser.settings = res.settings;
          this._user.next(res);
        }
        // UPDATE USER //
        this.localStorageService.set('was-user', res);
        // TODO: Store this on User, set to nil on display
        if (res.special_message) {
          console.log(`UserService: updateUser: special_message:[${res.special_message}]`);
          confirm(`${res.special_message.title}\n${res.special_message.message}`);
          // this.error_message = {
          //   title: res.special_message.title, message: res.special_message.message,
          //   button_type: 'btn-info', header_bg: '#29B6F6', header_color: 'black',
          //   helpmessage: [],
          //   randcookie: `${Math.random()}${Math.random()}${Math.random()}`
          // };
        }
        // Add user context in sentry
        // Raven.setUserContext({email: this._user.email, id: this._user.user_id});
      }, (error) => {
        console.log(`UserService: updateUser: error:[${error}]`);
        alert(`Attention!\n${error}`);
        // <any>error | this casts error to be any
        // this.error_message = {
        //   title: 'Attention!',
        //   message: error,
        //   header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
        //   helpmessage: [],
        //   randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
        // };
      });
    return _obs;
  }

  // addTodo(newTodo:Todo):Observable {
  //   let obs = this.todoBackendService.saveTodo(newTodo);
  //   obs.subscribe(
  //           res => {
  //               this._todos.next(this._todos.getValue().push(newTodo));
  //           });
  //   return obs;
  // }

}