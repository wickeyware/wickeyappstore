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

// SERVICES //
import { UserService } from './user.service';
import { PromptUpdateService } from './prompt-update.service';
import { ApiConnectionService } from './api-connection.service';
import { LocalStorageService } from './local-storage.service';
import { WasAppService } from './was-app.service';
// WAS CORE //
import { WasSpinnerComponent } from './was-spinner/was-spinner.component';
import { WickeyAppStoreComponent } from './wickeyappstore.component';
import { DisplayInAppComponent } from './display-apps/display-inapp/display-inapp.component';

// REVIEWS //
import { ReviewsComponent } from './ui/reviews/reviews.component';

// PIPES //
import { GetCategoryPipe } from './pipes/get-category.pipe';
// WAS MATERIAL POPOVERS //
import { WasUp } from './ui/popover/wasup/wasup.dialog';
import { WasAlert } from './ui/popover/wasalert/wasalert.dialog';
import { WasReview } from './ui/popover/wasreview/wasreview.dialog';
import { WasSSO } from './ui/popover/wassso/wassso.dialog';
import { WasMenuBtn } from './ui/popover/wasmenu-btn/wasmenu-btn.component';
import { WasShop } from './ui/popover/wasshop/wasshop.dialog';
import { WasPay } from './ui/popover/waspay/waspay.dialog';
import { WasProfile } from './ui/popover/wasprofile/wasprofile.dialog';

// EXPORT EVERYTHING //
export * from './animations';
export * from './user.service';
export * from './prompt-update.service';
export * from './was-app.service';
export * from './was-spinner/was-spinner.component';
export * from './wickeyappstore.component';
export * from './api-connection.service';
export * from './local-storage.service';
export * from './display-apps/display-inapp/display-inapp.component';
export * from './ui/reviews/reviews.component';
export * from './ui/popover/wasup/wasup.dialog';
export * from './ui/popover/wasalert/wasalert.dialog';
export * from './ui/popover/wasreview/wasreview.dialog';
export * from './ui/popover/wassso/wassso.dialog';
export * from './ui/popover/wasmenu-btn/wasmenu-btn.component';
export * from './ui/popover/wasshop/wasshop.dialog';
export * from './ui/popover/waspay/waspay.dialog';
export * from './ui/popover/wasprofile/wasprofile.dialog';
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
  ],
  declarations: [
    WasSpinnerComponent,
    WickeyAppStoreComponent,
    WasUp,
    WasAlert,
    WasReview,
    WasSSO,
    WasMenuBtn,
    WasShop,
    WasPay,
    WasProfile,
    ReviewsComponent,
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
    WasMenuBtn,
    WasShop,
    WasPay,
    WasProfile,
    ReviewsComponent,
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
  entryComponents: [WasUp, WasAlert, WasReview, WasSSO, WasShop, WasPay, WasProfile],
  providers: [
    ApiConnectionService, LocalStorageService, UserService, WasAppService, PromptUpdateService
  ],
})
export class WickeyAppStoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WickeyAppStoreModule,
      providers: [ApiConnectionService, LocalStorageService, UserService, WasAppService, PromptUpdateService]
    };
  }
}
