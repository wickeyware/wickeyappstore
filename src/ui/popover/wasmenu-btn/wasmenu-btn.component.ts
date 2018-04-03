import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../user.service';
import { User } from '../../../app.models';

@Component({
  selector: 'was-menu-btn',
  templateUrl: './wasmenu-btn.component.html',
  styleUrls: ['../was.component.css'],
})
export class WasMenuBtn {
  /**
 * WickeyAppStore Interface
 *
 * SIMPLY ADD to HTML where appropriate
 * <was-menu-btn></was-menu-btn>
 *
*/
  constructor(public userService: UserService) {}

  get loginMessage() {
    return this.userService.isLoggedInObs.map((_isLogged: Boolean) => {
      if (_isLogged) {
        return 'Logout';
      } else {
        return 'Login';
      }
    });
  }

  get infoIcon() {
    return this.userService.isLoggedInObs.map((_isLogged: Boolean) => {
      if (_isLogged) {
        return 'info';
      } else {
        return 'help';
      }
    });
  }

  leavereview(): void {
    this.userService.leavereview();
  }
  openstore() {
    this.userService.openstore();
  }
  opensso() {
    this.userService.opensso();
  }
  openuserinfo() {
    this.userService.openuserinfo();
  }
  openshop() {
    this.userService.openshop();
  }

}
