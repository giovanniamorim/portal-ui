import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IEvento } from './interfaces/evento.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private readonly BaseUrl = environment.apiUrl + '/api/juridico/eventos'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IEvento[]>(`${this.BaseUrl}/`, {params});
	}

  create(evento: IEvento){
    return this.httpClient.post<IEvento>(this.BaseUrl, evento);
  }

  remove(evento: IEvento){
    console.log("id do evento ao deleart no serice:", evento);
    
    return this.httpClient.delete(`${this.BaseUrl}/${evento.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IEvento>(`${this.BaseUrl}/${id}`);

  }

  update(id: number, evento: IEvento): Observable<IEvento> {
    return this.httpClient.put<IEvento>(`${this.BaseUrl}/${id}`, evento)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  errorHandler(error: any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      })
    } else {
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
