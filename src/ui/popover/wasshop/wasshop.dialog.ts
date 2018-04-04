import { Component, Inject, ChangeDetectorRef, ViewEncapsulation} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../user.service';
import { User } from '../../../app.models';
import { WasUp } from '../../../ui/popover/wasup/wasup.dialog';

@Component({
  selector: 'was-shop-dialog',
  templateUrl: './wasshop.dialog.html',
  styleUrls: ['../was.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WasShop {
  /**
   * Show your own personal store
   *
   * SIMPLE USE CASE
   * this.dialog.open(WasShop);
   *
   *
   * @example
   * import { WasShop } from 'wickeyappstore';
   * import { MatDialog, MatDialogRef } from '@angular/material';
   * Inject MatDialog in the constructor(public dialog: MatDialog) { }
   *
  */
  public addBtnText = 'Video Ads';
  private vastplayer;
  public adnotready = true;
  private loggedin = false;

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    public userService: UserService,
    public dialogRef: MatDialogRef<WasShop>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    // dialogRef.disableClose = true; // do not close by clicking off by default
    dialogRef.updateSize('100%', '100%');
  }
  /**
   * Cancel/close the dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  get loginValue() {
    return this.userService.isLoggedInObs.map((_isLogged: Boolean) => {
      if (_isLogged) {
        if (this.loggedin === false) {
          //  First time marked logged in
          // Try to load an ad.
          console.log('person is logged in');
        }
        this.loggedin = true;
        return true;
      } else {
        this.loggedin = false;
        return false;
      }
    });
  }
  offerwall() {
    this.dialog.open(WasUp, { data: { title: 'Ad watched', icon: 'card_giftcard', body: 'You got a coin!' } });
  }
  // ad stuff

  openedFreeCoins() {
    console.log('openedFreeCoins');
    if (this.loggedin === true) {
      this.loadAd();
    }
  }
  closedFreeCoins() {
    console.log('closedFreeCoins');
    this.adnotready = true;
    this.vastplayer.stopAd();
  }
  loadAd() {
    if (this.vastplayer === undefined) {
      console.log('create vast player');
      this.vastplayer = new (<any>window).VASTPlayer(document.getElementById('wasadcontainer'));
    } else {
      console.log('reuse vast player');
    }
    this.addBtnText = 'Checking for Ad';
    this.ref.detectChanges();
    this.vastplayer.load(
      // 'https://ads.aerserv.com/as/?plc=1000741&cb=&ip=&make=&model=&os=&osv=&type=&ua=&url=&lat=&long=&locationsource=&age=&yob=&gender=&coppa=&vpaid=&vph=&vpw='
      'https://ima3vpaid.appspot.com/?adTagUrl=https%3A%2F%2Fgoogleads.g.doubleclick.net%2Fpagead%2Fads%3Fclient%3Dca-video-pub-2393320645055022%26slotname%3D1989239344%2F6896802175%2F5200567630%26ad_type%3Dvideo%26description_url%3Dhttp%253A%252F%252Fwickeyappstore.com%26videoad_start_delay%3D0&type=js'
      // 'https://net.rayjump.com/openapi/ads?app_id=100148&unit_id=30452&client_ip=188.0.175.167&sign=f3a6ebfd8fdcd87d4f982cdf1052c597&platform=1&ad_num=1&os_version=6.0.1&package_name=video.cut.editor&gaid=f7140461-c01f-431f-9c05-c52f43d46e05&android_id=6be1afe3b0f8a5e2&useragent=Mozilla%2F5.0%20(Linux%3B%20Android%206.0.1%3B%20SM-T355%20Build%2FMMB29M%3B%20wv)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Version%2F4.0%20Chrome%2F63.0.3239.111%20Safari%2F537.36&unit_size=320x480&is_vast=1&http_req=2'
    ).then(() => {
      this.adnotready = false;
      this.addBtnText = 'Watch Ad';
      this.ref.detectChanges();
      console.log('an ad is ready');
    }).catch((reason) => {
      setTimeout(() => {
        console.log('watchAd error: ', reason);
        const noAdsError = /AdError 1009/gi; // g=global, i=case insensitive
        const genericError = /Request has been terminated/gi;

        const errorstring = String(reason);
        if (errorstring.search(noAdsError) > -1) {
          console.log('No Ad available');
          this.addBtnText = 'No Ads. Check back later!';
          this.ref.detectChanges();
        } else if (errorstring.search(genericError) > -1) {
          console.log('Request has been terminated');
          this.addBtnText = 'Request terminated. Check later';
          this.ref.detectChanges();
        } else {
          console.log('Unknown Error');
          this.addBtnText = 'Unknown error. Please try later';
          this.ref.detectChanges();
        }
      }, 0);
    });
  }



  awardCoin() {
    // wasup doesn't animate properly, so we use alert
    // this.dialog.open(WasUp, { data: { title: 'Ad watched', icon: 'card_giftcard', body: 'You got a coin!' } });
    this.loadAd();
  }
  watchAd() {
    console.log('showVideoAd');
    this.adnotready = true;
    this.addBtnText = 'Ad Playing...';
    this.vastplayer.startAd();
    this.vastplayer.once('AdStopped', () => {
      console.log('Ad finished playback!');
      this.addBtnText = 'YOU GOT A COIN!';
      this.ref.detectChanges();
      setTimeout(() => {
        this.awardCoin();
      }, 2500);
    });
  }
  opensso() {
    this.userService.opensso();
  }
}
