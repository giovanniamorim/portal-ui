import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessoFormComponent } from './processo-form/processo-form.component';
import { ProcessoDetailComponent } from './processo-detail/processo-detail.component';
import { ProcessosComponent } from './processos/processos.component';
import { AuthGuard } from 'src/app/seguranca/auth.guard';


const routes: Routes = [
  { 
    path: "", component: ProcessosComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_READ']}
   },
  { 
    path: "novo", component: ProcessoFormComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_CREATE']}
   },
  { 
    path: "editar/:id", component: ProcessoFormComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_UPDATE']}
   },
  { 
    path: "detalhe/:id", component: ProcessoDetailComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_READ']}
   },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessoRoutingModule { }
