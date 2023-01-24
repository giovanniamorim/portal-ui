import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from '../upload.service'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  toFile: any
  private previousUrl?: string;

  constructor(
    private uploadService: UploadService, 
    public router: Router) { 

  }

  ngOnInit(): void {
    
  }

  
  
 submit() {
  const file = this.toFile.item(0);
  this.uploadService.fileUpload(file);

}

 
  onChange(event:any) {
    this.toFile = event.target.files;
    if(event.target.files !== undefined){
      document.getElementById('btnEnviar')?.removeAttribute('disabled')
    }
    
  }

  reloadPage(){
    window.location.reload()
  }


}
