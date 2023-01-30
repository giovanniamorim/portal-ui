import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';

import { LancamentosComponent } from './lancamentos/lancamentos.component';




const routes: Routes = [
        { 
          path: "novo", component: LancamentoFormComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_CREATE'] }
         },
        { 
          path: "receitas", component: LancamentosComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_READ'] }
         },
        { 
          path: "despesas", component: LancamentosComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_READ'] }
         },
        { 
          path: "receitas/editar/:id", component: LancamentoFormComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_UPDATE'] } 
        },
        { 
          path: "despesas/editar/:id", component: LancamentoFormComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_UPDATE'] } 
        }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LancamentosRoutingModule { }
