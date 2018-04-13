import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'wasalert-dialog',
  templateUrl: './wasalert.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasAlert {

  /**
   * Create simple modal popups with btns or input field to get user input.
   *
   * SIMPLE USE CASE
    this.dialog.open(WasAlert, {data: { title: 'Hi', body: 'This is a WasAlert' } });
   *
   * Where data = {title?: string, body?: string, buttons?: Array<string>, input?: boolean, input_value?: string}
   *
   * @example
    import { WasAlert } from 'wickeyappstore';
    import { MatDialog, MatDialogRef } from '@angular/material';
    Inject MatDialog in the constructor(public dialog: MatDialog) { }
   *
   * MORE USE CASES BELOW
   *
   * Standard Confirm (WasAlertStyleConfirm / WasAlertStyleWarning)
    const dialogRef = this.dialog.open(WasAlert, { data: { title: 'Please confirm.',
        body: 'This is the default WasAlertStyleConfirm alert.', buttons: 'WasAlertStyleConfirm' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('This is 0 for cancel, and 1 for Confirm', result);
      } else {
        console.log('Dialog was cancelled');
      }
    });

   * With Buttons
    const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Hi', body: 'Confirm?', buttons: ['Cancel', 'Option A', Option B] } });
        dialogRef.afterClosed().subscribe(result => {
       if (result !== undefined) {
         console.log('This is 0 for cancel, and 1 for A, 2 for B', result);
       } else {
         console.log('Dialog was cancelled');
       }
     });
   *
   * With Input field
     const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Password', input: true, input_value: 'text', password: true } });
        dialogRef.afterClosed().subscribe(result => {
       if (result !== undefined) {
         console.log('This is the input captured', result);
       } else {
         console.log('Dialog was cancelled');
       }
     });
   * With List of choices
    const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Hi', list: ['item1', 'item2'] } });
        dialogRef.afterClosed().subscribe(result => {
       if (result !== undefined) {
         console.log('This is the index of the selected list item', result);
       } else {
         console.log('Dialog was cancelled');
       }
     });
   *
   * The MatDialog has additional properties.
   * By default, clicking outside the window does not close the dialog. Change by setting to false;
       this.dialogRef.disableClose = false;
   *
   * ADVANCED Options
   * Can Pass TWO buttons, TWO button_icons, and TWO button_colors
    const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Hi', body: 'Set Alarm?',
      buttons: ['Cancel', 'Alarm'], button_icons: ['cancel', 'alarm'], button_colors: ['', 'accent'] } });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('This is 0 for cancel, and 1 for A, 2 for B', result);
      } else {
        console.log('Dialog was cancelled');
      }
    });
   */
  constructor(
    public dialogRef: MatDialogRef<WasAlert>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    // console.log('print wasalert ', dialogRef);

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
        this.data.buttons = ['Cancel', 'Choose'];
      }
      // Can optionally style style those, or have the default choices
      if (!this.data.button_icons) { this.data.button_icons = ['cancel', 'done']; }
      if (!this.data.button_colors) { this.data.button_colors = ['', 'primary']; }
    }
    if (!this.data.password) { this.data.password = false; }
    if (!this.data.button_icons) { this.data.button_icons = ['', '']; }
    if (!this.data.button_colors) { this.data.button_colors = ['', '']; }
  }

  /**
   * Cancel/close the dialog
   *
   * @memberof WasAlert
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
