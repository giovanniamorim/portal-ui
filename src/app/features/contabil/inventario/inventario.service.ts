import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, throwError } from 'rxjs'
import Swal from 'sweetalert2'
import { IInventario } from './interfaces/inventario.interface'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private readonly BaseUrl = environment.apiUrl + '/api/inventario'

  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer  ${this.token}`,
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IInventario[]>(`${this.BaseUrl}/`, {
      headers: this.headers,
      params,
    })
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IInventario[]>(`${this.BaseUrl}/todos`, {
      headers: this.headers,
    })
  }

  create(inventario: IInventario) {
    return this.httpClient.post<IInventario>(this.BaseUrl, inventario, {
      headers: this.headers,
    })
  }

  remove(inventario: IInventario) {
    return this.httpClient.delete(`${this.BaseUrl}/${inventario.id}`, {
      headers: this.headers,
    })
  }

  loadById(id: number) {
    return this.httpClient.get<IInventario>(`${this.BaseUrl}/${id}`, {
      headers: this.headers,
    })
  }

  update(inventario: IInventario) {
    return this.httpClient
      .put<IInventario>(`${this.BaseUrl}/${inventario.id}`, inventario, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateInventario(id: number, inventario: IInventario): Observable<IInventario> {
    return this.httpClient
      .put<IInventario>(`${this.BaseUrl}/${id}`, inventario, { headers: this.headers })
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
