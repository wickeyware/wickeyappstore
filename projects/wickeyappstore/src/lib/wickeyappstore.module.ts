// import * as Raven from 'raven-js';
import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// MATERIAL
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatTabsModule,
  MatToolbarModule,
  MatStepperModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';

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

// Raven.config('https://69970e94d1d148dc84a0dfa43b3c2369@sentry.io/1246509', {release: '2.15.2'}).install();

// /** @ignore */
// export class RavenErrorHandler implements ErrorHandler {
//   handleError(err: any): void {
//     Raven.captureException(err);
//     // Raven.showReportDialog({});
//   }
// }
// providers: [ { provide: ErrorHandler, useClass: RavenErrorHandler } ]

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
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatTabsModule,
    MatToolbarModule
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
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatTabsModule,
    MatToolbarModule
  ],
  entryComponents: [WasUp, WasAlert, WasReview, WasSSO, WasShop, WasPay, WasProfile],
})
export class WickeyAppStoreModule { }
