import 'rxjs/add/operator/switchMap';
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { enterLeaveAnim } from '../../animations';
import { Subscription } from 'rxjs/Subscription';
import { WasAppService } from '../../was-app.service';
import { ClipboardService } from '../../clipboard.service';
import { GetCategoryPipe } from '../../pipes/get-category.pipe';
import { WASAlertComponent } from '../../ui/popover/popover-alert/popover-alert.component';
import { PopoverUpComponent } from '../../ui/popover/popover-up/popover-up.component';
// animations: [slideInDownAnimation]
@Component({
  selector: 'was-detail-page',
  templateUrl: './app-detail-page.component.html',
  styleUrls: ['./app-detail-page.component.css'],
  animations: [enterLeaveAnim]
})
export class AppDetailPageComponent implements OnInit {
  @ViewChild(WASAlertComponent) wasalert: WASAlertComponent;
  @ViewChild(PopoverUpComponent) wasup: PopoverUpComponent;
  @Output() close = new EventEmitter<string>();
  public busy: Subscription;
  public selected_app: any;
  public hasscreenshots;
  public selected_app_test = 'hello';
  public showReviews;
  private dom: Document;
  public showMe: number = null; // this dictates whether or not to show the overlay window
  // this is the container the item shows in.
  // To get a proper leave animation this container needs to stay until anim is done. That is why it is here.
  public showContainer: number = null;

public config: Object = {
    pagination: '.swiper-pagination',
    slidesPerView: 'auto',
    paginationClickable: true,
    freeMode: false
  };

  constructor(
    @Inject( DOCUMENT ) dom: Document,
    private wasAppService: WasAppService,
    private clipboardService: ClipboardService,
  ) {
    this.dom = dom;
  }

  ngOnInit() {}

  open(_app: any): void {
    // NOTE: Could pass only slug too, simply add `_slug: string` to params.
    // if ( _slug ) { this.slug = _slug; }
    // this.busy = this.wasAppService.appFromSlug(_slug).subscribe((_selected_app: any) => {
    //   console.log('AppDetailPageComponent', _selected_app);
    //   if (_selected_app[0] !== undefined) {
    //     _selected_app = _selected_app[0];
    //   }
    //   this.selected_app = _selected_app;
    //   if (this.busy) {
    //     this.busy.unsubscribe();
    //   } else {
    //     setTimeout(() => {
    //       if (this.busy) {
    //         this.busy.unsubscribe();
    //       }
    //     }, 40);
    //   }
    //   if (this.selected_app.screenshot_1) {
    //     this.hasscreenshots = true;
    //   }
    // }, (error) => {
    //   console.log('AppDetailPageComponent: ERROR:', error);
    //   this.wasalert.open(
    //     { title: 'Attention', text: error }
    //   );
    // });
    this.selected_app = _app;
    if (this.selected_app.screenshot_1) {
      this.hasscreenshots = true;
    } else {
      this.hasscreenshots = false;
    }
    this.showContainer = 1; // show the container (instantly)
    this.showMe = 1; // and show the animated window (:enter)
  }
  closeOverlay(event: any): void {
    // event.stopPropagation();
    this.showMe = null; // begins the (:leave) anim
  }
  // this closes the window after the animation is done
  overlayAnimationDone(event: AnimationEvent) {
    if (event.toState === 'void') {
      this.showContainer = null; // closes the container (instant)
       // this is where it notifes the parent that the message is closed (if we want to implement)
       this.close.emit('close');
    } else if (event.fromState === 'void') {
      // when it is finished opening
    }
  }

  private handleError(error: any): Promise<any> {
    // .catch(this.handleError);
    console.error('An error occurred', error);  // for demo purposes
    return Promise.reject(error.message || error);
  }

  performCopyLink() {
    let wasSuccessful = false;
    const shareLink = this.dom.querySelector('.was-share-link');
    const userAgent = navigator.userAgent || navigator.vendor || (<any>window).opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(<any>window).MSStream) {
      const range = this.dom.createRange();
      range.selectNode(shareLink);
      window.getSelection().addRange(range);
      console.log(shareLink);
      (<any>shareLink).setSelectionRange(0, 999999);
      wasSuccessful = this.dom.execCommand('copy');
      console.log('iOS Copy email command was ', (wasSuccessful ? 'successful' : 'unsuccessful'));
      window.getSelection().removeAllRanges();
    } else {
      (<any>shareLink).select();
      wasSuccessful = this.dom.execCommand('copy');
      console.log('Copy was ', (wasSuccessful ? 'successful' : 'unsuccessful'));
    }
    if (wasSuccessful === false) {
      throw({name: 'CopyError', message: 'unsuccessful copy'});
    }
    (<any>shareLink).blur();
    // scroll back to top
    window.scrollTo(0, 0);
    this.wasup.open('Link Copied', 'Copied link to clipboard!', 'fa fa-share fa-3x');
  }

  onShareBtn() {
    try {
      this.performCopyLink();
    } catch (shareError) {
      console.error('onShareBtn', shareError);
      this.wasalert.open(
        { title: 'Copy Error', text: `Share link is: https://wickeyappstore.com/app/${this.selected_app.slug}` }
      );
    }
    // const _app_url = `https://wickeyappstore.com/app/${this.selected_app.slug}`;
    // this.clipboardService.copy(_app_url).then((val: string) => {
    //   this.wasup.open('Link Copied', 'Copied link to clipboard!', 'fa fa-share fa-3x');
    //   console.log('Copied link to clipboard', _app_url);
    // }).catch((err: any) => {
    //   console.error('onShareBtn', err);
    // });
  }

  handleReviews(_state: string) {
    console.log ('handle review state' , _state);
    if (_state === 'open') {
      this.showReviews = 1;
    } else {
      this.showReviews = null;
    }
  }
  getReviewTitle() {
    return this.selected_app.name;
  }

}
