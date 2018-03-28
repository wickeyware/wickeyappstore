import { Component, Inject } from '@angular/core';
import { UserService } from '../../../user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'wasprofile-dialog',
  templateUrl: './wasprofile.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasProfile {
  /**
   * Show a user info panel if logged in. Help if not.
   *
   * SIMPLE USE CASE
   * this.dialog.open(WasProfile);
   *
   * @example
   * import { WasProfile } from 'wickeyappstore';
   * import { MatDialog, MatDialogRef } from '@angular/material';
   * Inject MatDialog in the constructor(public dialog: MatDialog) { }
  */

  public loggedin = false;
  constructor(
    public userService: UserService,
    public dialogRef: MatDialogRef<WasProfile>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = false; // close by clicking off by default

    this.userService.loginChange.subscribe((_isLogged: boolean) => {
      console.log('USER LOADED:', this.userService.userObject.user_id);
      this.loggedin = _isLogged;
    });

  }
  /**
 * Cancel/close the dialog
 *
 * @memberof WasProfile
 */
  onNoClick(): void {
    this.dialogRef.close();
  }
  opensso() {
    this.userService.opensso();
    this.dialogRef.close();
  }
}
