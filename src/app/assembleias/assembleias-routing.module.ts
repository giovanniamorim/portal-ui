import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';
import { AssembleiaFormComponent } from './assembleia-form/assembleia-form.component';
import { AssembleiasComponent } from './assembleias/assembleias.component';


const routes: Routes = [
  { 
    path: "", 
    component: AssembleiasComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_READ']}
   },
  { 
    path: "novo", 
    component: AssembleiaFormComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_CREATE']}
  },
  { 
    path: "editar/:id", 
    component: AssembleiaFormComponent,
    canActivate: [ AuthGuard ],
    data: {roles: ['ROLE_UPDATE']}
   },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssembleiasRoutingModule { }
