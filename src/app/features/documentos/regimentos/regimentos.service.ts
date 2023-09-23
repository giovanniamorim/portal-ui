import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import Swal from 'sweetalert2'

import { IRegimento } from './regimento.interface'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class RegimentosService {
  private readonly BaseUrl = environment.apiUrl + '/api/regimentos'
  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IRegimento[]>(`${this.BaseUrl}`, {
      headers: this.headers,
      params,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IRegimento[]>(`${this.BaseUrl}/todos`, {
      headers: this.headers,
    })
  }

  create(regimento: IRegimento) {
    return this.httpClient.post<IRegimento>(this.BaseUrl, regimento, {
      headers: this.headers,
    })
  }

  remove(regimento: IRegimento) {
    return this.httpClient.delete(`${this.BaseUrl}/${regimento.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IRegimento>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(regimento: IRegimento) {
    return this.httpClient
      .put<IRegimento>(`${this.BaseUrl}/${regimento.id}`, regimento, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateRegimento(id: number, regimento: IRegimento): Observable<IRegimento> {
    return this.httpClient
      .put<IRegimento>(`${this.BaseUrl}/${id}`, regimento, {
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
