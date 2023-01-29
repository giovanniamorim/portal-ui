import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IProcesso } from './interfaces/processo.interface';
import { environment } from '../../../environments/environment';
import { take, map, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessoService {

  private readonly BaseUrl = environment.apiUrl + '/api/juridico/processos'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IProcesso[]>(`${this.BaseUrl}/`, {params});
	}

  create(evento: IProcesso){
    return this.httpClient.post<IProcesso>(this.BaseUrl, evento);
  }

  remove(evento: IProcesso){
    return this.httpClient.delete(`${this.BaseUrl}/${evento.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IProcesso>(`${this.BaseUrl}/${id}`);
  }

  update(id: number, evento: IProcesso): Observable<IProcesso> {
    return this.httpClient.put<IProcesso>(`${this.BaseUrl}/${id}`, evento)
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
