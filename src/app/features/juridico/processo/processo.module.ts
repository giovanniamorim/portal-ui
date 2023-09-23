import { CommonModule, registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '@coreui/angular';

import { ProcessoDetailComponent } from './processo-detail/processo-detail.component';
import { ProcessoFormComponent } from './processo-form/processo-form.component';
import { ProcessoRoutingModule } from './processo-routing.module';
import { ProcessosComponent } from './processos/processos.component';
import { EventoModule } from '../evento/evento.module';
import { FileUploadModule } from 'src/app/shared/utils/file-upload/file-upload.module';

registerLocaleData(ptBr);

@NgModule({
    declarations: [
        ProcessoFormComponent,
        ProcessoDetailComponent,
        ProcessosComponent
    ],
    imports: [
        CommonModule,
        ProcessoRoutingModule,
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
        SharedModule,
        MatDatepickerModule,
        MatSelectModule,
        MatListModule,
        EventoModule,
        FileUploadModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR',},
        { provide: LOCALE_ID, useValue: 'pt' },
    ]
})
export class ProcessoModule { }
