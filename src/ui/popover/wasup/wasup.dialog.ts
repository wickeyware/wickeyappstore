import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'wasup-dialog',
  templateUrl: './wasup.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasUp {
  /**
   * Create simple auto closing messages with icons
   *
   * SIMPLE USE CASE
   * this.dialog.open(WasUp, {data: { title: 'Review Sent', icon: 'edit', body: 'Thanks for your feedback.'} });
   *
   * Where data = {title?: string, body?: string, icon?: string, stayopen?: boolean}
   *
   * @example
   * import { WasUp } from 'wickeyappstore';
   * import { MatDialog, MatDialogRef } from '@angular/material';
   * Inject MatDialog in the constructor(public dialog: MatDialog) { }
   *
   * MORE USE CASES BELOW
   *
   * Add a WIDTH, SPINNER, and STAYOPEN until closed
   *
   * private loadingdialogRef: MatDialogRef<WasUp, Array<string>>;
   * this.loadingdialogRef = this.dialog.open(WasUp, {
   *    width: '300px',
   *    data: { title: 'Intializing game', icon: 'spinner', body: 'Loading...', stayopen: true}
   *    });
   *
   * Then CLOSE whenever you want - like when loading complete
   * this.loadingdialogRef.close();
   *
   * The MatDialog has additional properties.
   * By default, clicking outside the window does not close the dialog. Change by setting to false;
   *    this.loadingdialogRef.disableClose = false;
  */

  constructor(
    public dialogRef: MatDialogRef<WasUp>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default
    if (!this.data) { this.data = {}; } // data may not be defined
    if (!this.data.title) { this.data.title = ''; }
    if (!this.data.body) { this.data.body = ''; }
    if (!this.data.icon) { this.data.icon = 'warning'; }
    if (!this.data.stayopen) {
      // stay open
      // will evaluate to here if stayopen is: null, undefined, 0, false, "", and NaN
      setTimeout(() => {
        this.dialogRef.close();
      }, 1750);
    }
  }
  /**
   * Cancel/close the dialog
   *
   * @memberof WasUp
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
