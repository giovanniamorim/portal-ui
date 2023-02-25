import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { IRegimento } from '../regimento.interface';
import { RegimentosService } from '../regimentos.service';


@Component({
  selector: 'app-regimento-form',
  templateUrl: './regimento-form.component.html',
  styleUrls: ['./regimento-form.component.scss'],
})
export class RegimentoFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditRegimento!: boolean
  editar: any
  currentId!: number
  submitted = false;
  isDisabled: boolean = true;


  // Config File
  regimentoFileName: string = 'regimento_';
  middleFileUrl = '/api/file/download/'  
  baseUrl = environment.apiUrl
  regimentoList: any;
  lastItemId: any;
 
  constructor(
    private formBuilder: FormBuilder,
    private regimentosService: RegimentosService,
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

    if(this.router.url.includes(`/documentos/regimentos/editar/`)){
      this.isEditRegimento = true
      this.currentId =  parseInt(this.router.url.substring(30))
      this.regimentoFileName = `regimento_${this.currentId}.pdf`
    } else if(this.router.url.includes('/regimentos/novo')) {
      this.findLastItemId()
      this.isEditRegimento = false
    }

    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const regimento$ = this.regimentosService.loadById(id);
        regimento$.subscribe(regimento => {
          this.updateForm(regimento)
        })
      }
    )
        
  }

  updateForm(regimento: IRegimento) {

    this.form.patchValue({
      id: this.currentId,
      dataAprovacao: regimento.dataAprovacao,
      descricao: regimento.descricao,
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.regimentoFileName}`
    })

  }

  onSubmit(){
    
    this.submitted = true;
    this.form.get('fileUrl')?.setValue(`${this.baseUrl}${this.middleFileUrl}${this.regimentoFileName}`);
    this.regimentosService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Regimento adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./documentos/regimentos'])
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
    this.regimentosService.updateRegimento(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Regimento atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2000
          }) 
          this.router.navigate(['./documentos/regimentos'])
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
    this.regimentosService.getAll()
      .subscribe({
        next: (data) => {
          this.regimentoList = data.content ;
          this.lastItemId = data.content[0].id + 1;
          this.regimentoFileName = `regimento_${this.lastItemId}.pdf`
        },
        error: (e) => console.error(e)
      });
  }

}
