import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';
import { IBalanco } from './interfaces/balanco.interface';

@Injectable({
  providedIn: 'root',
})
export class BalancoService {
  private readonly BaseUrl = environment.apiUrl + '/api/balancos'
  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IBalanco[]>(`${this.BaseUrl}/`, {
      headers: this.headers,
      params,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IBalanco[]>(`${this.BaseUrl}/todos`, {
      headers: this.headers,
    })
  }

  create(balanco: IBalanco) {
    return this.httpClient.post<IBalanco>(this.BaseUrl, balanco, {
      headers: this.headers,
    })
  }

  remove(balanco: IBalanco) {
    return this.httpClient.delete(`${this.BaseUrl}/${balanco.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IBalanco>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(balanco: IBalanco) {
    return this.httpClient
      .put<IBalanco>(`${this.BaseUrl}/${balanco.id}`, balanco, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateBalanco(id: number, balanco: IBalanco): Observable<IBalanco> {
    return this.httpClient
      .put<IBalanco>(`${this.BaseUrl}/${id}`, balanco, {
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
