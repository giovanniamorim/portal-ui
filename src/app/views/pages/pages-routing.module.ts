import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page500Component } from './page500/page500.component';

const routes: Routes = [
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
