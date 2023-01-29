import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssembleiaFormComponent } from './assembleia-form/assembleia-form.component';
import { AssembleiasComponent } from './assembleias/assembleias.component';


const routes: Routes = [
  { path: "", component: AssembleiasComponent },
  { path: "novo", component: AssembleiaFormComponent
 },
  { path: "editar/:id", component: AssembleiaFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssembleiasRoutingModule { }
