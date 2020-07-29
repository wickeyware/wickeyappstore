# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/wickeyware/wickeyappstore/compare/2.20.2...HEAD)

This shows all commits since last release (actually, currently all commits).

## [2.20.2](https://github.com/wickeyware/wickeyappstore/compare/2.20.0...2.20.2) - 2020-07-29

### Fixed

* **WasPay** Fix browser PaymentRequest BlueSnap integration.

## [2.20.1](https://github.com/wickeyware/wickeyappstore/compare/2.19.0...2.20.1) - 2020-07-27

### Fixed

* **package** Update bluesnap js

## [2.20.0](https://github.com/wickeyware/wickeyappstore/compare/2.19.0...2.20.0) - 2020-07-27

### Fixed

* **package** Update to Angular 10.
* **compile** Set enableIvy to false for compatibility (as suggested by Angular cli).

## [2.19.4](https://github.com/wickeyware/wickeyappstore/compare/2.19.0...2.19.4) - 2019-10-30

### Fixed

* **offerwall** Fixed offerwall.

## [2.19.3](https://github.com/wickeyware/wickeyappstore/compare/2.19.0...2.19.3) - 2019-09-30

### Fixed

* **package** Update to Angular 8 and core-js 3.

## [2.19.0](https://github.com/wickeyware/wickeyappstore/compare/2.18.9...2.19.0) - 2019-03-05

### Added

* **newsFeed** Add WasNews.
* **leaderboard:actions** On leaderboard user select, show an action popup. (new was menu btn to open a news/alerts feed)

### Fixed

* **opensso** Return an observable.
* **leaderboard** Show close button on bottom.

## [2.18.9](https://github.com/wickeyware/wickeyappstore/compare/2.18.8...2.18.9) - 2019-02-15

### Fixed

* **reviewBonus** Fix WasUp if bonus was given on review.

## [2.18.8](https://github.com/wickeyware/wickeyappstore/compare/2.18.7...2.18.8) - 2019-02-14

### Fixed

* **reviewBonus** Add WasUp if bonus was given on review.

## [2.18.7](https://github.com/wickeyware/wickeyappstore/compare/2.18.6...2.18.7) - 2019-02-13

### Fixed

* **WasDataService** Added missing delete `del` function.
* **app_data** Remove deprecated userService.data.
* **app_coins** Remove coins from UserService.updateUser, api does not allow updating coins this way (coins are purchased and consumed).

## [2.18.6](https://github.com/wickeyware/wickeyappstore/compare/2.18.5...2.18.6) - 2019-01-28

### Fixed

* **WasAlert** Add clear to end of input.
* **WasReview** Add clear to end of input.
* **WasLeaderboard** Add smooth scrolling on iOS.
* **WasShop** Add smooth scrolling on iOS.
* **WasShop** Make shop dialog fullscreen on mobile.
* **WasProfile** Make profile dialog fullscreen on mobile.
* **getLeaderboard** Return user's leaderboard `score` (along with `rank`) if username was passed in.
* **wickeyappstore.mudule** Add LayoutModule to exports.

## [2.18.5](https://github.com/wickeyware/wickeyappstore/compare/2.18.3...2.18.5) - 2019-01-23

### Fixed

* **WasAlert** Make WasAlert dialog fullscreen on mobile, IFF it has an input, also move input to top of screen.

## [2.18.4](https://github.com/wickeyware/wickeyappstore/compare/2.18.3...2.18.4) - 2019-01-21

### Fixed

* **SSO** Make SSO dialog fullscreen on mobile, also move input to top of screen.
* **Review** Make review dialog fullscreen on mobile, also move input to top of screen.
* **Review** Show WasUp (`Thanks for your feedback!`) on review submitted.
* **WasPay** On successful purchase show WasUp instead of WasAlert.

## [2.18.3](https://github.com/wickeyware/wickeyappstore/compare/2.18.2...2.18.3) - 2019-01-10

### Fixed

* **showLeaderboard** Returns observable.
* **leavereview** Returns observable.
* **leavereview** Directly open review modal after login, if invoked and user was not yet logged in.

## [2.18.2](https://github.com/wickeyware/wickeyappstore/compare/2.18.1...2.18.2) - 2018-01-09

### Fixed

* **openpayjs** Added `openpayjs` as the WASjs alternative to `openpay`.
* **addToLeaderboard** Only ask for username, if one has not yet been set.
* **addToLeaderboard** Show WasUp with current rank after adding to leaderboard.
* **addToLeaderboard** Show WasUp with first place message, if rank is 1.
* **addToLeaderboardjs** Return observable.
* **showLeaderboard** Reverted to default padding on top and bottom of dialog.

## [2.18.1](https://github.com/wickeyware/wickeyappstore/compare/2.17.5...2.18.1) - 2018-01-08

### Fixed

* **showLeaderboard** Return onClosed observable so caller knows when window closes (not available for WASjs).
* **WASjsZoneRefresh** Fix refresh on `Safari`. Added new methods `addToLeaderboardjs`, `showLeaderboardjs`, and `leavereviewjs`.

## [2.18.0](https://github.com/wickeyware/wickeyappstore/compare/2.17.5...2.18.0) - 2019-01-04

### Added

* **addToLeaderboard** Add to leaderboard handles username popup.
* **showLeaderboard** Add to leaderboard handles username popup.

## [2.17.5](https://github.com/wickeyware/wickeyappstore/compare/2.17.4...2.17.5) - 2018-12-26

### Fixed

* **WasPay** Add temporary zone refresh every 200ms for WASjs.
* **WasUp** Add temporary zone refresh every 200ms for WASjs.
* **WasReview** Add temporary zone refresh every 200ms for WASjs.
* **UserService** Add method to open WasPay (observable).

## [2.17.4](https://github.com/wickeyware/wickeyappstore/compare/2.17.3...2.17.4) - 2018-12-21

### Fixed

* **WasShop** Fix font overflowing on pay buttons, causing two lines.
* **WasShop** Make pay card clickable.

## [2.17.3](https://github.com/wickeyware/wickeyappstore/compare/2.17.2...2.17.3) - 2018-12-06

### Fixed

* **favorites** Show add to favorites even if not logged in.

## [2.17.2](https://github.com/wickeyware/wickeyappstore/compare/2.17.0...2.17.2) - 2018-12-06

### Fixed

* **favorites** Add favorites to WAS Menu.
* **package** Update to latest Angular 7 minor.

## [2.17.0](https://github.com/wickeyware/wickeyappstore/compare/2.16.5...2.17.0) - 2018-11-08

### Fixed

* **package** Update to Angular 7 and latest rxjs.
* **WASMenuBtn** Explicitly set menu to overlap WAS menu button.
* **docs** Re-compile docs.

## [2.16.5](https://github.com/wickeyware/wickeyappstore/compare/2.16.4...2.16.5) - 2018-09-25

### Fixed

* **WasShop** Scrolling fix on long lists of iapps (iOS)
* **API** add api for upcoming favorites list

## [2.16.4](https://github.com/wickeyware/wickeyappstore/compare/2.16.2...2.16.4) - 2018-09-24

### Fixed

* **Styles** Remove ios smooth scrolling for full screen modals. Causes issues with iOS 12

## [2.16.2](https://github.com/wickeyware/wickeyappstore/compare/2.16.1...2.16.2) - 2018-09-23

### Fixed

* **WasSSO** Add spinner.
* **AdGate** Add app name to user_id used in backend callback.
* **package** Update to latest Angular patches.

## [2.16.1](https://github.com/wickeyware/wickeyappstore/compare/2.16.0...2.16.1) - 2018-08-10

### Fixed

* **WasPay** Force SSO login before purchase.

## [2.16.0](https://github.com/wickeyware/wickeyappstore/compare/2.15.4...2.16.0) - 2018-08-10

### Added

* **WasPay** Add PayPal payment option.

### Fixed

* **WasShop** Make WasShop fullscreen.

## [2.15.4](https://github.com/wickeyware/wickeyappstore/compare/2.15.3...2.15.4) - 2018-08-03

### Fixed

* **WasShop** Add play icon to watch video button

## [2.15.3](https://github.com/wickeyware/wickeyappstore/compare/2.15.2...2.15.3) - 2018-07-28

### Fixed

* **package** Update Angular to latest patch.
* **was:package** Update angular/pwa dependency.
* **docs** Re-compile docs.
* **WasShop** Add spinner to watch video button

## [2.15.2](https://github.com/wickeyware/wickeyappstore/compare/2.15.1...2.15.2) - 2018-07-24

### Fixed

* **UserService** Send in correct store_id to Purchase API.
* **package** Update Angular to latest patch.

## [2.15.1](https://github.com/wickeyware/wickeyappstore/compare/2.15.0...2.15.1) - 2018-07-23

### Fixed

* **WebPayment** Fix WebPayment for Android, and computer (all non ApplePay).

## [2.15.0](https://github.com/wickeyware/wickeyappstore/compare/2.14.1...2.15.0) - 2018-07-20

### Added

* **UserService** Add consumeCoins api, this is to consume coins received from purchases or videos on things like new game levels or in app items.

### Fixed

* **package** Update Angular to latest patch

## [2.14.1](https://github.com/wickeyware/wickeyappstore/compare/2.14.0...2.14.1) - 2018-07-16

### Fixed

* **Styles** Add ios smooth scrolling for full screen modals

## [2.14.0](https://github.com/wickeyware/wickeyappstore/compare/2.13.1...2.14.0) - 2018-06-28

### Added

* **WasStore** Add rewarded video ads
* **package** Remove OneSignal load

## [2.13.1](https://github.com/wickeyware/wickeyappstore/compare/2.13.0...2.13.1) - 2018-06-27

### Fixed

* **README** Add readme back to WickeyAppStore npm package.

## [2.13.0](https://github.com/wickeyware/wickeyappstore/compare/2.12.7...2.13.0) - 2018-06-25

### Added

* **ApiConnectionService** Add getLeaderboard and setHighscore apis.
* **UserService** Implement Leaderboards!
* **demo** Add example of leaderboard.
* **README** Add example of leaderboard.

### Fixed

* **package** Update to latest Angular patch.
* **ApiConnection** Return error message from server if available as default.
* **docs** Recompile the documentation.

## [2.12.7](https://github.com/wickeyware/wickeyappstore/compare/2.12.6...2.12.7) - 2018-06-20

### Fixed

* **WasDataService** Reload WasData on login change, iff WasData is used.
* **WasDataService** Save resolved save conflict to local storage.
* **WASMenuButton** Add aria-label to button.
* **docs** Recompile the documentation.

## [2.12.6](https://github.com/wickeyware/wickeyappstore/compare/2.12.5...2.12.6) - 2018-06-19

### Fixed

* **dependencies** Add missing Material Icons css dependency to head in WasMenuBtn constructor, iff they are not there.
* **index.html** Fix example of how to use WASjs.
* **package** Update to latest patch of Angular.
* **README** Update readme, remove dependencies, link and script, from index.html head.
* **WasDataService** Add optional map/filter function (passed in restore()) when local and cloud saves conflict. Default saves newer copy.
* **demo** Add demo of how to use the save conflict in WasDataService.
* **docs** Recompile the documentation.

## [2.12.5](https://github.com/wickeyware/wickeyappstore/compare/2.12.4...2.12.5) - 2018-06-12

### Fixed

