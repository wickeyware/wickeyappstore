import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {BusyModule} from 'angular2-busy';

import { WickeyAppStoreComponent } from './wickeyappstore.component';
import { ApiConnectionService } from './api-connection.service';
import { WASAlertPopupComponent } from './alert-popup/was-alert-popup.component';
import { DisplayAppsComponent } from './display-apps/display-apps.component';
import { AppDetailPageComponent } from './display-apps/app-detail-page/app-detail-page.component';
import { AppReviewsPageComponent } from './display-apps/app-reviews-page/app-reviews-page.component';
import { AppGroupHorizontalComponent } from './display-apps/app-group-horizontal/app-group-horizontal.component';
import { AppGroupVerticalComponent } from './display-apps/app-group-vertical/app-group-vertical.component';
import { DisplayAppMiniComponent } from './display-apps/display-app-mini/display-app-mini.component';
import { DisplayAppFeaturedComponent } from './display-apps/display-app-featured/display-app-featured.component';

export * from './wickeyappstore.component';
export * from './api-connection.service';
export * from './alert-popup/was-alert-popup.component';
export * from './display-apps/display-apps.component';
export * from './display-apps/app-detail-page/app-detail-page.component';
export * from './display-apps/app-reviews-page/app-reviews-page.component';
export * from './display-apps/app-group-horizontal/app-group-horizontal.component';
export * from './display-apps/app-group-vertical/app-group-vertical.component';
export * from './display-apps/display-app-mini/display-app-mini.component';
export * from './display-apps/display-app-featured/display-app-featured.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
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
    DisplayAppFeaturedComponent
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
    DisplayAppFeaturedComponent
  ]
})
export class WickeyAppStoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WickeyAppStoreModule,
      providers: [ApiConnectionService]
    };
  }
}
