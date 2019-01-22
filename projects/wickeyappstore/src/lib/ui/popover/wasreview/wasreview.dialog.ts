import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { WasAlert } from '../wasalert/wasalert.dialog';
import { WasUp } from '../wasup/wasup.dialog';
import { UserService } from '../../../user.service';
import { User } from '../../../app.models';
import { ApiConnectionService } from '../../../api-connection.service';
/**
 * Leave an app review with WasReview
 *
 * ```js
 * import { WasReview } from 'wickeyappstore';
 * import { MatDialog, MatDialogRef } from '@angular/material';
 * ...
 * constructor(public dialog: MatDialog) { } // and Inject MatDialog in the constructor
 * ...
 * this.dialog.open(WasReview);
 * ```
*/
@Component({
  templateUrl: './wasreview.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasReview implements OnInit, OnDestroy {
  /**@ignore*/
  public stars = 0;
  /**@ignore*/
  public reviewText = '';
  /**@ignore*/
  public titleText = '';
  /**@ignore*/
  constructor(
    private apiConnectionService: ApiConnectionService,
    public userService: UserService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WasReview>,
    public breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default

    if (this.userService.userObject.user_id && this.userService.userObject.email) {
      this.loadReview(this.userService.userObject.user_id);
    }
  }

  /** @ignore */
  ngOnInit() {
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

  /** @ignore */
  ngOnDestroy() {}

  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**@ignore*/
  clickStar(star: number): void {
    this.stars = star;
  }
  /**@ignore*/
  loadReview(_user_id) {
    const loadingdialogRef = this.dialog.open(WasUp, {
      width: '300px',
      data: { title: 'Getting review', icon: 'spinner', body: 'Loading...', stayopen: true }
    });
    this.apiConnectionService.getReviews(
      { 'user_id': _user_id }
    ).subscribe((_reviews: any) => {
      loadingdialogRef.close();
      try {
        this.titleText = _reviews[0].title;
        this.reviewText = _reviews[0].text;
        this.stars = _reviews[0].rating;
      } catch (error) { }
    });
  }
  /**@ignore*/
  testValidReview(): void {
    if (this.stars === 0) {
      this.dialog.open(WasAlert, {
        data: { title: 'Select Rating', body: 'Choose Star Rating' }
      });
    } else {
      this.sendReview();
    }
  }
  /**@ignore*/
  sendReview(): void {
    // Need to get the stars, title, and text
    const _title = this.titleText;
    const _text = this.reviewText;
    const _rating = this.stars;

    const loadingdialogRef = this.dialog.open(WasUp, {
      width: '300px',
      data: { title: 'Sending review', icon: 'spinner', body: 'Saving...', stayopen: true }
    });
    this.userService.createReview(_title, _text, _rating)
      .subscribe((usr) => {
        loadingdialogRef.close();
        this.dialogRef.close(); // close the window
      }, (error) => {
        loadingdialogRef.close();
        // <any>error | this casts error to be any
        // NOTE: Can handle error return messages
        this.dialog.open(WasAlert, {
          data: { title: 'Attention', body: error }
        });
      });
  }
}
