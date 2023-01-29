import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { IEvento } from '../interfaces/evento.interface';
import { EventoService } from '../evento.service';
import { environment } from '../../../../environments/environment';
import { IProcesso } from '../../processo/interfaces/processo.interface';
import { ProcessoService } from '../../processo/processo.service';

@Component({
  selector: 'app-evento-form',
  templateUrl: './evento-form.component.html',
  styleUrls: ['./evento-form.component.scss'],
})
export class EventoFormComponent implements OnInit {

  form: FormGroup;
  showInputFile = false
  showInputFileUrl = false
  isEditEvento!: boolean
  editar: any
  currentId!: number
  submitted = false; 
  isDisabled: boolean = true;
  s3Url = environment.s3Url + 'evento_'
  recebeData: any;

  processos: IProcesso[] = []
  
 

  constructor(
    private formBuilder: FormBuilder,
    private eventoService: EventoService,
    private processoService: ProcessoService,
    private router: Router,
    private route: ActivatedRoute,
    ) {

      
      this.form =  this.formBuilder.group({
        nome: ['', [Validators.required]],
        data: [new FormControl(new Date()), [Validators.required]],           
        descricao: [null, Validators.required],
        // processo: [null, Validators.required],
        processo: this.formBuilder.group({
          id:  [null],
        }) ,
        fileUrl: [`${this.s3Url}${this.currentId}.pdf`]
      })


      if(this.router.url.includes(`/juridico/eventos/editar/`)){
        this.isEditEvento = true
        this.currentId =  parseInt(this.router.url.substring(25))
      } else if(this.router.url.includes('/juridico/eventos/novo')) {
        this.isEditEvento = false
      }
    }


  ngOnInit(): void {
       this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const evento$ = this.eventoService.loadById(id);
        evento$.subscribe(evento => {
          this.updateForm(evento)
        })
      }
    )
    
    this.listarProcessos(0);
  }

  public listarProcessos = (request:any) => {
    this.processoService.listAll(request).subscribe(processos => {
      this.processos = processos.content;
      console.log("Lista de processos do evento-form", this.processos);
      
    })
    
  }

  updateForm(evento: IEvento){
    this.form.patchValue({
      id: this.currentId,
      data: evento.data,
      nome: evento.nome,
      descricao: evento.descricao,
      processo: evento.processo.id,
      fileUrl: `${this.s3Url}${this.currentId}.pdf`
    })
  }

  onSubmit(){
    this.submitted = true;
    console.log("this.form.value", this.form.value);
    
    this.eventoService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Evento adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./juridico/eventos'])
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

    this.eventoService.update(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            title: 'Eventos atualizado. \n Deseja adicionar um arquivo agora?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Adicionar Arquivo',
            denyButtonText: `Agora não`,
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire('Envie um arquivo com o nome', "evento_" + res.id + ".pdf", 'info')
              this.router.navigate(['./uploads'])
            } else if (result.isDenied) {
              Swal.fire('Eventos salvo com sucesso!', '', 'success')
              this.router.navigate(['./juridico/eventos'])
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
