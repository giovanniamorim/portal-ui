import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanejamentoFormComponent } from './planejamento-form/planejamento-form.component';

import { PlanejamentosComponent } from './planejamentos/planejamentos.component';

const routes: Routes = [
  { path: "", component: PlanejamentosComponent },
  { path: "novo", component: PlanejamentoFormComponent },
  { path: "editar/:id", component: PlanejamentoFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanejamentosRoutingModule { }
