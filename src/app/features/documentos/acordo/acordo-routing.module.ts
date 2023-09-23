import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcordoFormComponent } from './acordo-form/acordo-form.component';
import { AcordosComponent } from './acordos/acordos.component';
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
        redirectTo: 'acordos',
      },
      {
        path: '',
        component: AcordosComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Acordos', roles: ['ROLE_READ']}
      },
      {
        path: 'novo',
        component: AcordoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Novo Acordo', roles: ['ROLE_CREATE']}
      },
      {
        path: 'editar/:id',
        component: AcordoFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Editar Acordo', roles: ['ROLE_UPDATE']}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcordoRoutingModule {}

