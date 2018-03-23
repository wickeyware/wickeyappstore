import { Component, Inject, Input } from '@angular/core';
import { WasAlert } from '../wasalert/wasalert.dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../user.service';

@Component({
  selector: 'was-pay-dialog',
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
  @Input() showApplePay = false; // default

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WasPay>,
    public userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // set defaults (just for testing)
    if (!this.data) {
      this.data = {'price': 1.99, 'title': 'Pack One', 'description': 'Intro Pack', 'coins': 100, 'isConsumable': false, 'isOwned': false};
    }

  }
  /**
   * Cancel/close the dialog
   *
   * @memberof WasPay
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  paypal() {

  }

  applepay() {

  }

  isAppleDevice() {

    const iDevices = [
      'Mac',
      'iPad',
      'iPhone',
      'iPod'
    ];
    if (!!navigator.platform) {
      while (iDevices.length) {
        while (iDevices.length) {
          const test = iDevices.pop();
          if (navigator.platform.indexOf(test) !== -1) { return true; }
        }
      }
    }
    // console.log('this is not ios');
    return false;
  }
  showTestApplePay() {
    if (this.isAppleDevice() === true && this.showApplePay === false) {
      return true;
    } else {
      return false;
    }
  }

  goToSafari() {
    this.dialog.open(WasAlert, {
      data: { title: 'Apple Pay', body: 'Open app in Safari to enable in-app purchases with Apple Pay.', buttons: ['Okay'] }
    });
  }
  makeTitle(): string {
    if (this.data.isConsumable === true) {
      return this.data.title + ' / ' + this.data.coins + ' coins';
    } else {
      return this.data.title;
    }
  }
}
