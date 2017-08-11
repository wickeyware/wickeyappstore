import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes, AnimationEvent } from '@angular/animations';
import { ErrorTable } from '../../app.models';
import { Subscription } from 'rxjs/Rx';

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

  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'out'; // this dictates the animation state of the actual window
  public showOverlay: number = null; // this dictates whether or not to show the overlay window

  public social_site: string;
  public game_name: string;
  public version: number;

  busy: Subscription;

  public alert_table: ErrorTable;


  constructor(
  ) { }

  ngOnInit() {
  }
  onAlertClose(data: any): void { }
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
    } else if (event.toState === 'in') {
      // the window is loaded
    }
  }

}

