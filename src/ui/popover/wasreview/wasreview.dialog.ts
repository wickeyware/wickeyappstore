import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WasAlert } from '../wasalert/wasalert.dialog';
import { WasUp } from '../wasup/wasup.dialog';
import { UserService } from '../../../user.service';
import { User } from '../../../app.models';
import { Subscription } from 'rxjs/Subscription';
import { ApiConnectionService } from '../../../api-connection.service';

@Component({
  selector: 'wasreview-dialog',
  templateUrl: './wasreview.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasReview {
  public busySubmit: Subscription;
  public stars = 0;
  public reviewText = '';
  public titleText = '';
  /**
   * Create the review app screen for WAS
   * This is opened from within the WAS menu.
   *
   * Opening manually is as simple as below
   * @example
   * import { WasReview } from 'wickeyappstore';
   * import { MatDialog, MatDialogRef } from '@angular/material';
   * Inject MatDialog in the constructor(public dialog: MatDialog) { }
   * this.dialog.open(WasReview);
  */

  constructor(
    private apiConnectionService: ApiConnectionService,
    private userService: UserService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WasReview>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default

    this.userService.user.subscribe((usr: User) => {
      if (usr.user_id && usr.email) {
        this.loadReview(usr.user_id);
      }
    });
  }
  /**
   * Cancel/close the dialog
   *
   * @memberof WasReview
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
  clickStar(star: number): void {
    this.stars = star;
  }

  loadReview(_user_id) {
    const loadingdialogRef = this.dialog.open(WasUp, {
      width: '300px',
      data: { title: 'Getting review', icon: 'spinner', body: 'Loading...', stayopen: true }
    });
    this.apiConnectionService.getReviews(
      { 'user_id': _user_id }
    ).subscribe((_reviews: any) => {
      console.log('WAS loadReview', _reviews);
      loadingdialogRef.close();
      try {
        this.titleText = _reviews[0].title;
        this.reviewText = _reviews[0].text;
        this.stars = _reviews[0].rating;
      } catch (error) { }
    });
  }

  testValidReview(): void {
    if (this.stars === 0) {
      this.dialog.open(WasAlert, {
        data: { title: 'Select Rating', body: 'Choose Star Rating', buttons: ['Okay'] }
      });
    } else {
      this.sendReview();
    }
  }

  sendReview(): void {
    console.log('send the review');

    // Need to get the stars, title, and text
    const _title = this.titleText;
    const _text = this.reviewText;
    const _rating = this.stars;

    const loadingdialogRef = this.dialog.open(WasUp, {
      width: '300px',
      data: { title: 'Getting review', icon: 'spinner', body: 'Loading...', stayopen: true }
    });
    this.userService.createReview(_title, _text, _rating)
      .subscribe((usr) => {
        console.log('WAS leaveReview: RETURN:', usr);
        loadingdialogRef.close();
        this.dialogRef.close(); // close the window
      }, (error) => {
        loadingdialogRef.close();
        // <any>error | this casts error to be any
        // NOTE: Can handle error return messages
        console.log('WAS leaveReview: RETURN ERROR:', error);
        this.dialog.open(WasAlert, {
          data: { title: 'Attention', body: error, buttons: ['Okay'] }
        });
      });
  }
}
