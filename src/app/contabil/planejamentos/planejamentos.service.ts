import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IPlanejamento } from './interfaces/planejamentos.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanejamentosService {

  private readonly BaseUrl = environment.apiUrl + '/api/planejamentos'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IPlanejamento[]>(`${this.BaseUrl}/`, {params});
	}

  create(planejamento: IPlanejamento){
    console.log("Salvando?", planejamento);
    return this.httpClient.post<IPlanejamento>(this.BaseUrl, planejamento);
  }


  remove(planejamento: IPlanejamento){
    return this.httpClient.delete(`${this.BaseUrl}/${planejamento.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IPlanejamento>(`${this.BaseUrl}/${id}`);

  }

  update(planejamento: IPlanejamento){
    return this.httpClient.put<IPlanejamento>(`${this.BaseUrl}/${planejamento.id}`, planejamento)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updatePlanejamento(id: number, planejamento: IPlanejamento): Observable<IPlanejamento> {
    
    console.log("Planejamento no service:", planejamento);
    return this.httpClient.put<IPlanejamento>(`${this.BaseUrl}/${id}`, planejamento)
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
