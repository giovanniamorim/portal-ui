import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { InventarioFormComponent } from './inventario-form/inventario-form.component';

import { InventarioComponent } from './inventario/inventario.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Contábil',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inventario',
      },
      { 
        path: '', component: InventarioComponent,
        canActivate: [ AuthGuard ],
        data: {title: 'Inventário', roles: ['ROLE_READ']}
      },
      { 
        path: "novo", component: InventarioFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Novo Item', roles: ['ROLE_CREATE']}
      },
      { 
        path: "editar/:id", component: InventarioFormComponent,
        canActivate: [ AuthGuard ],
        data: { title: 'Editar Item', roles: ['ROLE_UPDATE']}
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
