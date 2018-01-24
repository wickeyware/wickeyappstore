import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

///////////////////////////////////////////////////////////////////
// wasup.dialog is a MAT DIALOG  used for
// simple (usually self closing) messages with icons
///////////////////////////////////////////////////////////////////
//
// SETUP *
// import { WasUpDialogComponent } from 'wickeyappstore';
// import { MatDialog, MatDialogRef } from '@angular/material';
// add to constructor(public dialog: MatDialog){}
//
// SIMPLE
// this.dialog.open(WasUpDialogComponent, {
//   width: '300px',
//   data: { title: 'Review Sent', icon: 'edit', body: 'Thanks for your feedback.'}
// });
//
// COMPLEX
// Create a variable to store the dialog
// private loadingdialogRef: MatDialogRef<WasUpDialogComponent, Array<string>>;
// this.loadingdialogRef = this.dialog.open(WasUpDialogComponent, {
//   width: '300px',
//   data: { title: 'Intializing game', icon: 'spinner', body: 'Please do not make any changes until the load completes', stayopen: true}
// });
// 1) stayopen: true - to force the window to stay open.
// 2) set icon: 'spinner' - to get an activity spinner
// 3) this.loadingdialogRef.disableClose = true; - can optionaly FORCE the dialog to stay open / else a user click outside will close
//
@Component({
  selector: 'wasup-dialog',
  templateUrl: './wasup.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasUpDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<WasUpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { // This is when the dialog is shown. It inits right then.
    if (this.data.stayopen) {
      // stay open
    } else {
      // will evaluate to here if stayopen is: null, undefined, 0, false, "", and NaN
      setTimeout(() => {
        this.dialogRef.close();
      }, 1750);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
