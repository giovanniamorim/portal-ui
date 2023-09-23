import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private readonly baseUrl = environment.apiUrl + '/api'

  public token  = localStorage.getItem('token');

  public headers:HttpHeaders= new HttpHeaders({
    'reportProgress': 'true',
    'responseType': 'json',
    'Authorization': `Bearer  ${this.token}`
  });


  constructor(private httpClient: HttpClient) { }


  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<HttpEvent<any>>(`${this.baseUrl}/files/upload`, formData, {
      headers: this.headers
    });
  }

  getFiles(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/files`, {
      headers: this.headers});
  }

  getByName(name: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/file/find?name=${name}`, {
      headers: this.headers
    })
  }

  findByName(name: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/file/find?name=${name}`, {
      headers: this.headers
    })
  }

  findId(fileName: string): Observable<any> {
    return this.httpClient.head(`${this.baseUrl}/file/findId?name=${fileName}`, 
    {headers: this.headers, observe: 'response'})
  }

  getAllFiles(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/files/list`, {
      headers: this.headers});
  }

  deleteFile(arquivo: any) {
    return this.httpClient.delete(`${this.baseUrl}/file/${arquivo.id}`, {
      headers: this.headers,
    })
  }

  deleteById(id: any) {
    return this.httpClient.delete(`${this.baseUrl}/file/${id}`, {
      headers: this.headers,
    })
  }


}
