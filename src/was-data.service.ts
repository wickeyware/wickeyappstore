import { Injectable, HostListener } from '@angular/core';
import { UserService } from './user.service';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ApiConnectionService } from './api-connection.service';

/**
 * The WasDataService.
 *
 * ```typescript
 * // Import in any component this is to be used:
 * import { WasDataService } from 'WickeyAppStore';
 *
 * // Inject it in the constructor
 * constructor(wasDataService: WasDataService) { }
 *
 * // Restore from cloud/local.
 * this.wasDataService.restore().subscribe(mydata => {})
 *
 * // Persist to cloud.
 * this.wasDataService.persist();
 *
 * // Save a value (where value is json stringifiable).
 * this.wasDataService.save('key', 'value');
 *
 * // Load a value from db.
 * this.wasDataService.load('key).subscribe(myval => {});
 *
 * // listen for data observable.
 * this.wasDataService.data.subscribe(mydata => {});
 * ```
 */
@Injectable()
export class WasDataService {
  private _data: ReplaySubject<any> = new ReplaySubject(1);
  private _dataObj: any;

  /** @ignore */
  constructor(
    private apiConnectionService: ApiConnectionService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
  ) {
    // console.log('%c WasDataService constructor 18', 'background: #222; color: #bada55');
    // this.restore();
  }

  /**
   * Pushes saved data to all subscribers on every change update.
   *
   * @example
   * Use in angular template with the `async` pipe
   * wasDataService.data | async
   * Subscribe in ts: wasDataService.data.subscribe
   *
   * @readonly
   */
  get data() {
    return this._data;
  }

  /**
   * Loads the store from localStorage.
   * @ignore
   */
  private loadLocalStore() {
    return new Promise<{}>((resolve, reject) => {
      this.localStorageService.get('was-cloud')
        .then((value: any): void => {
          if (value && typeof value !== 'undefined') {
            this._dataObj = value;
            // normal load
            console.log('%c WasDataService loadLocalStore LOCAL', 'background: #222; color: #bada55', this._dataObj);
          } else {
            console.log('%c WasDataService loadLocalStore EMPTY', 'background: #222; color: #bada55');
            this._dataObj = {};
          }
          resolve(this._dataObj);
        }).catch(error => {
          console.error('WasDataService handleError', error);
          reject(error.message || error);
        });
    });
  }
  /** load locally, then from server.
   * @ignore
  */
  private initLoad() {
    return Observable.fromPromise(this.loadLocalStore()).map(retVal => retVal).mergeMap(val => {
      console.log('%c WasDataService initLoad', 'background: #222; color: #bada55', val);
      // Here load
      return this.getCloudStore();
    }).share();
  }

  /**
   * Restores/Returns the data from the cloud or local db whichever has a newer timestamp.
   * NOTE: The data will be in key/val format where val is can be anything json stringifiable
   */
  restore() {
    let _myObs: Observable<any>;
    if (this.userService.isLoaded) {
      if (this._dataObj) {
        console.log('%c WasDataService restore 106', 'background: #222; color: #bada55', this._dataObj);
        _myObs = this.getCloudStore();
      } else {
        console.log('%c WasDataService restore 109', 'background: #222; color: #bada55');
        _myObs = this.initLoad();
      }
    } else {
      _myObs = this.userService.loginChange.map(retVal => retVal).mergeMap(_loggedIn => {
        console.log('%c WasDataService restore (user loginChange)', 'background: #222; color: #bada55', _loggedIn);
        return this.initLoad();
      }).share();
    }
    _myObs.subscribe(_datastore => {
      console.log('%c WasDataService restore 91', 'background: #222; color: #bada55', _datastore);
      this._dataObj = _datastore;
      this._data.next(this._dataObj);
    }, (error) => {
      console.log('%c WasDataService restore 95', 'background: #222; color: #bada55', this._dataObj);
      this._data.next(this._dataObj);
    });
    return _myObs;
  }
  /**
   * Persists your save data to the cloud.
   * NOTE: please use sparingly, it can be subject to rate limits.
   */
  persist() {
    const _obs = this.setCloudStore();
    _obs.subscribe(val => val);
    return _obs;
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.persist();
  }

