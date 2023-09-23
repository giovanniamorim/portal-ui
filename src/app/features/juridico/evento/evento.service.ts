import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import Swal from 'sweetalert2'
import { IEvento } from './interfaces/evento.interface'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private readonly BaseUrl = environment.apiUrl + '/api/juridico/eventos'
  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IEvento[]>(`${this.BaseUrl}/`, {
      headers: this.headers,
      params,
    })
  }

  create(evento: IEvento) {
    return this.httpClient.post<IEvento>(this.BaseUrl, evento, {
      headers: this.headers,
    })
  }

  remove(evento: IEvento) {
    return this.httpClient.delete(`${this.BaseUrl}/${evento.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IEvento>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(id: number, evento: IEvento): Observable<IEvento> {
    return this.httpClient
      .put<IEvento>(`${this.BaseUrl}/${id}`, evento, { headers: this.headers })
      .pipe(catchError(this.errorHandler))
  }

  errorHandler(error: any) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    } else {
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
