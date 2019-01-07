import { Component, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
/**
 * Create simple auto closing messages with icons
 *
 * <b>SIMPLEST USE CASE</b>
 * ```js
 * import { WasUp } from 'wickeyappstore';
 * import { MatDialog, MatDialogRef } from '@angular/material';
 * ...
 * constructor(public dialog: MatDialog) { } // and Inject MatDialog in the constructor
 * ...
 * this.dialog.open(WasUp, {data: { title: 'Review Sent', icon: 'edit', body: 'Thanks for your feedback.'} });
 * ```
 * <i>icon</i> can be any material icon -> https://material.io/icons/
 *
 * MORE USE CASES BELOW
 *
 * Add <b>WIDTH</b>, <b>SPINNER</b>, and <b>STAYOPEN</b> until closed
 *```js
 * private loadingdialogRef: MatDialogRef<WasUp, Array<string>>;
 * this.loadingdialogRef = this.dialog.open(WasUp, {
 *    width: '300px',
 *    data: { title: 'Intializing game', icon: 'spinner', body: 'Loading...', stayopen: true}
 *    });
 * // IF you use stayopen then you have to close yourself. The user CANNOT close.
 * ...
 * // CLOSE where you want - like when loading complete
 * this.loadingdialogRef.close();
 * ```
 * The MatDialog has additional properties.
 * By default, clicking outside the window does not close the dialog. Change by setting to false;
 * ```js
 * this.loadingdialogRef.disableClose = false;
 * ```
*/
@Component({
  templateUrl: './wasup.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasUp implements OnDestroy {
  private zTimer: any;
  /**
   * WasUp Constructor
   * @param dialogRef Reference to a WasUp dialog opened via the MatDialog service.
   * @param data The data for WasUp is as such: {title: 'title', icon: 'any_material_icon',
   * body: 'main message'. stayopen: boolean indicating to stay open until closed via dialogRef.close()}
   * @ignore
   */
  constructor(
    private ref: ChangeDetectorRef,
    public dialogRef: MatDialogRef<WasUp>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    dialogRef.disableClose = true; // do not close by clicking off by default
    if (!this.data) { this.data = {}; } // data may not be defined
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
    // TODO: Temporary only! This fixes change detection not working on custom elements WASjs
    // ref.detach();
    this.zTimer = setInterval(() => {
      try {
        this.ref.detectChanges();
      } catch (detecterror) {}
    }, 200);
  }

  /** @ignore */
  ngOnDestroy() {
    clearInterval(this.zTimer);
  }

  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }
}
