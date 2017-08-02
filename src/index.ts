import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {BusyModule} from 'angular2-busy';

import { WickeyAppStoreComponent } from './wickeyappstore.component';
import { ApiConnectionService } from './api-connection.service';
import { LocalStorageService } from './local-storage.service';
import { WASAlertPopupComponent } from './was-alert-popup/was-alert-popup.component';
import { DisplayAppsComponent } from './display-apps/display-apps.component';
import { AppDetailPageComponent } from './display-apps/app-detail-page/app-detail-page.component';
import { AppReviewsPageComponent } from './display-apps/app-reviews-page/app-reviews-page.component';
import { AppGroupHorizontalComponent } from './display-apps/app-group-horizontal/app-group-horizontal.component';
import { AppGroupVerticalComponent } from './display-apps/app-group-vertical/app-group-vertical.component';
import { DisplayAppMiniComponent } from './display-apps/display-app-mini/display-app-mini.component';
import { DisplayAppFeaturedComponent } from './display-apps/display-app-featured/display-app-featured.component';
// POPOVER //
import { PopoverBaseComponent } from './ui/popover/popover-base/popover-base.component';
import { PopoverAccountInfoComponent } from './ui/popover/popover-account-info/popover-account-info.component';
import { PopoverLoginComponent } from './ui/popover/popover-login/popover-login.component';
import { CustomValidatorDirective } from './custom-validator.directive';

export * from './wickeyappstore.component';
export * from './api-connection.service';
export * from './local-storage.service';
export * from './was-alert-popup/was-alert-popup.component';
export * from './display-apps/display-apps.component';
export * from './display-apps/app-detail-page/app-detail-page.component';
export * from './display-apps/app-reviews-page/app-reviews-page.component';
export * from './display-apps/app-group-horizontal/app-group-horizontal.component';
export * from './display-apps/app-group-vertical/app-group-vertical.component';
export * from './display-apps/display-app-mini/display-app-mini.component';
export * from './display-apps/display-app-featured/display-app-featured.component';
// POPOVER //
export * from './ui/popover/popover-base/popover-base.component';
export * from './ui/popover/popover-account-info/popover-account-info.component';
export * from './ui/popover/popover-login/popover-login.component';
export * from './custom-validator.directive';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
    // BusyModule
  ],
  declarations: [
    WickeyAppStoreComponent,
    WASAlertPopupComponent,
    DisplayAppsComponent,
    AppDetailPageComponent,
    AppReviewsPageComponent,
    AppGroupHorizontalComponent,
    AppGroupVerticalComponent,
    DisplayAppMiniComponent,
    DisplayAppFeaturedComponent,
    PopoverBaseComponent,
    PopoverAccountInfoComponent,
    PopoverLoginComponent,
    CustomValidatorDirective
  ],
  exports: [
    WickeyAppStoreComponent,
    WASAlertPopupComponent,
    DisplayAppsComponent,
    AppDetailPageComponent,
    AppReviewsPageComponent,
    AppGroupHorizontalComponent,
    AppGroupVerticalComponent,
    DisplayAppMiniComponent,
    DisplayAppFeaturedComponent,
    PopoverBaseComponent,
    PopoverAccountInfoComponent,
    PopoverLoginComponent,
    CustomValidatorDirective
  ],
})
export class WickeyAppStoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WickeyAppStoreModule,
      providers: [ApiConnectionService, LocalStorageService]
    };
  }
}
