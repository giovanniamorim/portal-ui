import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment'
import { ILancamentos } from './interfaces/lancamentos.interface';

@Injectable({
  providedIn: 'root'
})
export class LancamentosService {

  private readonly BaseUrl = environment.apiUrl + '/api/lancamentos'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}`, {params});
	}

  listReceitas(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}/receitas`, {params});
	}

  listDespesas(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}/despesas`, {params});
	}

  create(lancamento: ILancamentos){
    return this.httpClient.post<ILancamentos>(this.BaseUrl, lancamento);
  }

  remove(lancamento: ILancamentos){
    return this.httpClient.delete(`${this.BaseUrl}/${lancamento.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<ILancamentos>(`${this.BaseUrl}/${id}`);

  }

  update(lancamento: ILancamentos){
    return this.httpClient.put<ILancamentos>(`${this.BaseUrl}/${lancamento.id}`, lancamento)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateLancamento(id: number, lancamento: ILancamentos): Observable<ILancamentos> {
    console.log("id no service", id);
    console.log("lancamento no service",  lancamento);
    return this.httpClient.put<ILancamentos>(`${this.BaseUrl}/${id}`, lancamento)
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

 httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

    
}
