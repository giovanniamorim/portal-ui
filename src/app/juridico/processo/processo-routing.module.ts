import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessoFormComponent } from './processo-form/processo-form.component';
import { ProcessoDetailComponent } from './processo-detail/processo-detail.component';
import { ProcessosComponent } from './processos/processos.component';


const routes: Routes = [
  { path: "", component: ProcessosComponent },
  { path: "novo", component: ProcessoFormComponent },
  { path: "editar/:id", component: ProcessoFormComponent },
  { path: "detalhe/:id", component: ProcessoDetailComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessoRoutingModule { }
