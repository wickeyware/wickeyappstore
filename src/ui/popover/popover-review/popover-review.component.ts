import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes, AnimationEvent } from '@angular/animations';
import { Subscription } from 'rxjs/Rx';

import { ApiConnectionService } from '../../../api-connection.service';
import { LocalStorageService } from '../../../local-storage.service';
import { User, ErrorTable } from '../../../app.models';
import { UserService } from '../../../user.service';

/**
 * Shows write-a-review popover.
 * EXAMPLE: <was-popover-review [showReview]="writeAReview" (close)="closeReviewScreen()"></was-popover-review>
 *
 * @param {User} user The current user object
 * @param {function} close Emits successfully closed review
 * @export
 * @class PopoverReviewComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'was-popover-review',
  templateUrl: './popover-review.component.html',
  styleUrls: ['../popover-base/popover-base.component.css'],
  animations: [

    trigger('clickButtonTrigger', [
      state('inactive', style({
        transform: 'scale(1)',
      })),
      state('active', style({
        transform: 'scale(1.2)',
      })),
      transition('inactive => active', animate('80ms ease-out')),
      transition('active => inactive', animate('80ms ease-in'))
    ]),
    // ANIMATION FOR MODAL //
    trigger('overlayAnimationTrigger', [
      state('in', style({ opacity: '1' })),
      state('out', style({ opacity: '0' })),
      transition('in => out', [
        // Animates back up and shrinks
        animate('150ms ease-out', style({ opacity: .1, transform: 'scaleX(.98) scaleY(.9)' }))
      ]),
      // This defines an animation on element create (nothing to something)
      transition(':enter', [
        // Set start style, this is a temp style only exists during the animation
        style({ opacity: .1, transform: 'scaleX(.98) scaleY(.9)' }),
        // Define the animation, define easing out back function (http://cubic-bezier.com/#.23,.55,.11,1.21)
        // Set the end style, the goal of the animation
        animate('300ms cubic-bezier(.61,.02,.44,1.01)', style({ opacity: 1, transform: 'scale(1)' })),
      ])
    ]),
    trigger('submitAnimation', [
      state('inactive', style({
        opacity: 1, transform: 'scale(1)',
      })),
      state('active', style({
        opacity: .9, transform: 'scale(.95)',
      })),
      transition('inactive => active', [
        // move the input box up to the other box
        animate('.25s cubic-bezier(.28,.87,.68,1)', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ opacity: .9, transform: 'scale(.95)', offset: 1 }),
        ]))
      ]),
      transition('active => inactive', [
        // move the input box up to the other box
        animate('.25s cubic-bezier(.28,.87,.68,1)', keyframes([
          style({ opacity: .9, transform: 'scale(.95)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 }),
        ]))
      ]),
    ]),
  ]
})
export class PopoverReviewComponent implements OnInit {
  @Output() close: EventEmitter<string> = new EventEmitter();
  @Input() public showReview: number = null; // this dictates whether or not to show the overlay window

  public error_message: any;
  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'in'; // this dictates the animation state of the actual window
  public reviewText = '';
  public titleText = '';
  public stars = 0;

  public sendButtonText = 'Send';
  public submitState = 'inactive';

  public social_site: string;
  public game_name: string;
  public version: number;

  public busyLoad: Subscription;
  public busySubmit: Subscription;
  public review_msg = '';


  constructor(
    private apiConnectionService: ApiConnectionService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    console.log('WAS Review ngOnInit:');
    // TODO: Don't allow leave review without email
    this.busyLoad = this.userService.user.subscribe((usr: User) => {
      if (usr.user_id && usr.email) {
        this.busyLoad.unsubscribe();
        this.loadReview(usr.user_id);
      }
    });
  }
  onAlertClose(data: any): void { }

  closeOverlay(): void {
    this.overlayState = 'out';
  }
  catchClick(event: any): void {
    event.stopPropagation();
  }
  // this closes the window after the animation is done
  overlayAnimationDone(event: AnimationEvent) {
    if (event.toState === 'out') {
      this.showReview = null;
      this.overlayState = 'in';
      this.close.emit(this.review_msg);
    } else if (event.toState === 'in') {
      // the window is loaded
      this.review_msg = '';
    }
  }

  clickStar(star: number): void {
    this.stars = star;
  }

  loadReview(_user_id) {
    this.busyLoad = this.apiConnectionService.getReviews(
      {'user_id': _user_id}
    ).subscribe((_reviews: any) => {
      console.log('WAS loadReview', _reviews);
      try {
        this.titleText = _reviews[0].title;
        this.reviewText = _reviews[0].text;
        this.stars = _reviews[0].rating;
      } catch (error) { }
    });
  }

  testValidReview(): void {
    if (this.stars === 0) {
      this.error_message = {
        title: 'Attention!',
        message: 'Please choose Star Rating',
        header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
        helpmessage: [],
        randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
      };
    } else {
      this.sendReview();
    }
  }

  sendReview(): void {
    console.log('send the review');
    this.submitState = 'active';

    // Need to get the stars, title, and text
    const _title = this.titleText;
    const _text = this.reviewText;
    const _rating = this.stars;

    this.busySubmit = this.userService.createReview(_title, _text, _rating)
      .subscribe((usr) => {
        console.log('WAS leaveReview: RETURN:', usr);
        // NOTE: all user APIS can return a `special_message`
        // if (usr.special_message) {
        //   this.error_message = {
        //     title: usr.special_message.title, message: usr.special_message.message,
        //     button_type: 'btn-info', header_bg: '#29B6F6', header_color: 'black',
        //     helpmessage: [],
        //     randcookie: `${Math.random()}${Math.random()}${Math.random()}`
        //   };
        // }
        this.review_msg = 'success';
        this.submitState = 'inactive';
        this.closeOverlay();
      }, (error) => {
        // <any>error | this casts error to be any
        // NOTE: Can handle error return messages
        console.log('WAS leaveReview: RETURN ERROR:', error);
        this.error_message = {
          title: 'Attention!',
          message: error,
          header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
          helpmessage: [],
          randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
        };
        this.submitState = 'inactive';
      });



  }

}


