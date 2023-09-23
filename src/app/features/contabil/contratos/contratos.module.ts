import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '@coreui/angular';
import { NgxCurrencyModule } from 'ngx-currency';

import { ContratoFormComponent } from './contrato-form/contrato-form.component';
import { ContratosRoutingModule } from './contratos-routing.module';
import { ContratoSearchComponent } from './contratos-search/contrato-search.component';
import { ContratosComponent } from './contratos/contratos.component';
import { FileUploadModule } from 'src/app/shared/utils/file-upload/file-upload.module';


@NgModule({
  declarations: [
    ContratosComponent,
    ContratoFormComponent,
    ContratoSearchComponent

  ],
  imports: [
    CommonModule,
    ContratosRoutingModule,
    MatTableModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSortModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    SharedModule,
    NgxCurrencyModule,
    FileUploadModule
  ]
})
export class ContratosModule { }
