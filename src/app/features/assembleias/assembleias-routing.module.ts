import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssembleiaFormComponent } from './assembleia-form/assembleia-form.component';
import { AssembleiasComponent } from './assembleias/assembleias.component';
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
        redirectTo: 'assembleias',
      },
      { 
        path: "", 
        component: AssembleiasComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Assembleias', roles: ['ROLE_READ']}
      },
      { 
        path: "novo", 
        component: AssembleiaFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Nova Assembleia', roles: ['ROLE_CREATE']}
      },
      { 
        path: "editar/:id", 
        component: AssembleiaFormComponent,
        canActivate: [ AuthGuard ],
        data: {title: 'Editar Assembleia', roles: ['ROLE_UPDATE']}
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssembleiasRoutingModule { }
