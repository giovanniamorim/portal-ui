import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalancoFormComponent } from './balanco-form/balanco-form.component';

import { BalancosComponent } from './balancos/balancos.component';

const routes: Routes = [
  { path: "", component: BalancosComponent },
  { path: "novo", component: BalancoFormComponent },
  { path: "editar/:id", component: BalancoFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalancosRoutingModule { }
