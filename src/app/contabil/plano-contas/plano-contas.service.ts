import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';
import { IPlanoContas } from './interfaces/plano-contas.interface';

@Injectable({
  providedIn: 'root'
})
export class PlanoContasService {

  private readonly BaseUrl = environment.apiUrl + '/api/planocontas'

  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IPlanoContas[]>(`${this.BaseUrl}/`, { headers:this.headers, params});
	}

  create(planoContas: IPlanoContas){
    return this.httpClient.post<IPlanoContas>(this.BaseUrl, planoContas, {headers:this.headers});
  }

  remove(planoContas: IPlanoContas){
    return this.httpClient.delete(`${this.BaseUrl}/${planoContas.id}`, {headers:this.headers});
  }
  
  loadById(id: number) {
    return this.httpClient.get<IPlanoContas>(`${this.BaseUrl}/${id}`, {headers:this.headers});

  }

  update(planoContas: IPlanoContas){
    return this.httpClient.put<IPlanoContas>(`${this.BaseUrl}/${planoContas.id}`, planoContas, {headers:this.headers})
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updatePlanoContas(id: number, planoContas: IPlanoContas): Observable<IPlanoContas> {
    return this.httpClient.put<IPlanoContas>(`${this.BaseUrl}/${id}`, planoContas, {headers:this.headers})
    .pipe(
      catchError(this.errorHandler)
    )
  }


  errorHandler(error: any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    }
    return throwError(errorMessage);
 }

    
}
