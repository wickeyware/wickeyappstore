import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { enterLeaveAnim } from '../../animations';
import { Subscription } from 'rxjs/Subscription';
import { WasAppService } from '../../was-app.service';
import { GetCategoryPipe } from '../../pipes/get-category.pipe';
import { WasAlert } from '../../ui/popover/wasalert/wasalert.dialog';
import { WasUp } from '../../ui/popover/wasup/wasup.dialog';
import { MatDialog, MatDialogRef } from '@angular/material';

/**
 * @module
 * @ignore
 */
@Component({
  selector: 'was-detail-page',
  templateUrl: './app-detail-page.component.html',
  styleUrls: ['./app-detail-page.component.css'],
  animations: [enterLeaveAnim]
})
export class AppDetailPageComponent implements OnInit {
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
    @Inject( DOCUMENT ) dom: any,
    private wasAppService: WasAppService,
    public dialog: MatDialog,
  ) {
    this.dom = dom;
  }

  ngOnInit() {}

  open(_app: any): void {
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
    this.dialog.open(WasUp, {data: { title: 'Link Copied', icon: 'done', body: 'Copied link to clipboard!'} });
  }

  doLinkCopy() {
    try {
      this.performCopyLink();
    } catch (shareError) {
      console.error('onShareBtn', shareError);
      this.dialog.open(WasAlert, {
        data: { title: 'Copy Error', body: 'Share link is: https://wickeyappstore.com/app/${this.selected_app.slug}', buttons: ['Okay'] }
      });
    }
  }

  onShareBtn() {
    if ((<any>navigator).share !== undefined) {
      (<any>navigator).share({
        title: this.selected_app.name,
        text: this.selected_app.title,
        url: `https://wickeyappstore.com/app/${this.selected_app.slug}`})
        .then(() => console.log('Successful share'))
        .catch((error) => {
          console.log('Error sharing', error);
          this.doLinkCopy();
        });
    } else {
      this.doLinkCopy();
    }
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
