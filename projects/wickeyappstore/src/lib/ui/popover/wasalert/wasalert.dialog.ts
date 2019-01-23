import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/**
 * Create simple modal popups with btns or input field to get user input.
 *
 * <b>SIMPLEST USE CASE</b>
 * ```js
 * import { WasAlert } from 'wickeyappstore';
 * import { MatDialog, MatDialogRef } from '@angular/material';
 * ...
 * constructor(public dialog: MatDialog) { } // and Inject MatDialog in the constructor
 * ...
 * this.dialog.open(WasAlert, {data: { title: 'Hi', body: 'This is a WasAlert' } });
 * ```
 *
 * MORE USE CASES BELOW
 *
 * <b>Standard Confirm (WasAlertStyleConfirm / WasAlertStyleWarning)</b>
 * ```js
  this.dialog.open(WasAlert, {
    data: {
      title: 'Please confirm.',
      body: 'This is the default WasAlertStyleConfirm alert.', buttons: 'WasAlertStyleConfirm'
    }
  }).afterClosed().subscribe(result => {
    if (result !== undefined) {
      console.log('This is 0 for cancel, and 1 for Confirm', result);
    } else {
      console.log('Dialog was cancelled');
    }
  });
 * ```
 *
 * <b>With Buttons</b>
 * ```js
  const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Hi', body: 'Confirm?', buttons: ['Cancel', 'Option A', Option B] } });
      dialogRef.afterClosed().subscribe(result => {
     if (result !== undefined) {
       console.log('This is 0 for cancel, and 1 for A, 2 for B', result);
     } else {
       console.log('Dialog was cancelled');
     }
   });
 * ```
 *
 * <b>With Input field</b>
 * ```js
   const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Password', input: true, input_value: 'text', password: true } });
      dialogRef.afterClosed().subscribe(result => {
     if (result !== undefined) {
       console.log('This is the input captured', result);
     } else {
       console.log('Dialog was cancelled');
     }
   });
   ```
 *
 * <b>With List of choices<b> ---<i>Deprecated</i>
 * ```js
  const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Hi', list: ['item1', 'item2'] } });
      dialogRef.afterClosed().subscribe(result => {
     if (result !== undefined) {
       console.log('This is the index of the selected list item', result);
     } else {
       console.log('Dialog was cancelled');
     }
   });
 *```
 *
 * <b>ADVANCED Options</b>
 *
 * Can Pass TWO buttons, TWO button_icons, and TWO button_colors
 *
 * <i>button_icons</i> can be any material icon -> https://material.io/icons/
 *
 * <i>button_colors</i> can be any material theme color. primary, accent, warn, or empty string
 * ```js
  const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Hi', body: 'Set Alarm?',
    buttons: ['Cancel', 'Alarm'], button_icons: ['cancel', 'alarm'], button_colors: ['', 'accent'] } });
  dialogRef.afterClosed().subscribe(result => {
    if (result !== undefined) {
      console.log('This is 0 for cancel, and 1 for A, 2 for B', result);
    } else {
      console.log('Dialog was cancelled');
    }
  });
  ```
 *
 * The MatDialog has additional properties.
 * By default, clicking outside the window does not close the dialog. Change by setting to false;
 * ```js
 this.dialogRef.disableClose = false;
     ```
 */
@Component({
  templateUrl: './wasalert.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasAlert implements OnInit, OnDestroy {
  /**
 * WasAlert Constructor
 * @param dialogRef Reference to a WasAlert dialog opened via the MatDialog service.
 * @param data The data for WasAlert always contains: {title: 'title', body: 'main message'}. See the examples for a full list.
 * @ignore
 */
  constructor(
    public dialogRef: MatDialogRef<WasAlert>,
    public breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default
    if (!this.data) { this.data = {}; } // data may not be defined
    if (!this.data.title) { this.data.title = ''; }
    if (!this.data.body) { this.data.body = ''; }
    if (!this.data.buttons) { this.data.buttons = ['OK']; }
    if (this.data.buttons === 'WasAlertStyleConfirm') {
      this.data.buttons = ['Cancel', 'OK'];
      this.data.button_icons = ['cancel', 'done'];
      this.data.button_colors = ['warn', 'primary'];
    } else if (this.data.buttons === 'WasAlertStyleWarning') {
      // example of a DELETE Confirmation
      this.data.buttons = ['Cancel', 'CONFIRM'];
      this.data.button_icons = ['', 'warning'];
      this.data.button_colors = ['', 'warn'];
    }
    if (!this.data.input) {
      this.data.input = false;
      // there will be two buttons always.
      // Cancel and Choose
      if (this.data.buttons.length === 2) {
        // then we'll just trust they used a Cancel, and Submit choice
      } else {
        this.data.buttons = ['Cancel', 'OK'];
      }
      // Can optionally style style those, or have the default choices
      if (!this.data.button_icons) { this.data.button_icons = ['cancel', 'done']; }
      if (!this.data.button_colors) { this.data.button_colors = ['', 'primary']; }
    }
    if (!this.data.password) { this.data.password = false; }
    if (!this.data.button_icons) { this.data.button_icons = ['', '']; }
    if (!this.data.button_colors) { this.data.button_colors = ['', '']; }
  }

  /** @ignore */
  ngOnInit() {
    if (this.data.input === true) {
      // https://material.angular.io/cdk/layout/overview
      this.breakpointObserver.observe([
        Breakpoints.Handset,
        Breakpoints.Tablet
      ]).subscribe(result => {
        if (result.matches) {
          // NOTE: IFF mobile, set size to full screen
          this.dialogRef.updateSize('100%', '100%');
        }
      });
    }
  }

  /** @ignore */
  ngOnDestroy() {}

  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }
}
