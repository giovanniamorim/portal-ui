import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';
import { UserFormComponent } from './user-form/user-form.component';

import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { 
    path: "", component: UsersComponent,
    canActivate: [ AuthGuard],
    data: { roles: ['ROLE_CREATE']}
   },
  { 
    path: "novo", component: UserFormComponent,
    canActivate: [ AuthGuard],
    data: { roles: ['ROLE_CREATE']}
   },
  { 
    path: "editar/:id", component: UserFormComponent,
    canActivate: [ AuthGuard],
    data: { roles: ['ROLE_UPDATE']}
   },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
