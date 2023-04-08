import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { IAcordo } from '../acordo.interface';
import { AcordoService } from '../acordo.service';



@Component({
  selector: 'app-acordo-form',
  templateUrl: './acordo-form.component.html',
  styleUrls: ['./acordo-form.component.scss'],
})
export class AcordoFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditAcordo!: boolean
  editar: any
  currentId!: number
  submitted = false;
  isDisabled: boolean = true;


  // Config File
  acordoFileName: string = 'acordo_';
  middleFileUrl = '/api/file/find?name='   
  baseUrl = environment.apiUrl
  acordoList: any;
  lastItemId: any;
 
  constructor(
    private formBuilder: FormBuilder,
    private acordosService: AcordoService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    ) {
        this.form =  this.formBuilder.group({
        dataAprovacao: [null, [Validators.required]],
        descricao: [null, [Validators.required]],
        fileUrl: ['']
      })
  }


  ngOnInit(): void {

    if(this.router.url.includes(`/documentos/acordos/editar/`)){
      this.isEditAcordo = true
      this.currentId =  parseInt(this.router.url.substring(27))
      this.acordoFileName = `acordo_${this.currentId}.pdf`
    } else if(this.router.url.includes('/acordos/novo')) {
      this.findLastItemId()
      this.isEditAcordo = false
    }

    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const acordo$ = this.acordosService.loadById(id);
        acordo$.subscribe(acordo => {
          this.updateForm(acordo)
        })
      }
    )
        
  }

  updateForm(acordo: IAcordo) {

    this.form.patchValue({
      id: this.currentId,
      dataAprovacao: acordo.dataAprovacao,
      descricao: acordo.descricao,
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.acordoFileName}`
    })

  }

  onSubmit(){
    
    this.submitted = true;
    this.form.get('fileUrl')?.setValue(`${this.baseUrl}${this.middleFileUrl}${this.acordoFileName}`);
    this.acordosService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Acordo adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./documentos/acordos'])
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: err.error.status,
          text: err.error.message
        })
      },
      
    )

  }

  onEdit(){
    this.acordosService.updateAcordo(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Acordo atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2000
          }) 
          this.router.navigate(['./documentos/acordos'])
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: err.error.status,
            text: err.error.message
          })
        }
      )
  }

  findLastItemId(): void {
    this.acordosService.getAll()
      .subscribe({
        next: (data) => {
          this.acordoList = data.content ;
          this.lastItemId = data.content[0].id + 1;
          this.acordoFileName = `acordo_${this.lastItemId}.pdf`
        },
        error: (e) => console.error(e)
      });
  }

}