  /**
   * Save a value.
   * NOTE: Where value is json stringifiable.
   *
   * @param _key The key.
   * @param _val The Value (where value is json stringifiable).
   */
  save(_key: string, _val: any) {
    if (this._dataObj) {
      this._dataObj[_key] = _val;
      this._dataObj['timestamp'] = Date.now();
      this.localStorageService.set('was-cloud', this._dataObj);
      this._data.next(this._dataObj);
    } else {
      console.warn('WasData not yet initialized', _val);
      // TODO: Make this promise/observable based and wait till cloudstore initialized.
    }
  }

  /**
   * Load a value from db.
   *
   * @param _key The key.
   */
  load(_key: string): Observable<any | null> {
    let _obs;
    if (this._dataObj) {
      console.log(`WasData load: ${_key}:${this._dataObj[_key]}`);
      _obs = Observable.of(this._dataObj[_key]);
    } else {
      _obs = Observable.of(null);
    }
    return _obs;
  }

  /**
   * Get cloud data packet.
   *
   * @param _keys [string]: A list of keys to get from the key val store.
   * @ignore
   */
  private getCloudStore(): Observable<{}> {
    const _apiobject = { 'user_id': this.userService.userObject.user_id, 'keys': 'was-cloud' };
    return this.apiConnectionService.getWASStore(_apiobject).map(res => {
      console.log('%c WasDataService getCloudStore 139', 'background: #222; color: #bada55', res);
      // console.log('WasDataService: getCloudStore RETURN:', res);
      if (this.userService.checkIfValue(res, 'was-cloud')) {
        const _cloudStore = JSON.parse(res['was-cloud']);
        if (this.userService.checkIfValue(this._dataObj, 'timestamp') && this.userService.checkIfValue(_cloudStore, 'timestamp')) {
          if (this._dataObj.timestamp < _cloudStore.timestamp) {
            this._dataObj = _cloudStore;
            // this._data.next(this._dataObj);
          }
        } else {
          console.warn('No timestamp, use server cloud store (current)', this._dataObj);
          this._dataObj = _cloudStore;
          // this._data.next(this._dataObj);
        }
      } else {
        console.log('WasDataService: getCloudStore Do not update:', this._dataObj);
      }
      return this._dataObj;
    }).share();
  }
  /**
   * Set data in the key val store.
   *
   * @param _was_data {key:val, ...}: A key val dict of data to save.
   * @ignore
   */
  private setCloudStore(): Observable<any> {
    const _newdata = { 'was-cloud': JSON.stringify(this._dataObj) };
    const _apiobject = { 'user_id': this.userService.userObject.user_id, 'was_data': _newdata };
    const _obs = this.apiConnectionService.setWASStore(_apiobject);
    _obs.subscribe((res) => {
      // console.log('WasDataService: setCloudStore RETURN:', res);
    }, (error) => {
      // console.log(`WasDataService: setCloudStore: error:[${error}]`);
    });
    return _obs;
  }
  /**
   * Delete value(s) from key val store.
   *
   * @param _keys [string]: A list of keys to delete from the key val store.
   * @ignore
   */
  private deleteCloudStore(): Observable<any> {
    const _apiobject = { 'user_id': this.userService.userObject.user_id, 'keys': 'was-cloud' };
    const _obs = this.apiConnectionService.deleteWASStore(_apiobject);
    _obs.subscribe((res) => {
      // console.log('WasDataService: deleteCloudStore RETURN:', res);
    }, (error) => {
      // console.log(`WasDataService: deleteCloudStore: error:[${error}]`);
    });
    return _obs;
  }
}
