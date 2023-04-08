import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { BalancoFormComponent } from './balanco-form/balanco-form.component';

import { BalancosComponent } from './balancos/balancos.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Contábil',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'balancos',
      },
      { 
        path: '', component: BalancosComponent,
        canActivate: [AuthGuard],
        data: {title: 'Balanços', roles: ['ROLE_READ']}
      },
      { 
        path: "novo", component: BalancoFormComponent,
        canActivate: [AuthGuard],
        data: {title: 'Novo Balanço', roles: ['ROLE_CREATE']}
      },
      { 
        path: "editar/:id", component: BalancoFormComponent,
        canActivate: [AuthGuard],
        data: {title: 'Editar Balanço', roles: ['ROLE_UPDATE']}
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalancosRoutingModule { }
