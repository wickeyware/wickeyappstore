/**
 * menu.module
 */

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MenuContainerComponent } from './menu-container.component';
import { MenuOptions } from './menu-options.service';
import { MenuWingComponent } from './menu-wing.component';
import { SpinService } from './menu-spin.service';

/* HammerJS */
// import 'hammerjs';

export * from './menu-container.component';
export * from './menu-options.service';
export * from './menu-wing.component';
export * from './menu-spin.service';

@NgModule({
    declarations: [
        MenuContainerComponent,
        MenuWingComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
    ],
    exports: [
        MenuContainerComponent,
    ],
    providers: [
        MenuOptions,
        SpinService,
    ]
})
export class FanMenuModule {
}
