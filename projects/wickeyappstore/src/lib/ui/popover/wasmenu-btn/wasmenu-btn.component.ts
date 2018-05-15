import { Component } from '@angular/core';
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

}
