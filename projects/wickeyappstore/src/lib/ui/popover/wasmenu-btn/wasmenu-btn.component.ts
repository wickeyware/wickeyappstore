import { Component, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../user.service';
import { User, Inapp } from '../../../app.models';
/**
* WickeyAppStore Interface

* This is <b>REQUIRED</b> and is the hook into WickeyAppStore reviews, purchases, sso, and other functionality.
*
* SIMPLY ADD to HTML in your main app page
* ```js
* <was-menu-btn></was-menu-btn>
* ```
* @ignore
*/
@Component({
  selector: 'was-menu-btn',
  templateUrl: './wasmenu-btn.component.html',
  styleUrls: ['../was.component.css'],
})
export class WasMenuBtn {
  /** Event emitted when the associated menu is opened.*/
  @Output() open = new EventEmitter<void>();

  /**@ignore*/
  public hasInapps = false;
  /**@ignore*/
  constructor(public userService: UserService) {
    this.userService.inapps.subscribe((_inapps: [Inapp]) => {
      if (_inapps !== undefined && _inapps.length > 0) {
        this.hasInapps = true;
      } else {
        this.hasInapps = false;
      }
    });
    loadScriptWithCallback('https://cdn.onesignal.com/sdks/OneSignalSDK.js', () => {
      console.log('OneSignal script loaded');
    });
    loadScriptWithCallback('https://cdn.jsdelivr.net/npm/vast-player@0.2/dist/vast-player.min.js', () => {
      console.log('VastPlayer script loaded');
    });
    loadScriptWithCallback('https://ws.bluesnap.com/source/web-sdk/bluesnap.js', () => {
      console.log('OneSignal script loaded');
    });
    function isLoadedScript(_url) {
      return document.querySelectorAll('[src="' + _url + '"]').length > 0;
    }
    function loadScriptWithCallback(_url, callback) {
      try {
        if (isLoadedScript(_url)) {
          console.log(`script alread loaded: ${_url}`);
        } else {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = _url;
          (<any>script).onreadystatechange = callback;
          script.onload = callback;
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error(`Failed to load script: ${_url}`, error);
      }
    }
  }
  /**@ignore*/
  get loginMessage() {
    return this.userService.isLoggedInObs.pipe(map((_isLogged: Boolean) => {
      if (_isLogged) {
        return 'Logout';
      } else {
        return 'Login';
      }
    }));
  }
  /**@ignore*/
  get infoIcon() {
    return this.userService.isLoggedInObs.pipe(map((_isLogged: Boolean) => {
      if (_isLogged) {
        return 'info';
      } else {
        return 'help';
      }
    }));
  }
  /**@ignore*/
  leavereview(): void {
    this.userService.leavereview();
  }
  /**@ignore*/
  opensso() {
    this.userService.opensso();
  }
  /**@ignore*/
  openuserinfo() {
    this.userService.openuserinfo();
  }
  /**@ignore*/
  openshop() {
    this.userService.openshop();
  }
  /**@ignore*/
  openEvent() {
    this.open.emit();
  }

}
