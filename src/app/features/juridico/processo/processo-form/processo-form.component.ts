import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { IProcesso } from '../interfaces/processo.interface';
import { ProcessoService } from '../processo.service';

@Component({
  selector: 'app-processo-form',
  templateUrl: './processo-form.component.html',
  styleUrls: ['./processo-form.component.scss'],
})
export class ProcessoFormComponent implements OnInit {

  form: FormGroup;
  showInputFile = false
  showInputFileUrl = false
  isEditProcesso!: boolean
  editar: any
  currentId!: number
  submitted = false; 
  isDisabled: boolean = true;
  processos: IProcesso[] = []
 

  constructor(
    private formBuilder: FormBuilder,
    private processoService: ProcessoService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
          numero: ['', [Validators.required]],
          exequente: ['', Validators.required],
          executado: ['', Validators.required],
          juizo: ['', Validators.required],
          juiz: ['', Validators.required],
          assunto: ['', Validators.required],
          valor: ['', Validators.required],
          eventos: ['', Validators.required],
      })

      if(this.router.url.includes(`/juridico/processos/editar/`)){
        this.isEditProcesso = true
        this.currentId =  parseInt(this.router.url.substring(27))
      } else if(this.router.url.includes('/juridico/processos/novo')) {
        this.isEditProcesso = false
      }
    }


  ngOnInit(): void {
       this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const processo$ = this.processoService.loadById(id);
        processo$.subscribe(processo => {
          this.updateForm(processo)
        })
      }
    ) 
  }

  updateForm(processo: IProcesso){

    this.form.patchValue({
      id: this.currentId,
      numero: processo.numero,
      exequente: processo.exequente,
      executado: processo.executado,
      juizo: processo.juizo,
      juiz: processo.juiz,
      assunto: processo.assunto,
      valor: processo.valor,
      eventos: processo.eventos
    })
  }

  onSubmit(){
    this.submitted = true;
    console.log("this.form.value", this.form.value);
    this.processoService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Processo adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./juridico/processos'])
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
    console.log("Ao editar:", this.form.value);

    this.processoService.update(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            title: 'Processo atualizado. \n Deseja adicionar um arquivo agora?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Adicionar Arquivo',
            denyButtonText: `Agora não`,
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire('Envie um arquivo com o nome', "processo_" + res.id + ".pdf", 'info')
              this.router.navigate(['./uploads'])
            } else if (result.isDenied) {
              Swal.fire('Processos salvo com sucesso!', '', 'success')
              this.router.navigate(['./juridico/processos'])
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
