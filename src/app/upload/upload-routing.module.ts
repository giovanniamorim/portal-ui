import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../seguranca/auth.guard';
import { UploadComponent } from './upload/upload.component';


const routes: Routes = [
  
  { 
    path: "", component: UploadComponent,
    canActivate: [ AuthGuard],
    data: { roles: ['ROLE_CREATE']}
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadRoutingModule { }
