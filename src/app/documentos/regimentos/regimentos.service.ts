import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

import { IRegimento } from './regimento.interface';

export class RegimentoFiltro {
  ano?: number
  mes?: string
  pagina: number = 0
  itensPorPagina: number = 5
}

@Injectable({
  providedIn: 'root'
})
export class RegimentosService {

  private readonly BaseUrl = environment.apiUrl + '/api/regimentos'

  public headers:HttpHeaders= new HttpHeaders({
    'Content-Type':'application/json',
    'Accept':"application/json"
  });

  constructor(private  httpClient: HttpClient) { }

  pesquisar(filtro: RegimentoFiltro): Promise<any> {
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
		return this.httpClient.get<IRegimento[]>(`${this.BaseUrl}`, {params});
	}

  getAll(): Observable<any> {
    return this.httpClient.get<IRegimento[]>(`${this.BaseUrl}/todos`);
  }

  public getRegimentosFilterValues(){
    return this.httpClient.get(`${this.BaseUrl}`,{headers: this.headers})
  }

  public getRegimentos( pageIndex: any, pageSize: any, filter?: any){
    
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
  

  listAllFiltered(page:any, filtro: RegimentoFiltro): Observable<any> {
		const params = page;
    let paramsFilter = new HttpParams()

    if (filtro.ano) {
      paramsFilter = paramsFilter.set('ano', filtro.ano);
    }

    if (filtro.mes) {
      paramsFilter = paramsFilter.set('mes', filtro.mes);
    }
		return this.httpClient.get<IRegimento[]>(`${this.BaseUrl}?`, { params });
	}

  create(regimento: IRegimento){
    return this.httpClient.post<IRegimento>(this.BaseUrl, regimento);
  }

  remove(regimento: IRegimento){
    return this.httpClient.delete(`${this.BaseUrl}/${regimento.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IRegimento>(`${this.BaseUrl}/${id}`);

  }

  update(regimento: IRegimento){
    return this.httpClient.put<IRegimento>(`${this.BaseUrl}/${regimento.id}`, regimento)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateRegimento(id: number, regimento: IRegimento): Observable<IRegimento> {
    return this.httpClient.put<IRegimento>(`${this.BaseUrl}/${id}`, regimento)
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
