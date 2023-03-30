import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from '../../environments/environment';
import { IUser } from './interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly BaseUrl = environment.apiUrl + '/api/usuarios'
  public token = localStorage.getItem('token')

  public headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer  ${this.token}`
  })

  constructor(private httpClient: HttpClient) {}

  listAll(request: any): Observable<any> {
    const params = request
    return this.httpClient.get<IUser[]>(`${this.BaseUrl}`, {
      headers: this.headers,
      params,
    })
  }

  create(usuario: IUser) {
    console.log("user no service:", usuario );
    
    return this.httpClient.post<IUser>(`${this.BaseUrl}`, usuario, {
      headers: this.headers,
    })
  }

  addRolesToUser(roles: any) {
    return this.httpClient.post<IUser>(
      `${this.BaseUrl}/role/addtouser`,
      roles,
      { headers: this.headers },
    )
  }

  remove(user: IUser) {
    return this.httpClient.delete(`${this.BaseUrl}/${user.codigo}`, {
      headers: this.headers,
    })
  }

  loadById(codigo: number) {
    return this.httpClient.get<IUser>(`${this.BaseUrl}/${codigo}`, {
      headers: this.headers,
    })
  }

  findByEmail(email: string) {
    return this.httpClient.get<IUser>(`${this.BaseUrl}/perfil?email=${email}`)
  }
  

  update(usuario: IUser) {
    return this.httpClient
      .put<IUser>(`${this.BaseUrl}/${usuario.codigo}`, usuario, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandler))
  }

  updateUser(codigo: number, usuario: IUser): Observable<IUser> {
    console.log("usuario no service: ", usuario);
    
    return this.httpClient
      .put<IUser>(`${this.BaseUrl}/${codigo}`, usuario, {
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
