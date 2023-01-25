import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecucaoFormComponent } from './execucao-form/execucao-form.component';

import { ExecucoesComponent } from './execucoes/execucoes.component';

const routes: Routes = [
  { path: "", component: ExecucoesComponent },
  { path: "novo", component: ExecucaoFormComponent },
  { path: "editar/:id", component: ExecucaoFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecucoesRoutingModule { }
