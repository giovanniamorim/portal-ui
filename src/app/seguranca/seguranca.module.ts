import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { environment } from './../../environments/environment';
import { AuthGuard } from './auth.guard';
import { LoginFormComponent } from './login-form/login-form.component';
import { MoneyHttpInterceptor } from './money-http-interceptor';
import { Page403Component } from './page-403/page-403.component';
import { Page404Component } from './page-404/page-404.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';

export function tokenGetter(): string {
  return localStorage.getItem('token')!;
}
@NgModule({
  declarations: [
    LoginFormComponent,
    Page403Component,
    Page404Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    

    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: environment.tokenAllowedDomains,
        disallowedRoutes: environment.tokenDisallowedRoutes
      }
    }),

    

    SegurancaRoutingModule,
  ],
  providers: [
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MoneyHttpInterceptor,
      multi: true
    },
    AuthGuard
  ]
})
export class SegurancaModule { }
