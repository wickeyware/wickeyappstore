import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WasReview } from '../../../ui/popover/wasreview/wasreview.dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../user.service';
import { User } from '../../../app.models';
import { WasStore } from '../../../ui/popover/wasstore/wasstore.dialog';
import { WasSSO } from '../../../ui/popover/wassso/wassso.dialog';
import { WasAlert } from '../../../ui/popover/wasalert/wasalert.dialog';

@Component({
  selector: 'was-menu-btn',
  templateUrl: './wasmenu-btn.component.html',
  styleUrls: ['../was.component.css'],
})
export class WasMenuBtn implements OnInit {
  public userloggedin = false;
  // public loginmessage = 'Login with SSO';
  /**
 * WickeyAppStore Interface
 *
 * SIMPLY ADD to HTML where appropriate
 * <was-menu-btn></was-menu-btn>
 *
*/
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
  ) {
  }
  ngOnInit(): void {
    // this.loginlogoutMessage();
  }
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
    const thissso = this.dialog.open(WasReview);
  }
  openstore() {
    const thissso = this.dialog.open(WasStore);
  }
  opensso() {
    if (this.userloggedin) {
      const dialogRef = this.dialog.open(WasAlert, {
        data: { title: 'Do you wish to log out?', body: 'Log out of your WickeyAppStore SSO account?', buttons: ['Yes', 'No'] }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 0) {
          // yes selected
          // log out.
          console.log('log out this user');
          this.userService.logOut();
        }
      })
    } else {
      this.dialog.open(WasSSO);
    }
  }

}
