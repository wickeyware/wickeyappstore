import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationEvent, keyframes } from '@angular/animations';
import { WasAlertTable } from '../../../app.models';


/**
 * Shows a was-up popover.
 * OPTION ONE: place 
 *    <was-alert #wasalert ></was-alert> in html file
 * Optional param:
 * Can set a close emitter. You need to do this if you add an action button, else you cannot get the action.
 *    <was-alert #wasalert (close)="closealert($event)"></was-alert>
 *
 * Call from anywhere in html. 
 *    (click)="wasalert.open({ title: 'Hey', text: 'message', btn: {title: 'title', action: 'action'}})"
 *
 * OPTION two. Show from typescript
 * Add to html file same as before
 * ...then...
 * Add the following to typescript file:
 *    import { ViewChild } from '@angular/core';
 *    import { WASAlertComponent } from './ui/popover/popover-alert/popover-alert.component';
 * under --> export class AppComponent {...}
 *    @ViewChild(WASAlertComponent) wasalert: WASAlertComponent;
 *    showalert(): void {
        this.wasalert.open({ title: 'Hey', text: 'message', btn: {title: 'title', action: 'action'}});
      }
 * @export
 * @class WASAlertComponent
 * @implements {Component, OnInit}
 */
@Component({
  selector: 'was-alert',
  templateUrl: './popover-alert.component.html',
  styleUrls: ['../popover-base/popover-base.component.css'],
  animations: [
    // ANIMATION FOR MODAL //
    trigger('enterLeaveAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleX(.98) scaleY(.9)' }),
        animate('300ms cubic-bezier(.61,.02,.44,1.01)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(.61,.02,.44,1.01)', style({ opacity: 0, transform: 'scale(.5)' })),
      ])
    ])
  ]
})
export class WASAlertComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();

  public alert: WasAlertTable = { title: 'Alert', text: 'Default Alert Message', btn: { title: 'title', action: 'action' } };
  public showMe: number = null; // this dictates whether or not to show the overlay window

  // this is the container the item shows in.
  // To get a proper leave animation this container needs to stay until anim is done. That is why it is here.
  public showContainer: number = null;
  private emitmessage = '';

  constructor(
  ) {
  }

  ngOnInit() {
  }

  open(alert: WasAlertTable): void {
    // set the optional variables
    if (alert) { this.alert = alert; }
    this.emitmessage = ''; // default
    this.showContainer = 1; // show the container (instantly)
    this.showMe = 1; // and show the animated window (:enter)
  }
  closeOverlay(): void {
    this.showMe = null; // begins the (:leave) anim
  }
  cancel(): void {
    this.emitmessage = 'cancel';
    this.closeOverlay();
  }
  action(): void {
    this.emitmessage = this.alert.btn.action;
    this.closeOverlay();
  }
  // this closes the window after the animation is done
  overlayAnimationDone(event: AnimationEvent) {
    if (event.toState === 'void') {
      this.showContainer = null; // closes the container (instant)
      // this is where it notifes the parent that the message is closed (if we want to implement)
      this.close.emit(this.emitmessage);
    } else if (event.fromState === 'void') {
      // when it is finished opening
    }
  }



}

