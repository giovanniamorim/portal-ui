import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { IChangePassword, IUser } from './interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly BaseUrl = environment.apiUrl + '/api/usuarios'
  private readonly baseReset = environment.apiUrl + '/api'
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

  create(usuario: IUser): Observable<any> {
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
    return this.httpClient.get<IUser>(`${this.BaseUrl}/perfil?email=${email}`,{
      headers: this.headers,
    })
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
  }

  autoUpdateUser(codigo: number, usuario: IUser): Observable<IUser> {
    console.log("usuario no service: ", usuario);
    
    return this.httpClient
      .put<IUser>(`${this.BaseUrl}/${codigo}`, usuario, {
        headers: this.headers,
      })
  }

  changePassword(codigo: number, password: IChangePassword ): Observable<IChangePassword> {
    console.log("recebido no  service: ", codigo,  password);
    
    return this.httpClient.put<IChangePassword>(`${this.BaseUrl}/change/${codigo}`, password, {
      headers: this.headers
    })
  }

  resetPassword(email: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log("Log de resposta resete senha: ", `${this.baseReset}/forgot-password`)
    
    return this.httpClient.post(`${this.baseReset}/forgot-password`, { email }, { headers });
  }

  newPassword(password: string, token:string): Observable<any> {
    
    return this.httpClient.post(`${this.baseReset}/reset-password?token=${token}`, { password, token });
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
      errorMessage = `${error}`
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    }
    return throwError(errorMessage)
  }
}
