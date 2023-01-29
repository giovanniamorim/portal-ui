import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IUser } from './interfaces/user.interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly BaseUrl = environment.apiUrl + '/api/usuarios'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
    const container = [{}]
		return this.httpClient.get<IUser[]>(`${this.BaseUrl}`, {params});
	}

  create(usuario: IUser){
    return this.httpClient.post<IUser>(`${this.BaseUrl}`, usuario);
  }
  
  // addRolesToUser(roles: any){
  //   return this.httpClient.post<IUser>(`${this.BaseUrl}/role/addtouser`, roles);
    
  // }

  remove(user: IUser){
    return this.httpClient.delete(`${this.BaseUrl}/${user.codigo}`);
  }
  
  loadById(codigo: number) {
    return this.httpClient.get<IUser>(`${this.BaseUrl}/${codigo}`);
  }

  update(usuario: IUser){
    return this.httpClient.put<IUser>(`${this.BaseUrl}/${usuario.codigo}`, usuario)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateUser(codigo: number, balanco: IUser): Observable<IUser> {
    return this.httpClient.put<IUser>(`${this.BaseUrl}/${codigo}`, balanco)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  errorHandler(error: any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    }
    return throwError(errorMessage);
 }

 httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

    
}
