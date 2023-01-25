import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '@coreui/angular';

import { UploadModule } from '../../upload/upload.module';
import { ExecucaoFormComponent } from './execucao-form/execucao-form.component';
import { ExecucoesRoutingModule } from './execucoes-routing.module';
import { ExecucoesComponent } from './execucoes/execucoes.component';


@NgModule({
    declarations: [
        ExecucoesComponent,
        ExecucaoFormComponent,
    ],
    imports: [
        CommonModule,
        ExecucoesRoutingModule,
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
        MatSelectModule,
        MatSortModule,
        SharedModule,
        UploadModule
    ]
})
export class ExecucoesModule { }
