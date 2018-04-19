import { Component, Inject, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../user.service';
import { User } from '../../../app.models';
import { WasUp } from '../../../ui/popover/wasup/wasup.dialog';
/**
 * Open your personal store with WasShop.
 *
 * Users can buy in-app purchases as well as get free coins via ads.
 *
 * ```js
 * import { WasShop } from 'wickeyappstore';
 * import { MatDialog, MatDialogRef } from '@angular/material';
 * ...
 * constructor(public dialog: MatDialog) { } // and Inject MatDialog in the constructor
 * ...
 * this.dialog.open(WasShop);
 * ```
*/
@Component({
  templateUrl: './wasshop.dialog.html',
  styleUrls: ['../was.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WasShop {
  /**@ignore*/
  public addBtnText = 'Video Ads';
  private vastplayer;
  /**@ignore*/
  public adnotready = true;
  private loggedin = false;
  /**@ignore*/
  public hasAds = false;
  /**@ignore*/
  public hasOfferwall = false;
  private vastAdTag = 'https://ima3vpaid.appspot.com/?adTagUrl=https%3A%2F%2Fgoogleads.g.doubleclick.net%2Fpagead%2Fads%3Fclient%3Dca-video-pub-5512390705137507%26slotname%3D3326280305%2F2027455546%26ad_type%3Dvideo_text_image%26description_url%3Dhttp%253A%252F%252Fwickeyappstore.com%26max_ad_duration%3D60000%26videoad_start_delay%3D0&type=js';
  private vastAdID: string;
  /**@ignore*/
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
  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**@ignore*/
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

  /**@ignore*/
  get isFreeCoinPanel() {
    return this.userService.freebieSettings.map((_freesetting) => {
      this.hasAds = _freesetting.hasAds;
      this.hasOfferwall = _freesetting.hasOfferwall;
      if (_freesetting.hasAds === true || _freesetting.hasOfferwall === true) {
        return true;
      } else {
        return false;
      }
    });
  }
  /**@ignore*/
  openedFreeCoins() {
    console.log('openedFreeCoins');
    if (this.loggedin === true) {
      if (this.vastAdTag) {
        this.loadAd();
      }
    }
  }
  /**@ignore*/
  closedFreeCoins() {
    console.log('closedFreeCoins');
    if (this.vastAdTag) {
      this.adnotready = true;
      this.vastplayer.stopAd();
    }
  }
  /**@ignore*/
  createVastplayer_1() {
    if (this.vastplayer === undefined) {
      console.log('create vast player');
      this.vastplayer = new (<any>window).VASTPlayer(document.getElementById('wasadcontainer'));
      this.vastplayer.once('AdStarted', () => {
        // console.log('Ad started', this.vastAdID);
        this.userService.adVideoStart(this.vastAdID);
      });
      this.vastplayer.once('AdStopped', () => {
        // console.log('Ad finished playback!');
        this.userService.adVideoEnd(this.vastAdID);
      });
    } else {
      console.log('reuse vast player'); // BUT have to reset these listeners else they will not happen
      this.vastplayer.once('AdStarted', () => {
        // console.log('Ad STARTED', this.vastAdID);
        this.userService.adVideoStart(this.vastAdID);
      });
      this.vastplayer.once('AdStopped', () => {
        // console.log('Ad FINISHED playback!');
        this.userService.adVideoEnd(this.vastAdID);
      });
    }
  }
  /**@ignore*/
  loadAd() {
    this.createVastplayer_1();

    this.addBtnText = 'Checking for Ad';
    this.ref.detectChanges();
    this.vastplayer.load(this.vastAdTag
    ).then((_vastobj) => {
      this.adnotready = false;
      this.addBtnText = 'Watch Ad';
      this.ref.detectChanges();
      console.log('an ad is ready');
      // TODO: Get currently playing video ID, I don't know if this is correct or just the first ad ID.
      this.vastAdID = _vastobj.vast.ads[0].id;
      console.log('print out the ad');
      console.log(_vastobj.vast.ads);
    }).catch((reason) => {
      console.log('watchAd error: ', reason);
      const noAdsError = /AdError 1009/gi; // g=global, i=case insensitive
      const noAds2Error = /Reduce of empty array with no initial value/gi;
      const genericError = /Request has been terminated/gi;

      const errorstring = String(reason);
      if (errorstring.search(noAdsError) > -1 || errorstring.search(noAds2Error) > -1) {
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
    });
  }

  /**@ignore*/
  watchAd() {
    console.log('showVideoAd');
    this.addBtnText = 'Ad Playing...';
    this.vastplayer.startAd();
    this.vastplayer.once('AdStopped', () => {
      console.log('Ad finished playback!');
      this.addBtnText = 'YOU GOT A COIN!';
      this.ref.detectChanges();
      setTimeout(() => {
        this.loadAd(); // load another ad
      }, 2500);
    });
  }
  /**@ignore*/
  opensso() {
    this.userService.opensso();
  }
}
