import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { IContrato } from './contratos.interface';

export class ContratoFiltro {
  ano?: number
  mes?: string
  pagina: number = 0
  itensPorPagina: number = 5
}

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  private readonly BaseUrl = environment.apiUrl + '/api/contratos'

  public headers:HttpHeaders= new HttpHeaders({
    'Content-Type':'application/json',
    'Accept':"application/json"
  });

  constructor(private  httpClient: HttpClient) { }

  pesquisar(filtro: ContratoFiltro): Promise<any> {
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
		return this.httpClient.get<IContrato[]>(`${this.BaseUrl}`, {params});
	}

  public getContratosFilterValues(){
    return this.httpClient.get(`${this.BaseUrl}`,{headers: this.headers})
  }

  public getContratos( pageIndex: any, pageSize: any, filter?: any){
    console.log("No serviço: ", pageIndex, pageSize, filter);
    
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
  

  listAllFiltered(page:any, filtro: ContratoFiltro): Observable<any> {
		const params = page;
    let paramsFilter = new HttpParams()

    if (filtro.ano) {
      paramsFilter = paramsFilter.set('ano', filtro.ano);
    }

    if (filtro.mes) {
      paramsFilter = paramsFilter.set('mes', filtro.mes);
    }
		return this.httpClient.get<IContrato[]>(`${this.BaseUrl}?`, { params });
	}

  create(contrato: IContrato){
    return this.httpClient.post<IContrato>(this.BaseUrl, contrato);
  }

  getAll(): Observable<any> {
    return this.httpClient.get<IContrato[]>(`${this.BaseUrl}/todos`);
  }



  remove(contrato: IContrato){
    return this.httpClient.delete(`${this.BaseUrl}/${contrato.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IContrato>(`${this.BaseUrl}/${id}`);

  }

  update(contrato: IContrato){
    return this.httpClient.put<IContrato>(`${this.BaseUrl}/${contrato.id}`, contrato)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateContrato(id: number, contrato: IContrato): Observable<IContrato> {
    console.log("id no service", id);
    console.log("contrato no service",  contrato);
    return this.httpClient.put<IContrato>(`${this.BaseUrl}/${id}`, contrato)
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
