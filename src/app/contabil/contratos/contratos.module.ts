import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratosComponent } from './contratos/contratos.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@coreui/angular';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ContratosRoutingModule } from './contratos-routing.module';
import { ContratoFormComponent } from './contrato-form/contrato-form.component';
import { ContratoSearchComponent } from './contratos-search/contrato-search.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { UploadModule } from 'src/app/upload/upload.module';
import { NgxCurrencyModule } from 'ngx-currency';


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
    UploadModule,
    NgxCurrencyModule
  ]
})
export class ContratosModule { }
