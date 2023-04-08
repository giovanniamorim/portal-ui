import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  getByName(name: string) {
    return this.httpClient.get(`${this.baseUrl}/file/find?name=${name}`, {
      headers: this.headers
    })
  }

  findId(fileName: string) {
    return this.httpClient.get(`${this.baseUrl}/file/findId?name=${fileName}`, 
    {headers: this.headers})
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
