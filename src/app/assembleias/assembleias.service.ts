import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { IAssembleias } from './interfaces/assembleias.interface';

@Injectable({
  providedIn: 'root'
})
export class AssembleiasService {

  private readonly BaseUrl = environment.apiUrl + '/api/assembleias'

  constructor(private  httpClient: HttpClient) { }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IAssembleias[]>(`${this.BaseUrl}/`, {params});
	}

  getAll(): Observable<any> {
    return this.httpClient.get<IAssembleias[]>(`${this.BaseUrl}/todas`);
  }

  create(assembleia: IAssembleias){
    console.log("Salvando?", assembleia);
    return this.httpClient.post<IAssembleias>(this.BaseUrl, assembleia);
  }


  remove(assembleia: IAssembleias){
    return this.httpClient.delete(`${this.BaseUrl}/${assembleia.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IAssembleias>(`${this.BaseUrl}/${id}`);

  }

  update(assembleia: IAssembleias){
    return this.httpClient.put<IAssembleias>(`${this.BaseUrl}/${assembleia.id}`, assembleia)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateAssembleia(id: number, assembleia: IAssembleias): Observable<IAssembleias> {
    
    console.log("Assembleia no service:", assembleia);
    return this.httpClient.put<IAssembleias>(`${this.BaseUrl}/${id}`, assembleia)
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
