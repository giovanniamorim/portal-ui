import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page500Component } from './views/pages/page500/page500.component';

import { RegisterComponent } from './views/pages/register/register.component';
import { AuthGuard } from './seguranca/auth.guard';
import { LoginFormComponent } from './seguranca/login-form/login-form.component';
import { Page403Component } from './seguranca/page-403/page-403.component';
import { Page404Component } from './seguranca/page-404/page-404.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
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
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_READ'] }
      },
      {
        path: 'lancamentos',
        loadChildren: () => import('./contabil/lancamentos/lancamentos.module').then( m => m.LancamentosModule),
      },
      {
        path: 'balancetes',
        loadChildren: () => import('./contabil/balancetes/balancetes.module').then( m => m.BalancetesModule),
      },
      {
        path: 'balancos',
        loadChildren: () => import('./contabil/balancos/balancos.module').then( m => m.BalancosModule)
      },
      {
        path: 'planejamentos',
        loadChildren: () => import('./contabil/planejamentos/planejamentos.module').then( m => m.PlanejamentosModule)
      },
      {
        path: 'execucoes',
        loadChildren: () => import('./contabil/execucoes/execucoes.module').then( m => m.ExecucoesModule),
      },
      {
        path: 'inventario',
        loadChildren: () => import('./contabil/inventario/inventario.module').then( m => m.InventarioModule),
      },
      {
        path: 'assembleias',
        loadChildren: () => import('./assembleias/assembleias.module').then( m => m.AssembleiasModule),
      },
      {
        path: 'juridico/eventos',
        loadChildren: () => import('./juridico/evento/evento.module').then( m => m.EventoModule),
      },
      {
        path: 'juridico/processos',
        loadChildren: () => import('./juridico/processo/processo.module').then( m => m.ProcessoModule),
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./users/users.module').then( m => m.UsersModule),
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule)
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule)
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule)
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule)
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
      {
        path: 'uploads',
        loadChildren: () =>
          import('./upload/upload.module').then((m) => m.UploadModule)
      },
      
      
    ]
  },
  // {
  //   path: '404',
  //   component: Page404Component,
  //   data: {
  //     title: 'Page 404'
  //   }
  // },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginFormComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
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
