import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload.component';
import { AuthGuard } from '../seguranca/auth.guard';
const routes: Routes = [
  { 
    path: "", component: FileUploadComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ROLE_READ']}
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileUploadRoutingModule {}

