import { Component, OnInit } from '@angular/core';
import { WasReview } from '../../../ui/popover/wasreview/wasreview.dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../user.service';
import { User } from '../../../app.models';

@Component({
  selector: 'was-menu-btn',
  templateUrl: './wasmenu-btn.component.html',
  styleUrls: ['../was.component.css'],
})
export class WasMenuBtn implements OnInit {
  /**
 * WickeyAppStore Interface
 *
 * SIMPLY ADD to HTML where appropriate
 * <was-menu-btn></was-menu-btn>
 *
*/
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
  ) {
  }
  ngOnInit(): void {
  }

  leavereview(): void {
    const thissso = this.dialog.open(WasReview);
  }
  buttonClick() {
    // const thissso = this.dialog.open(WasSSO);
  }

}
