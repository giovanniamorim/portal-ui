import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { IMeses } from '../../balancetes/balancete.interface';
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
  isDisabled: boolean = true;
  
  // Config file
middleFileUrl = '/api/file/find?name='  
  baseUrl = environment.apiUrl
  execucaoFileName!: string;
  execucaoList: any;
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
    private execucaoService: ExecucoesService,
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

    if(this.router.url.includes(`/execucoes/editar/`)){
      this.isEditExecucao= true
      this.currentId =  parseInt(this.router.url.substring(18))
      this.execucaoFileName = `execucao_${this.currentId}.pdf`
    } else if(this.router.url.includes('/execucoes/novo')) {
      this.findLastItemId()
      this.isEditExecucao= false
    }
    
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
      mes: execucao.mes,
      descricao: execucao.descricao,
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.execucaoFileName}`
    })   

  }

  onSubmit(){
    this.submitted = true;
    this.form.get('fileUrl')?.setValue(`${this.baseUrl}${this.middleFileUrl}${this.execucaoFileName}`);
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
            position: 'top-end',
            icon: 'success',
            title: 'Execução atualizada com sucesso!',
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
        }
      )
  }

  findLastItemId(): void {
    this.execucaoService.getAll()
      .subscribe({
        next: (data) => {
          this.execucaoList = data.content ;
          this.lastItemId = data.content[0].id + 1;
          this.execucaoFileName = `execucao_${this.lastItemId}.pdf`
        },
        error: (e) => console.error(e)
      });
  }

}
