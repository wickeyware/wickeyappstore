import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'wasreview-dialog',
  templateUrl: './wasreview.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasReview {
  /**
   * Create the review app screen for WAS
   *
  */

  constructor(
    public dialogRef: MatDialogRef<WasReview>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default
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
   * @memberof WasReview
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
