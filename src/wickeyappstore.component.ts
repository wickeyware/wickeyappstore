import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationEvent, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { ApiConnectionService } from './api-connection.service';
import { LocalStorageService } from './local-storage.service';
import { UserService } from './user.service';
import { User, ErrorTable } from './app.models';

// TODO: Create service that gets/sets user, it will get the user from LocalStorage

const DEFAULT_APP_LIST = [
  {
    'app_url': 'https://youtube.instaboost.social/', 'category': 7, 'is_featured': false, 'app_video': null,
    'name': 'Instaboost for Youtube',
    'title': `Get 1000's of Youtube Views, Likes, Subscribers, Shares, Favorites, and even Dislikes for YouTube, quickly, easily, and safely. Anonymous boost - NO password required!`,
    'text': `Youtube rewards videos and channels that are already popular by recommending them to people who might be interested in them. Boosting essentially causes the recommendation algorithm to kick in and show your content to many more people. In addition to that, people implicitly trust content that has lots of likes, so a boost is valuable in multiple ways. Get a jump start on your social media presence, and boost today!`,
    'coins': 0, 'screenshot_1': 'https://i.imgur.com/waPPNBt.png', 'screenshot_3': null, 'screenshot_2': null,
    'reviews': [], 'created_time': 1494256647,
    'owner': {
      'username': 'wickeymme', 'phone_number': '4048582928', 'freebie_used': false, 'user_id': 'wickeym',
      'app_creator': true, 'account_verified': true, 'email': 'wickeym@gmail.com', 'rated_app': false
    },
    'app_version': 0.1, 'id': 4, 'icon': 'https://i.imgur.com/waPPNBt.png'
  }];

/**
 * Shows a button when clicked will open the WickeyAppStore {@link https://www.npmjs.com/package/wickeyappstore}
 *
 * @param {function} update  Calls the update EventEmitter on update events.
 * @param {function} close  Calls the close EventEmitter on close.
 *
 * @example
 * Add to your main html component template
 * <wickey-appstore (close)="onWickeyAppStoreClose($event)"></wickey-appstore>
 *
 * @returns      The store overlay
 */
@Component({
  selector: 'wickey-appstore',
  templateUrl: './wickeyappstore.component.html',
  styleUrls: ['./wickeyappstore.component.css'],
  providers: [ApiConnectionService],
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
  @Output() close = new EventEmitter<number>();
  @Output() update = new EventEmitter<any>();
  public clickState = 'inactive'; // this dictates the state of the clickable button
  private overlayState = 'in'; // this dictates the animation state of the actual window
  public showOverlay: number = null; // this dictates whether or not to show the overlay window
  public busy: Subscription;
  public error_message: ErrorTable;
  private test_alert = 0;
  public apps = [];
  public bannerApps = [];
  public selected_app: {};
  public showCloseBtn = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private apiConnectionService: ApiConnectionService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    console.log('WAS: ngOnInit');
    this.showCloseBtn = true;
    this.localStorageService.get('was-apps')
      .then((value: any): void => {
        if (typeof value !== 'undefined') {
          this.apps = value;  // as Apps;
          // normal load
          console.log('WAS: load apps from db, refresh from server');
          this.getFeaturedGroups(false);  // UPDATE app list
        } else {
          console.log('WAS: no apps in db, get apps from server');
          this.getFeaturedGroups(false);  // UPDATE app list
        }
      }
      )
      .catch(this.handleError);
  }

  onAlertClose(data: any): void {
    if (data) {
      console.log('WAS: onAlertClose', data);
    } else {
      console.log('WAS: onAlertClose');
    }
  }
  buttonClick() {
    // document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.clickState = 'active'; // make the button animate on click
    this.showOverlay = 1; // show the overlay
    this.overlayState = 'in'; // set it to animate in
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

  getFeaturedGroups(show_spinner: boolean): void {
    if (show_spinner === false) {
      this.apiConnectionService
        .getFeaturedGroups()
        .subscribe((res) => {
          console.log('WAS: getFeaturedGroups RETURN:', res);
          this.apps = res;
          // UPDATE DB //
          this.localStorageService.set('was-apps', this.apps);
        }, (error) => {
          console.log('WAS: getFeaturedGroups ERROR:', error);
          this.apps = DEFAULT_APP_LIST;
          // TODO: USE DEFAULT LIST FOR DEV PURPOSE, REMOVE FOR PRODUCTION //
          // UPDATE DB //
          this.localStorageService.set('was-apps', this.apps);
          this.error_message = {
            title: 'Attention',
            message: error,
            header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
            helpmessage: [],
            randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
          };
        });
    } else {
      this.busy = this.apiConnectionService
        .getFeaturedGroups()
        .subscribe((res) => {
          console.log('WAS: getFeaturedGroups RETURN:', res);
          this.apps = res;
          // UPDATE DB //
          this.localStorageService.set('was-apps', this.apps);
        }, (error) => {
          console.log('WAS: getFeaturedGroups ERROR:', error);
          this.apps = DEFAULT_APP_LIST;
          // TODO: USE DEFAULT LIST FOR DEV PURPOSE, REMOVE FOR PRODUCTION //
          // UPDATE DB //
          this.localStorageService.set('was-apps', this.apps);
          this.error_message = {
            title: 'Attention',
            message: error,
            header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
            helpmessage: [],
            randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
          };
        });
    }
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
    this.router.navigate(['was', _app.slug]);
    // window.open(app_term, '_blank');
  }
  closeAppDetail(_val: number): void {
    // console.log('closed AppDetail');
  }

  inIframe(): boolean {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
  }

  closeIframe(): void {
    console.log('closeIframe');
    try {
      parent.postMessage('close', '*');
      // const someIframe = window.parent.document.getElementById('wickeyappstore');
      // someIframe.parentNode.removeChild(window.parent.document.getElementById('wickeyappstore'));
    } catch (error) {
      console.error('closeIframe', error);
    }
  }

  closeMe(): void {
    // this.closeIframe();
    // TODO: Need to still do this
    // document.getElementsByTagName('body')[0].style.overflow = 'auto';
    this.showOverlay = null;
    this.close.emit(1);
    // this.getApps();
    // this.testAlertBox();
  }

  testAlertBox() {
    this.error_message = {
      title: 'Attention!', message: 'Sorry had an oops', helpmessage: [],
      randcookie: `${Math.random()}${Math.random()}${Math.random()}`
    };
    if (this.test_alert === 0) {
    } else if (this.test_alert === 1) {
      this.error_message.button_type = 'btn-info';
      this.error_message.header_color = 'black';
      this.error_message.header_bg = '#29B6F6';
    } else if (this.test_alert === 2) {
      this.error_message.button_type = 'btn-success';
      this.error_message.header_color = 'black';
      this.error_message.header_bg = '#66BB6A';
    } else if (this.test_alert === 3) {
      this.error_message.button_type = 'btn-warning';
      this.error_message.header_color = 'black';
      this.error_message.header_bg = '#FFA726';
    } else {
      this.error_message.button_type = 'btn-danger';
      this.error_message.header_color = 'black';
      this.error_message.header_bg = '#EF5350';
      this.test_alert = 0;
    }
    this.test_alert += 1;
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
}
