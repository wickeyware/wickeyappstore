import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

// MATERIAL
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

// SWIPER //
import { SwiperModule } from 'angular2-useful-swiper';  // or for angular-cli the path will be ../../node_modules/angular2-useful-swiper
// SERVICES //
import { UserService } from './user.service';
import { ApiConnectionService } from './api-connection.service';
import { LocalStorageService } from './local-storage.service';
import { WasAppService } from './was-app.service';
// WAS CORE //
import { WasSpinnerComponent } from './was-spinner/was-spinner.component';
import { WickeyAppStoreComponent } from './wickeyappstore.component';
import { DisplayAppsComponent } from './display-apps/display-apps.component';
import { AppDetailPageComponent } from './display-apps/app-detail-page/app-detail-page.component';
import { AppGroupHorizontalComponent } from './display-apps/app-group-horizontal/app-group-horizontal.component';
import { AppGroupVerticalComponent } from './display-apps/app-group-vertical/app-group-vertical.component';
import { DisplayAppMiniComponent } from './display-apps/display-app-mini/display-app-mini.component';
import { DisplayAppFeaturedComponent } from './display-apps/display-app-featured/display-app-featured.component';
import { DisplayAppFullwidthComponent } from './display-apps/display-app-fullwidth/display-app-fullwidth.component';
import { CustomValidatorDirective } from './custom-validator.directive';
import { DisplayInAppComponent } from './display-apps/display-inapp/display-inapp.component';

// REVIEWS //
import { ReviewsComponent } from './ui/reviews/reviews.component';
import { DisplayAppReviewComponent } from './display-apps/display-app-review/display-app-review.component';
import { AppGroupReviewsComponent } from './display-apps/app-group-reviews/app-group-reviews.component';
// PIPES //
import { GetCategoryPipe } from './pipes/get-category.pipe';
// WAS MATERIAL POPOVERS //
import { WasUp } from './ui/popover/wasup/wasup.dialog';
import { WasAlert } from './ui/popover/wasalert/wasalert.dialog';
import { WasReview } from './ui/popover/wasreview/wasreview.dialog';
import { WasSSO } from './ui/popover/wassso/wassso.dialog';
import { WasSSOBtn } from './ui/popover/wassso-btn/wassso-btn.component';
import { WasMenuBtn } from './ui/popover/wasmenu-btn/wasmenu-btn.component';
import { WasStore } from './ui/popover/wasstore/wasstore.dialog';
import { WasShop } from './ui/popover/wasshop/wasshop.dialog';
import { WasPay } from './ui/popover/waspay/waspay.dialog';
import { WasProfile } from './ui/popover/wasprofile/wasprofile.dialog';

// EXPORT EVERYTHING //
export * from 'angular2-useful-swiper';
export * from './animations';
export * from './user.service';
export * from './was-app.service';
export * from './was-spinner/was-spinner.component';
export * from './wickeyappstore.component';
export * from './api-connection.service';
export * from './local-storage.service';
export * from './display-apps/display-apps.component';
export * from './display-apps/app-detail-page/app-detail-page.component';
export * from './display-apps/app-group-horizontal/app-group-horizontal.component';
export * from './display-apps/app-group-vertical/app-group-vertical.component';
export * from './display-apps/display-app-mini/display-app-mini.component';
export * from './display-apps/display-app-featured/display-app-featured.component';
export * from './display-apps/display-app-fullwidth/display-app-fullwidth.component';
export * from './display-apps/display-inapp/display-inapp.component';
export * from './ui/reviews/reviews.component';
export * from './ui/popover/wasup/wasup.dialog';
export * from './ui/popover/wasalert/wasalert.dialog';
export * from './ui/popover/wasreview/wasreview.dialog';
export * from './ui/popover/wassso/wassso.dialog';
export * from './ui/popover/wassso-btn/wassso-btn.component';
export * from './ui/popover/wasmenu-btn/wasmenu-btn.component';
export * from './ui/popover/wasstore/wasstore.dialog';
export * from './ui/popover/wasshop/wasshop.dialog';
export * from './ui/popover/waspay/waspay.dialog';
export * from './ui/popover/wasprofile/wasprofile.dialog';
export * from './display-apps/display-app-review/display-app-review.component';
export * from './display-apps/app-group-reviews/app-group-reviews.component';
export * from './custom-validator.directive';
export * from './pipes/get-category.pipe';
export * from './display-apps/display-inapp/display-inapp.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    SwiperModule,
  ],
  declarations: [
    WasSpinnerComponent,
    WickeyAppStoreComponent,
    WasUp,
    WasAlert,
    WasReview,
    WasSSO,
    WasSSOBtn,
    WasMenuBtn,
    WasStore,
    WasShop,
    WasPay,
    WasProfile,
    ReviewsComponent,
    DisplayAppsComponent,
    AppDetailPageComponent,
    AppGroupHorizontalComponent,
    AppGroupVerticalComponent,
    DisplayAppMiniComponent,
    DisplayAppFeaturedComponent,
    CustomValidatorDirective,
    DisplayAppFullwidthComponent,
    DisplayAppReviewComponent,
    AppGroupReviewsComponent,
    DisplayInAppComponent,
    GetCategoryPipe
  ],
  exports: [
    WasSpinnerComponent,
    WickeyAppStoreComponent,
    WasUp,
    WasAlert,
    WasReview,
    WasSSO,
    WasSSOBtn,
    WasMenuBtn,
    WasStore,
    WasShop,
    WasPay,
    WasProfile,
    ReviewsComponent,
    DisplayAppsComponent,
    AppDetailPageComponent,
    AppGroupHorizontalComponent,
    AppGroupVerticalComponent,
    DisplayAppMiniComponent,
    DisplayAppFeaturedComponent,
    CustomValidatorDirective,
    DisplayAppFullwidthComponent,
    DisplayAppReviewComponent,
    AppGroupReviewsComponent,
    DisplayInAppComponent,
    GetCategoryPipe,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  entryComponents: [WasUp, WasAlert, WasReview, WasSSO, WasStore, WasShop, WasPay, WasProfile],
  providers: [
    ApiConnectionService, LocalStorageService, UserService, WasAppService
  ],
})
export class WickeyAppStoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WickeyAppStoreModule,
      providers: [ApiConnectionService, LocalStorageService, UserService, WasAppService]
    };
  }
}
