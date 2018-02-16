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
// POPOVER //
import { PopoverBaseComponent } from './ui/popover/popover-base/popover-base.component';
import { PopoverAccountInfoComponent } from './ui/popover/popover-account-info/popover-account-info.component';
import { PopoverLoginComponent } from './ui/popover/popover-login/popover-login.component';
import { CustomValidatorDirective } from './custom-validator.directive';
import { PopoverReviewComponent } from './ui/popover/popover-review/popover-review.component';
import { PopoverUpComponent } from './ui/popover/popover-up/popover-up.component';
import { WASAlertComponent } from './ui/popover/popover-alert/popover-alert.component';
// REVIEWS //
import { ReviewsComponent } from './ui/reviews/reviews.component';
import { DisplayAppReviewComponent } from './display-apps/display-app-review/display-app-review.component';
import { AppGroupReviewsComponent } from './display-apps/app-group-reviews/app-group-reviews.component';
// PIPES //
import { GetCategoryPipe } from './pipes/get-category.pipe';
// WAS FAN MENU IMPORT //
import { FanMenuModule } from './ui/was_menu/menu.module';
// WAS MATERIAL POPOVERS //
import { WasUp } from './ui/popover/wasup/wasup.dialog';
import { WasAlert } from './ui/popover/wasalert/wasalert.dialog';
import { WasReview } from './ui/popover/wasreview/wasreview.dialog';
import { WasSSO } from './ui/popover/wassso/wassso.dialog';
import { WasSSOBtn } from './ui/popover/wassso-btn/wassso-btn.component';
import { WasMenuBtn } from './ui/popover/wasmenu-btn/wasmenu-btn.component';
import { WasStore } from './ui/popover/wasstore/wasstore.dialog';

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
export * from './ui/popover/popover-base/popover-base.component';
export * from './ui/popover/popover-account-info/popover-account-info.component';
export * from './ui/popover/popover-login/popover-login.component';
export * from './ui/popover/popover-review/popover-review.component';
export * from './ui/popover/popover-up/popover-up.component';
export * from './ui/popover/popover-alert/popover-alert.component';
export * from './ui/popover/wasup/wasup.dialog';
export * from './ui/popover/wasalert/wasalert.dialog';
export * from './ui/popover/wasreview/wasreview.dialog';
export * from './ui/popover/wassso/wassso.dialog';
export * from './ui/popover/wassso-btn/wassso-btn.component';
export * from './ui/popover/wasmenu-btn/wasmenu-btn.component';
export * from './ui/popover/wasstore/wasstore.dialog';
export * from './ui/reviews/reviews.component';
export * from './display-apps/display-app-review/display-app-review.component';
export * from './display-apps/app-group-reviews/app-group-reviews.component';
export * from './custom-validator.directive';
export * from './pipes/get-category.pipe';
// WAS FAN MENU EXPORT //
export * from './ui/was_menu/menu.module';


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
    FanMenuModule
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
    DisplayAppsComponent,
    AppDetailPageComponent,
    AppGroupHorizontalComponent,
    AppGroupVerticalComponent,
    DisplayAppMiniComponent,
    DisplayAppFeaturedComponent,
    PopoverBaseComponent,
    PopoverAccountInfoComponent,
    PopoverLoginComponent,
    PopoverReviewComponent,
    WASAlertComponent,
    PopoverUpComponent,
    CustomValidatorDirective,
    DisplayAppFullwidthComponent,
    ReviewsComponent,
    DisplayAppReviewComponent,
    AppGroupReviewsComponent,
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
    DisplayAppsComponent,
    AppDetailPageComponent,
    AppGroupHorizontalComponent,
    AppGroupVerticalComponent,
    DisplayAppMiniComponent,
    DisplayAppFeaturedComponent,
    PopoverBaseComponent,
    PopoverAccountInfoComponent,
    PopoverLoginComponent,
    PopoverReviewComponent,
    WASAlertComponent,
    PopoverUpComponent,
    CustomValidatorDirective,
    DisplayAppFullwidthComponent,
    ReviewsComponent,
    DisplayAppReviewComponent,
    AppGroupReviewsComponent,
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
  entryComponents: [WasUp, WasAlert, WasReview, WasSSO, WasStore],
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
