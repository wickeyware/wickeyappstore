import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationEvent, keyframes } from '@angular/animations';
// import { slideInDownAnimation } from '../../../animations'; // Figure this out at some point

// use like this:
// Can pass Global style.css styles.
// allowed inputs: type, color, isModal, html
//  <was-popover-base [isModal]="false"
//  html='<div class="popover-title">Love the </div><div class="popover-body">{{user.coins}} details a bunch of stuff!</div>'
//  ></was-popover-base>

@Component({
  selector: 'was-popover-base',
  templateUrl: './popover-base.component.html',
  styleUrls: ['./popover-base.component.css'],
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
export class PopoverBaseComponent implements OnInit {
  @Input() public type = 'info'; // can be info or custom. Custom needs to pass in an image file. ****Not yet configured
  @Input() public color = '#006AEB'; // default to blue
  @Input() public isModal = false; // if this is modal, then covers the whole screen with a background
  @Input() public html = ''; // this is the html to go in the container body
  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'out'; // this dictates the animation state of the actual window
  public showOverlay: number = null; // this dictates whether or not to show the overlay window

  constructor(
  ) {
  }

  ngOnInit() {
  }

  buttonClick() {
    this.clickState = 'active'; // make the button animate on click
    if (this.overlayState === 'out') {
      this.showOverlay = 1; // show the overlay
      this.overlayState = 'in'; // set it to animate in
    } else {
      this.overlayState = 'out';
    }

  }
  // this animates the buttonClick Over
  buttonClickAnimationDone(event: AnimationEvent) {
    if (this.clickState === 'active') {
      this.clickState = 'inactive'; // make the button animate back
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
      this.showOverlay = null;
    }
  }


}
