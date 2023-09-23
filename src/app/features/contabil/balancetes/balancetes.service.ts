import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'
import Swal from 'sweetalert2'

import { IBalancete } from './balancete.interface'

@Injectable({
  providedIn: 'root',
})
export class BalancetesService {
  private readonly BaseUrl = environment.apiUrl + '/api/balancetes'
  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params =  request 
    return this.httpClient.get<IBalancete[]>(`${this.BaseUrl}`, {
      headers: this.headers,
      params,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IBalancete[]>(`${this.BaseUrl}/todos`, {
      headers: this.headers,
    })
  }

  create(balancete: IBalancete) {
    return this.httpClient.post<IBalancete>(this.BaseUrl, balancete, {
      headers: this.headers,
    })
  }

  remove(balancete: IBalancete) {
    return this.httpClient.delete(`${this.BaseUrl}/${balancete.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IBalancete>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(balancete: IBalancete) {
    return this.httpClient
      .put<IBalancete>(`${this.BaseUrl}/${balancete.id}`, balancete, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateBalancete(id: number, balancete: IBalancete): Observable<IBalancete> {
    console.log(
      'na função updateBalancete do service: ',
      id,
      balancete,
      this.headers,
    )

    return this.httpClient
      .put<IBalancete>(`${this.BaseUrl}/${id}`, balancete, {
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
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.errorMessage}`
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    }
    return throwError(errorMessage)
  }
}
