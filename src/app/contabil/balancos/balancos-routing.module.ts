import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { BalancoFormComponent } from './balanco-form/balanco-form.component';

import { BalancosComponent } from './balancos/balancos.component';

const routes: Routes = [
  { 
    path: "", component: BalancosComponent,
    canActivate: [AuthGuard],
    data: {roles: ['ROLE_READ']}
   },
  { 
    path: "novo", component: BalancoFormComponent,
    canActivate: [AuthGuard],
    data: {roles: ['ROLE_CREATE']}
   },
  { 
    path: "editar/:id", component: BalancoFormComponent,
    canActivate: [AuthGuard],
    data: {roles: ['ROLE_UPDATE']}
   },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalancosRoutingModule { }
