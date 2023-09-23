import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { EventoFormComponent } from './evento-form/evento-form.component';
import { EventosComponent } from './eventos/eventos.component';


const routes: Routes = [
  { 
    path: "", component: EventosComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_READ']}
   },
  { 
    path: "novo", component: EventoFormComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_CREATE']}
   },
  { 
    path: "editar/:id", component: EventoFormComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_UPDATE']}
   },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventoRoutingModule { }
