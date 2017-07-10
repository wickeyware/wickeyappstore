import { Component, EventEmitter, OnInit, Input, Output, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Rx';
// TODO: Can also do idb-keyval/dist/idb-keyval-min.js
// http://stackoverflow.com/questions/31173738/typescript-getting-error-ts2304-cannot-find-name-require
// const idbKeyval = require('../../node_modules/idb-keyval/idb-keyval.js');
// const idbKeyval = require('../../node_modules/idb-keyval/dist/idb-keyval-min.js');

import { ApiConnectionService } from './api-connection.service';
import { ErrorTable } from './app.models';

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

@Component({
  selector: 'wickey-appstore',
  templateUrl: './wickeyappstore.component.html',
  styleUrls: ['./wickeyappstore.component.css'],
  providers: [ApiConnectionService]
})
export class WickeyAppStoreComponent implements OnInit, OnDestroy {
  @Input() public showWickeyAppStore: number;
  @Output() close = new EventEmitter<number>();
  public busy: Subscription;
  public error_message: ErrorTable;
  private test_alert = 0;
  title = 'apps yo';
  public user = {};
  public apps = [];
  public selected_app: {};
  public showApp = null; // dictate if the app detail page shows up
  public showCloseIframeBtn = false;

  constructor(
    private apiConnectionService: ApiConnectionService
  ) { }

  ngOnInit(): void {
    console.log('WickeyAppStoreComponent: ngOnInit');
    this.showCloseIframeBtn = true;  // this.inIframe();
    this.get_apps();
    // idbKeyval.get('apps')
    //   .then((value: any): void => {
    //     if (typeof value !== 'undefined') {
    //       this.apps = value;  // as Apps;
    //       // normal load
    //       console.log('load apps from db, refresh from server');
    //       this.get_apps();  // UPDATE app list
    //     } else {
    //       // create new user
    //       console.log('no apps in db, get apps from server');
    //       this.get_apps();
    //     }
    //   }
    //   )
    //   .then(() => console.log('WickeyAppStoreComponent: db', this.user))
    //   .catch(this.handleError);
    // idbKeyval.get('user')
    //   .then((value: any): void => {
    //     if (typeof value !== 'undefined') {
    //       this.user = value;  // as User;
    //       // normal load
    //       console.log('load user from db');
    //       // this.createPerson();  // UPDATE user
    //     } else {
    //       // create new user
    //       console.log('create new user');
    //       // this.createNewUser();
    //     }
    //   }
    //   )
    //   .then(() => console.log('WickeyAppStoreComponent: db', this.user))
    //   .catch(this.handleError);
  }
  goBack(): void {
    // this.location.back();
    // TODO: hide modal
    this.showWickeyAppStore = null;
    this.close.emit(1);
  }

  updateParentHeight(): void {
    const height = document.documentElement.scrollHeight;
    console.log('Resizing to ' + height);
    parent.postMessage(height, '*');
  }

  ngOnDestroy(): void {
    console.log('WickeyAppStoreComponent ngOnDestroy');
    // idbKeyval.set('user', this.user);
  }

  private handleError(error: any): Promise<any> {
    // .catch(this.handleError);
    console.error('An error occurred', error);  // for demo purposes
    return Promise.reject(error.message || error);
  }

  get_apps(): void {
    this.busy = this.apiConnectionService
      .get_apps()
      .subscribe((res) => {
        console.log('get_apps RETURN:', res);
        this.apps = res;
        setTimeout(this.updateParentHeight, 200);
        // UPDATE DB //
        // idbKeyval.set('apps', this.apps);
      }, (error) => {
        console.log('get_apps ERROR:', error);
        this.apps = DEFAULT_APP_LIST;
        this.updateParentHeight();
        // TODO: USE DEFAULT LIST FOR DEV PURPOSE, REMOVE FOR PRODUCTION //
        // UPDATE DB //
        // idbKeyval.set('apps', this.apps);
        this.error_message = {
          title: 'Attention',
          message: error,
          header_bg: '#F44336', header_color: 'black', button_type: 'btn-danger',
          helpmessage: [],
          randcookie: `${Math.random()}${Math.random()}${Math.random()}`,
        };
      });
  }

  showAppDetail = (_app: any) => {
    this.selected_app = _app;
    this.showApp = 1;
    console.log(this.showApp);
    // window.open(app_term, '_blank');
  }
  closeAppDetail(_val: number): void {
    console.log('closed AppDetail');
    this.showApp = null;
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
    this.goBack();
    // this.get_apps();
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
}
