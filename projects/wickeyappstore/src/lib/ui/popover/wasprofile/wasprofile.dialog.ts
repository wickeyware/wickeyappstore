import { Component, Inject } from '@angular/core';
import { UserService } from '../../../user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
/**
 * WasProfile
 *
 * Show a user info panel if logged in. A help panel if not logged in.
 *
 * ```js
 * import { WasProfile } from 'wickeyappstore';
 * import { MatDialog, MatDialogRef } from '@angular/material';
 * ...
 * constructor(public dialog: MatDialog) { } // and Inject MatDialog in the constructor
 * ...
 * this.dialog.open(WasProfile);
 * ```
*/
@Component({
  templateUrl: './wasprofile.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasProfile {
  /**@ignore*/
  public loggedin = false;
  /** @ignore */
  public version = '2.13.1';
  /**@ignore*/
  constructor(
    public userService: UserService,
    public dialogRef: MatDialogRef<WasProfile>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = false; // close by clicking off by default

    this.userService.loginChange.subscribe((_isLogged: boolean) => {
      this.loggedin = _isLogged;
    });

  }
  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**@ignore*/
  opensso() {
    this.userService.opensso();
    this.dialogRef.close();
  }
}
