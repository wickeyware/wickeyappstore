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
   * this.dialog.open(WasAlert, {data: { title: 'Hi', body: 'This is a WasAlert' } });
   *
   * Where data = {title?: string, body?: string, buttons?: Array<string>, input?: boolean, input_value?: string}
   *
   * @example
   * import { WasAlert } from 'wickeyappstore';
   * import { MatDialog, MatDialogRef } from '@angular/material';
   * Inject MatDialog in the constructor(public dialog: MatDialog) { }
   *
   * MORE USE CASES BELOW
   *
   * With Buttons
   * const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Hi', body: 'Yes or No?', buttons: ['Yes', 'No'] } });
   *     dialogRef.afterClosed().subscribe(result => {
   *    if (result !== undefined) {
   *      console.log('This is 0 for yes, and 1 for no', result);
   *    } else {
   *      console.log('Dialog was cancelled');
   *    }
   *  }
   *
   * With Input field
    * const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Hi', input: true, input_value: 'text' } });
   *     dialogRef.afterClosed().subscribe(result => {
   *    if (result !== undefined) {
   *      console.log('This is the input captured', result);
   *    } else {
   *      console.log('Dialog was cancelled');
   *    }
   *  }
   * With List of choices
   * const dialogRef = this.dialog.open(WasAlert, {data: { title: 'Hi', list: ['item1', 'item2'] } });
   *     dialogRef.afterClosed().subscribe(result => {
   *    if (result !== undefined) {
   *      console.log('This is the index of the selected list item', result);
   *    } else {
   *      console.log('Dialog was cancelled');
   *    }
   *  }
   *
   * The MatDialog has additional properties.
   * By default, clicking outside the window does not close the dialog. Change by setting to false;
   *    this.dialogRef.disableClose = false;
   */
  constructor(
    public dialogRef: MatDialogRef<WasAlert>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default
    if (!this.data.title) { this.data.title = ''; }
    if (!this.data.body) { this.data.body = ''; }
    if (!this.data.buttons) { this.data.buttons = ['Cancel']; }
    if (!this.data.input) { this.data.input = false; }
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
