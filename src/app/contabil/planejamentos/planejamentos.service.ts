import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';
import { IPlanejamento } from './interfaces/planejamentos.interface';

@Injectable({
  providedIn: 'root',
})
export class PlanejamentosService {
  private readonly BaseUrl = environment.apiUrl + '/api/planejamentos'
  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IPlanejamento[]>(`${this.BaseUrl}/`, {
      headers: this.headers,
      params,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IPlanejamento[]>(`${this.BaseUrl}/todos`, {
      headers: this.headers,
    })
  }

  create(planejamento: IPlanejamento) {
    return this.httpClient.post<IPlanejamento>(this.BaseUrl, planejamento, {
      headers: this.headers,
    })
  }

  remove(planejamento: IPlanejamento) {
    return this.httpClient.delete(`${this.BaseUrl}/${planejamento.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IPlanejamento>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(planejamento: IPlanejamento) {
    return this.httpClient
      .put<IPlanejamento>(`${this.BaseUrl}/${planejamento.id}`, planejamento, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updatePlanejamento(
    id: number,
    planejamento: IPlanejamento,
  ): Observable<IPlanejamento> {
    return this.httpClient
      .put<IPlanejamento>(`${this.BaseUrl}/${id}`, planejamento, {
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
