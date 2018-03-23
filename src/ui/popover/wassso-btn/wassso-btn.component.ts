import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WasSSO } from '../../../ui/popover/wassso/wassso.dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../user.service';
import { User } from '../../../app.models';

@Component({
  selector: 'was-sso-btn',
  templateUrl: './wassso-btn.component.html',
  styleUrls: ['../was.component.css'],
})
export class WasSSOBtn implements OnInit {
  @Output() close: EventEmitter<{}> = new EventEmitter();
  /**
 * WickeyAppStore SSO Interface
 *
 * SIMPLY ADD to HTML where appropriate
 * <was-sso-btn></was-sso-btn>
 *
 * If you need to know if successfully logged in
 * <was-sso-btn (close)="closesso($event)></was-sso-btn>
 * @param close OPTIONAL Emits logged in user email to function on successful login
*/
  constructor(
    public dialog: MatDialog,
    public userService: UserService,
  ) {
  }
  ngOnInit(): void {
    console.log('wassobtn ngoninit');
    this.userService.user.subscribe((usr: User) => {
      this.checkLoggingIn();
    });
  }
  checkLoggingIn() {
    console.log('wassso-btn checking logging in');
    setTimeout(() => {
      if (this.userService.userObject.logging_in) {
        // then show the SSO
        console.log('wassso-btn email', this.userService.userObject.token_email);
        const thissso = this.dialog.open(WasSSO, {
          data: { email: this.userService.userObject.token_email }
        });
        thissso.afterClosed().subscribe(result => {
          this.close.emit(result);
        });
      }
    }, 1000);
  }

  buttonClick() {
    const thissso = this.dialog.open(WasSSO);
    thissso.afterClosed().subscribe(result => {
      this.close.emit(result);
    });
  }

}
