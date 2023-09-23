import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegimentoFormComponent } from './regimento-form/regimento-form.component';
import { RegimentosComponent } from './regimentos/regimentos.component'
import { AuthGuard } from 'src/app/seguranca/auth.guard';

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
        redirectTo: 'regimentos',
      },
      {
        path: '',
        component: RegimentosComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Regimentos', roles: ['ROLE_READ']}
      },
      {
        path: 'novo',
        component: RegimentoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Novo Regimento', roles: ['ROLE_CREATE']}
      },
      {
        path: 'editar/:id',
        component: RegimentoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Editar Regimento', roles: ['ROLE_UPDATE']}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegimentosRoutingModule {}

