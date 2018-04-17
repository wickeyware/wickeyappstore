import { Component, Inject, OnInit, ViewChild, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WasAppService } from '../../../was-app.service';
import { User, AppGroup, App } from '../../../app.models';
import { AppDetailPageComponent } from '../../../display-apps/app-detail-page/app-detail-page.component';
import { WasAlert } from '../../../ui/popover/wasalert/wasalert.dialog';
/**
 * Open the WAS Store.
 *
 * Browse the WickeyAppStore right inside your app.
 *
 * ```js
 * import { WasStore } from 'wickeyappstore';
 * import { MatDialog, MatDialogRef } from '@angular/material';
 * ...
 * constructor(public dialog: MatDialog) { } // and Inject MatDialog in the constructor
 * ...
 * this.dialog.open(WasStore);
 * ```
*/
@Component({
  templateUrl: './wasstore.dialog.html',
  styleUrls: ['../was.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WasStore implements OnInit {
  /**@ignore*/
  public showVerticalList: boolean; // dictate if the full screen vertical list is shown
  /**@ignore*/
  public selectedAppList: AppGroup;
  /**@ignore*/
  public apps = [];
  /**@ignore*/
  public bannerApps = [];
  /**@ignore*/
  public selected_app: {};
  /**@ignore*/
  public showScroller;
  /**@ignore*/
  @ViewChild(AppDetailPageComponent) appDetailPage: AppDetailPageComponent;
  /**@ignore*/
  @Output() close = new EventEmitter<any>();
  /**@ignore*/
  constructor(
    public dialogRef: MatDialogRef<WasStore>,
    private wasAppService: WasAppService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default
    if (!this.data) { this.data = {}; }

    this.showVerticalList = false;
    dialogRef.updateSize('100%', '100%');
  }
  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**@ignore*/
  ngOnInit(): void {
    console.log('WAS: ngOnInit');
    this.getFeaturedGroups();
  }
  /**@ignore*/
  showAppList = (_appList: AppGroup) => {
    console.log('showVerticalListApps');
    this.selectedAppList = _appList;
    this.showVerticalList = true;
  }
  /**@ignore*/
  closeVerticalListApps(_val: number): void {
    console.log('closeVerticalListApps');
    this.showVerticalList = false;
  }
  /**@ignore*/
  getFeaturedGroups(): void {
    this.wasAppService.appGroups.subscribe((res) => {
      console.log('WAS: appGroups RETURN:', res);
      this.apps = res;
      setTimeout(() => {
        this.showScroller = true;
      }, 500);
    }, (error) => {
      console.log('WAS: appGroups ERROR:', error);
      const dialogRef = this.dialog.open(WasAlert, {
        data: { title: 'Attention', body: error }
      });
    });
  }
  /**@ignore*/
  showAppDetail = (_app: any) => {
    this.selected_app = _app;
    // this.handleAppDetail('open');
    this.appDetailPage.open(_app);
  }
  /**@ignore*/
  onAppDetailClose(_state: string) {
    console.log('onAppDetailClose', _state);
    this.selected_app = null;
  }
  /**@ignore*/
  closeMe(): void {
    this.close.emit(); // send back a message that full screen portion of the app store is closed
    this.dialogRef.close();
  }
}
