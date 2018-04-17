import { Component, Inject, Input } from '@angular/core';
import { WasAlert } from '../wasalert/wasalert.dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../user.service';
/**
 * Directly open a purchase page with WasPay
 *
 * Alternatively use WasShop to show all available in-apps.
 *
 * Get your inapp purchaseid from your app in developer.wickeyappstore.com
 * 
 * ```js
 * import { WasPay } from 'wickeyappstore';
 * import { MatDialog, MatDialogRef } from '@angular/material';
 * import { UserService } from './user.service';
 * ...
 * constructor(public dialog: MatDialog, private userService: UserService) { } // and Inject MatDialog & UserService in the constructor
 * ...
 * const _myInapp = this.userService.getInapp(this.myInappPurchaseId);
 * this.dialog.open(WasPay, {data: _myInapp}).afterClosed().subscribe(_isSuccess => {
 *  if (_isSuccess === true) {
 *     // the inapp was purchased
 *     }
 *   });
 * ```
 *
*/
@Component({
  templateUrl: './waspay.dialog.html',
  styleUrls: ['../was.component.css'],
})
export class WasPay {
  /**
   * Choose payment type. Internal Use
   * Must pass price, title, description, coins, isConsumable, isOwned
   *     this.dialog.open(WasPay, {
      data: {'price': 1.99, 'title': 'Pack One', 'description': 'Intro Pack', 'coins': 100}
    });
  */
  /**@ignore*/
  public isApplePayAvail = false; // dictates if the apple pay button is shown.
  /**@ignore */
  public purchaseSuccess;
  /**@ignore*/
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WasPay>,
    public userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // set defaults (just for testing)
    if (!this.data) {
      this.data = {
        'price': 1.99,
        'title': 'Pack One', 'description': 'Intro Pack', 'coins': 100, 'isConsumable': false, 'isOwned': false
      };
    }
    this.isApplePayAvail = this.userService.isApplePayAvailable();
  }
  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**@ignore*/
  showWebPay() {
    if (this.userService.isLoggedInVal) {
      if (this.data.isOwned === true) {
        this.dialog.open(WasAlert, {
          data: { title: 'Already Owned', body: 'You already own: ' + this.data.title, buttons: ['Cool'] }
        });
      } else {
        this.userService.showWebPay(this.data).then((_goodPurchase: boolean) => {
          if (_goodPurchase) {
            this.purchaseSuccess = true;
            this.dialog.open(WasAlert, {
              data: { title: 'Purchase Successful!', body: 'Your purchase was successful.', buttons: ['Okay'] }
            }).afterClosed().subscribe(result => {
              this.dialogRef.close(true);
            });
          } else {
            this.dialog.open(WasAlert, {
              data: { title: 'Purchase Failed', body: 'Your purchase failed.', buttons: ['Okay'] }
            }).afterClosed().subscribe(result => {
              this.dialogRef.close(false);
            });
          }
        }).catch((_failReason) => {
          console.error('showWebPay:error return:', _failReason);
          if (_failReason !== 'cancelled') {
            this.dialog.open(WasAlert, {
              data: { title: 'Purchase Failed', body: 'Your purchase failed, contact us for help.', buttons: ['Okay'] }
            }).afterClosed().subscribe(result => {
              this.dialogRef.close(false);
            });
          }
        });
      }
    } else {
      this.userService.opensso();
    }
  }
  /**@ignore*/
  goToSafari() {
    this.dialog.open(WasAlert, {
      data: { title: 'Apple Pay', body: 'Open app in Safari to enable in-app purchases with Apple Pay.' }
    });
  }
  /**@ignore*/
  makeTitle(): string {
    if (this.data.isConsumable === true) {
      return this.data.title + ' / ' + this.data.coins + ' coins';
    } else {
      return this.data.title;
    }
  }
}
