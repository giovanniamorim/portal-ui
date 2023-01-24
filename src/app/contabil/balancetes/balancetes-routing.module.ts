import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        data: {
          title: 'Balancetes',
        },
      },
      {
        path: 'novo',
        component: BalanceteFormComponent,
        data: {
          title: 'Novo Balancete',
        },
      },
      {
        path: 'editar/:id',
        component: BalanceteFormComponent,
        data: {
          title: 'Editar Balancete',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalancetesRoutingModule {}

