import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { FilesService } from '../files/files.service';
import { FileUploadService } from './file-upload.service';

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


  constructor(
    private filesService: FilesService
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes o upload-file componentes", changes);
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
        console.log("target.result file-upload", this.selectedFiles[i].name);
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
        (event: any) => {
          if(event.message) {
            this.typeMessage = 'success'
            this.message.push(event.message)
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
          this.progressInfos[idx].value = 0;
          console.log("Event erro: ", err);
          const msg = err.error.message;
          this.typeMessage = 'danger'
          this.message.push(msg);
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
