import { Injectable } from '@angular/core';

// let idbkeyval = require('../../node_modules/idb-keyval/idb-keyval.js'); // 'idb-keyval'
// let idbkeyval = require('https://unpkg.com/idb-keyval@2.3.0/idb-keyval.js');

/**
 * Store values and objects locally, uses indexedDB via idb-keyval.js if available,
 * else uses cookies. NOTE: cookies are limited in length.
 * TODO: Allow passing in of idb-keyval.js location, currently uses location:
 * ../../node_modules/idb-keyval/idb-keyval.js
 *
 * @export
 * @class LocalStorageService
 */
@Injectable()
export class LocalStorageService {
  public use_cookie = false;
  public idbkeyval = require('../../node_modules/idb-keyval/idb-keyval.js'); // 'idb-keyval'

  constructor() {
    // CHECK IF BROWSER HAS INDEXEDDB //
    if (typeof navigator !== 'undefined' && !window.hasOwnProperty('indexedDB')) {
      this.use_cookie = true;
      console.log('USE COOKIE STORAGE');
    } else {
      this.use_cookie = false;
      console.log('USE INDEXEDDB STORAGE');
    }
  }
  /**
   * Gets the value stored at `key` or undefined if it doesn't exist
   *
   * @param {string} key
   * @returns {Promise<any>}
   * @memberof LocalStorageService
   */
  get(key: string): Promise<any> {
    if (this.use_cookie === false) {
      return this.idbkeyval.get(key);
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
   *
   * @param {string} key
   * @param {*} value
   * @returns {Promise<any>}
   * @memberof LocalStorageService
   */
  set(key: string, value: any): Promise<any> {
    if (this.use_cookie === false) {
      return this.idbkeyval.set(key, value);
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
   *
   * @param {string} key
   * @returns {Promise<any>}
   * @memberof LocalStorageService
   */
  delete(key: string): Promise<any> {
    if (this.use_cookie === false) {
      return this.idbkeyval.delete(key);
    } else {
      return new Promise((resolve, reject) => {
        // Delete value from cookie at key
        this.cookie_remove(key);
        resolve(1);
      });
    }
  }
  // clear(): Promise<any> {
  //   if (this.use_cookie === false) {
  //     return this.idbkeyval.clear();
  //   } else {
  //     return new Promise((resolve, reject) => {
  //       // TODO: Clear all ccokies this service set
  //       resolve(1);
  //     });
  //   }
  // }

  safe_json_parse(str: string): any {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }
  // COOKIE FUNCTIONS //
  cookie_read(name: string): any {
    const result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
    return result ? result[1] : null;
  }
  // TODO: Possibly don't store everything if using cookies
  cookie_write(name: string, value: string, days?: number): void {
    if (!days) {
      days = 365 * 20;
    }
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = '; expires=' + date.toUTCString();
    // console.log(`set cookie ${name} to ${value}`);
    document.cookie = name + '=' + value + expires + '; path=/';
    // console.log(document.cookie);
  }
  cookie_remove(name: string): void {
    this.cookie_write(name, undefined, -1);
  }
}