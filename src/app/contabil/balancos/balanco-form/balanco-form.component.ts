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

  
  isDisabled: boolean = true;

  s3Url = environment.s3Url + 'balanco_'
 


  constructor(
    private formBuilder: FormBuilder,
    private balancoService: BalancoService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
          ano: [null, [Validators.required]],
          mes: [null, [Validators.required]],
        fileUrl: [`${this.s3Url}${this.currentId}.pdf`]
      })

      if(this.router.url.includes(`/balancos/editar/`)){
        this.isEditBalanco = true
        this.currentId =  parseInt(this.router.url.substring(17))
      } else if(this.router.url.includes('/balancos/novo')) {
        this.isEditBalanco = false
      }
    }


  ngOnInit(): void {
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
      fileUrl: `${this.s3Url}${this.currentId}.pdf`
    })
    console.log("chegou no updateForm", this.form);
    

  }

  onSubmit(){
    this.submitted = true;
    console.log(this.form.value);
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
            title: 'Balanço atualizado. \n Deseja adicionar um arquivo agora?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Adicionar Arquivo',
            denyButtonText: `Agora não`,
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Envie um arquivo com o nome', "balanco_" + res.id + ".pdf", 'info')
              this.router.navigate(['./uploads'])
            } else if (result.isDenied) {
              Swal.fire('Balanço salvo com sucesso!', '', 'success')
              this.router.navigate(['./balancos'])
            }
          })
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




}
