import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { ExecucaoFormComponent } from './execucao-form/execucao-form.component';

import { ExecucoesComponent } from './execucoes/execucoes.component';

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
        redirectTo: 'execucoes',
      },
      { 
        path: "", component: ExecucoesComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Execuções', roles: ['ROLE_READ']}
      },
      { 
        path: "novo", component: ExecucaoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Nova Execução', roles: ['ROLE_CREATE']}
      },
      { 
        path: "editar/:id", component: ExecucaoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Editar Execução', roles: ['ROLE_UPDATE']}
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecucoesRoutingModule { }
