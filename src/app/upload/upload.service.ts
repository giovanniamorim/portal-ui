import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { setTimeout } from 'timers/promises';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  configEnv = environment

  constructor(
    public router: Router,
  ) { }

  fileUpload(file:File) {
    const contentType = file.type;
        
    const bucket = new S3(
      {
      accessKeyId: this.configEnv.ACCESS_KEY_ID,
      secretAccessKey: this.configEnv.SECRET_ACCESS_KEY,
      region: this.configEnv.REGION
      }
    );
    const params = {
      Bucket: this.configEnv.BUCKET,
      Key: file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    bucket.upload(params,  (err:any, data:any) => {
     
      if (err) {
        Swal.fire({
          icon: 'error',
          title: err.error.status,
          text: err.error.message
        })
      return false;
      } else {
        

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Arquivo adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        })

        return true;
        
      }    

      });
    }
}
