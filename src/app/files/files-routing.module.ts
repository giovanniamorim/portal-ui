import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';
import { FilesComponent } from './files/files.component';

const routes: Routes = [
  { 
    path: "", component: FilesComponent,
    canActivate: [ AuthGuard ],
    data: { title: 'Upload', roles: ['ROLE_READ']}
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilesRoutingModule {}

