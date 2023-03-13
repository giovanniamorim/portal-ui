import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import Swal from 'sweetalert2'

import { environment } from '../../../environments/environment'
import { IAcordo } from './acordo.interface'

@Injectable({
  providedIn: 'root',
})
export class AcordoService {
  private readonly BaseUrl = environment.apiUrl + '/api/acordos'

  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IAcordo[]>(`${this.BaseUrl}`, {
      headers: this.headers,
      params,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IAcordo[]>(`${this.BaseUrl}/todos`, {
      headers: this.headers,
    })
  }

  create(acordo: IAcordo) {
    return this.httpClient.post<IAcordo>(this.BaseUrl, acordo, {
      headers: this.headers,
    })
  }

  remove(acordo: IAcordo) {
    return this.httpClient.delete(`${this.BaseUrl}/${acordo.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IAcordo>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(acordo: IAcordo) {
    return this.httpClient
      .put<IAcordo>(`${this.BaseUrl}/${acordo.id}`, acordo, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateAcordo(id: number, acordo: IAcordo): Observable<IAcordo> {
    return this.httpClient
      .put<IAcordo>(`${this.BaseUrl}/${id}`, acordo, { headers: this.headers })
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
