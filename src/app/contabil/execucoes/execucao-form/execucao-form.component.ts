import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { ExecucoesService } from '../execucoes.service';
import { IExecucao} from '../interfaces/execucoes.interface';


@Component({
  selector: 'app-execucao-form',
  templateUrl: './execucao-form.component.html',
  styleUrls: ['./execucao-form.component.scss'],
})
export class ExecucaoFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditExecucao!: boolean
  editar: any
  currentId!: number
  submitted = false;
  anos: string[] = ['2022', '2024']
  isDisabled: boolean = true;
  s3Url = environment.s3Url + 'execucao_'
 

  constructor(
    private formBuilder: FormBuilder,
    private execucaoService: ExecucoesService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
          ano: [null, [Validators.required]],
          descricao: [null, [Validators.required]],
        fileUrl: [`${this.s3Url}${this.currentId}.pdf`]
      })

      if(this.router.url.includes(`/execucoes/editar/`)){
        this.isEditExecucao= true
        this.currentId =  parseInt(this.router.url.substring(22))
      } else if(this.router.url.includes('/execucoes/novo')) {
        this.isEditExecucao= false
      }
    }


  ngOnInit(): void {
       this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const execucao$ = this.execucaoService.loadById(id);
        execucao$.subscribe(execucao=> {
          this.updateForm(execucao)
        })
      }
    )

        
  }

  updateForm(execucao: IExecucao){
    this.form.patchValue({
      id: this.currentId,
      ano: execucao.ano,
      descricao: execucao.descricao,
      fileUrl: `${this.s3Url}${this.currentId}.pdf`
    })   

  }

  onSubmit(){
    this.submitted = true;
    console.log(this.form.value);
    this.execucaoService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Execução adicionada com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./execucoes'])
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
    this.execucaoService.updateExecucao(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            title: 'Execução atualizada. \n Deseja adicionar um arquivo agora?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Adicionar Arquivo',
            denyButtonText: `Agora não`,
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Envie um arquivo com o nome', "execucao_" + res.id + ".pdf", 'info')
              this.router.navigate(['./uploads'])
            } else if (result.isDenied) {
              Swal.fire('Execucção salva com sucesso!', '', 'success')
              this.router.navigate(['./execucoes'])
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
