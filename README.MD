# WickeyAppStore
Reach the next One Billion users, AppStore for Progressive WebApps.

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

## Tutorial App

Check out the tutorial app: https://github.com/wickeyware/was-tutorial

## Installation

To install this library, run: (NOTE: Install all dependencies)

```bash
$ npm install wickeyappstore --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install wickeyappstore --save
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component';

// Import your library
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

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html or wherever needed -->
<h1>
  {{title}}
</h1>
<!-- Close will be called when app store closes-->
<wickey-appstore (close)="onWASClose($event)"></wickey-appstore>
<!-- A button, when clicked will show the account info modal and allow email add/edit -->
<was-popover-account-info [isModal]="true" [user]="user" (signout)="logoutUser($event)"></was-popover-account-info>
<!-- A button, when clicked will show the login overlay screen -->
<was-popover-login [user]="user" (close)="closeLoginScreen($event)"></was-popover-login>
```

Link CSS, or copy it into your styles.css:
```code
<!-- BOOTSTRAP 4 CSS (required by wickeyappstore) -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
<!-- WickeyAppStore global css-->
<link rel="stylesheet" href="https://unpkg.com/wickeyappstore@0.1.34/styles.css">
<!-- WICKEYAPPSTORE DEPENDENCY Home Screen Slider https://www.npmjs.com/package/angular2-useful-swiper -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/css/swiper.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/js/swiper.js"></script>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Michael Wickey](mailto:wickeym@gmail.com)
