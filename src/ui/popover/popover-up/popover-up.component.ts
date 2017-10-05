import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { enterLeaveAnim } from '../../../animations';


/**
 * Shows a was-up popover.
 *
 * @example
 * OPTION ONE: place following in component html file
 * <was-up #wasup></was-up>
 *
 * Optional param:
 * Can set a close emitter
 * <was-up #wasup (close)="closewasup()"></was-up>
 *
 * Call from anywhere in html.
 * (click)="wasup.open('title','text','fa icon')"
 *
 * @example
 * OPTION two. Show from typescript
 * Add <was-up #wasup></was-up> to html file same as before
 * ...then...
 * Add the following to typescript file:
 * import { ViewChild } from '@angular/core';
 * import { PopoverUpComponent } from './ui/popover/popover-up/popover-up.component';
 *
 * under --> export class AppComponent {...}
 * @ViewChild(PopoverUpComponent) wasup: PopoverUpComponent;
 * openwasup(): void {
 *   this.wasup.open('title', 'text', 'fa icon optional');
 * }
 *
 * @export
 * @class PopoverUpComponent
 * @implements {Component, OnInit}
 */
@Component({
  selector: 'was-up',
  templateUrl: './popover-up.component.html',
  styleUrls: ['../popover-base/popover-base.component.css'],
  animations: [enterLeaveAnim]
})
export class PopoverUpComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();
  public title = 'You there';
  public text = 'Check this out';
  public faIcon = '';
  public showMe: number = null; // this dictates whether or not to show the overlay window

  // this is the container the item shows in.
  // To get a proper leave animation this container needs to stay until anim is done. That is why it is here.
  public showContainer: number = null;

  constructor(
  ) {
  }

  ngOnInit() {
  }

  /**
   * Opens a was-up
   * @param title The was-up title
   * @param text The main body text
   * @param faIcon The font-awesome icon
   */
  open(title: string, text: string, faIcon: string): void {
    // set the optional variables
    if ( title ) { this.title = title; }
    if ( text ) { this.text = text; }
    if ( faIcon ) { this.faIcon = faIcon; }
    this.showContainer = 1; // show the container (instantly)
    this.showMe = 1; // and show the animated window (:enter)
  }
  closeOverlay(): void {
    this.showMe = null; // begins the (:leave) anim
  }
  // this closes the window after the animation is done
  overlayAnimationDone(event: AnimationEvent) {
    if (event.toState === 'void') {
      this.showContainer = null; // closes the container (instant)
       // this is where it notifes the parent that the message is closed (if we want to implement)
    } else if (event.fromState === 'void') {
      setTimeout(() => {
        this.closeOverlay();
      }, 1750);
    }
  }



}

