import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiConnectionService } from './api-connection.service';
import { LocalStorageService } from './local-storage.service';
import { AppGroup, App } from './app.models';

/**
 * The service to get apps from WAS.
 *
 * @example
 * Import the service in the base `app.module.ts`
 * ```import { WasAppService, AppGroup, App } from './was-app.service';```
 * Add to the providers:
 * ```providers: [WasAppService, ...],```
 * Import in any component this is to be used:
 * ```import { WasAppService } from './was-app.service';```
 * Inject it in the constructor
 * ```constructor(private wasAppService: WasAppService) { }
 * Get appGroups:
 * NOTE: this.wasAppService.appGroups() is an Observable, this.wasAppService.appGroupsObject() is the currently stored object.
 * ```this.wasAppService.appGroups();```
 * To use in html:
 * ```
 * <div *ngIf="wasAppService.appGroups | async as grpobj">
 *   <p *ngFor="let _app of grpobj">{{_app | json}}}</p>
 * </div>
 * ```
 *
 * @export
 * @class WasAppService
 */
@Injectable()
export class WasAppService {
  private _appGroups: BehaviorSubject<AppGroup[]> = new BehaviorSubject([{
    id: undefined, title: undefined, created_time: undefined, apps: []}]);
  private _appIndex: BehaviorSubject<any> = new BehaviorSubject({});
  // NOTE: _app is the currently selected app, update on appFromSlug.
  private _app: BehaviorSubject<App> = new BehaviorSubject({
    id: undefined, name: undefined, title: undefined, text: undefined, category: undefined,
    icon: undefined, app_version: undefined, created_time: undefined, owner: undefined
  });

  constructor(
    public apiConnectionService: ApiConnectionService,
    private localStorageService: LocalStorageService
  ) {
    this.loadApps();
  }

  /**
   * Returns appGroups as an observable.
   *
   * @example
   * Use in angular template with the `async` pipe
   * wasAppService.appGroups | async
   * Subscribe in ts: wasAppService.appGroups.subscribe
   *
   * @readonly
   * @memberof WasAppService
   */
  get appGroups() {
    return this._appGroups.asObservable();
  }
  /**
   * Returns the last pushed AppGroup as an object.
   *
   * @example
   * wasAppService.appGroupsObject().id
   *
   * @readonly
   * @memberof WasAppService
   */
  get appGroupsObject() {
    return this._appGroups.getValue();
  }
  get app() {
    return this._app.asObservable();
  }
  get appObject() {
    return this._app.getValue();
  }

  appFromSlug(slug: string): Observable<App | [App]> {
    try {
      const _appIndex = this._appIndex.getValue();
      const _appGroups = this._appGroups.getValue();
      const _appKey = _appIndex[slug]['key'];
      const keylist = _appKey.split(':');
      const _app = _appGroups[keylist[0]][keylist[1]][keylist[2]];
      if ((Date.now() - _appIndex[slug]['time']) > 600000) {
        _appIndex[slug]['time'] = Date.now();
        this._appIndex.next(_appIndex);
        console.log('WasAppService: appFromSlug: Old, refresh from server');
        this.getApps(slug).subscribe((res: [App]) => {
          // TODO: Should empty {} or undefined be pushed on app not found
          if (res[0] !== undefined) {
            console.log('WasAppService: appFromSlug PUSH:', res[0]);
            this._app.next(res[0]);
            _appGroups[keylist[0]][keylist[1]][keylist[2]] = res[0];
            this._appGroups.next(_appGroups);
          }
        });
      }
      this._app.next(_app);
      return Observable.of(_app).share();
    } catch (error) {
      console.warn('WasAppService: appFromSlug', error);
      // ON ERROR GET FROM SERVER
      const _obs = this.getApps(slug);
      _obs.subscribe((res: [App]) => {
        // TODO: Should empty {} or undefined be pushed on app not found
        if (res[0] !== undefined) {
          console.log('WasAppService: appFromSlug PUSH:', res[0]);
          this._app.next(res[0]);
        }
      });
      return _obs;
    }
  }

  loadApps() {
    this.localStorageService.get('was-apps')
      .then((value: any): void => {
        let _hasLocalApps = false;
        try {
          if (typeof value !== 'undefined' && value[0].id !== undefined) {
            _hasLocalApps = true;
          }
        } catch (_loc_error) {
          console.error('WasAppService loadApps', _loc_error);
          _hasLocalApps = false;
        }
        if (_hasLocalApps === true) {
          const _localApps = value;
          this._appGroups.next(_localApps);
          this.createAppIndexKey(_localApps);
          // normal load
          console.log('WasAppService loadApps: load apps from db', _localApps);
          this.getAppGroups();
        } else {
          // create new user
          this.getAppGroups();
        }
      }
      ).catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    // .catch(this.handleError);
    console.error('WasAppService: An error occurred', error);  // for demo purposes
    return Promise.reject(error.message || error);
  }

  createAppIndexKey(_appGroups: AppGroup[]) {
    // console.log('createAppIndexKey', _appGroups);
    const appIndex = {};
    let _feat_idx = 0;
    let _app_idx = 0;
    let _appKey: string;
    for (const _featured_list of _appGroups) {
      _app_idx = 0;
      for (const _app of _featured_list['apps']) {
        _appKey = `${_feat_idx}:apps:${_app_idx}`;
        appIndex[_app['slug']] = {'key': _appKey, 'time': Date.now()};
        _app_idx += 1;
      }
      _feat_idx += 1;
    }
    console.log('PUSH appIndex', appIndex);
    this._appIndex.next(appIndex);
    // TODO: See if necessary to store in indexedDB
    // UPDATE DB //
    // this.localStorageService.set('was-apps-index', appIndex);
  }

  getAppGroups(): Observable<[AppGroup]> {
    const _obs = this.apiConnectionService.getFeaturedGroups();
    _obs.subscribe((res) => {
        console.log('WasAppService: getAppGroups RETURN:', res);
        this._appGroups.next(res);
        // UPDATE DB //
        this.localStorageService.set('was-apps', res);
        this.createAppIndexKey(res);
      }, (error) => {
        console.log(`WasAppService: getAppGroups: error:[${error}]`);
        // NOTE: Handle errors in calling component.
      });
    return _obs;
  }

  getApps(slug?: string): Observable<[App]> {
    let _obs: any;
    if (slug) {
      _obs = this.apiConnectionService.getApps({ 'slug': slug});
    } else {
      _obs = this.apiConnectionService.getApps();
    }
    _obs.subscribe((res) => {
        console.log('WasAppService: getApps RETURN:', res);
      }, (error) => {
        console.log(`WasAppService: getApps: error:[${error}]`);
        // NOTE: Handle errors in calling component.
      });
    return _obs;
  }

}
