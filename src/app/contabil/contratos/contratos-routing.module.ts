import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../seguranca/auth.guard';
import { ContratoFormComponent } from './contrato-form/contrato-form.component';
import { ContratosComponent } from './contratos/contratos.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Documentos',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'contratos',
      },
      {
        path: '',
        component: ContratosComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Contratos', roles: ['ROLE_READ']}
      },
      {
        path: 'novo',
        component: ContratoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Novo Contrato', roles: ['ROLE_CREATE']}
      },
      {
        path: 'editar/:id',
        component: ContratoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Editar Contrato', roles: ['ROLE_UPDATE']}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratosRoutingModule {}

