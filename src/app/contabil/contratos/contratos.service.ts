import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, first, Observable, throwError } from 'rxjs'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'
import { IContrato } from './contratos.interface'

@Injectable({
  providedIn: 'root',
})
export class ContratosService {
  private readonly BaseUrl = environment.apiUrl + '/api/contratos'

  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IContrato[]>(`${this.BaseUrl}`, {
      headers: this.headers,
      params,
    })
  }

  create(contrato: IContrato) {
    return this.httpClient.post<IContrato>(this.BaseUrl, contrato, {
      headers: this.headers,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IContrato[]>(`${this.BaseUrl}/todos`, {
      headers: this.headers,
    })
  }

  remove(contrato: IContrato) {
    return this.httpClient.delete(`${this.BaseUrl}/${contrato.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IContrato>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(contrato: IContrato) {
    return this.httpClient
      .put<IContrato>(`${this.BaseUrl}/${contrato.id}`, contrato, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateContrato(id: number, contrato: IContrato): Observable<IContrato> {
    console.log('id no service', id)
    console.log('contrato no service', contrato)
    return this.httpClient
      .put<IContrato>(`${this.BaseUrl}/${id}`, contrato, {
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
