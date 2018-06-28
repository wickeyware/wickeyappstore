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
    // loadScriptWithCallback('https://cdn.onesignal.com/sdks/OneSignalSDK.js', () => {
    //   console.log('N// script loaded');
    // });
    loadScriptWithSignAppIDCallback('https://vijs.rayjump.com/bin/vijs.js', 'f3592dcb4a3dc65d02f95a17bbe7a7d0', '102955', (_thisscript) => {
      console.log('A// script loaded');
      // we need the context of the script to pass into init
      (<any>window).Vijs.init(_thisscript);
    });
    loadScriptWithCallback('https://ws.bluesnap.com/source/web-sdk/bluesnap.js', () => {
      console.log('P// script loaded');
    });
    loadLinkWithCallback('https://fonts.googleapis.com/icon?family=Material+Icons', () => {
      console.log('M// Icons link loaded');
    });
    function isLoadedLink(_url) {
      return document.querySelectorAll('[href="' + _url + '"]').length > 0;
    }
    function loadLinkWithCallback(_url, callback) {
      console.log('Load Material icons');
      try {
        if (isLoadedLink(_url)) {
          console.log(`link alread loaded: ${_url}`);
        } else {
          const _link = document.createElement('link');
          _link.rel = 'stylesheet';
          _link.href = _url;
          _link.onload = callback;
          document.head.appendChild(_link);
        }
      } catch (error) {
        console.error(`Failed to load link: ${_url}`, error);
      }
    }
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
          script.onload = callback;
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error(`Failed to load script: ${_url}`, error);
      }
    }
    function loadScriptWithSignAppIDCallback(_url, _sign, _appid, callback) {
      try {
        if (isLoadedScript(_url)) {
          console.log(`script alread loaded: ${_url}`);
        } else {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = _url;
          script.setAttribute('sign', _sign);
          script.setAttribute('appid', _appid);
          script.onload = function () { callback(script); };
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
