import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

///////////////////////////////////////////////////////////////////
// wasalert.dialog is a MAT DIALOG  used for
// getting user yes/no ( or input ) feedback
///////////////////////////////////////////////////////////////////
//
// SIMPLE
// this.dialog.open(WasAlertDialogComponent, {
//   data: { title: 'Review Sent', body: 'Thanks for your feedback.'}
// });
//
// With Buttons
// const dialogRef = this.dialog.open(WasAlertDialogComponent, {
//   data: { title: 'Delete', body: 'Do you want to delete this?', buttons: ['Yes', 'No'] }
// });
// dialogRef.afterClosed().subscribe(result => {
//   console.log('This is the index of the button pressed', result);
// });

@Component({
  selector: 'wasalert-dialog',
  templateUrl: './wasalert.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasAlertDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<WasAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true; // do not close by clicking off by default
    }

  ngOnInit() { // This is when the dialog is shown. It inits right then.
    if (this.data.buttons) {
    } else {
      // will evaluate to here if buttons is: null, undefined, 0, false, "", and NaN
      this.data.buttons = ['Cancel']; // default value
    }
  }
}
