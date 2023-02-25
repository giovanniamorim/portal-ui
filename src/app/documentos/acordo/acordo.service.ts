import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

import { IAcordo } from './acordo.interface';

export class AcordoFiltro {
  ano?: number
  mes?: string
  pagina: number = 0
  itensPorPagina: number = 5
}

@Injectable({
  providedIn: 'root'
})
export class AcordoService {

  private readonly BaseUrl = environment.apiUrl + '/api/acordos'

  public headers:HttpHeaders= new HttpHeaders({
    'Content-Type':'application/json',
    'Accept':"application/json"
  });

  constructor(private  httpClient: HttpClient) { }

  pesquisar(filtro: AcordoFiltro): Promise<any> {
    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    if (filtro.ano) {
      params = params.set('ano', filtro.ano);
    }

    if (filtro.mes) {
      params = params.set('mes', filtro.mes);
    }

    return this.httpClient.get(`${this.BaseUrl}?`, { params })
      .toPromise()
      .then((response: any) => {
        const lancamentos = response['content'];

        const resultado = {
          lancamentos,
          total: response['totalElements']
        };

        return resultado;
      });
  }

 
  listAll(request:any): Observable<any> {
		const params = request;
		return this.httpClient.get<IAcordo[]>(`${this.BaseUrl}`, {params});
	}

  getAll(): Observable<any> {
    return this.httpClient.get<IAcordo[]>(`${this.BaseUrl}/todos`);
  }

  public getAcordoFilterValues(){
    return this.httpClient.get(`${this.BaseUrl}`,{headers: this.headers})
  }

  public getAcordo( pageIndex: any, pageSize: any, filter?: any){
    
    let params= new HttpParams();
    if(filter && !filter.searchText){
      if(filter.ano){
        params = params.append('ano',filter.ano);
      }
      if(filter.mes){
        params = params.append('mes',filter.mes);
      }
    }

    if(filter.searchText){
      if(filter.searchText && filter.searchText.length > 0){
        params = params.append('searchText',filter.searchText);
      }
    }
    return this.httpClient.get(`${this.BaseUrl}?page=${pageIndex}&size=${pageSize}`,{headers: this.headers, params})
  }
  

  listAllFiltered(page:any, filtro: AcordoFiltro): Observable<any> {
		const params = page;
    let paramsFilter = new HttpParams()

    if (filtro.ano) {
      paramsFilter = paramsFilter.set('ano', filtro.ano);
    }

    if (filtro.mes) {
      paramsFilter = paramsFilter.set('mes', filtro.mes);
    }
		return this.httpClient.get<IAcordo[]>(`${this.BaseUrl}?`, { params });
	}

  create(acordo: IAcordo){
    return this.httpClient.post<IAcordo>(this.BaseUrl, acordo);
  }

  remove(acordo: IAcordo){
    return this.httpClient.delete(`${this.BaseUrl}/${acordo.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IAcordo>(`${this.BaseUrl}/${id}`);

  }

  update(acordo: IAcordo){
    return this.httpClient.put<IAcordo>(`${this.BaseUrl}/${acordo.id}`, acordo)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateAcordo(id: number, acordo: IAcordo): Observable<IAcordo> {
    return this.httpClient.put<IAcordo>(`${this.BaseUrl}/${id}`, acordo)
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
