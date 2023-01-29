import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IPlanoContas } from './interfaces/plano-contas.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanoContasService {

  private readonly BaseUrl = environment.apiUrl + '/api/planocontas'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IPlanoContas[]>(`${this.BaseUrl}/`, {params});
	}

  create(planoContas: IPlanoContas){
    console.log("Salvando?", planoContas);
    return this.httpClient.post<IPlanoContas>(this.BaseUrl, planoContas);
  }



  // remove(planoContas: IPlanoContas){
  //   return this.httpClient.delete(`${this.BaseUrl}/${planoContas.id}`);
  // }
  
  loadById(id: number) {
    return this.httpClient.get<IPlanoContas>(`${this.BaseUrl}/${id}`);

  }

  // update(planoContas: IPlanoContas){
  //   return this.httpClient.put<IPlanoContas>(`${this.BaseUrl}/${planoContas.id}`, planoContas)
  //     .pipe(
  //       catchError(this.errorHandler)
  //     )
  // }

  updatePlanoContas(id: number, planoContas: IPlanoContas): Observable<IPlanoContas> {
    
    console.log("PlanoContas no service:", planoContas);
    return this.httpClient.put<IPlanoContas>(`${this.BaseUrl}/${id}`, planoContas)
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
