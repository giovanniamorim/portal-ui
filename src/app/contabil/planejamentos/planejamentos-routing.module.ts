import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { PlanejamentoFormComponent } from './planejamento-form/planejamento-form.component';

import { PlanejamentosComponent } from './planejamentos/planejamentos.component';

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
        redirectTo: 'planejamentos',
      },
      { 
        path: '', component: PlanejamentosComponent,
        canActivate: [ AuthGuard ],
        data: {title: 'Planejamentos', roles: ['ROLE_READ']}
      },
      { 
        path: "novo", component: PlanejamentoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Novo Planejamento', roles: ['ROLE_CREATE']}
      },
      { 
        path: "editar/:id", component: PlanejamentoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Editar Planejamento', roles: ['ROLE_UPDATE']}
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanejamentosRoutingModule { }
