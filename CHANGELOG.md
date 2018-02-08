# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/all)

This shows all commits since last release (actually, currently all commits).

## [1.16.0](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.16.0) - 2018-08-02

### Added

* **UserInterface** Add new WAS SSO. Add basis for all new User Interface.
* **API** Add person auth api. This allows a user to set a pin/pass code for extra security or faster logins.
* **UserService** Add isLoggedIn function to UserService.
* **UserService** Add logOut function to UserService.

### Deprecated

* **PopoverLoginComponent** Deprecating the old SSO, migrating to new dialog version of SSO (same functionality).

### Fixed

* **SESSIONS** Fix bug where session token header was not sent in.

## [1.15.2](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.15.2) - 2018-02-02

### Added

* **SESSIONS** Add WAS session support.

## [1.14.1](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.14.1) - 2018-01-02

### Fixed

* **UserService** Fix standalone on Chrome, was only correct on iOS safari.
* **UserService** Pass current user push_id, freebie_used, and rated_app values, update with passed params if available.

## [1.14.0](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.14.0) - 2018-26-01

### Changed

* **WasAlert** Changed the name from WasAlertDialogComponent to WasAlert. 
                Added input and list capability.
* **WasUp** Changed the name from WasUpDialogComponent to WasUp.

## [1.13.2](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.13.2) - 2018-24-01

### Added

* **UserInterface** Add all new wasalert and wasup dialog for quickly showing modal messages to users

## [1.13.1](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.13.1) - 2018-19-01

### Fixed

* **UserService** Fix bug on if user_id is found in cookie.

## [1.13.0](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.13.0) - 2018-19-01

### Added

* **UserService** Set was_user_id on new/verified user, use this cookie on indexeddb acount not found.
* **packages** Add Material dependency.

## [1.12.2](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.12.2) - 2017-12-08

### Fixed

* **FanMenuButton** Remove draggable part, this is a fix for the non scroll issue.

## [1.12.1](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.12.1) - 2017-12-06

### Fixed

* **packages** Updated to latest Angular

## [1.12.0](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.12.0) - 2017-12-06

### Changed

* **WasAppService** Switch WasAppService to  ReplaySubject, this allows the callee to get the initial real object, not a set default/undefined.
* **docs** Updated documentation.

## [1.11.0](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.11.0) - 2017-12-06

### Changed

* **UserService** Switch UserService to  ReplaySubject, this allows the callee to get the initial real user object, not a set default/undefined.
           EXAMPLE:
           this.userService.user.subscribe((usr: User) => {console.log('USER LOADED: usr.user_id', usr.user_id);});

### Fixed

* **PopoverLoginComponent** Fix WASLogin to work with new UserService.
* **ApiConnectionService** Handle no internet connection in APIConnection service.

## [1.10.0](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.10.0) - 2017-11-08

### Added

* **UserService** Add UserService.store to get/add/update/delete date from the WASStore (persistant cloud storage).
           TODO: Add small example
* **docs** Re-build docs

### Deprecated

* **UserService** Deprecate UserService.data, use the new UserService.store to get/add/update/delete date from the WASStore (persistant cloud storage).

## [1.9.17](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.17) - 2017-11-06

### Fixed

* **packages** Begin upgrade process to angular 5, angular cli 1.5, rxjs 5.5.2, and typescript 2.4.3

## [1.9.16](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.16) - 2017-10-27

### Fixed

* **styles** Fix the janky scrolling issues and the multiple scroll bars.
* **AppDetailsPage** Add web share, if web share exists on device (else copy link).

## [1.9.15](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.15) - 2017-10-24

### Fixed

* **ClipboardService** Remove the ClipboardService, since it is not used.
* **SSO** Update to new format to negate the cursor bug on iOS (Thanks @tim).
* **API** Fix error when api returned error from server, correctly display error message.

## [1.9.14](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.14) - 2017-10-20

### Fixed

* **styles** Make X to close clickable area larger (SSO and review modal)
* **SSO** Remove auto focus on email and token fields, iOS has issues (did not allow immediate selection).
* **REVIEW** Fix typo in textarea

## [1.9.13](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.13) - 2017-10-20

### Fixed

* **styles** Add font size to alert danger css in global styles.css

## [1.9.12](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.12) - 2017-10-20

### Fixed

* **styles** Fix typo in last build

## [1.9.11](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.11) - 2017-10-20

### Fixed

* **styles** Fix/Add missing css for invalid input error message in global style.css

## [1.9.10](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.10) - 2017-10-20

### Fixed

* **styles** Add missing [hidden] css for SSO buttons in global style.css. This ensures SSO button is hidden on invalid input

## [1.9.9](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.9) - 2017-10-20

#### Fixed

* **styles** Fix/Add missing css for SSO buttons in global style.css

## [1.9.8](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.8) - 2017-10-20

### Fixed

* **styles** Fix/Add missing css for SSO in global style.css

## [1.9.7](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.7) - 2017-10-09

### Fixed

* **styles** Fix syntax error in global style.css

## [1.9.6](https://bitbucket.org/wickeyware/wickeyappstore_npm/commits/tag/1.9.6) - 2017-10-05

### Fixed

* **README** Updated QuickStart in readme
* **docs** Fixed documentation on was-up
* **docs** Added documentation on was-spinner