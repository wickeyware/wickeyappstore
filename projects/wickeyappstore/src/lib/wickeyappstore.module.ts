// import * as Raven from 'raven-js';
import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// MATERIAL
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { CdkTableModule } from '@angular/cdk/table';
import { LayoutModule } from '@angular/cdk/layout';

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
import { WasLeaderboard } from './ui/popover/wasleaderboard/wasleaderboard.dialog';
import { WasNewsAction } from './ui/popover/wasnewsaction/wasnewsaction.dialog';
import { WasNews } from './ui/popover/wasnews/wasnews.dialog';
import { NewsitemComponent } from './ui/popover/wasnews/newsitem/newsitem.component';

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
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CdkTableModule,
    LayoutModule,
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
    MatTableModule,
    MatBadgeModule,
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
    WasLeaderboard,
    WasPay,
    WasNews,
    WasNewsAction,
    NewsitemComponent,
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
    WasLeaderboard,
    WasPay,
    WasNews,
    WasNewsAction,
    NewsitemComponent,
    WasProfile,
    ReviewsComponent,
    DisplayInAppComponent,
    GetCategoryPipe,
    CdkTableModule,
    LayoutModule,
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
    MatTableModule,
    MatSelectModule,
    MatTabsModule,
    MatBadgeModule,
    MatToolbarModule
  ],
  entryComponents: [WasUp, WasAlert, WasReview, WasSSO, WasShop, WasLeaderboard, WasPay, WasNews, WasNewsAction, WasProfile],
})
export class WickeyAppStoreModule { }
