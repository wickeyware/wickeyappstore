/* tslint:disable: member-ordering forin */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes, AnimationEvent } from '@angular/animations';
import { Subscription } from 'rxjs/Rx';

import { ApiConnectionService } from '../../../api-connection.service';
import { LocalStorageService } from '../../../local-storage.service';
import { User, ErrorTable } from '../../../app.models';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { customValidator } from '../../../custom-validator.directive';
/**
 * Shows login popover.
 *
 * @param {User} user OPTIONAL The current user object, if not passed in, loads from db
 * @param {function} close OPTIONAL Emits logged in user email to function on successful login
 *
 * @example
 * Add this wherever you want to display the login button
 * <was-popover-login [user]="user" (close)="closeOnboardScreen($event)"></was-popover-login>
 *
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
  @Input() public hidden: false; // can choose to make the button invisiblemakewhite
  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'out'; // this dictates the animation state of the actual window
  public showOverlay: number = null; // this dictates whether or not to show the overlay window

  public showLoginState: string = null;
  public showTokenState: string = null;
  public sendButtonText = 'Login';
  public sendEmailState = 'inactive';
  public sendTokenState = 'inactive';
  public token = '';
  public email_term: string;
  public token_term: string;

  public social_site: string;
  public game_name: string;
  public version: number;

  public busymessage = 'Sending your token...';
  busyEmail: Subscription;
  busyToken: Subscription;

  public alert_table: ErrorTable;
  public emailForm: FormGroup;
  public tokenForm: FormGroup;

  constructor(
    private apiConnectionService: ApiConnectionService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // console.log('ngOnInit - SSO');
    if (this.showOverlay && this.user === undefined) {
      console.log('WASlogin: load user');
      this.localStorageService.get('was-user').then((value: any) => this.user = value as User).then(() => {
        this.buildPageForms();
      });
    } else {
      // console.log('WASlogin: user passed in', this.showOverlay, this.user);
      // this.buildPageForms();
      this.localStorageService.get('was-user').then((value: any) => this.user = value as User).then(() => {
        this.buildPageForms();
      });
    }
  }

  buildPageForms() {
    this.buildEmailForm();
    this.buildTokenForm();
    this.checkLoggingIn();
  }
  checkLoggingIn() {
    setTimeout(() => {
      if (this.user.logging_in) {
        // console.log('ngOnInit: show SSO');
        // then show the SSO
        this.buttonClick();
        this.showTokenState = 'sent';
        this.sendButtonText = 'Send it again';
        this.sendEmailState = 'inactive';
        this.email_term = this.user.token_email;
      }
    }, 1000);
  }

  buildEmailForm(): void {
    this.emailForm = this.fb.group({
      'email': [this.user.email, [
        Validators.required,
        customValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)]
      ]
    });
    this.emailForm.valueChanges.subscribe(data => this.onEmailValueChanged(data));
    this.onEmailValueChanged(); // (re)set validation messages now
  }
  onEmailValueChanged(data?: any) {
    if (!this.emailForm) { return; }
    const form = this.emailForm;

    for (const field in this.formEmailErrors) {
      // clear previous error message (if any)
      this.formEmailErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationEmailMessages[field];
        for (const key in control.errors) {
          this.formEmailErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  // Add each of the form fields here that have validation
  formEmailErrors = {
    'email': '',
  };
  // Add all the possible errors for each form field
  validationEmailMessages = {
    'email': {
      'required': 'Email is required.',
      'minlength': 'Email must be at least 4 characters long.',
      'forbiddenValue': 'Invalid email format.'
    }
  };

  buildTokenForm(): void {
    this.tokenForm = this.fb.group({
      'token': [this.token, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        customValidator(/^\d+$/i)]
      ]
    });
    this.tokenForm.valueChanges.subscribe(data => this.onTokenValueChanged(data));
    this.onTokenValueChanged(); // (re)set validation messages now
  }
  onTokenValueChanged(data?: any) {
    if (!this.tokenForm) { return; }
    const form = this.tokenForm;

    // console.log('onTokenValueChanged');
    for (const field in this.formTokenErrors) {
      // clear previous error message (if any)
      this.formTokenErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationTokenMessages[field];
        for (const key in control.errors) {
          this.formTokenErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  // Add each of the form fields here that have validation
  formTokenErrors = {
    'token': '',
  };
  // Add all the possible errors for each form field
  validationTokenMessages = {
    'token': {
      'required': 'Enter your token.',
      'minlength': 'Token must be 6 digits.',
      'maxlength': 'Token must be 6 digits.',
      'forbiddenValue': 'Numbers 1-9 only.'
    }
  };


  onAlertClose(data: any): void { }
  buttonClick() {
    this.clickState = 'active'; // make the button animate on click
    if (this.overlayState === 'out') {
      this.showOverlay = 1; // show the overlay
      this.overlayState = 'in'; // set it to animate in
      // // show token input, if logging in
      // if (this.user.logging_in === true) {
      //   this.showTokenState = 'sent';
      // } else {
      //   this.showTokenState = null;
      // }
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
    // Set logging in process off //
    this.user.logging_in = false;
    this.localStorageService.set('was-user', this.user);
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
      setTimeout(() => {
        if (this.showTokenState) {
        } else {
          // console.log('set to email focus');
          document.getElementById('emailInput').focus();
        }
      }, 250);
    }
  }
  // this shows the token field
  tokenAnimationDone(event: AnimationEvent) {
    // console.log('tokenanimation', event);
    if (event.toState === 'inactive') {
      setTimeout(() => {
        // console.log('set to token focus');
        this.token_term = '';
        const tok = document.getElementById('tokenInput');
        tok.focus();
      }, 250);
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
    this.busyEmail = this.apiConnectionService
      .tokenPerson(email)
      .subscribe((res) => {
        this.alert_table = {
          title: 'Check email (' + email + ')',
          message: 'The login token was sent. Enter it in token field to finish the login.',
          button_type: 'btn-success', header_bg: '#66BB6A', header_color: 'black',
          helpmessage: [],
          randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
        };
        this.user.logging_in = true;
        this.localStorageService.set('was-user', this.user);

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
    this.busyToken = this.apiConnectionService
      .verifyPerson(this.user.token_email, verification_token, this.version)
      .subscribe((res) => {
        // TODO: Handle results
        // Standard return: signature, paypal, allow_reward_push, next_reward, coins, isPro, user_id
        // PLUS: freebie_used, settings, inapps, rated_app
        console.log('WASlogin: verifyPerson RETURN:', res);
        // Set logging in process off //
        this.user.logging_in = false;
        this.user.user_id = res.user_id;
        this.user.email = res.email;
        this.user.coins = res.coins;
        this.user.created_time = res.created_time;
        this.user.freebie_used = res.freebie_used;
        this.user.settings = res.settings;
        // UPDATE USER //
        this.localStorageService.set('was-user', this.user).then(() => {
          this.sendButtonText = 'Login';
          this.showTokenState = null;
          this.sendTokenState = 'inactive';
          this.token = '';
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
        this.localStorageService.set('was-user', this.user).then(() => {
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

