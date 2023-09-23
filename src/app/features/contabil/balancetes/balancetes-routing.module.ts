import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { BalanceteFormComponent } from './balancete-form/balancete-form.component';
import { BalancetesComponent } from './balancetes/balancetes.component'

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
        redirectTo: 'balancetes',
      },
      {
        path: '',
        component: BalancetesComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Balancetes', roles: ['ROLE_READ']}
      },
      {
        path: 'novo',
        component: BalanceteFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Novo Balancete', roles: ['ROLE_CREATE']}
      },
      {
        path: 'editar/:id',
        component: BalanceteFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Editar Balancete', roles: ['ROLE_UPDATE']}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalancetesRoutingModule {}

