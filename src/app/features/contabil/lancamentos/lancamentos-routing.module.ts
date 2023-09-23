import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';

import { LancamentosComponent } from './lancamentos/lancamentos.component';




const routes: Routes = [
  {
    path: '',
    data: { title: 'Lançamentos'},
    children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'despesas',
        },
        { 
          path: "novo", component: LancamentoFormComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_CREATE'], title: 'Novo Lançamento' }
         },
        { 
          path: "receitas", component: LancamentosComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_READ'], title: 'Receitas' }
         },
        { 
          path: "despesas", component: LancamentosComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_READ'], title: 'Despesas' }
         },
        { 
          path: "receitas/editar/:id", component: LancamentoFormComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_UPDATE'], title: 'Editando Receita' } 
        },
        { 
          path: "despesas/editar/:id", component: LancamentoFormComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_UPDATE'], title: 'Editando Despesa' } 
        }
      ]
    }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LancamentosRoutingModule { }
