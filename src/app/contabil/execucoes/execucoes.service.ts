import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { IExecucao } from './interfaces/execucoes.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExecucoesService {

  private readonly BaseUrl = environment.apiUrl + '/api/execucoes'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IExecucao[]>(`${this.BaseUrl}/`, {params});
	}

  create(execucao: IExecucao){
    console.log("Salvando?", execucao);
    return this.httpClient.post<IExecucao>(this.BaseUrl, execucao);
  }


  remove(execucao: IExecucao){
    return this.httpClient.delete(`${this.BaseUrl}/${execucao.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IExecucao>(`${this.BaseUrl}/${id}`);

  }

  update(execucao: IExecucao){
    return this.httpClient.put<IExecucao>(`${this.BaseUrl}/${execucao.id}`, execucao)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateExecucao(id: number, execucao: IExecucao): Observable<IExecucao> {
    
    console.log("Execucao no service:", execucao);
    return this.httpClient.put<IExecucao>(`${this.BaseUrl}/${id}`, execucao)
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
