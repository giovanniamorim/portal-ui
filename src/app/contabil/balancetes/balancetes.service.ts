import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { IBalancete } from './balancete.interface';

export class BalanceteFiltro {
  ano?: number
  mes?: string
  pagina: number = 0
  itensPorPagina: number = 5
}

@Injectable({
  providedIn: 'root'
})
export class BalancetesService {

  private readonly BaseUrl = environment.apiUrl + '/api/balancetes'

  public headers:HttpHeaders= new HttpHeaders({
    'Content-Type':'application/json',
    'Accept':"application/json"
  });

  constructor(private  httpClient: HttpClient) { }

  pesquisar(filtro: BalanceteFiltro): Promise<any> {
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
		return this.httpClient.get<IBalancete[]>(`${this.BaseUrl}`, {params});
	}

  getAll(): Observable<any> {
    return this.httpClient.get<IBalancete[]>(`${this.BaseUrl}/todos`);
  }

  public getBalancetesFilterValues(){
    return this.httpClient.get(`${this.BaseUrl}`,{headers: this.headers})
  }

  public getBalancetes( pageIndex: any, pageSize: any, filter?: any){
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
  

  listAllFiltered(page:any, filtro: BalanceteFiltro): Observable<any> {
		const params = page;
    let paramsFilter = new HttpParams()

    if (filtro.ano) {
      paramsFilter = paramsFilter.set('ano', filtro.ano);
    }

    if (filtro.mes) {
      paramsFilter = paramsFilter.set('mes', filtro.mes);
    }
		return this.httpClient.get<IBalancete[]>(`${this.BaseUrl}?`, { params });
	}

  create(balancete: IBalancete){
    console.log("Chegou no service: ", balancete);
    
    return this.httpClient.post<IBalancete>(this.BaseUrl, balancete);
  }



  remove(balancete: IBalancete){
    return this.httpClient.delete(`${this.BaseUrl}/${balancete.id}`);
  }
  
  loadById(id: number) {
    return this.httpClient.get<IBalancete>(`${this.BaseUrl}/${id}`);

  }

  update(balancete: IBalancete){
    return this.httpClient.put<IBalancete>(`${this.BaseUrl}/${balancete.id}`, balancete)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateBalancete(id: number, balancete: IBalancete): Observable<IBalancete> {
    console.log("id no service", id);
    console.log("balancete no service",  balancete);
    return this.httpClient.put<IBalancete>(`${this.BaseUrl}/${id}`, balancete)
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
