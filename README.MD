# WickeyAppStore
The first AppStore for Progressive WebApps.

[![Build Status](https://img.shields.io/travis/wickeyware/wickeyappstore/master.svg)](https://travis-ci.org/wickeyware/wickeyappstore)
[![npm version](https://badge.fury.io/js/wickeyappstore.svg)](https://badge.fury.io/js/wickeyappstore)
[![npm](https://img.shields.io/npm/dm/wickeyappstore.svg)](https://www.npmjs.com/package/wickeyappstore)
[![Dependency Status](https://david-dm.org/wickeyware/wickeyappstore.svg)](https://david-dm.org/wickeyware/wickeyappstore)

## Docs, Demo, & Developer Portal
DOCS: https://wickeyware.github.io/wickeyappstore/

DEMO APP: https://wickeyappstore.com/app/airhorn and corresponding repo: https://github.com/wickeyware/was-tutorial/

DEV PORTAL: https://wickeyappstore.com/app/developer-portal

## App Store

[WickeyAppStore](https://wickeyappstore.com/)

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
Here's a link to get started: [Developer Portal](https://wickeyappstore.com/app/developer-portal)

## QuickStart (Angular)

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
npm run build:lib
npm run start
```

with [yarn](https://yarnpkg.com)

```bash
yarn
yarn run build:lib
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

## QuickStart (Manual Angular Integration)

To install this library, run: (NOTE: Install all dependencies)

```bash
npm install wickeyappstore --save
```

Import [Material theme](https://material.angular.io/guide/theming) in global styles.css

```css
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
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

## QuickStart Other (JS)

Example index.html:
NOTE: Make sure to add the dependencies to the header, then add the tag <wickey-appstore> and the wickeyappstore.js script in the body.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Custom WAS Test Page</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="src/favicon.ico">

  <!-- WickeyAppStore css -->
  <link rel="stylesheet" href="elements/styles.css">
</head>
<body>
  <wickey-appstore></wickey-appstore>
  <script type="text/javascript" src="elements/wickeyappstore.js"></script>
  <script>
    const wickeyappstore = document.querySelector('wickey-appstore');
    wickeyappstore.addEventListener('open', (event) => {
      console.log('WAS button opened');  // can pause game here.
    });
    // https://wickeyware.github.io/wickeyappstore/injectables/UserService.html
    const userService = window.WAS.userService;
    // https://wickeyware.github.io/wickeyappstore/injectables/WasDataService.html
    const dataService = window.WAS.dataService;
    userService.user.subscribe(usr => {
      console.log('userServiceOut user.subscribe', usr);
    });
    userService.loginChange.subscribe((_isLogged) => {
      console.log('loginChange: loggedin: ', _isLogged);
      // This is a good place to call dataService.restore again, to get the logged in user's data.
    });
    // Check if purchased (where 10 is your purchase item id).
    userService.checkIfPurchased(10).subscribe(isPurch => {
      console.log('checkIfPurchased', isPurch);
      if (!isPurch) {
        // Check if purchased (where 10 is your purchase item id).
        userService.openpayjs(10).subscribe(isSuccessful => {
          console.log('was purchase successful?', isSuccessful);
        });
      }
    });

    // Opens review popup, if logged in, else first logs in.
    // userService.leavereviewjs();

    // Example of how to pass in own save conflict mapping function.
    // Default mapping will choose the newest save.
    function onSaveConflict(localSave, cloudSave) {
      let keepSave = localSave;
      if (localSave && cloudSave) {
        if (cloudSave.highScore > localSave.highScore) {
          keepSave = cloudSave;
        }
      }
      return keepSave;
    }
    dataService.restore(onSaveConflict).subscribe(mydata => {
      console.log('wasDataService.restore', mydata);
      // // WasDataService is now loaded and restored (ready for use).
      // dataService.get('highScore');
      // dataService.save('highScore', 3000);
      // // Then after the session (or game level), persist to cloud
      // dataService.persist();

      // // Show leaderboard
      // userService.showLeaderboardjs();

      // // Add score to leaderboard
      // userService.addToLeaderboardjs(this.highScore);
    });
  </script>
</body>
</html>
```

## License

MIT © [WickeyWare, LLC](mailto:tim@wickeyappstore.com)
