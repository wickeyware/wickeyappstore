import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes, AnimationEvent } from '@angular/animations';
import { Subscription } from 'rxjs/Rx';

import { ApiConnectionService } from '../../../api-connection.service';
import { LocalStorageService } from '../../../local-storage.service';
import { User, ErrorTable } from '../../../app.models';

/**
 * Shows login popover.
 * EXAMPLE: <was-popover-login [user]="user" (close)="closeOnboardScreen($event)"></was-popover-login>
 *
 * @param {User} user The current user object
 * @param {function} close Emits logged in user email to function on successful login
 * @export
 * @class PopoverLoginComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'was-popover-login',
  templateUrl: './popover-login.component.html',
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
    trigger('sendAnimation', [
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
    trigger('sendTokenAnimation', [
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
export class PopoverLoginComponent implements OnInit {
  @Output() close: EventEmitter<string> = new EventEmitter();
  @Input() public user: User;
  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'out'; // this dictates the animation state of the actual window
  public showOverlay: number = null; // this dictates whether or not to show the overlay window

  public showLoginState: string = null;
  public showTokenState: string = null;
  public sendButtonText = 'Login';
  public sendEmailState = 'inactive';
  public sendTokenState = 'inactive';

  public social_site: string;
  public game_name: string;
  public version: number;

  busy: Subscription;

  public alert_table: ErrorTable;


  constructor(
    private apiConnectionService: ApiConnectionService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
  }
  onAlertClose(data: any): void { }
  buttonClick() {
    this.clickState = 'active'; // make the button animate on click
    if (this.overlayState === 'out') {
      this.showOverlay = 1; // show the overlay
      this.overlayState = 'in'; // set it to animate in
      // show token input, if logging in
      if (this.user.logging_in === true) {
        this.showTokenState = 'sent';
      } else {
        this.showTokenState = null;
      }
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

  isEmailButtonDisabled() {
    if (this.sendEmailState === 'active') {
      return true;
    } else {
      return false;
    }
  }
  isTokenButtonDisabled() {
    if (this.sendTokenState === 'active') {
      return true;
    } else {
      return false;
    }
  }

  tokenPerson(email: string): void {
    this.user.token_email = email;
    this.sendEmailState = 'active';
    this.busy = this.apiConnectionService
      .tokenPerson(email)
      .subscribe((res) => {
        // TODO: Handle results
        // message
        // console.log(res);
        this.alert_table = {
          title: 'Check email (' + email + ')',
          message: 'The login token was sent. Enter it in token field to finish the login.',
          button_type: 'btn-success', header_bg: '#66BB6A', header_color: 'black',
          helpmessage: [],
          randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
        };
        this.user.logging_in = true;
        this.localStorageService.set('user', this.user);

        this.showTokenState = 'sent';
        this.sendButtonText = 'Resend the login token';
        this.sendEmailState = 'inactive';
      }, (error) => {
        // <any>error | this casts error to be any
        this.alert_table = {
          title: 'Attention!',
          message: error,
          header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
          helpmessage: [],
          randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
        };
        this.sendEmailState = 'inactive';
      });
  }

  verifyPerson(verification_token: string): void {
    this.sendTokenState = 'active';
    this.busy = this.apiConnectionService
      .verifyPerson(this.user.token_email, verification_token, this.version)
      .subscribe((res) => {
        // TODO: Handle results
        // Standard return: signature, paypal, allow_reward_push, next_reward, coins, isPro, user_id
        // PLUS: freebie_used, settings, inapps, rated_app
        console.log('verifyPerson RETURN:', res);
        // Set logging in process off //
        this.showTokenState = null;
        this.user.logging_in = false;
        this.user.user_id = res.user_id;
        this.user.email = res.email;
        this.user.coins = res.coins;
        this.user.created_time = res.created_time;
        this.user.freebie_used = res.freebie_used;
        this.user.settings = res.settings;
        // UPDATE USER //
        this.localStorageService.set('user', this.user).then(() => {
          // console.log('verifyPerson good', this.user);
          this.sendTokenState = 'inactive';
          this.closeOverlay();
          this.close.emit(this.user.email);
        });
        this.alert_table = {
          title: 'Successful login',
          message: 'Log into ' + res.email + ' success!',
          button_type: 'btn-success', header_bg: '#66BB6A', header_color: 'black',
          helpmessage: [],
          randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
        };
      }, (error) => {
        // Set logging in process off //
        this.user.logging_in = false;
        this.localStorageService.set('user', this.user).then(() => {
          // console.log('verifyPerson error', this.user);
          this.sendTokenState = 'inactive';
        });
        // <any>error | this casts error to be any
        this.alert_table = {
          title: 'Attention!',
          message: error,
          header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
          helpmessage: [],
          randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
        };
      });
  }
}

