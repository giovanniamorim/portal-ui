import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventoFormComponent } from './evento-form/evento-form.component';
import { EventosComponent } from './eventos/eventos.component';


const routes: Routes = [
  { path: "", component: EventosComponent },
  { path: "novo", component: EventoFormComponent },
  { path: "editar/:id", component: EventoFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventoRoutingModule { }
