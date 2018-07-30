// import * as Raven from 'raven-js';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, ErrorHandler } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { CommonModule } from '@angular/common';
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

import { WickeyAppStoreComponent } from './wickeyappstore.component';
// WAS CORE //
import { WasSpinnerComponent } from '../../../wickeyappstore/src/lib/was-spinner/was-spinner.component';
import { DisplayInAppComponent } from '../../../wickeyappstore/src/lib/display-apps/display-inapp/display-inapp.component';
// REVIEWS //
import { ReviewsComponent } from '../../../wickeyappstore/src/lib/ui/reviews/reviews.component';
// PIPES //
import { GetCategoryPipe } from '../../../wickeyappstore/src/lib/pipes/get-category.pipe';
// WAS MATERIAL POPOVERS //
import { WasUp } from '../../../wickeyappstore/src/lib/ui/popover/wasup/wasup.dialog';
import { WasAlert } from '../../../wickeyappstore/src/lib/ui/popover/wasalert/wasalert.dialog';
import { WasReview } from '../../../wickeyappstore/src/lib/ui/popover/wasreview/wasreview.dialog';
import { WasSSO } from '../../../wickeyappstore/src/lib/ui/popover/wassso/wassso.dialog';
import { WasMenuBtn } from '../../../wickeyappstore/src/lib/ui/popover/wasmenu-btn/wasmenu-btn.component';
import { WasShop } from '../../../wickeyappstore/src/lib/ui/popover/wasshop/wasshop.dialog';
import { WasPay } from '../../../wickeyappstore/src/lib/ui/popover/waspay/waspay.dialog';
import { WasProfile } from '../../../wickeyappstore/src/lib/ui/popover/wasprofile/wasprofile.dialog';

// Raven.config('https://69970e94d1d148dc84a0dfa43b3c2369@sentry.io/1246509', {release: '2.15.3'}).install();

// /** @ignore */
// export class RavenErrorHandler implements ErrorHandler {
//   handleError(err: any): void {
//     Raven.captureException(err);
//     // Raven.showReportDialog({});
//   }
// }
// providers: [ { provide: ErrorHandler, useClass: RavenErrorHandler } ]

@NgModule({
  declarations: [
    WickeyAppStoreComponent,
    WasSpinnerComponent,
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
  entryComponents: [
    WickeyAppStoreComponent,
    WasUp, WasAlert, WasReview, WasSSO, WasShop, WasPay, WasProfile
  ]
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const customWAS = createCustomElement(WickeyAppStoreComponent, {injector: this.injector});
    customElements.define('wickey-appstore', customWAS);
  }
}
