import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
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

import { UploadModule } from '../../upload/upload.module';
import { ModalImageComponent } from '../lancamentos/modal/modal-image.component';
import { LancamentosComponent } from './lancamentos/lancamentos.component';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';
import { LancamentosRoutingModule } from './lancamentos-routing.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileUploadModule } from "../../file-upload/file-upload.module";



@NgModule({
    declarations: [
        LancamentosComponent,
        LancamentoFormComponent,
        ModalImageComponent,
    ],
    imports: [
        CommonModule,
        LancamentosRoutingModule,
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
        NgxCurrencyModule,
        FileUploadModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LancamentosModule { }
