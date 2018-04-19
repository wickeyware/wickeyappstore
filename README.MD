# WickeyAppStore
The first AppStore for Progressive WebApps.

[![Build Status](https://travis-ci.org/wickeyware/wickeyappstore.svg?branch=master)](https://travis-ci.org/wickeyware/wickeyappstore)
[![npm version](https://badge.fury.io/js/wickeyappstore.svg)](https://badge.fury.io/js/wickeyappstore)
[![Dependency Status](https://david-dm.org/wickeyware/wickeyappstore.svg)](https://david-dm.org/wickeyware/wickeyappstore)

## Docs, Demo, & Developer Portal
DOCS: https://wickeyware.github.io/wickeyappstore/

DEMO APP: https://wickeyappstore.com/app/airhorn and corresponding repo: https://github.com/wickeyware/was-tutorial/

DEV PORTAL: https://wickeyappstore.com/app/developer-portal

## App Store
https://wickeyappstore.com/

## Progressive Web App Store 
WickeyAppStore is the first App Store for **PWA** web-apps. A **PWA** makes use of new Web and JavaScript API to deliver an experience similar to a native app on the web. Reach the next One Billion users with lightweight, platform independant, full featured, web-apps.

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
Create your app in the dev portal and use it to add meta data, in-app purchases, and so on.
Here's a link to get started: https://wickeyappstore.com/app/developer-portal


## QuickStart

Prerequisite: [nodejs](https://nodejs.org) needs to be installed on your pc.

Clone our starter project Airhorn.

Where `mywasapp` is the name of your app, replace with whatever is desired.
```bash
git clone https://github.com/wickeyware/was-tutorial.git mywasapp
```

Change to that directory
```bash
cd mywasapp/
```

Install project dependencies and run.

with [npm](https://nodejs.org).

NOTE: npm will already be installed if node is already installed.

```bash
npm install
npm run start
```

with [yarn](https://yarnpkg.com)

```bash
yarn
yarn run start
```

Now visit [localhost:4204](http://localhost:4204)

To build your app in preparation for deployment to the WickeyAppStore.

```bash
npm run build
```

```bash
yarn run build
```

The output `dist/` directory is what will be selected to deploy on: [developer.wickeyappstore.com](https://developer.wickeyappstore.com/)

## QuickStart (Manual Integration)

To install this library, run: (NOTE: Install all dependencies)

```bash
$ npm install wickeyappstore --save
```

Link external dependencies in the header of your index.html
```html
  <!-- WICKEYAPPSTORE -->

  <!-- PUSH NOTIFICATIONS -->
  <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script>
  <!-- Vast Player -->
  <script defer src="https://cdn.jsdelivr.net/npm/vast-player@0.2/dist/vast-player.min.js"></script>
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
<!-- Add the Wickey Appstore to top of the bootstrapped component -->
<wickey-appstore></wickey-appstore>

<!--Now your app. Thats it.-->
<div class="myapp">
  <h1>Welcome to my app!</h1>
</div>
```

## License

MIT © [WickeyWare, LLC](mailto:tim@wickeyappstore.com)
