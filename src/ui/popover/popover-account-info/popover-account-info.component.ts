import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationEvent, keyframes } from '@angular/animations';
import { ApiConnectionService } from '../../../api-connection.service';
import { LocalStorageService } from '../../../local-storage.service';
import { User, ErrorTable } from '../../../app.models';
import { Subscription } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';

/**
 * Shows WickeyAppStore user account info in popover box.
 *
 * @param {boolean} isModal OPTIONAL Show up as modal vs info box [default false (info box)]
 * @param {User} user OPTIONAL The current user object, if not passed in, loads from db
 * @param {function} signout OPTIONAL Emits to function if user signs out
 *
 * @example
 * Add this wherever you want to display the account info button
 * <was-popover-account-info [isModal]="true" [user]="user" (signout)="logoutUser($event)"></was-popover-account-info>
 *
 * @export
 * @class PopoverAccountInfoComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'was-popover-account-info',
  templateUrl: './popover-account-info.component.html',
  styleUrls: ['../popover-base/popover-base.component.css'],
  providers: [DatePipe],
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
    trigger('showEmailEditAnim', [
      transition(':enter', [
        // move the input box up to the other box
        animate(300, keyframes([
          style({ opacity: 0, transform: 'scale(.9)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(1.05)', offset: 0.35 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1.0 })
        ]))
      ]),
      transition(':leave', [
        // move the input box up to the other box
        animate(200, keyframes([
          style({ opacity: 1, transform: 'scale(1)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(1.05)', offset: 0.35 }),
          style({ opacity: 0, transform: 'scale(.8)', offset: 1.0 })
        ]))
      ]),
    ]),
  ]
})
export class PopoverAccountInfoComponent implements OnInit {
  @Input() public isModal = false; // if this is modal, then covers the whole screen with a background
  @Input() public html = ''; // this is the html to go in the container body
  @Input() public user: User;
  @Output() public signout: EventEmitter<any> = new EventEmitter();
  busy: Subscription;
  public alert_table: ErrorTable;
  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'out'; // this dictates the animation state of the actual window
  public showOverlay: number = null; // this dictates whether or not to show the overlay window
  public version = '0.5.4';

  private showEditEmailState: string = null; // this dictates whether to show the edit email field and also the anim state

  private temp_email: string;

  constructor(
    private apiConnectionService: ApiConnectionService,
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    // TODO: getEmailString still has "Cannot read property 'email' of undefined", needs to check for undefined as well
    if (this.showOverlay && this.user === undefined) {
      console.log('WASaccount: load user');
      this.localStorageService.get('was-user').then((value: any) => this.user = value as User);
    }
  }
  onAlertClose(data: any): void {
    if (data === 'button_action') {
      // this.logoutUser(data);
      console.log('WASaccount: LOG OUT USER');
    }
  }

  editEmailClick() {
    this.showEditEmailState = 'in';
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
      this.showEditEmailState = null;
    }
  }


// test if the string is empty or null
  isEmpty(str: string): boolean {
    return (!str || 0 === str.length);
  }

  canISignOut(): boolean {
    if (this.isEmpty(this.user.email) === false) {
      return true;
    } else {
      if (this.user.coins === 0) {
        // no email and no coins. Can sign out
        return true;
      } else {
        return false;
      }
    }
  }

  signoutfunc(): void {
    if (this.canISignOut() === true) {
      this.showOverlay = null;
      this.showEditEmailState = null;
      this.signout.emit('');
    } else {
      this.alert_table = {
        title: 'Set your Email',
        message: 'You cannot log out of an anonymous ' +
        'account or you will never be able to log back in. Please add a recovery email first.',
        header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
        helpmessage: [],
        randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
      };
      this.showEditEmailState = 'in';
    }
  }

  getEmailString(): string {
    if (this.user.email) {
      return this.user.email;
    } else {
      return '{ No Email Saved }';
    }
  }

  getSaveEmailButtonText(): string {
    if (this.user.email) {
      return 'Update';
    } else {
      return 'Add Email';
    }
  }

  getSignoutButtonText(): string {
    if (this.canISignOut() === false) {
      return 'How can I switch accounts';
    } else {
      return 'Log into another account';
    }
  }

  accountAge(create_time: number): string {

    const date = +new Date(create_time * 1000);
    const currentDate = +new Date();
    const milisecondsDiff = currentDate - date;
    const secondsDiff = milisecondsDiff / 1000;
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);
    if (minutesDiff < 5) {
      return 'This account is brand new';
    } else if (minutesDiff < 10) {
      return 'This account was created a few minutes ago';
    } else if (minutesDiff < 30) {
      return 'This account was created about a half hour ago';
    } else if (hoursDiff < 2) {
      return 'This account was created about an hour ago';
    } else if (hoursDiff < 6) {
      return 'This account is a few hours old';
    } else if (hoursDiff < 18) {
      return 'This account is half a day old';
    } else if (daysDiff < 2) {
      return 'This account is a day old';
    } else if (daysDiff < 5) {
      return 'This account is a few days old';
    } else if (daysDiff < 12) {
      return 'This account is about a week old';
    } else if (daysDiff < 20) {
      return 'This account is a few weeks old';
    } else if (daysDiff < 40) {
      return 'This account is about a month old';
    } else if (daysDiff < 80) {
      return 'This account is a few months old';
    } else {
      return 'Created on ' + this.datePipe.transform(create_time * 1000);
    }
  }

  updateEmail(email: string): void {
    console.log('WASaccount: updateEmail', email);
    this.temp_email = email;
    this.updateUser();
  }

  updateUser(): void {
    let apiobject = {user_id: this.user.user_id, email: this.temp_email, version: .1};
    this.showEditEmailState = null;
    this.busy = this.apiConnectionService
      .createPerson(apiobject)
      .subscribe((res) => {
        // TODO: Handle results
        // Standard return: signature, paypal, allow_reward_push, next_reward, coins, isPro, user_id
        // PLUS: freebie_used, settings, inapps, rated_app
        console.log('WASaccount: updateUser RETURN:', res);
        // NOTE: If a user has an email, the account was either verified by token or doesn't belong to someone else.
        if (res.email && res.user_id) {
          this.user.user_id = res.user_id;
        }
        this.user.email = this.temp_email;
        this.user.coins = res.coins;
        this.user.created_time = res.created_time;
        this.user.freebie_used = res.freebie_used;
        // UPDATE USER //
        this.localStorageService.set('was-user', this.user);

        this.alert_table = {
          title: 'Email updated',
          message: 'You have set your email to ' + this.user.email,
          button_type: 'btn-success', header_bg: '#66BB6A', header_color: 'black',
          helpmessage: [],
          randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
        };
        // this.goBack();
      }, (error) => {
        // <any>error | this casts error to be any
        if (typeof error === 'string' && error.startsWith('This email exists')) {
          this.alert_table = {
            title: 'Attention!',
            message: error,
            header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
            helpmessage: [],
            button_action: 'Login',
            randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
          };
        } else {
          this.alert_table = {
            title: 'Attention!',
            message: error,
            header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
            helpmessage: [],
            randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
          };
        }
      });
  }

}
