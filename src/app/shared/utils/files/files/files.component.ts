import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, take } from 'rxjs';
import { AuthService } from 'src/app/seguranca/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { FilesService } from '../files.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;

  displayedColumns: string[] = ['id', 'nome', 'tipo', 'actions'];
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  imgSrc!: string;
  perfil!: string;
  imgId: any;
  imageUrl: any;
  showFirstLastButtons = true


  constructor(
    private filesService: FilesService,
    private auth: AuthService) { }


  ngOnInit(): void {
    this.fileInfos = this.filesService.getFiles();
    this.findRoles();
    
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.listarArquivos({ page: "0", size: "5" })
  }
  

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.filesService.uploadFile(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.filesService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }


  public listarArquivos = (request:any) => {

    this.filesService.getAllFiles()
    .pipe(take(1))
      .subscribe(
          (arquivo) => {
            console.log("Meus arquivos: ", arquivo);
            
              this.datasource = new MatTableDataSource(arquivo.content) ;
              
              this.datasource.sort = this.sort;
              this.carregando = false;
              this.totalElements = arquivo.totalElements
          },
          (error) => {
              this.datasource = new MatTableDataSource();
              this.carregando = false;
              console.log("Erro ao listar itens");
              Swal.fire({
                title: 'Error!',
                text: 'Erro ao listar itens',
                icon: 'error',
                confirmButtonText: 'Ok'
              })
          }
      );
    
  }

  onDelete(arquivo: any){
    Swal.fire({
      title: 'Deseja remover o arquivo?',
      text: "ATENÇÃO: Esta operação é irreversível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.filesService.deleteFile(arquivo).subscribe( res => {
          this.listarArquivos({ page: "0", size: "5" })
        })
        Swal.fire(
          'Removido!',
          'O arquivo foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onClick(arquivo:any){
    console.log("Image: ", arquivo);
    this.imgId = arquivo.id
    this.imgSrc = arquivo.fileUrl
  }

  nextPage(event: PageEvent) {
        const request:any = {};
        request['page'] = event.pageIndex.toString();
        request['size'] = event.pageSize.toString();
        this.listarArquivos(request);
 }


  filterData($event : any){
    this.datasource.filter = $event.target.value;
  }

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }


}
