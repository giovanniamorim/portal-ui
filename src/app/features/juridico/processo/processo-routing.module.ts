import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessoFormComponent } from './processo-form/processo-form.component';
import { ProcessoDetailComponent } from './processo-detail/processo-detail.component';
import { ProcessosComponent } from './processos/processos.component';
import { AuthGuard } from 'src/app/seguranca/auth.guard';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Jurídico',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'processos',
      },
      { 
        path: "", component: ProcessosComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Processos', roles: ['ROLE_READ']}
      },
      { 
        path: "novo", component: ProcessoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Novo Processo', roles: ['ROLE_CREATE']}
      },
      { 
        path: "editar/:id", component: ProcessoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Editar Processo',  roles: ['ROLE_UPDATE']}
      },
      { 
        path: "detalhe/:id", component: ProcessoDetailComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Detalhe Processo',  roles: ['ROLE_READ']}
      },
    ],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessoRoutingModule { }
