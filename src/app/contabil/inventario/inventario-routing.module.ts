import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioFormComponent } from './inventario-form/inventario-form.component';

import { InventarioComponent } from './inventario/inventario.component';

const routes: Routes = [
  { path: "", component: InventarioComponent },
  { path: "novo", component: InventarioFormComponent },
  { path: "editar/:id", component: InventarioFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
