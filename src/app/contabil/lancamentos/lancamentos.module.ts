import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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

import { FileUploadModule } from '../../file-upload/file-upload.module';
import { ModalImageComponent } from '../lancamentos/modal/modal-image.component';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';
import { LancamentosRoutingModule } from './lancamentos-routing.module';
import { LancamentosComponent } from './lancamentos/lancamentos.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BuscaComponent } from './busca/busca.component'; 
import { MatExpansionModule } from '@angular/material/expansion'; 




@NgModule({
    declarations: [
        LancamentosComponent,
        LancamentoFormComponent,
        ModalImageComponent,
        BuscaComponent,
    ],
    imports: [
        CommonModule,
        LancamentosRoutingModule,
        MatTableModule,
        MatCardModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
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
        MatIconModule,
        FileUploadModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatExpansionModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LancamentosModule { }
