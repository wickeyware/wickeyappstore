import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../user.service';
// import { WasUp } from '../../../ui/popover/wasup/wasup.dialog';
/**
 * Open your app's leaderboard.
 *
 * ```js
 * import { WasLeaderboard } from 'wickeyappstore';
 * import { MatDialog } from '@angular/material';
 * ...
 * constructor(public dialog: MatDialog) { } // and Inject MatDialog in the constructor
 * ...
 * this.dialog.open(WasLeaderboard);
 * ```
*/
@Component({
  templateUrl: './wasleaderboard.dialog.html',
  styleUrls: ['../was.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WasLeaderboard implements OnDestroy {
  /**@ignore*/
  public leaderboardColumns: string[] = ['rank', 'username', 'score'];
  /**@ignore*/
  public appName: string;
  /**@ignore*/
  public appIcon: string;
  /**@ignore*/
  public leaderboard: [{username: string, score: number}];  // list of {username: string, score: number)
  /**@ignore*/
  public myrank: number;
  /**@ignore*/
  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public dialogRef: MatDialogRef<WasLeaderboard>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    // dialogRef.disableClose = true; // do not close by clicking off by default
    dialogRef.updateSize('100%', '100%');
    try {
      const getSubdomain = function(hostname) {
        if (hostname === 'localhost') {
          return 'localhostwickeyappstore';
        } else if (hostname === 'test.wickeyappstore.com') {
          return 'testwickeyappstore';
        } else if (hostname === 'wickeyappstore.com') {
          return 'wickeyappstore';
        } else {
          const regexParse = new RegExp('[a-z\-0-9]{2,63}\.[a-z\.]{2,5}$');
          const urlParts = regexParse.exec(hostname);
          return hostname.replace(urlParts[0], '').slice(0, -1);
        }
      };
      this.appName = getSubdomain(window.location.hostname);
    } catch (getdomainerror) {
      console.error('Ads:getdomainerror', getdomainerror);
      this.appName = '';
    }
    userService.getLeaderboard(userService.userObject.username).subscribe(res => {
      this.leaderboard = res.leaderboard;
      this.myrank = res.rank;
      this.appName = res.name;
      this.appIcon = res.icon;

    });
  }

  /** @ignore */
  ngOnDestroy() { }

  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }

}
