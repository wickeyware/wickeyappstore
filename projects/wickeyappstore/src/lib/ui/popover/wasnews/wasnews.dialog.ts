import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserService, NewsFeedObj } from '../../../user.service';
import { LocalStorageService } from '../../../local-storage.service';

// import { WasUp } from '../../../ui/popover/wasup/wasup.dialog';
/**
 * Open your newsfeed
 *
 * ```js
 * import { WasNews } from 'wickeyappstore';
 * import { MatDialog } from '@angular/material';
 * ...
 * constructor(public dialog: MatDialog) { } // and Inject MatDialog in the constructor
 * ...
 * this.dialog.open(WasNews);
 * ```
*/
@Component({
  templateUrl: './wasnews.dialog.html',
  styleUrls: ['../was.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WasNews implements OnInit, OnDestroy {
  /**@ignore*/
  public add_class = 'was-leaderboard-content';
  /**@ignore*/
  public leaderboardColumns: string[] = ['rank', 'username', 'score'];
  /**@ignore*/
  public appName: string;
  /**@ignore*/
  public appIcon: string;
  /**@ignore*/
  public leaderboard: [{ username: string, score: number }];  // list of {username: string, score: number)
  /**@ignore*/
  public myrank: number;
  /**@ignore*/
  public newsList: NewsFeedObj[];
  /** @ignore */
  private seenItems: string[];
  /** @ignore */
  private globalSeenItems: number[];
  /**@ignore*/
  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    private localStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<WasNews>,
    public breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    // dialogRef.disableClose = true; // do not close by clicking off by default
    this.seenItems = [];
    this.globalSeenItems = [];
  }

  /** @ignore */
  ngOnInit() {
    this.newsList = this.userService.newsfeedObject;
    let cpynewsfeed: [NewsFeedObj];
    cpynewsfeed = JSON.parse(JSON.stringify(this.userService.newsfeedObject));
    for (const newsitm of cpynewsfeed) {
      if (newsitm.isGlobal === true) {
        this.globalSeenItems.push(newsitm.id as number);
      } else {
        this.seenItems.push(newsitm.id as string);
      }
      newsitm.isNew = false;
    }
    if (JSON.stringify(this.userService.newsfeedObject) !== JSON.stringify(cpynewsfeed)) {
      console.log('UPDATE WAS NEWS', this.userService.newsfeedObject, cpynewsfeed);
      if (this.seenItems.length > 0 || this.globalSeenItems.length > 0) {
        this.userService.seenNewsfeed(this.seenItems, this.globalSeenItems);
      }
    }
    this.userService.savenewsfeed(cpynewsfeed);

    // https://material.angular.io/cdk/layout/overview
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      if (result.matches) {
        // NOTE: IFF mobile, set size to full screen
        this.dialogRef.updateSize('100%', '100%');
        // // this.dialogRef.removePanelClass('was-leaderboard-modal');
        this.dialogRef.addPanelClass('was-leaderboard-modal-m');
        this.add_class = 'was-leaderboard-content-m';
      } else {
        // this.dialogRef.updateSize('60%', '60%');
        // this.add_class = 'was-leaderboard-content';
      }
    });
  }

  /** @ignore */
  ngOnDestroy() { }

  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }

}
