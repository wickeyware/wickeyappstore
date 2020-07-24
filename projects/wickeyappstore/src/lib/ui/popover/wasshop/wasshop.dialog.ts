import { Component, Inject, ChangeDetectorRef, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
export class WasShop implements OnInit, OnDestroy {
  /**@ignore*/
  public add_class = '';  // was-shop-content
  /**@ignore*/
  public addBtnText = 'Video Ads';
  private vastplayer;
  /**@ignore*/
  public adnotready = true;
  /**@ignore*/
  public rewardedVideoNOTReady = true;
  /**@ignore*/
  public appName: string;
  private loggedin = false;
  /**@ignore*/
  public hasAds = false;
  /**@ignore*/
  public hasOfferwall = false;
  private vastAdTag;
  private vastAdID: string;
  /**@ignore*/
  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    public userService: UserService,
    public dialogRef: MatDialogRef<WasShop>,
    public breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // SET DEFAULT VALUES
    // dialogRef.disableClose = true; // do not close by clicking off by default
    try {
      const getSubdomain = function(hostname) {
        if (hostname === 'localhost') {
          return 'localhostwickeyappstore';
        } else if (hostname === 'test.wickeyappstore.com') {
          return 'testwickeyappstore';
        } else if (hostname === 'wickeyappstore.com') {
          return 'wickeyappstore';
        } else {
          const regexParse = new RegExp('[a-z\-0-9]{2,63}\.[a-z\.]{2,5}$');
          const urlParts = regexParse.exec(hostname);
          return hostname.replace(urlParts[0], '').slice(0, -1);
        }
      };
      this.appName = getSubdomain(window.location.hostname);
    } catch (getdomainerror) {
      console.error('Ads:getdomainerror', getdomainerror);
      this.appName = '';
    }
  }

  /** @ignore */
  ngOnInit() {
    // https://material.angular.io/cdk/layout/overview
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      if (result.matches) {
        // NOTE: IFF mobile, set size to full screen
        this.dialogRef.updateSize('100%', '100%');
        this.dialogRef.addPanelClass('was-shop-modal-m');
        this.add_class = 'was-shop-content-m';
      }
    });
  }

  /** @ignore */
  ngOnDestroy() {}

  /**@ignore*/
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**@ignore*/
  get loginValue() {
    return this.userService.isLoggedInObs.pipe(map((_isLogged: Boolean) => {
      if (_isLogged) {
        if (this.loggedin === false) {
          //  First time marked logged in
          // Try to load an ad.
        }
        this.loggedin = true;
        return true;
      } else {
        this.loggedin = false;
        return false;
      }
    }));
  }

  /**@ignore*/
  get isFreeCoinPanel() {
    return this.userService.freebieSettings.pipe(map((_freesetting: any) => {
      this.hasAds = _freesetting.hasAds;
      if (this.hasAds === true) {
        this.initRewardedVideo();
      }
      this.hasOfferwall = _freesetting.hasOfferwall;
      if (_freesetting.hasAds === true || _freesetting.hasOfferwall === true) {
        return true;
      } else {
        return false;
      }
    }));
  }
  /**@ignore*/
  openedFreeCoinsPanel() {
    // if (this.loggedin === true) {
    //   if (this.vastAdTag) {
    //     this.loadVASTAd();
    //   }
    // }
    this.configRewardedVideo();
  }
  /**@ignore*/
  closedFreeCoinsPanel() {
    // if (this.vastAdTag) {
    //   this.adnotready = true;
    //   if (this.vastplayer) {
    //     this.vastplayer.stopAd();
    //   }
    // }
  }
  /**@ignore*/
  createVastplayer_1() {
    if (this.vastplayer === undefined) {
      // console.log('create vast player');
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
      // console.log('reuse vast player'); // BUT have to reset these listeners else they will not happen
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
  loadVASTAd() {
    this.createVastplayer_1();

    this.addBtnText = 'Checking for Ad';
    this.ref.detectChanges();
    this.vastplayer.load(this.vastAdTag
    ).then((_vastobj) => {
      this.adnotready = false;
      this.addBtnText = 'Watch Ad';
      this.ref.detectChanges();
      // TODO: Get currently playing video ID, I don't know if this is correct or just the first ad ID.
      this.vastAdID = _vastobj.vast.ads[0].id;
    }).catch((reason) => {
      console.log('watchAd error: ', reason);
      const noAdsError = /AdError 1009/gi; // g=global, i=case insensitive
      const noAds2Error = /Reduce of empty array with no initial value/gi;
      const genericError = /Request has been terminated/gi;

      const errorstring = String(reason);
      if (errorstring.search(noAdsError) > -1 || errorstring.search(noAds2Error) > -1) {
        this.addBtnText = 'Loading Ad';
        this.ref.detectChanges();
      } else if (errorstring.search(genericError) > -1) {
        this.addBtnText = 'Request terminated. Check later';
        this.ref.detectChanges();
      } else {
        this.addBtnText = 'Unknown error. Please try later';
        this.ref.detectChanges();
      }
    });
  }

  /**@ignore*/
  watchVASTAd() {
    this.addBtnText = 'Ad Playing...';
    this.vastplayer.startAd();
    this.vastplayer.once('AdStopped', () => {
      this.addBtnText = 'YOU GOT A COIN!';
      this.ref.detectChanges();
      setTimeout(() => {
        this.loadVASTAd(); // load another ad
      }, 2500);
    });
  }

  /**@ignore*/
  configRewardedVideo() {
    // console.log('configRewardedVideo');
    (<any>window).myAd44653 = (<any>window).Vijs.setAD({
      unitid: 44653,
      loadedCallback: () => {
        console.log('load success');
        this.rewardedVideoNOTReady = false;
        this.addBtnText = 'Watch Ad';
        this.ref.detectChanges();
      },
      errorCallback: (msg) => {
        console.log('errorCallback');
        console.log('msg', msg);
        this.rewardedVideoNOTReady = true;
        this.addBtnText = 'Loading Ad';
        this.ref.detectChanges();
      },
      rewardedCallback: (reward_name, reward_amount) => {
        console.log('rewardedCallback', reward_name, reward_amount);
        this.userService.adVideoEnd('mintegral ads');

        this.addBtnText = 'YOU GOT A COIN!';
        this.ref.detectChanges();
        setTimeout(() => {
          this.addBtnText = 'Watch Ad'; // load another ad
          this.ref.detectChanges();
        }, 2500);
      }
    });
  }

  /**@ignore*/
  initRewardedVideo() {
    if ((<any>window).Vijs && !(<any>window).myAd44653) {
      // console.log('initRewardedVideo', (<any>window).Vijs);
      this.configRewardedVideo();
    }
  }
  /**@ignore*/
  watchRewardedVideo() {
    // console.log('myAd44653', (<any>window).myAd44653, (<any>window).Vijs);
    // console.log((<any>window).Vijs.Offer.adUnitArray);
    // console.log((<any>window).Vijs.Offer.adUnitArray[0].videoPlayer.videoUrl);
    if ((<any>window).myAd44653) {
      if ((<any>window).myAd44653.show) {
        (<any>window).myAd44653.show();
        this.userService.adVideoStart('mintegral ads');
      }
    }
  }
  /**@ignore*/
  opensso() {
    this.userService.opensso();
  }
}
