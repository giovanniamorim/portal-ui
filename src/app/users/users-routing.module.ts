import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';

import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: "", component: UsersComponent },
  { path: "novo", component: UserFormComponent },
  { path: "editar/:id", component: UserFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
