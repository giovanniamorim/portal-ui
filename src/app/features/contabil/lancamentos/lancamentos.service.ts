import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { ILancamentos } from './interfaces/lancamentos.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LancamentosService {

  private readonly BaseUrl = environment.apiUrl + '/api/lancamentos'

  public token = localStorage.getItem('token')

  private lancamentoRemovidoSubject = new Subject<void>();

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}


  listAll(): Observable<any> {
    return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}`, {
      headers: this.headers,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}`, {
      headers: this.headers,
    })
  }

  listReceitas(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}/receitas`, {
      headers: this.headers,
      params,
    })
  }

  busca(criterias: any): Observable<any> {
    const params = {...criterias}
    return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}/busca`, {
      headers: this.headers,
      params,
    })
  }


  buscaReceitas(request?: any): Observable<any> {
    const params = request
    return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}/busca?tipoLancamento=Receita`, {
      headers: this.headers,
      params,
    })
  }

  buscaDespesas(request?: any): Observable<any> {
    const params = request
    return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}/busca?tipoLancamento=Despesa`, {
      headers: this.headers,
      params,
    })
  }

  listDespesas(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<ILancamentos[]>(`${this.BaseUrl}/despesas`, {
      headers: this.headers,
      params,
    })
  }

  create(lancamento: ILancamentos) {
    return this.httpClient.post<ILancamentos>(this.BaseUrl, lancamento, {
      headers: this.headers,
    })
  }

  remove(lancamento: ILancamentos) {
    return this.httpClient.delete(`${this.BaseUrl}/${lancamento.id}`, { headers: this.headers })
      .pipe(
        tap(() => this.lancamentoRemovidoSubject.next()),
        catchError(this.errorHandler)
      );
  }

  get lancamentoRemovido$() {
    return this.lancamentoRemovidoSubject.asObservable();
  }

  loadById(id: number) {
    console.log("ID no service: ", id);
    
    return this.httpClient.get<ILancamentos>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    }).pipe(
      catchError(this.errorHandler)
    )
    
  }

  update(lancamento: ILancamentos) {
    return this.httpClient
      .put<ILancamentos>(`${this.BaseUrl}/${lancamento.id}`, lancamento, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateLancamento(
    id: number,
    lancamento: ILancamentos,
  ): Observable<ILancamentos> {
    return this.httpClient
      .put<ILancamentos>(`${this.BaseUrl}/${id}`, lancamento, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: any) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    } 
    return throwError(errorMessage)
  }



}
