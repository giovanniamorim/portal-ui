import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './seguranca/auth.guard';
import { ForgotPasswordComponent } from './seguranca/forgot-password/forgot-password.component';
import { LoginFormComponent } from './seguranca/login-form/login-form.component';
import { Page403Component } from './seguranca/page-403/page-403.component';
import { Page404Component } from './seguranca/page-404/page-404.component';
import { ResetPasswordComponent } from './seguranca/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {
      title: 'Recuperar Senha'
    }
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    data: {
      title: 'Nova Senha'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_PESQUISAR_PESSOA'] }
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_READ'] }
      },
      {
        path: 'lancamentos',
        loadChildren: () => import('./features/contabil/lancamentos/lancamentos.module').then( m => m.LancamentosModule),
      },
      {
        path: 'balancetes',
        loadChildren: () => import('./features/contabil/balancetes/balancetes.module').then( m => m.BalancetesModule),
      },
      {
        path: 'balancos',
        loadChildren: () => import('./features/contabil/balancos/balancos.module').then( m => m.BalancosModule)
      },
      {
        path: 'planejamentos',
        loadChildren: () => import('./features/contabil/planejamentos/planejamentos.module').then( m => m.PlanejamentosModule)
      },
      {
        path: 'execucoes',
        loadChildren: () => import('./features/contabil/execucoes/execucoes.module').then( m => m.ExecucoesModule),
      },

      {
        path: 'inventario',
        loadChildren: () => import('./features/contabil/inventario/inventario.module').then( m => m.InventarioModule),
      },
      {
        path: 'assembleias',
        loadChildren: () => import('./features/assembleias/assembleias.module').then( m => m.AssembleiasModule),
      },
      {
        path: 'juridico/eventos',
        loadChildren: () => import('./features/juridico/evento/evento.module').then( m => m.EventoModule),
      },
      {
        path: 'juridico/processos',
        loadChildren: () => import('./features/juridico/processo/processo.module').then( m => m.ProcessoModule),
      },
      {
        path: 'documentos/contratos',
        loadChildren: () => import('./features/contabil/contratos/contratos.module').then( m => m.ContratosModule),
      },
      {
        path: 'documentos/regimentos',
        loadChildren: () => import('./features/documentos/regimentos/regimentos.module').then( m => m.RegimentosModule),
      },
      {
        path: 'documentos/acordos',
        loadChildren: () => import('./features/documentos/acordo/acordo.module').then( m => m.AcordoModule),
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./features/users/users.module').then( m => m.UsersModule),
      },
     
      {
        path: 'files',
        loadChildren: () =>
          import('./shared/utils/file-upload/file-upload.module').then((m) => m.FileUploadModule)
      },
      {
        path: 'arquivos',
        loadChildren: () =>
          import('./shared/utils/files/files.module').then((m) => m.FilesModule)
      },
      
    ]
  },
  {
    path: 'login',
    component: LoginFormComponent,
    data: {
      title: 'Login Page'
    }
  },  
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
  { path: 'nao-autorizado', component: Page403Component },
  { path: 'pagina-nao-encontrada', component: Page404Component },
  { path: '**', redirectTo: 'pagina-nao-encontrada' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
