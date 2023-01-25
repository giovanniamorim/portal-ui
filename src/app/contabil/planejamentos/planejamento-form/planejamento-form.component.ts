import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
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
  anos: string[] = ['2022', '2024']
  isDisabled: boolean = true;
  s3Url = environment.s3Url + 'planejamento_'
 

  constructor(
    private formBuilder: FormBuilder,
    private planejamentoService: PlanejamentosService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
          ano: [null, [Validators.required]],
          descricao: [null, [Validators.required]],
        fileUrl: [`${this.s3Url}${this.currentId}.pdf`]
      })

      if(this.router.url.includes(`/planejamentos/editar/`)){
        this.isEditPlanejamento = true
        this.currentId =  parseInt(this.router.url.substring(22))
      } else if(this.router.url.includes('/planejamentos/novo')) {
        this.isEditPlanejamento = false
      }
    }


  ngOnInit(): void {
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
      fileUrl: `${this.s3Url}${this.currentId}.pdf`
    })
    console.log("chegou no updateForm", this.form);
    

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
            title: 'Planejamento atualizado. \n Deseja adicionar um arquivo agora?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Adicionar Arquivo',
            denyButtonText: `Agora não`,
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Envie um arquivo com o nome', "planejamento_" + res.id + ".pdf", 'info')
              this.router.navigate(['./uploads'])
            } else if (result.isDenied) {
              Swal.fire('Planejamento salvo com sucesso!', '', 'success')
              this.router.navigate(['./planejamentos'])
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