* **WASjs** Fix error on Chrome 67 - [Angular issue 24390](https://github.com/angular/angular/issues/24390).

## [2.12.4](https://github.com/wickeyware/wickeyappstore/compare/2.12.3...2.12.4) - 2018-06-11

### Fixed

* **WASjs** Set dataService and userService in WAS object on window (e.g. `window.WAS.dataService`).
* **WASjs** Remove event emitter userServiceOut.
* **WASjs** Remove event emitter wasDataServiceOut.
* **WASjs** Update to latest patch of Angular.
* **docs** Recompile the documentation.

## [2.12.3](https://github.com/wickeyware/wickeyappstore/compare/2.12.2...2.12.3) - 2018-06-05

### Fixed

* **PaymentRequest** Get payer email and first and last name from Payment Request object.
* **PaymentRequest** Show spinner on payment until all processing has completed.
* **Ads** Fix error if ad player did not initialize.
* **DEBUG** Remove un-needed console.log statements.
* **WasProfile** Show version in profile popup.
* **WASjs** Return UserService and WasDataService even on no internet.
* **docs** Recompile the documentation.

## [2.12.2](https://github.com/wickeyware/wickeyappstore/compare/2.12.1...2.12.2) - 2018-06-01

### Fixed

* **WASjs** Add missing input `open` on menu open hook.
* **WASjs** Clean up, remove un-used code.
* **dependencies** Add dependencies to head in WasMenuBtn constructor, iff they are not there.
* **PaymentRequest** Fix PaymentRequest for browsers supporting it.
* **docs** Recompile the documentation.

## [2.12.1](https://github.com/wickeyware/wickeyappstore/compare/2.12.0...2.12.1) - 2018-05-31

### Fixed

* **WASjs** Remove ViewEncapsulation.Native (a polyfill was required for all browsers other than Chrome).
* **WasDataService** Add .get(_key) that returns value not observable.
* **package** Update to latest patch releases.
* **demo** Fix WickeyAppStore import in the demo app.

## [2.12.0](https://github.com/wickeyware/wickeyappstore/compare/2.11.1...2.12.0) - 2018-05-30

### Added

* **WASMenu** Add hook to indicate when WAS is opened. <wickey-appstore (open)="pause()"></wickey-appstore>.

## [2.11.1](https://github.com/wickeyware/wickeyappstore/compare/2.11.0...2.11.1) - 2018-05-25

### Fixed

* **README** Show example of WasDataService with WAS js.

## [2.11.0](https://github.com/wickeyware/wickeyappstore/compare/2.10.3...2.11.0) - 2018-05-22

### Added

* **WickeyAppStoreJS** Add WickeyAppStore as single, dependency free, js file with single styles.css file (in elements folder).

## [2.10.3](https://github.com/wickeyware/wickeyappstore/compare/2.10.2...2.10.3) - 2018-05-22

### Fixed

* **package** Remove un-used dependencies hammerjs.
* **package** Install latest versions of Angular.
* **css** Remove un-used css.
* **app.module** Remove un-used Angular Material modules.

## [2.10.2](https://github.com/wickeyware/wickeyappstore/compare/2.10.1...2.10.2) - 2018-05-15

### Fixed

* **dependencies** Fix peer dependency match, allow minor version increases.

## [2.10.1](https://github.com/wickeyware/wickeyappstore/compare/2.10.0...2.10.1) - 2018-05-15

### Fixed

* **license** Fix license mis-match.

## [2.10.0](https://github.com/wickeyware/wickeyappstore/compare/2.9.0...2.10.0) - 2018-05-15

### Changed

* **packages** [BREAKING] Update to Angular 6 and rxjs 6, these are breaking changes. [how to update](https://update.angular.io/)
* **build** Change to angular/cli lib builder.

### Added

* **demoapp** Add demo app to test lib. First run `yarn run build:lib` then `yarn run start` or `yarn run build` and `yarn run serve:cli`.

## [2.9.0](https://github.com/wickeyware/wickeyappstore/compare/2.8.1...2.9.0) - 2018-05-10

### Added

* **WasDataService** Add a simple local and cloud persistable data store.

### Changed

* **WASMenu** Fix z-index on WasMenu-Btn.

### Fixed

* **WASMenu** Make sure WAS menu button is below WAS menu option menu slideout.
* **LibBuild** Update build process, use fs-extra instead of del to remove old dist and other small changes.
* **WasSSO** Update form to use only reactive forms (Angular 6 deprecated use of ngModel with reactive forms).
* **UserService** Set WickeyAppStore user cookie after token verification.
* **ApiConnectionService** Handle error in error if message is on root error object.
* **Subscription** Remove un-used Subscriptions imports and the un-used associated busys for was-spinner.
* **Docs** Recompile the documentation.

### Deprecated

* **WASKeyVal** UserService.getStore/setStore/deleteStore, use new WasDataService.

## [2.8.2](https://github.com/wickeyware/wickeyappstore/compare/2.8.1...2.8.2) - 2018-04-30

### Fixed

* **WickeyAppStore** Set z-index to max index for WickeyAppStore button

## [2.8.1](https://github.com/wickeyware/wickeyappstore/compare/2.8.0...2.8.1) - 2018-04-23

### Fixed

* **UserService** Subscribe to getStore to ensure the call is made.
* **UserService** Subscribe to setStore to ensure the call is made.
* **UserService** Subscribe to deleteStore to ensure the call is made.
* **ApiConnection** Remove console debug out on getStore, setStore, and deleteStore.

## [2.8.0](https://github.com/wickeyware/wickeyappstore/compare/2.7.2...2.8.0) - 2018-04-19

### Fixed

* **README** Update dependancies to remove swiper, add VAST player.
* **Docs** Update Docs.

### Added

* **models** Add username to User model.
* **UserService** Add updateUsername function.

### Changed

* **WickeyAppStore** Link to wickeyappstore.com instead of showing internal store.

### Removed

* **WickeyAppStore** Remove internal WickeyAppStore display and associated pieces.
* **dependencies** Remove swiper dependency.

## [2.7.2](https://github.com/wickeyware/wickeyappstore/compare/2.7.1...2.7.2) - 2018-04-18

### Fixed

* **README** Move badge below project name in readme.
* **README** Update docs link in readme.
* **README** Add prerequisites to quickstart, this is a link to nodejs.
* **CHANGELOG** Fix incorrect comparisons on versions.

## [2.7.1](https://github.com/wickeyware/wickeyappstore/compare/2.7.0...2.7.1) - 2018-04-18

### Fixed

* **Documentation** Update to new repository url (github).
* **packages** Update angular to latest patch versions.
* **README** Update readme, add travis-ci.org, badge.fury.io, and david-dm.org badges.

## [2.7.0](https://github.com/wickeyware/wickeyappstore/compare/1.7.0...e772ad27a0a4670b1f9a3f38c6039608eeeb693d) - 2018-04-17

### Fixed

* **Documentation** Update README.

### Added

* **WasPay** Show purchase indicator in WasPay after successful purchase.

## [2.6.3](https://github.com/wickeyware/wickeyappstore/compare/6b96b5fd6b0873f39f14cb6c3810cef1994f1c48...e772ad27a0a4670b1f9a3f38c6039608eeeb693d) - 2018-04-17

### Fixed

* **Documentation** Update README.
* **WasReview** Fix the fields in WasReview. Made full width.

## [2.6.2](https://github.com/wickeyware/wickeyappstore/compare/6099f59c1bfce2efa233ece063181d0bdd73c0f1...6b96b5fd6b0873f39f14cb6c3810cef1994f1c48) - 2018-04-17

### Fixed

* **Documentation** Documentation for WickeyAppStore added.
* **WickeyAppStore** Add WickeyAppStore to apps via <wickey-appstore></wickey-appstore>

## [2.6.1](https://github.com/wickeyware/wickeyappstore/compare/f766704acd5841c5cf1167d9eb38c9b7fe46f7f3...6099f59c1bfce2efa233ece063181d0bdd73c0f1) - 2018-04-13

### Fixed

* **WasAlert** Allow Custom buttons, button_colors, button_icons for input alerts.
* **Documentation** Update documentation.

## [2.6.0](https://github.com/wickeyware/wickeyappstore/compare/29f0f84f43123ee74344c1124a323086c50a2077...f766704acd5841c5cf1167d9eb38c9b7fe46f7f3) - 2018-04-11

### Added

* **serviceworker** Add new service to check for available updates (adds new @angular/service-worker dependency).
* **UserService.checkIfPurchased** Add a function that returns an observable that returns true if non-consumable is purchased.
* **UserService.getInapp** Add a function that retrieves the inapp object, given the purchaseId.
* **WasPay** Return boolean|null on WasPay close (true is a good purchase).

### Fixed

* **UserService.inapps** Reload inapps from server after purchase api returns.
* **PaymentRequest** [under development] Handle user cancel.

## [2.5.0](https://github.com/wickeyware/wickeyappstore/compare/73452f7461088bb53492e242bb601d9884741b0e...29f0f84f43123ee74344c1124a323086c50a2077) - 2018-04-09

### Added

* **WasAlert** Added standard confirm styles WasAlertStyleConfirm / WasAlertStyleWarning
* **UI** Updated to use the new WasAlert

## [2.4.0](https://github.com/wickeyware/wickeyappstore/compare/e345a157f04929dd7256abb772677a5d226ef9fe...73452f7461088bb53492e242bb601d9884741b0e) - 2018-04-06

### Fixed

* **WasShop** Only show free coins panel when ads or offerwall is set.
* **WasPay** On non consumable, first check locally if already bought.

### Added

* **WasMenuBtn** Show login status on WAS menu button .

## [2.3.0](https://github.com/wickeyware/wickeyappstore/compare/1675ebc9c4af19501b854592c7983935ba1aeaa4...e345a157f04929dd7256abb772677a5d226ef9fe) - 2018-04-06

### Added

* **ads** Rewarded video ads available in WasShop.
* **inapps** Inapp purchases are now available, currently only ApplePay is available.

## [2.2.3](https://github.com/wickeyware/wickeyappstore/compare/a793de0e331593657d3ea70f39a26d91a385d4c2...1675ebc9c4af19501b854592c7983935ba1aeaa4) - 2018-04-04

### Fixed

* **WickeyAppStore** Fix scroll issue.

## [2.2.2](https://github.com/wickeyware/wickeyappstore/compare/4a08917d25084aeaa5cb5a1376f7b29de502c60f...a793de0e331593657d3ea70f39a26d91a385d4c2) - 2018-04-03

### Fixed

* **WasMenuBtn** Only show shop button if app has inapps.

## [2.2.1](https://github.com/wickeyware/wickeyappstore/compare/7bee6488234526f3fe4a74e1dd6c0b08bda19cdb...4a08917d25084aeaa5cb5a1376f7b29de502c60f) - 2018-03-30

### Fixed

* **SSO** Fix login on iOS.

## [2.2.0](https://github.com/wickeyware/wickeyappstore/compare/98ed1483a774f545482b3956af239fcd5e33af43...7bee6488234526f3fe4a74e1dd6c0b08bda19cdb) - 2018-03-30

### Added

* **WasAlert** Add password option.

## [2.1.2](https://github.com/wickeyware/wickeyappstore/compare/d55e52457823b23a7a32bbd0a655b105e439a798...98ed1483a774f545482b3956af239fcd5e33af43) - 2018-03-29

### Fixed

* **SSO** Fix login error where app is refreshed between token and verification.

## [2.1.0](https://github.com/wickeyware/wickeyappstore/compare/f321945b3090762d72a63d4eaa3b45cf0dd6b1de...d55e52457823b23a7a32bbd0a655b105e439a798) - 2018-03-28

### Added

* **WasPay** Add simple purchase interface.
* **WasShop** Add InApp Shop interface.
* **WasAppService** Add bannerApps service.
* **WasAppService** Add featuredGroups service.
* **API** Add API to get Inapps.
* **UserService** Implement services to handle Inapps.
* **UserService** Add new service (onAccountCreate), that pushes a boolean on initial account create.
* **UserService** Add accessor to _loaded field. This is a boolean denoting if UserService is loaded or not.
* **LocalStorageService** Add clear and keys indexedDB wrapper functions, these currently do not work with cookie storage.
* **WasProfile** Add simple account info popover
* **WasMenu** Add WasProfile to WasMenu

### Changed

* **models** Update Inapp model to new field names.
* **models** Add has_data and account_verified to User.
* **tslint** Update to latest parameters for tslint (show common linting issues).
* **Docs** Updated the docs.
* **LocalStorage** BREAKING: Updated idb-keyval library, must update peer dependency.

### Fixed

* **WasAppService** Remove .complete and .asObservable, these are not needed, also only replay 1.
* **UserService** Fix linting issues.
* **UserService** Fix anonymous accounts not logging into logged in cookie was_user_id.

## [2.0.1](https://github.com/wickeyware/wickeyappstore/compare/58511acba35edc447b9779cbf6a6d535b5761338...f321945b3090762d72a63d4eaa3b45cf0dd6b1de) - 2018-02-28

### Fixed

* **LocalStorage** Save user_id and session_id in *.wickeyappstore.com as secure cookie.

## [2.0.0](https://github.com/wickeyware/wickeyappstore/compare/333082affee07226fbe1f2f7af2a7bfabd0112d8...58511acba35edc447b9779cbf6a6d535b5761338) - 2018-02-22

### Major Version

* **WasUI** Removed all the old style popovers (alert, login, popup, review).
* **WasMenu** Change the layout of WasMenu
* **AppStore** Add fix for app store lists not scrolling properly

## [1.18.2](https://github.com/wickeyware/wickeyappstore/compare/38e2ca15baa02b2d1a4e0ac52f819c7afa4946e1...333082affee07226fbe1f2f7af2a7bfabd0112d8) - 2018-02-21

### Fixed

* **LocalStorage** Save user_id and session_id in *.wickeyappstore.com as secure cookie.

## [1.18.1](https://github.com/wickeyware/wickeyappstore/compare/6bd2b5ea708c77d4725b51488e799123f270423c...38e2ca15baa02b2d1a4e0ac52f819c7afa4946e1) - 2018-02-21

### Fixed

* **UserService** Ensure initial push of login status (on user load, push status).

## [1.18.0](https://github.com/wickeyware/wickeyappstore/compare/8904fd4f47e99f3e5202b223501e319dba628649...6bd2b5ea708c77d4725b51488e799123f270423c) - 2018-02-20

### Added

* **UserService** Add new service loginChange, this pushes an update on login status change (and on page load it emits the login status).
* **UserService** Handle opensso (this includes showing sso if logging in).
* **UserService** Handle leavereview (this includes checking if logged in).
* **UserService** Handle openstore.

### Fixed

* **UserService** Fix user not pushing to subscribers on every update. NOTE: This could lead to infinite loops (planning on checking object and only pushing updates).
* **WASbtnSSO** Update login/logout message for SSO in was menu button.
* **Review** Update saving message.

## [1.17.3](https://github.com/wickeyware/wickeyappstore/commit/8904fd4f47e99f3e5202b223501e319dba628649) - 2018-02-16

### Added

* **UserInterface** Add SSO to Was Menu

## [1.17.2](https://github.com/wickeyware/wickeyappstore/commit/cc0e6b5ab49db6a8f4897bdbfbc4a97d32085d85) - 2018-02-15

### Added

* **UserInterface** Make WasMenu and Store a button and dialog. 

## [1.17.1](https://github.com/wickeyware/wickeyappstore/commit/a0ed7d3afa2c8edc0ac247e7e9d23220b1c9bde4) - 2018-02-13

### Fixed

* **WASReview** Fix check if user is already logged in.

## [1.17.0](https://github.com/wickeyware/wickeyappstore/commit/2834072fe0c75a910440387f4564a30b1c1a4f6d) - 2018-02-13

### Fixed

* **UserService** Update secured on each standard return.
* **API** Add Auth if passed in. This allows login via email and passcode (not yet implemented in UI).
* **API** Add withCredentials to modifying calls.

### Added

* **UserInterface** Add new WasReview dialog.

## [1.16.1](https://github.com/wickeyware/wickeyappstore/commit/92e02db8f0a9e8755772e36973518722ffa5e808) - 2018-02-09

### Fixed

* **UserInterface** Add error validation. Add documentation. WAS SSO
* **UserService** Finish setPassword implementation.
* **UserService** Add documentation.
* **UserService** Use cookie functions from localStorage.
* **AppService** Update documentation.
* **SSO** Add emitter on login.

### Deprecated

* **API** Deprecated un-used version parameter. This is now sent in as a header.

## [1.16.0](https://github.com/wickeyware/wickeyappstore/commit/f1efc6c6840137db8667a8321db99be6b700e7fd) - 2018-02-08

### Added

* **UserInterface** Add new WAS SSO. Add basis for all new User Interface.
* **API** Add person auth api. This allows a user to set a pin/pass code for extra security or faster logins.
* **UserService** Add isLoggedIn function to UserService.
* **UserService** Add logOut function to UserService.

### Deprecated

* **PopoverLoginComponent** Deprecating the old SSO, migrating to new dialog version of SSO (same functionality).

### Fixed

* **SESSIONS** Fix bug where session token header was not sent in.

## [1.15.2](https://github.com/wickeyware/wickeyappstore/commit/a1f4daf47af89abc395d0a4eaf501d3affac3227) - 2018-02-02

### Added

* **SESSIONS** Add WAS session support.

## [1.14.1](https://github.com/wickeyware/wickeyappstore/commit/a1f4daf47af89abc395d0a4eaf501d3affac3227) - 2018-02-01

### Fixed

* **UserService** Fix standalone on Chrome, was only correct on iOS safari.
* **UserService** Pass current user push_id, freebie_used, and rated_app values, update with passed params if available.

## [1.14.0](https://github.com/wickeyware/wickeyappstore/commit/f89a7079129db0116cfc9d5fa94dca94d5d0171e) - 2018-01-26

### Changed

* **WasAlert** Changed the name from WasAlertDialogComponent to WasAlert. 
                Added input and list capability.
* **WasUp** Changed the name from WasUpDialogComponent to WasUp.

## [1.13.2](https://github.com/wickeyware/wickeyappstore/commit/889504f33b3cbcf405ba8ce81015081faf3ca0eb) - 2018-01-24

### Added

* **UserInterface** Add all new wasalert and wasup dialog for quickly showing modal messages to users

## [1.13.1](https://github.com/wickeyware/wickeyappstore/commit/8c26b7654598676620467ab86cfe3d7621acb5cf) - 2018-01-19

### Fixed

* **UserService** Fix bug on if user_id is found in cookie.

## [1.13.0](https://github.com/wickeyware/wickeyappstore/releases/tag/1.13.0) - 2018-01-19

### Added

* **UserService** Set was_user_id on new/verified user, use this cookie on indexeddb acount not found.
* **packages** Add Material dependency.

## [1.12.2](https://github.com/wickeyware/wickeyappstore/releases/tag/1.12.2) - 2017-12-08

### Fixed

* **FanMenuButton** Remove draggable part, this is a fix for the non scroll issue.

## [1.12.1](https://github.com/wickeyware/wickeyappstore/releases/tag/1.12.1) - 2017-12-06

### Fixed

* **packages** Updated to latest Angular

## [1.12.0](https://github.com/wickeyware/wickeyappstore/releases/tag/1.12.0) - 2017-12-06

### Changed

* **WasAppService** Switch WasAppService to  ReplaySubject, this allows the callee to get the initial real object, not a set default/undefined.
* **docs** Updated documentation.

## [1.11.0](https://github.com/wickeyware/wickeyappstore/releases/tag/1.11.0) - 2017-12-06

### Changed

* **UserService** Switch UserService to  ReplaySubject, this allows the callee to get the initial real user object, not a set default/undefined.
           EXAMPLE:
           this.userService.user.subscribe((usr: User) => {console.log('USER LOADED: usr.user_id', usr.user_id);});

### Fixed

* **PopoverLoginComponent** Fix WASLogin to work with new UserService.
* **ApiConnectionService** Handle no internet connection in APIConnection service.

## [1.10.0](https://github.com/wickeyware/wickeyappstore/releases/tag/1.10.0) - 2017-11-08

### Added

* **UserService** Add UserService.store to get/add/update/delete date from the WASStore (persistant cloud storage).
           TODO: Add small example
* **docs** Re-build docs

### Deprecated

* **UserService** Deprecate UserService.data, use the new UserService.store to get/add/update/delete date from the WASStore (persistant cloud storage).

## [1.9.17](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.17) - 2017-11-06

### Fixed

* **packages** Begin upgrade process to angular 5, angular cli 1.5, rxjs 5.5.2, and typescript 2.4.3

## [1.9.16](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.16) - 2017-10-27

### Fixed

* **styles** Fix the janky scrolling issues and the multiple scroll bars.
* **AppDetailsPage** Add web share, if web share exists on device (else copy link).

## [1.9.15](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.15) - 2017-10-24

### Fixed

* **ClipboardService** Remove the ClipboardService, since it is not used.
* **SSO** Update to new format to negate the cursor bug on iOS (Thanks @tim).
* **API** Fix error when api returned error from server, correctly display error message.

## [1.9.14](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.14) - 2017-10-20

### Fixed

* **styles** Make X to close clickable area larger (SSO and review modal)
* **SSO** Remove auto focus on email and token fields, iOS has issues (did not allow immediate selection).
* **REVIEW** Fix typo in textarea

## [1.9.13](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.13) - 2017-10-20

### Fixed

* **styles** Add font size to alert danger css in global styles.css

## [1.9.12](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.12) - 2017-10-20

### Fixed

* **styles** Fix typo in last build

## [1.9.11](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.11) - 2017-10-20

### Fixed

* **styles** Fix/Add missing css for invalid input error message in global style.css

## [1.9.10](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.10) - 2017-10-20

### Fixed

* **styles** Add missing [hidden] css for SSO buttons in global style.css. This ensures SSO button is hidden on invalid input

## [1.9.9](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.9) - 2017-10-20

#### Fixed

* **styles** Fix/Add missing css for SSO buttons in global style.css

## [1.9.8](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.8) - 2017-10-20

### Fixed

* **styles** Fix/Add missing css for SSO in global style.css

## [1.9.7](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.7) - 2017-10-09

### Fixed

* **styles** Fix syntax error in global style.css

## [1.9.6](https://github.com/wickeyware/wickeyappstore/releases/tag/1.9.6) - 2017-10-05

### Fixed

* **README** Updated QuickStart in readme
* **docs** Fixed documentation on was-up
* **docs** Added documentation on was-spinner
