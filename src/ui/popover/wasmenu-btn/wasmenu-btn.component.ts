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
  public userloggedin = false;
  // public loginmessage = 'Login with SSO';
  /**
 * WickeyAppStore Interface
 *
 * SIMPLY ADD to HTML where appropriate
 * <was-menu-btn></was-menu-btn>
 *
*/
  constructor(private userService: UserService) {}

  get loginMessage() {
    return this.userService.isLoggedInObs.map((_isLogged: Boolean) => {
      if (_isLogged) {
        this.userloggedin = true;
        return 'Logout of SSO';
      } else {
        this.userloggedin = false;
        return 'Login with SSO';
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
  openShop() {
    this.userService.openshop();
  }

}
