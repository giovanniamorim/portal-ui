import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { IPlanejamento } from '../interfaces/planejamentos.interface';
import { PlanejamentosService } from '../planejamentos.service';

@Component({
  selector: 'app-planejamento-form',
  templateUrl: './planejamento-form.component.html',
  styleUrls: ['./planejamento-form.component.scss'],
})
export class PlanejamentoFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditPlanejamento!: boolean
  editar: any
  currentId!: number
  submitted = false;
  isDisabled: boolean = true;

  // Config File
  planejamentoFileName: string = 'planejamento_';
  middleFileUrl = '/api/file/download/'  
  baseUrl = environment.apiUrl
  planejamentoList: any;
  lastItemId: any;

  constructor(
    private formBuilder: FormBuilder,
    private planejamentoService: PlanejamentosService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
          ano: [null, [Validators.required]],
          descricao: [null, [Validators.required]],
          fileUrl: ['']
      })

    }


  ngOnInit(): void {
    
    if(this.router.url.includes(`/planejamentos/editar/`)){
      this.isEditPlanejamento = true
      this.currentId =  parseInt(this.router.url.substring(22))
      this.planejamentoFileName = `planejamento_${this.currentId}.pdf`
    } else if(this.router.url.includes('/planejamentos/novo')) {
      this.findLastItemId()
      this.isEditPlanejamento = false
    }

    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const planejamento$ = this.planejamentoService.loadById(id);
        planejamento$.subscribe(planejamento => {
          this.updateForm(planejamento)
        })
      }
    )

        
  }

  updateForm(planejamento: IPlanejamento){
    this.form.patchValue({
      id: this.currentId,
      ano: planejamento.ano,
      descricao: planejamento.descricao,
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.planejamentoFileName}`
    })

  }

  onSubmit(){
    this.submitted = true;
    console.log(this.form.value);
    this.planejamentoService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Planejamento adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./planejamentos'])
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
    this.planejamentoService.updatePlanejamento(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Balancete adicionado com sucesso!',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigate(['./planejamentos'])
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
    this.planejamentoService.getAll()
      .subscribe({
        next: (data) => {
          this.planejamentoList = data.content ;
          this.lastItemId = data.content[0].id + 1;
          this.planejamentoFileName = `planejamento_${this.lastItemId}.pdf`
        },
        error: (e) => console.error(e)
      });

  }


}
