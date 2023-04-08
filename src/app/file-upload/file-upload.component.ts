import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { FilesService } from '../files/files.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnChanges {

  @Input() fileName = ''
  @Input() isEditing: boolean = false
  @Input() typeLancamento: string = ''
  @Input() editingId!: number

  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  typeMessage!: string;
  showTopMessage: boolean = false
  isImageType!: boolean;
  arquivo!: string;
  fileId!: any;


  constructor(
    private filesService: FilesService
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.showTopMessage = changes.fileName.currentValue.startsWith('undefine') ? false : true;
    this.fileName  = changes.fileName.currentValue
    this.fileName.includes('undefined') ? this.showTopMessage = false : this.showTopMessage = true;
    this.fileName.includes('pdf') ? this.isImageType = false : this.isImageType = true
  }

  ngOnInit(): void {
    this.imageInfos = this.filesService.getFiles();
    // No caso de edição de lançamentos
    if(this.editingId > 0){
      if(this.typeLancamento === 'receitas'){
        this.fileName = "receita_" + this.editingId + ".jpg"
      }
      if(this.typeLancamento === 'despesas'){
        this.fileName = "despesa_" + this.editingId + ".jpg"
      }
    }
  }


  selectFiles(event: any): void {
    
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;
    this.previews = [];

    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
        this.selectedFileNames.push(this.selectedFiles[i].name);
        if(this.selectedFiles[i].name.includes('jpg')){
          this.isImageType = true
        }
        this.arquivo = this.selectedFiles[i].name
      }
    }
  }

  uploadFiles(): void {
    this.message = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {

    if(file.name !== this.fileName){
    } else {
      this.progressInfos[idx] = { value: 0, fileName: file.name };
    }
  
    if (file.name === this.fileName) {
      this.filesService.uploadFile(file).subscribe(
        (res: any) => {
          if(res.message) {
            this.typeMessage = 'success'
            this.message.push(res.message)
            this.imageInfos = this.filesService.getFiles();
          }
          
          // const msg = event.message;
          
          // if (event.type === HttpEventType.UploadProgress) {
          //   this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          // } else if (event instanceof HttpResponse) {
          //   this.message.push(msg);
          //   this.typeMessage = 'success'
          //   this.imageInfos = this.filesService.getFiles();
          // }
        },

        (err: any) => {
          // this.progressInfos[idx].value = 0;
          // const msg = err.error.message;
          // this.typeMessage = 'danger'
          // this.message.push(msg);

          Swal.fire({
            title: 'Substituir arquivo?',
            text: err.error.message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, substitua o arquivo!'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              // Identificar e deletar o arquivo
              this.filesService.findId(this.arquivo).subscribe(res => {
                this.fileId = res;
                this.filesService.deleteById(this.fileId).subscribe((res:any) => {
                  this.upload(idx, file) ;
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Arquivo atualizado com sucesso! \n Salve o seu registro.',
                      showConfirmButton: false,
                      timer: 2000
                    })
                });
              })

            } else if (result.isDenied) {
              Swal.fire('Ação cancelada', '', 'info')
            }
            
          })

        });
    } else {
     
      if(this.fileName.includes('undefinedundefined')){
        const msg = 'ERRO: Primeiramente selecione o tipo de Lançamento'
        this.typeMessage = 'danger'
        this.message.push(msg);
      }
      if(!this.fileName.includes('undefine')){
        const msg = 'ERRO: O nome do arquivo deve ser: ' + this.fileName;
        this.typeMessage = 'danger'
        this.message.push(msg);
      }
       
    }
  }

  deleteImagens(){
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
  
    this.previews = [];
  }
  

}
