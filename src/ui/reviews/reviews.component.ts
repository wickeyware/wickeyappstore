import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes, AnimationEvent } from '@angular/animations';
import { WASAlertComponent } from '../../ui/popover/popover-alert/popover-alert.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'was-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
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
    ])
  ]
})

export class ReviewsComponent implements OnInit {
  @ViewChild(WASAlertComponent) wasalert: WASAlertComponent;
  @Input() public store_app: any;
  @Output() changeReviewState = new EventEmitter<string>();
  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'out'; // this dictates the animation state of the actual window

  public stars = 4.5;
  public showstars;
  public appID;

  busy: Subscription;

  constructor(
  ) { }

  // https://stackoverflow.com/questions/19390644/round-number-to-nearest-5-decimal
  roundHalf(n: number): number {
    return parseFloat((Math.round(n * 2) / 2).toFixed(1));
  }
  ngOnInit() {
    if (this.store_app.review_average) {
      this.showstars = true;
      this.stars = this.roundHalf(this.store_app.review_average);
      this.appID = this.store_app.id;
    }
  }

  buttonClick() {
    this.clickState = 'active'; // make the button animate on click

    if (this.overlayState === 'out') {
      this.overlayState = 'in'; // set it to animate in
    } else {
      this.overlayState = 'out';
    }

  }
  // this animates the buttonClick Over
  buttonClickAnimationDone(event: AnimationEvent) {
    console.log('buttonClickAnimationDone',this.clickState ,this.overlayState);
    if (this.clickState === 'active') {
      this.clickState = 'inactive'; // make the button animate back
      this.changeReviewState.emit('open');
    }
  }
  closeOverlay(): void {
    this.overlayState = 'out';
  }
  catchClick(event: any): void {
    event.stopPropagation();
  }
  // this closes the window after the animation is done
  overlayAnimationDone(event: AnimationEvent) {
    if (event.toState === 'out') {
    } else if (event.toState === 'in') {
      // the window is loaded
    }
  }

}

