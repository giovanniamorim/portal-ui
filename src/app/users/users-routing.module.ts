import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';
import { UserFormComponent } from './user-form/user-form.component';

import { UsersComponent } from './users/users.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Acesso',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'usuarios',
      },
      { 
        path: "", component: UsersComponent,
        canActivate: [ AuthGuard],
        data: { title: 'Usuários', roles: ['ROLE_CREATE']}
      },
      { 
        path: "novo", component: UserFormComponent,
        canActivate: [ AuthGuard],
        data: { title: 'Novo Usuário', roles: ['ROLE_CREATE']}
      },
      { 
        path: "editar/:id", component: UserFormComponent,
        canActivate: [ AuthGuard],
        data: { title: 'Editar Usuário', roles: ['ROLE_UPDATE']}
      },
      { 
        path: "detalhe/:id", component: UserDetailsComponent,
        canActivate: [ AuthGuard],
        data: { title: 'Detalhes do Usuário', roles: ['ROLE_READ']}
      },
      { 
        path: "change-password", component: ChangePasswordComponent,
        canActivate: [ AuthGuard],
        data: { title: 'Alterar Senha', roles: ['ROLE_READ']}
      },
      ],
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
