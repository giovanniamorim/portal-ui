import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';

import { LancamentosComponent } from './lancamentos/lancamentos.component';




const routes: Routes = [
  
        { path: "novo", component: LancamentoFormComponent },
        { path: "receitas", component: LancamentosComponent },
        { path: "despesas", component: LancamentosComponent },
        { path: "receitas/editar/:id", component: LancamentoFormComponent },
        { path: "despesas/editar/:id", component: LancamentoFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LancamentosRoutingModule { }
