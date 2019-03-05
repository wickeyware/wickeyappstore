import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../user.service';
import { WasUp } from '../wasup/wasup.dialog';

/**@ignore*/
@Component({
  templateUrl: './wasnewsaction.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasNewsAction implements OnInit, OnDestroy {
  /**@ignore*/
  public add_class = 'was-leaderboard-content';
  public actionControl = new FormControl('', [Validators.required]);
  /**@ignore */
  public actions = [
    { id: 'TAUNT', name: '😝 Taunt' },
    { id: 'PRAISE', name: '✋ High Five', selected: true },
    { id: 'CHALLENGE', name: '😁 Challenge' }
  ];
  /**@ignore */
  public defaultValue = 'PRAISE';

  /**@ignore*/
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WasNewsAction>,
    public breakpointObserver: BreakpointObserver,
    public userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // set defaults (just for testing)
    if (!this.data) {
      this.data = {
        'username': 'username',
        'title': 'Action Away!', 'body': 'Select an alert to send "username"'
      };
    }
    if (!this.data.title) { this.data.title = 'WickeyAppStore News Alerts'; } // <action> <username>
    if (!this.data.body) { this.data.body = 'Change message'; } // Change message
    this.actionControl.setValue(this.defaultValue);
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
        // // this.dialogRef.removePanelClass('was-leaderboard-modal');
        // this.dialogRef.addPanelClass('was-leaderboard-modal-m');
        this.add_class = 'was-leaderboard-content-m';
      }
    });
  }
  /** @ignore */
  getActionName(actionid: string) {
    for (const action of this.actions) {
      if (action.id === actionid) {
        return action.name;
      }
    }
    return actionid;
  }

  /** @ignore */
  ngOnDestroy() { }

  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**@ignore*/
  doAction() {
    const loadingdialogRef = this.dialog.open(WasUp, {
      width: '300px', data: {
        title: `Sending ${this.getActionName(this.actionControl.value)}`,
        icon: 'spinner', body: 'Sending...', stayopen: true
      }
    });
    this.userService.setNewsfeed(this.data.username, this.actionControl.value).subscribe(res => {
      loadingdialogRef.close();
      this.dialogRef.close(true);
    }, (error) => {
      loadingdialogRef.close(false);
      this.dialogRef.close();
    });
  }
}
