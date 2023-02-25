import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegimentosComponent } from './regimentos/regimentos.component'
import { RegimentosRoutingModule } from './regimentos-routing.module'
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
import { RegimentoFormComponent } from './regimento-form/regimento-form.component'
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FileUploadModule } from 'src/app/file-upload/file-upload.module';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [
    RegimentosComponent,
    RegimentoFormComponent,
  ],
  imports: [
    CommonModule,
    RegimentosRoutingModule,
    FormsModule,
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
    MatSelectModule,
    MatAutocompleteModule,
    SharedModule,
    FileUploadModule,
    MatDatepickerModule
  ]
})
export class RegimentosModule { }
