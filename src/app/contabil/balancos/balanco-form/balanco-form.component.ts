import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { IBalanco, IMeses } from '../interfaces/balanco.interface';
import { BalancoService } from '../balanco.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-balanco-form',
  templateUrl: './balanco-form.component.html',
  styleUrls: ['./balanco-form.component.scss'],
})
export class BalancoFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditBalanco!: boolean
  editar: any
  currentId!: number
  submitted = false;

  // Config file
  middleFileUrl = '/api/file/download/'  
  baseUrl = environment.apiUrl
  balancoFileName: string = 'balanco_';
  balancoList: any;
  lastItemId: any;

  anos: string[] = ['2022', '2024']
  meses: IMeses[] = [
    { id: 1, nome: 'Janeiro' },
    { id: 2, nome: 'Fevereiro' },
    { id: 3, nome: 'Março' },
    { id: 4, nome: 'Abril' },
    { id: 5, nome: 'Maio' },
    { id: 6, nome: 'Junho' },
    { id: 7, nome: 'Julho' },
    { id: 8, nome: 'Agosto' },
    { id: 9, nome: 'Setembro' },
    { id: 10, nome: 'Outubro' },
    { id: 11, nome: 'Novembro' },
    { id: 12, nome: 'Dezembro' }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private balancoService: BalancoService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
          ano: [null, [Validators.required]],
          mes: [null, [Validators.required]],
          descricao: [null, [Validators.required]],
          fileUrl: ['']
      })
    }


  ngOnInit(): void {

    if(this.router.url.includes(`/balancos/editar/`)){
      this.isEditBalanco = true
      this.currentId =  parseInt(this.router.url.substring(17))
      this.balancoFileName = `balanco_${this.currentId}.pdf`
    } else if(this.router.url.includes('/balancos/novo')) {
      this.findLastItemId()
      this.isEditBalanco = false
    }

    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const balanco$ = this.balancoService.loadById(id);
        balanco$.subscribe(balanco => {
          this.updateForm(balanco)
        })
      }
    )
  }

  updateForm(balanco: IBalanco){
    this.form.patchValue({
      id: this.currentId,
      ano: balanco.ano,
      mes: balanco.mes,
      descricao: balanco.descricao,
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.balancoFileName}`
    })
  }

  onSubmit(){
    this.submitted = true;
    this.form.get('fileUrl')?.setValue(`${this.baseUrl}${this.middleFileUrl}${this.balancoFileName}`);
    this.balancoService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Balanço adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./balancos'])
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
    this.balancoService.updateBalanco(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Balanço atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigate(['./balancos'])
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
    this.balancoService.getAll()
      .subscribe({
        next: (data) => {
          this.balancoList = data.content ;
          this.lastItemId = data.content[0].id + 1;
          this.balancoFileName = `balanco_${this.lastItemId}.pdf`
        },
        error: (e) => console.error(e)
      });

  }

}
