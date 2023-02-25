import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


import { ContratosService } from '../contratos.service';
import { environment } from '../../../../environments/environment';
import { IContrato } from '../contratos.interface';

@Component({
  selector: 'app-contrato-form',
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.scss'],
})
export class ContratoFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditContrato!: boolean
  editar: any
  currentId!: number
  submitted = false;
  isDisabled: boolean = true;

  // Config File
  contratoFileName: string = 'contrato_';
  middleFileUrl = '/api/file/download/'  
  baseUrl = environment.apiUrl
  contratoList: any;
  lastItemId: any;


  constructor(
    private formBuilder: FormBuilder,
    private contratosService: ContratosService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    ) {
        this.form =  this.formBuilder.group({
        prestador: ['', [Validators.required]],
        descServico: ['', [Validators.required]],
        dataInicial: ['', [Validators.required]],
        dataFinal: ['', [Validators.required]],
        obs: [''],
        valor: ['', [Validators.required]],
        fileUrl: ['']
      })

    }


  ngOnInit(): void {

    if(this.router.url.includes(`/contratos/editar/`)){
      this.isEditContrato = true
      this.currentId =  parseInt(this.router.url.substring(18))
      this.contratoFileName = `contrato_${this.currentId}.pdf`
    } else if(this.router.url.includes('/contratos/novo')) {
      this.findLastItemId()
      this.isEditContrato = false
    }

    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const contrato$ = this.contratosService.loadById(id);
        contrato$.subscribe(contrato => {
          this.updateForm(contrato)
        })
      }
    )
  }

  updateForm(contrato: IContrato){
    this.form.patchValue({
      id: this.currentId,
      prestador: contrato.prestador,
      descServico: contrato.descServico,
      dataInicial: contrato.dataInicial,
      dataFinal: contrato.dataFinal,
      obs: contrato.obs,
      valor: contrato.valor,
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.contratoFileName}`
    })

  }

  onSubmit(){
    this.submitted = true;
    this.form.get('fileUrl')?.setValue(`${this.baseUrl}${this.middleFileUrl}${this.contratoFileName}`);
    this.contratosService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Contrato adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./contratos'])
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
    this.contratosService.updateContrato(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Contrato adicionado com sucesso!',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigate(['./contratos'])
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
    this.contratosService.getAll()
      .subscribe({
        next: (data) => {
          this.contratoList = data.content ;
          this.lastItemId = data.content[0].id + 1;
          this.contratoFileName = `contrato_${this.lastItemId}.pdf`
        },
        error: (e) => console.error(e)
      });
  }


}
