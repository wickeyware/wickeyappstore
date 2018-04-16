import { Injectable } from '@angular/core';
import { get as dbGet, set as dbSet, del as dbDel, clear as dbClear, keys as dbKeys } from 'idb-keyval';
// TODO: Use Angular Direct Injected document
// import {DOCUMENT} from '@angular/common';
// in constructor @Inject(DOCUMENT) private doc: any
// this.doc.cookie

/**
 * @module
 * @ignore
 */
@Injectable()
export class LocalStorageService {
  public use_cookie = false;
  // http://stackoverflow.com/questions/31173738/typescript-getting-error-ts2304-cannot-find-name-require
  // public idbkeyval = require('../../node_modules/idb-keyval/idb-keyval.js'); // 'idb-keyval'

  constructor() {
    // CHECK IF BROWSER HAS INDEXEDDB //
    if (typeof navigator !== 'undefined' && !window.hasOwnProperty('indexedDB')) {
      this.use_cookie = true;
      console.log('WASSTORAGE: USE COOKIE STORAGE');
    } else {
      this.use_cookie = false;
      console.log('WASSTORAGE: USE INDEXEDDB STORAGE');
    }
  }
  /**
   * Gets the value stored at `key` or undefined if it doesn't exist
   */
  get(key: string): Promise<any> {
    if (this.use_cookie === false) {
      return dbGet(key);
    } else {
      return new Promise((resolve, reject) => {
        // Get value from cookie at key
        let _value = this.safe_json_parse(this.cookie_read(key));
        if (_value === null) {
          _value = undefined;
        }
        // console.log('DEBUG: localstorage get value', key, _value);
        resolve(_value);
      });
    }
  }
  /**
   * Sets the data in `value` in location `key`
   */
  set(key: string, value: any): Promise<any> {
    if (this.use_cookie === false) {
      return dbSet(key, value);
    } else {
      return new Promise((resolve, reject) => {
        let _val: string;
        if (typeof(value) === 'object') {
          if (value.hasOwnProperty('settings')) {
            // REMOVE ALL NON-VITAL INFO
            const new_value = JSON.parse(JSON.stringify(value));
            new_value.inapps = [];
            new_value.user_posts = [];
            new_value.price_upper_options = undefined;
            new_value.price_lower_options = undefined;
            new_value.settings = undefined;
            if (new_value.hasOwnProperty('user_events')) {
              new_value.user_events = [];
            }
            if (new_value.hasOwnProperty('promotions')) {
              new_value.promotions = [];
            }
            if (new_value.hasOwnProperty('history')) {
              new_value.history = [];
            }
            if (new_value.hasOwnProperty('special_message')) {
              new_value.special_message = {};
            }
            // console.log('cooke save edit', new_value);
            _val = JSON.stringify(new_value);
          } else {
            _val = JSON.stringify(value);
          }
        } else {
          _val = value;
        }
        // ONLY SAVE VITAL INFO, TOTAL COOKIE SIZE NEEDS TO BE 4K OR LESS //
        if (key !== 'promotion_history') {
          // Set value to cookie at key
          this.cookie_write(key, _val);
          resolve(1);
        }
      });
    }
  }
  /**
   * Deletes data at `key`
   */
  delete(key: string): Promise<any> {
    if (this.use_cookie === false) {
      return dbDel(key);
    } else {
      return new Promise((resolve, reject) => {
        // Delete value from cookie at key
        this.cookie_remove(key);
        resolve(1);
      });
    }
  }
  clear(): Promise<any> {
    if (this.use_cookie === false) {
      return dbClear();
    } else {
      return new Promise((resolve, reject) => {
        // TODO: Clear all ccokies this service set
        resolve(undefined);
      });
    }
  }

  keys(): Promise<any> {
    if (this.use_cookie === false) {
      return dbKeys();
    } else {
      return new Promise((resolve, reject) => {
        // TODO: Return all cookie keys
        resolve([]);
      });
    }
  }

  safe_json_parse(str: string): any {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }
  // COOKIE FUNCTIONS //
  /**
   *  Gets the value stored at `key` or null from cookie.
   *
   * @param name Name of cookie.
   */
  cookie_read(name: string): any {
    const result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
    return result ? result[1] : null;
  }
  // TODO: Possibly don't store whole user object if using cookies, only essentials
  /**
   * Sets the value at `key` as a cookie.
   *
   * @param name Name of cookie.
   * @param value Value to store.
   * @param days Number of days to store it, default is 20 years.
   */
  cookie_write(name: string, value: string, days?: number): void {
    if (!days) {
      days = 365 * 20;
    }
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = '; expires=' + date.toUTCString();
    // console.log(`set cookie ${name} to ${value}`);
    document.cookie = name + '=' + value + expires + ';secure;path=/';
    // console.log(document.cookie);
  }
  /**
   *  Deletes the value stored at `key` from cookie.
   *
   * @param name Name of cookie.
   */
  cookie_remove(name: string): void {
    this.cookie_write(name, undefined, -1);
  }
  cookie_write_multi(name: string, value: string, days?: number): void {
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
  cookie_remove_multi(name: string): void {
    this.cookie_write_multi(name, undefined, -1);
  }
}
