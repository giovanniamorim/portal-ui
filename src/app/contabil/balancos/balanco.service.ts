import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IBalanco } from './interfaces/balanco.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BalancoService {

  private readonly BaseUrl = environment.apiUrl + '/balancos'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IBalanco[]>(`${this.BaseUrl}/`, {params});
	}

  create(balanco: IBalanco){
    console.log("Salvando?", balanco);
    return this.httpClient.post<IBalanco>(this.BaseUrl, balanco);
  }



  remove(balanco: IBalanco){
    return this.httpClient.delete(`${this.BaseUrl}/${balanco.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IBalanco>(`${this.BaseUrl}/${id}`);

  }

  update(balanco: IBalanco){
    return this.httpClient.put<IBalanco>(`${this.BaseUrl}/${balanco.id}`, balanco)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateBalanco(id: number, balanco: IBalanco): Observable<IBalanco> {
    
    console.log("Balanco no service:", balanco);
    return this.httpClient.put<IBalanco>(`${this.BaseUrl}/${id}`, balanco)
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
