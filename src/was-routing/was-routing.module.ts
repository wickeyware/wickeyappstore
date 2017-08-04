import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppDetailPageComponent } from '../display-apps/app-detail-page/app-detail-page.component';

const wasRoutes: Routes = [
  {path: 'was/:slug', component: AppDetailPageComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(wasRoutes)],
  exports: [ RouterModule]
})
export class WasRoutingModule { }
