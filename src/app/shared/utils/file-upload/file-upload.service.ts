import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';;



@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private readonly baseUrl = environment.apiUrl + '/api/file'

  public token  = localStorage.getItem('token');

  public headers:HttpHeaders= new HttpHeaders({
    'Content-Type':'application/json',
    'Accept':"application/json",
    'reportProgress': 'true',
    'responseType': 'json',
    'Authorization': `Bearer  ${this.token}`
  });


  constructor(private  httpClient: HttpClient) { }

  upload_old(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.httpClient.request( req);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      headers: this.headers
    });

    return this.httpClient.request(req );
  }

  getFiles(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/files`, { headers: this.headers });
  }

  getFile(fileName: string): Observable<any> {
    console.log("checgou no getfile do service");
    
    return this.httpClient.get(`${this.baseUrl}/download/${fileName}`, { headers: this.headers })
  }
    
}
