import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import Swal from 'sweetalert2'
import { IExecucao } from './interfaces/execucoes.interface'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ExecucoesService {
  private readonly BaseUrl = environment.apiUrl + '/api/execucoes'
  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IExecucao[]>(`${this.BaseUrl}/`, {
      headers: this.headers,
      params,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IExecucao[]>(`${this.BaseUrl}/todas`, {
      headers: this.headers,
    })
  }

  create(execucao: IExecucao) {
    return this.httpClient.post<IExecucao>(this.BaseUrl, execucao, {
      headers: this.headers,
    })
  }

  remove(execucao: IExecucao) {
    return this.httpClient.delete(`${this.BaseUrl}/${execucao.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IExecucao>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(execucao: IExecucao) {
    return this.httpClient
      .put<IExecucao>(`${this.BaseUrl}/${execucao.id}`, execucao, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateExecucao(id: number, execucao: IExecucao): Observable<IExecucao> {
    return this.httpClient
      .put<IExecucao>(`${this.BaseUrl}/${id}`, execucao, {
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
