/**
 * menu.module
 * ng2-fan-menu@1.0.1 MIT (Thanks @DanielYKPan https://github.com/DanielYKPan/ng2-fan-menu)
 *
 *  Copyright (c) 2014-2016 Google, Inc.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MenuContainerComponent } from './menu-container.component';
import { MenuOptions } from './menu-options.service';
import { MenuWingComponent } from './menu-wing.component';

/* HammerJS */
// import 'hammerjs';

export * from './menu-container.component';
export * from './menu-options.service';
export * from './menu-wing.component';
// export * from './menu-spin.service';

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
    ]
})
export class FanMenuModule {
}
