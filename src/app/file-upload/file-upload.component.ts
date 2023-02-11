import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnChanges {

  @Input() fileName = ''
  @Input() lastId!: number
  @Input() typeLanc!: string

  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  typeMessage!: string;
  showTopMessage: boolean = false

  constructor(private uploadService: FileUploadService) { }

  ngOnChanges(changes: SimpleChanges): void {
    
    this.showTopMessage = changes.fileName.currentValue.startsWith('undefine') ? false : true;


  }

  ngOnInit(): void {
    this.fileName.includes('undefined') ? this.showTopMessage = false : this.showTopMessage = true;
    this.imageInfos = this.uploadService.getFiles();
    console.log("no file upload: ", this.fileName);
    
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
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };
  
        reader.readAsDataURL(this.selectedFiles[i]);

        
        this.selectedFileNames.push(this.selectedFiles[i].name);
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
      console.log("O nome é diferente de ", this.fileName);
    } else {
      this.progressInfos[idx] = { value: 0, fileName: file.name };
    }
  
    if (file.name === this.fileName) {
      this.uploadService.upload(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Arquivo enviado com sucesso!';
            this.message.push(msg);
            this.typeMessage = 'success'
            this.imageInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Não foi possivel enviar o arquivo: ' + file.name;
          this.typeMessage = 'danger'
          this.message.push(msg);
        });
    } else {
      if(this.fileName.includes('undefine')){
        const msg = 'ERRO: Primeiramente selecione o tipo de Lançamento'
        // const msg = 'ERRO: O nome do arquivo deve ser: ' + this.fileName;
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
