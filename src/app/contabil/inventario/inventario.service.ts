import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IInventario } from './interfaces/inventario.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private readonly BaseUrl = environment.apiUrl + '/api/inventario'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IInventario[]>(`${this.BaseUrl}/`, {params});
	}

  create(inventario: IInventario){
    console.log("Salvando?", inventario);
    return this.httpClient.post<IInventario>(this.BaseUrl, inventario);
  }


  remove(inventario: IInventario){
    return this.httpClient.delete(`${this.BaseUrl}/${inventario.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IInventario>(`${this.BaseUrl}/${id}`);

  }

  update(inventario: IInventario){
    return this.httpClient.put<IInventario>(`${this.BaseUrl}/${inventario.id}`, inventario)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateInventario(id: number, inventario: IInventario): Observable<IInventario> {
    
    console.log("Inventario no service:", inventario);
    return this.httpClient.put<IInventario>(`${this.BaseUrl}/${id}`, inventario)
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
