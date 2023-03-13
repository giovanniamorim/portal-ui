import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import Swal from 'sweetalert2'

import { environment } from '../../../environments/environment'
import { ILancamentos } from './interfaces/lancamentos.interface'

@Injectable({
  providedIn: 'root',
})
export class LancamentosService {
  private readonly BaseUrl = environment.apiUrl + '/api/lancamentos'

  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
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
    return this.httpClient.delete(`${this.BaseUrl}/${lancamento.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<ILancamentos>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
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
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    }
    return throwError(errorMessage)
  }
}
