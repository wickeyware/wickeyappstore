import { Component, EventEmitter, OnInit, Output, Input, OnDestroy, ViewChild, Inject } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationEvent, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from './user.service';
import { WasAppService } from './was-app.service';
import { User, AppGroup, App } from './app.models';
import { AppDetailPageComponent } from './display-apps/app-detail-page/app-detail-page.component';
import { PopoverUpComponent } from './ui/popover/popover-up/popover-up.component';
import { PopoverLoginComponent } from './ui/popover/popover-login/popover-login.component';
import { WASAlertComponent } from './ui/popover/popover-alert/popover-alert.component';

import { WasUp } from './ui/popover/wasup/wasup.dialog';
import { WasAlert } from './ui/popover/wasalert/wasalert.dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/**
 * Shows a button when clicked will open the WickeyAppStore {@link https://www.npmjs.com/package/wickeyappstore }
 *
 * @param {function} close  Calls the close EventEmitter on close.
 *
 * @example
 * Add to your main html component template
 * <wickey-appstore (open)="gamePause()" (close)="gameResume()"></wickey-appstore>
 * <wickey-appstore initialPosition="topRight"></wickey-appstore> topLeft/topRight/bottomLeft/bottomRight
 *
 * @returns      The store overlay
 */
@Component({
  selector: 'wickey-appstore',
  templateUrl: './wickeyappstore.component.html',
  styleUrls: ['./wickeyappstore.component.css'],
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
export class WickeyAppStoreComponent implements OnInit, OnDestroy {
  @Output() open = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Input() public initialPosition = 'bottomLeft'; // bottomLeft, bottomRight, topLeft, topRight
  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'in'; // this dictates the animation state of the actual window
  public showOverlay: number = null; // this dictates whether or not to show the overlay window
  public busy: Subscription;
  private test_alert = 0;
  public apps = [];
  public bannerApps = [];
  public selected_app: {};
  public selectedAppList: AppGroup;
  public showCloseBtn = true;
  public writeAReview = null;
  public showVerticalList: boolean; // dictate if the full screen vertical list is shown
  @ViewChild(AppDetailPageComponent) appDetailPage: AppDetailPageComponent;
  @ViewChild(PopoverUpComponent) wasup: PopoverUpComponent;
  @ViewChild(WASAlertComponent) wasalert: WASAlertComponent;
  @ViewChild(PopoverLoginComponent) waslogin: PopoverLoginComponent;

  // Add the main menu button

  public WAS_wings = [
    {
      'title': 'Leave a Review',
      'color': '#ea2a29',
      'icon': {
        'name': 'fa fa-send',
      },
      'name': 'review',
    },
    {
      'title': 'Open the Store',
      'color': '#f16729',
      'icon': {
        'name': 'fa fa-shopping-bag'
      },
      'name': 'store',
    }
  ];

  public WAS_gutter = { top: 10, left: 10, right: 10, bottom: 30 };

  public WAS_startAngles = {
    topLeft: 20,
    topRight: 130,
    bottomRight: 186,
    bottomLeft: 324
  };
  // add as a function so we can edit the starting location
  WAS_options(): any {
    return {
      radius: 235,
      defaultPosition: this.initialPosition,
      buttonOpacity: 0.85,
      defaultOpen: false,
      spinable: false
    };
  }
  public WASMenuClick(open: any) {
    // returns true or false
  }
  public WASWingClick(event: any) {
    // returns the 'wings' object of the clicked
    if (event.name === 'review') {
      console.log('leave a review');
      this.openReview();
    } else if (event.name === 'store') {
      console.log('open was');
      this.showOverlay = 1; // show the overlay
      this.overlayState = 'in'; // set it to animate in
    }
  }

  constructor(
    private userService: UserService,
    private wasAppService: WasAppService,
    public dialog: MatDialog
  ) {
    this.showVerticalList = false;
  }


  ngOnInit(): void {
    console.log('WAS: ngOnInit');
    this.showCloseBtn = true;
    this.getFeaturedGroups();
  }
  openwasup(): void {
    const thiswasup = this.dialog.open(WasUp, {
      width: '300px',
      data: { title: 'Review Sent', icon: 'edit', body: 'Thanks for your feedback.'}
    });
    thiswasup.disableClose = false;
  }
  openReview(): void {
    if (this.isVerifiedUser()) {
      this.wasalert.open(
        { title: 'Login to leave a Review', text: 'Do you wish to log in?', btn: { title: 'Login', action: 'login' } } // Login error
      );
    } else {
      this.writeAReview = 1;
      this.open.emit(); // send back a message that full screen portion of the app store is opening
    }
  }
  closeLoginScreen(_data?: any) {
    // this only returns if logged in. But double check by testing if emailed returned
    if (this.isEmpty(_data) === false) {
      this.openReview();
    }
  }
  closeReviewScreen(message: string): void {
    console.log('the review screen was closed', message);
    if (message === 'success') {
      this.openwasup();
    }
    this.writeAReview = null;
    this.close.emit(); // send back a message that full screen portion of the app store is closed
  }

  // test if the string is empty or null
  isEmpty(str: string): boolean {
    return (!str || 0 === str.length);
  }

  isVerifiedUser(): boolean {
    if (this.userService.userObject) {
      console.log('isVerifiedUser:', this.userService.userObject.email);
      if (this.isEmpty(this.userService.userObject.email) === false) {
        return false;
      } else {
        return true;
      }
    } else {
      console.log('isVerifiedUser: not yet loaded');
      return false;  // User not yet loaded
    }
  }
  closealert(action: string) {
    console.log('alert was closed', action);
    if (action === 'login') {
      this.waslogin.buttonClick();
    }
  }

  buttonClick() {
    // document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.clickState = 'active'; // make the button animate on click
    this.showOverlay = 1; // show the overlay
    this.overlayState = 'in'; // set it to animate in

    this.open.emit(); // send back a message that full screen portion of the app store is opening
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
      this.closeMe();
    }
  }

  ngOnDestroy(): void {
    console.log('WAS ngOnDestroy');
  }

  private handleError(error: any): Promise<any> {
    // .catch(this.handleError);
    console.error('WAS: An error occurred', error);  // for demo purposes
    return Promise.reject(error.message || error);
  }

  getFeaturedGroups(): void {
    this.wasAppService.appGroups.subscribe((res) => {
      console.log('WAS: appGroups RETURN:', res);
      this.apps = res;
    }, (error) => {
      console.log('WAS: appGroups ERROR:', error);
      this.wasalert.open(
        { title: 'Attention', text: error } // Login error
      );
    });
  }
  // loop through the featured apps and get the banner group
  getBannerFeaturedApps() {
    for (const group of this.apps) {
      if (group.title === 'Featured') {
        return group.apps;
      }
    }
  }
  // loop through the featured apps and remove the banner group
  getFeaturedApps() {
    let otherapps = [];
    for (const group of this.apps) {
      if (group.title !== 'Featured') {
        otherapps.push(group);
      }
    }
    return otherapps;
  }

  showAppDetail = (_app: any) => {
    this.selected_app = _app;
    // this.handleAppDetail('open');
    this.appDetailPage.open(_app);
  }
  onAppDetailClose(_state: string) {
    console.log('onAppDetailClose', _state);
    this.selected_app = null;
  }
  closeMe(): void {
    this.showOverlay = null;
    this.close.emit(); // send back a message that full screen portion of the app store is closed
  }

  // POPOVER //
  logoutUser(_data?: any) {
    if (_data) {
      console.log('WAS: logoutUser', _data);
    } else {
      console.log('WAS: logoutUser');
    }
  }
  closeOnboardScreen(_data?: any) {
    if (_data) {
      console.log('WAS: closeOnboardScreen', _data);
    } else {
      console.log('WAS: closeOnboardScreen');
    }
  }

  showAppList = (_appList: AppGroup) => {
    console.log('showVerticalListApps');
    this.selectedAppList = _appList;
    this.showVerticalList = true;
  }
  closeVerticalListApps(_val: number): void {
    console.log('closeVerticalListApps');
    this.showVerticalList = false;
  }
}
