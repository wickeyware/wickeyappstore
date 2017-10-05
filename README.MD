# WickeyAppStore
Reach the next One Billion users, AppStore for Progressive WebApps.

## Tutorial App
Check out a tutorial app:  
REPO: https://github.com/wickeyware/was-tutorial/  
LIVE DEMO: https://wickeyware.github.io/was-tutorial/

## App Store
https://wickeyappstore.com/

## Progressive Web App Store 
Reach the next One Billion users. WickeyAppStore is a full featured App Store for **PWA** web-apps. A **PWA** makes use of new Web and JavaScript API to deliver an experience similar to a native app on the web.

Apps on the WickeyAppStore must meet quality and security requirements:

* **Safety** - must be served via HTTPS to ensure that the real content has not been tampered.
* **Responsive** - can fit all resolutions like desktop, tablet and mobile.
* **Progressive**- work in all modern browsers because they use progressive enhancement concepts.
* **Connectivity independent** - need to work on any type of connection, including offline.
* **Engageable** - using push notifications, "add to home" feature to be more app-like.

## Benefits

* **Trust** - each app is vetted and approved manually.  Only high quality apps are featured on the WickeyAppStore.
* **Single Sign On** - you do not need to sign into apps you do not know or trust. Your WickeyAppStore SSO is all you need.
* **Monetization** - we provide monetization tools including in-app purchases and ads.
* **Traffic** - we feature unique and cool apps, and all apps benefit from being under one umbrella. 

## Submit your app

If you have an app you want to submit, email us at [wickeyappstore@gmail.com](mailto:wickeyappstore@gmail.com). 

**NOTE**: Please check back frequently. We will keep this document updated all the time.


## QuickStart

To install this library, run: (NOTE: Install all dependencies)

```bash
$ npm install wickeyappstore --save
```

Link external dependencies in the header of your index.html
```html
<!-- WickeyAppStore global css-->
<link rel="stylesheet" href="https://unpkg.com/wickeyappstore@1.9.5/styles.css">
<!-- WICKEYAPPSTORE DEPENDENCY Home Screen Slider https://www.npmjs.com/package/angular2-useful-swiper -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/css/swiper.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/js/swiper.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.6/hammer.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
// Import Wickey AppStore
import { WickeyAppStoreModule } from 'wickeyappstore';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    // Specify as an import
    WickeyAppStoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once WickeyAppStoreModule is imported, you can use its components, directives and pipes in your Angular application:

```html
<!-- Put Wickey Appstore in the bootstrapped component -->
<!--******************************************
**
  IMPORTANT The lines BELOW are REQUIRED
**
***********************************************-->
<!-- A button, when clicked will show the SSO overlay screen (create or login to accounts) -->
<was-popover-login #loginpopover (close)="closeLoginScreen($event)"></was-popover-login>
<was-spinner [busy]="busy" [message]='"Please wait.."'></was-spinner>
<was-alert #wasalert (close)="closealert($event)"></was-alert>
<!-- The WAS button, when clicked will show the store. Close will be called when app store closes -->
<wickey-appstore initialPosition="bottomLeft" (close)="onWASClose($event)"></wickey-appstore>
<!--******************************************
**
  Your app goes below.
**
***********************************************-->
<h1>
  Welcome to my app: {{name}}
</h1>
```

## License

MIT © [WickeyWare, LLC](mailto:wickeyappstore@gmail.com)
