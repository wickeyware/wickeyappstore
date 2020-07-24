import { Component, OnInit, Input } from '@angular/core';
import { WasPay } from '../../ui/popover/waspay/waspay.dialog';
import { WasAlert } from '../../ui/popover/wasalert/wasalert.dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
/**
 * @module
 * @ignore
 */
@Component({
  selector: 'was-display-inapp',
  templateUrl: './display-inapp.component.html',
  styleUrls: ['./display-inapp.component.css']
})
export class DisplayInAppComponent implements OnInit {
  @Input() public inapp: any;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (this.inapp === undefined) {
      this.inapp = {
        title: 'Pack One', description: 'Get an amazing pack of stuff within this exciting first pack!',
        price: '$1.99', coins: 100, isConsumable: false
      };
    }
  }

  clickPay() {
    if (this.inapp.isOwned === true) {
      this.dialog.open(WasAlert, {
        data: { title: 'Already Owned', body: 'You already own: ' + this.inapp.title, buttons: ['Cool'] }
      });
    } else {
      this.dialog.open(WasPay, {
        data: this.inapp
      });
    }
  }

  priceColor(): string {
    if (this.inapp.isOwned === true) {
      return 'primary';
    } else {
      return 'accent';
    }
  }

  // this gets the price. If owned, say so
  priceTag(): string {
    if (this.inapp.isOwned === true) {
      return 'OWNED';
    } else {
      return 'Pay ' + this.inapp.price;
    }
  }

  makeTitle(): string {
    if (this.inapp.isConsumable === true) {
      return this.inapp.title + ' / ' + this.inapp.coins + ' coins';
    } else {
      return this.inapp.title;
    }
  }

}
