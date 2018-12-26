import { Component, Inject, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { WasAlert } from '../wasalert/wasalert.dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../user.service';
import { WasUp } from '../wasup/wasup.dialog';
/**@ignore*/
declare let paypal: any;
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
export class WasPay implements AfterViewChecked {
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
  /**@ignore */
  private addScript = false;
  /**@ignore */
  public paypalLoad = true;
  /**@ignore */
  public paypalConfig = {
    env: 'production',  // sandbox | production
    client: {
      sandbox: 'AdapT6SJWcZOdQD0kEwe_TfczeWIxmp961l6r2_A7_scbMgPQveYw9OW2dh3qvgoVAG1TzahCYyz0T5A',
      production: 'AbEK_PChjGvAvbzeWrdNsHQ7nZXLpayv2VcN_aITKe1nlu1uSHwlOAZd_eKL4fsQfv1-WI_1dnShmCu5'
    },
    style: {
      // https://developer.paypal.com/demo/checkout/#/pattern/generic
      label: 'paypal',
      size: 'responsive',    // small | medium | large | responsive
      shape: 'rect',     // pill | rect
      color: 'blue',      // gold | blue | silver | black
      tagline: false
    },
    commit: true,
    payment: (data, actions) => {
      // https://developer.paypal.com/docs/api/payments/v1/#definition-payment_options
      return actions.payment.create({
        payment: {
          transactions: [{
            amount: { total: this.data.price, currency: 'USD' },
            description: this.makeTitle(),
            payment_options: {
              allowed_payment_method: 'IMMEDIATE_PAY'
            }
          }]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return new Promise<boolean>((resolve, reject) => {
        this.userService.createPurchase(this.data.purchaseId, data, this.data.price, undefined,
          undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, 'paypal')
          .subscribe(purchres => {
            // console.log('onAuthorize:createPurchase:OK', purchres);
            this.purchaseSuccess = true;
            this.dialog.open(WasAlert, {
              data: { title: 'Purchase Successful!', body: 'Your purchase was successful.', buttons: ['Okay'] }
            }).afterClosed().subscribe(result => {
              this.dialogRef.close(true);
            });
            resolve(true);
          }, (error) => {
            console.error('onAuthorize:createPurchase:error', error);
            this.dialog.open(WasAlert, {
              data: { title: 'Purchase Failed', body: 'Your purchase failed, contact us for help.', buttons: ['Okay'] }
            }).afterClosed().subscribe(result => {
              this.dialogRef.close(false);
            });
            reject('payment failed');
          });
      });
    }
  };

  /**@ignore*/
  constructor(
    private ref: ChangeDetectorRef,
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
    // TODO: Temporary only! This fixes change detection not working on custom elements WASjs
    // ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 200);
  }
  /**@ignore */
  ngAfterViewChecked(): void {
    this.userService.isLoggedInObs.subscribe((_isLogged: Boolean) => {
      if (_isLogged) {
        if (!this.addScript) {
          this.addPaypalScript().then(() => {
            paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
            this.paypalLoad = false;
          });
        }
      }
    });
  }
  /**@ignore */
  isLoadedScript(_url) {
    return document.querySelectorAll('[src="' + _url + '"]').length > 0;
  }
  /**@ignore */
  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      if (this.isLoadedScript('https://www.paypalobjects.com/api/checkout.js')) {
        console.log(`PP// script alread loaded`);
        resolve(true);
      } else {
        const scripttagElement = document.createElement('script');
        scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
        scripttagElement.onload = resolve;
        document.body.appendChild(scripttagElement);
      }
    });
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
        const loadingdialogRef = this.dialog.open(WasUp, {
          width: '300px', data: { title: 'Preparing Payment', icon: 'spinner', body: 'Preparing...', stayopen: true }
        });
        this.userService.showWebPay(this.data).then((_goodPurchase: boolean) => {
          if (_goodPurchase) {
            loadingdialogRef.close();
            this.purchaseSuccess = true;
            this.dialog.open(WasAlert, {
              data: { title: 'Purchase Successful!', body: 'Your purchase was successful.', buttons: ['Okay'] }
            }).afterClosed().subscribe(result => {
              this.dialogRef.close(true);
            });
          } else {
            loadingdialogRef.close();
            this.dialog.open(WasAlert, {
              data: { title: 'Purchase Failed', body: 'Your purchase failed.', buttons: ['Okay'] }
            }).afterClosed().subscribe(result => {
              this.dialogRef.close(false);
            });
          }
        }).catch((_failReason) => {
          console.error('showWebPay:error return:', _failReason);
          loadingdialogRef.close();
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
