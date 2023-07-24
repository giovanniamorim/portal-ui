import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
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
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgxCurrencyModule } from 'ngx-currency';

import { FileUploadModule } from '../../file-upload/file-upload.module';
import { ModalImageComponent } from '../lancamentos/modal/modal-image.component';
import { BuscaComponent } from './busca/busca.component';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';
import { LancamentosRoutingModule } from './lancamentos-routing.module';
import { LancamentosComponent } from './lancamentos/lancamentos.component';



export const MY_FORMATS = {
    parse: {
      dateInput: "DD/MM/YYYY"
    },
    display: {
      dateInput: "DD/MM/YYYY",
      monthYearLabel: "MMM YYYY",
      dateA11yLabel: "DD/MM/YYYY",
      monthYearA11yLabel: "MMMM YYYY"
    }
  };


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
        MatExpansionModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatTableExporterModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
          },
          { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
          DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LancamentosModule { }
