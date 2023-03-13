import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '../../environments/environment';
import { IAssembleias } from './interfaces/assembleias.interface';

@Injectable({
  providedIn: 'root',
})
export class AssembleiasService {
  private readonly BaseUrl = environment.apiUrl + '/api/assembleias'
  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IAssembleias[]>(`${this.BaseUrl}/`, {
      headers: this.headers,
      params,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IAssembleias[]>(`${this.BaseUrl}/todas`, {
      headers: this.headers,
    })
  }

  create(assembleia: IAssembleias) {
    return this.httpClient.post<IAssembleias>(this.BaseUrl, assembleia, {
      headers: this.headers,
    })
  }

  remove(assembleia: IAssembleias) {
    return this.httpClient.delete(`${this.BaseUrl}/${assembleia.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IAssembleias>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(assembleia: IAssembleias) {
    return this.httpClient
      .put<IAssembleias>(`${this.BaseUrl}/${assembleia.id}`, assembleia, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateAssembleia(
    id: number,
    assembleia: IAssembleias,
  ): Observable<IAssembleias> {
    return this.httpClient
      .put<IAssembleias>(`${this.BaseUrl}/${id}`, assembleia, {
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
