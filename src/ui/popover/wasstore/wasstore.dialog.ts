import { Component, Inject, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WasAppService } from '../../../was-app.service';
import { User, AppGroup, App } from '../../../app.models';
import { AppDetailPageComponent } from '../../../display-apps/app-detail-page/app-detail-page.component';
import { WasAlert } from '../../../ui/popover/wasalert/wasalert.dialog';

@Component({
  selector: 'wasstore-dialog',
  templateUrl: './wasstore.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasStore implements OnInit {
  public showVerticalList: boolean; // dictate if the full screen vertical list is shown
  public selectedAppList: AppGroup;
  public apps = [];
  public bannerApps = [];
  public selected_app: {};
  public showScroller;
  @ViewChild(AppDetailPageComponent) appDetailPage: AppDetailPageComponent;
  @Output() close = new EventEmitter<any>();
  /**
   * Open the WAS Store
   *
   * SIMPLE USE CASE
   * this.dialog.open(WasStore);
  */

  constructor(
    public dialogRef: MatDialogRef<WasStore>,
    private wasAppService: WasAppService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default
    if (!this.data) { this.data = {} };

    this.showVerticalList = false;
  }
  /**
   * Cancel/close the dialog
   *
   * @memberof WasUp
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    console.log('WAS: ngOnInit');
    this.getFeaturedGroups();
  }

  showAppList = (_appList: AppGroup) => {
    console.log('showVerticalListApps');
    this.selectedAppList = _appList;
    this.showVerticalList = true;
  }
  closeVerticalListApps(_val: number): void {
    console.log('closeVerticalListApps');
    this.showVerticalList = false;
  }
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
  // loop through the featured apps and get the banner group
  getBannerFeaturedApps() {
    for (const group of this.apps) {
      if (group.title === 'Featured') {
        return group.apps;
      }
    }
  }
  // loop through the featured apps and remove the banner group
  getFeaturedApps() {
    let otherapps = [];
    for (const group of this.apps) {
      if (group.title !== 'Featured') {
        otherapps.push(group);
      }
    }
    return otherapps;
  }

  showAppDetail = (_app: any) => {
    this.selected_app = _app;
    // this.handleAppDetail('open');
    this.appDetailPage.open(_app);
  }
  onAppDetailClose(_state: string) {
    console.log('onAppDetailClose', _state);
    this.selected_app = null;
  }
  closeMe(): void {
    this.close.emit(); // send back a message that full screen portion of the app store is closed
    this.dialogRef.close();
  }
}
