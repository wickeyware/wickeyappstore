/* tslint:disable: member-ordering forin */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes, AnimationEvent } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { WASAlertComponent } from '../../../ui/popover/popover-alert/popover-alert.component';

import { UserService } from '../../../user.service';
import { User } from '../../../app.models';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { customValidator } from '../../../custom-validator.directive';
/**
 * Shows SSO popover. Can be used to create or login to accounts via an email.
 * All logins and new emails will be verified by token, else user will stay unverified.
 *
 * @param {boolean} hidden OPTIONAL Set if text should be hidden.
 * @param {function} close OPTIONAL Emits logged in user email to function on successful login
 *
 * @example
 * Add this wherever you want to display the SSO button
 * <was-popover-login #loginpopover (close)="closeOnboardScreen($event)"></was-popover-login>
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
  @ViewChild(WASAlertComponent) wasalert: WASAlertComponent;
  @Output() close: EventEmitter<string> = new EventEmitter();
  @Input() public hidden: false; // can choose to make the button invisiblemakewhite
  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'out'; // this dictates the animation state of the actual window
  public showOverlay: number = null; // this dictates whether or not to show the overlay window

  public showTokenState: string = null;
  public sendButtonText = 'Create/Login';
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

  public emailForm: FormGroup;
  public tokenForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log('WASlogin: ngOnInit');
    this.userService.user.subscribe((usr: User) => {
      console.log('WASlogin: build forms');
      this.buildPageForms();
    });
  }

  buildPageForms() {
    this.buildEmailForm();
    this.buildTokenForm();
    this.checkLoggingIn();
  }
  checkLoggingIn() {
    setTimeout(() => {
      if (this.userService.userObject.logging_in) {
        // console.log('ngOnInit: show SSO');
        // then show the SSO
        this.buttonClick();
        this.showTokenState = 'sent';
        this.sendButtonText = 'Send it again';
        this.sendEmailState = 'inactive';
        this.email_term = this.userService.userObject.token_email;
      }
    }, 1000);
  }
  get loginMessage() {
    return this.userService.user.map((usr: User) => {
      let _loginMsg = '';
      if (usr.email && usr.email.length > 3) {
          _loginMsg = 'Login to another account?';
        } else {
          _loginMsg = 'Create an account or Login?';
        }
      return _loginMsg;
    });
  }

  buildEmailForm(): void {
    this.emailForm = this.fb.group({
      'email': [this.userService.userObject.email, [
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
    // Set logging in process off //
    this.userService.stopToken();
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
      // setTimeout(() => {
      //   if (this.showTokenState) {
      //   } else {
      //     // console.log('set to email focus');
      //     document.getElementById('emailInput').focus();
      //   }
      // }, 250);
    }
  }
  // this shows the token field
  tokenAnimationDone(event: AnimationEvent) {
    // console.log('tokenanimation', event);
    // if (event.toState === 'inactive') {
    //   setTimeout(() => {
    //     // console.log('set to token focus');
    //     this.token_term = '';
    //     const tok = document.getElementById('tokenInput');
    //     tok.focus();
    //   }, 250);
    // }
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

  goBack(): void {
    this.showTokenState = null;
  }

  tokenPerson(email: string): void {
    // NOTE: If email doesn't exist add to their account, send token, set account to verified after token entered
    this.sendEmailState = 'active';
    this.busyEmail = this.userService
      .sendToken({'token_email': email})
      .subscribe((res) => {
        let _alertMessage = 'The login token was sent. Enter it in token field to finish the login.';
        if (res.new_account) {
          _alertMessage = 'The verification token was sent. Enter it in token field to finish creating account.';
        }
        this.wasalert.open(
          { title: 'Check email (' + email + ')', text: _alertMessage } // Login error
        );
        this.showTokenState = 'sent';
        this.sendButtonText = 'Resend the login token';
        this.sendEmailState = 'inactive';
        this.token_term = ''; // clear last token if it exists.
      }, (error) => {
        // <any>error | this casts error to be any
        this.wasalert.open(
          { title: 'Attention', text: error } // Login error
        );
        this.sendEmailState = 'inactive';
      });
  }

  verifyPerson(verification_token: string): void {
    this.sendTokenState = 'active';
    this.busyToken = this.userService
      .verifyToken({'token': verification_token})
      .subscribe((res) => {
        this.sendButtonText = 'Create/Login';
        this.showTokenState = null;
        this.sendTokenState = 'inactive';
        this.token = '';
        this.closeOverlay();
        this.close.emit(res.email);
        let _alertTitle = 'Successful login';
        let _alertMessage = 'Log into ' + res.email + ' success!';
        if (res.account_created) {
          _alertTitle = 'Successfully created account';
          _alertMessage = 'Created an account with ' + res.email;
        }
        this.wasalert.open(
          { title: _alertTitle, text: _alertMessage } // Login error
        );
      }, (error) => {
        this.sendTokenState = 'inactive';
        // <any>error | this casts error to be any
        this.wasalert.open(
          { title: 'Attention', text: error } // Login error
        );
      });
  }
}

