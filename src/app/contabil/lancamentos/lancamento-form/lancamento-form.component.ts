import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { IModoPagamento } from '../../plano-contas/interfaces/modo-pagamento.interface';
import { IPlanoContas } from '../../plano-contas/interfaces/plano-contas.interface';
import { PlanoContasService } from '../../plano-contas/plano-contas.service';
import { ILancamentos } from '../interfaces/lancamentos.interface';
import { LancamentosService } from '../lancamentos.service';

import { ITipoComprovante } from '../../plano-contas/interfaces/tipo-comprovante.interface';
import { IProfundidade } from '../../plano-contas/interfaces/profundidade.interface';
import { AuthGuard } from 'src/app/seguranca/auth.guard';
import { AuthService } from 'src/app/seguranca/auth.service';


@Component({
  selector: 'app-lancamento-form',
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.scss']
})
export class LancamentoFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditLancamento!: boolean
  editar: any
  currentId!: number
  submitted = false;
  s3Url = environment.s3Url + 'lancamento_'
  isDisabled: boolean = true;
  planoContas: IPlanoContas[] = [];

  modosPagamentos: IModoPagamento[] = [
    { nome: 'Dinheiro'}, 
    { nome: 'Cheque'}, 
    { nome: 'Transação Bancária'},
    { nome: 'Cartão de Crédito'},
    { nome: 'Cartão de Débito'},
    { nome: 'PIX'}
  ];

  tiposComprovantes: ITipoComprovante[] = [
    { nome: 'Boleto'}, 
    { nome: 'Recibo'}, 
    { nome: 'Cupom Fiscal'},
    { nome: 'Nota Fiscal'},
    { nome: 'Recibo Bancário'},
    { nome: 'DOC'},
    { nome: 'TED'}
  ];

  profundidade: IProfundidade[] = [
    { nome: 'Analítica'}, 
    { nome: 'Sintética'}
  ];

  supCaixa: string[] = ['Sim', 'Não'];
  tipoLancamento: string[] = ['Receita', 'Despesa'];
  tipoLancamentoPlano!: string;
  tipoLancamentoPage!: string;
  pathUrl!: string;
  currentPath!: string;
  perfil!: string;

  constructor(
    private formBuilder: FormBuilder,
    private lancamentosService: LancamentosService,
    private planoContaService: PlanoContasService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private auth: AuthService
    ) {

      this.planoContasList();
      
        this.form =  this.formBuilder.group({
          tipoLancamento: ['', [Validators.required]],
          dataLancamento: ['', [Validators.required]],
          planoConta: this.formBuilder.group({
            id: ['', [Validators.required]]
          }),
          modoPagamento: ['', [Validators.required]],
          tipoComprovante: ['', [Validators.required]],
          supCaixa: ['', [Validators.required]],
          valor: ['', [Validators.required]],
          obs: [''],
          fileUrl: [`${this.s3Url}${this.currentId}.jpg`]
        })

      if(
        this.router.url.includes(`/lancamentos/receitas/editar/`) ||
        this.router.url.includes(`/lancamentos/despesas/editar/`) 
        ){
        this.isEditLancamento = true
        this.currentId =  parseInt(this.router.url.substring(29))
      } else if(
        this.router.url.includes('/lancamentos/novo')
        ) {
        this.isEditLancamento = false
      }
    }


  ngOnInit(): void {
       this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const lancamento$ = this.lancamentosService.loadById(id);
        lancamento$.subscribe(lancamento => {
          this.updateForm(lancamento)
        })
      }

    )

    this.tipoLancamentoPage = this.router.url.substring(13,21);

    console.log("this.tipoLancamentoPage aqui: ", this.tipoLancamentoPage);

    if(this.router.url.substring(13,21) === 'novo'){
      this.pathUrl = (`/lancamentos/${this.currentPath}`).toLowerCase();
    }
    
    
    if( this.router.url.substring(13,21) === 'receitas') {
      this.pathUrl = '/lancamentos/receitas'
      this.tipoLancamentoPlano = 'Receita'
    } else {
      this.pathUrl = '/lancamentos/despesas'
      this.tipoLancamentoPlano = 'Despesa'
    }
  }


  updateForm(lancamento: ILancamentos){
    let idAtualizando = {id: lancamento.planoConta.id}
    
    this.form.patchValue({
      id: this.currentId,
      tipoLancamento: lancamento.tipoLancamento,
      dataLancamento: lancamento.dataLancamento,
      planoConta: idAtualizando,
      modoPagamento: lancamento.modoPagamento,
      tipoComprovante: lancamento.tipoComprovante,
      supCaixa: lancamento.supCaixa,
      valor: lancamento.valor,
      obs: lancamento.obs,
      fileUrl: `${this.s3Url}${this.currentId}.jpg`
    })

  }

  onSubmit(){
    this.submitted = true;
    this.lancamentosService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Lancamento adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        console.log("path atual", this.pathUrl);
        
        this.router.navigate([this.pathUrl])
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
    console.log("this.currentId", this.currentId);
    
    this.lancamentosService.updateLancamento(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            title: 'Lancamento atualizado. \n Deseja adicionar um arquivo agora?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Adicionar Arquivo',
            denyButtonText: `Agora não`,
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire('Envie um arquivo com o nome', "lancamento_" + res.id + ".jpg", 'info')
              this.router.navigate([this.pathUrl])
            } else if (result.isDenied) {
              Swal.fire('Lancamento salvo com sucesso!', '', 'success')
              this.router.navigate([this.pathUrl])
              
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

  planoContasList(){
    this.planoContaService.listAll(1).subscribe( (contas) => {
      this.planoContas = contas.content.filter(
        (p: IPlanoContas) => p.profundidade === 'Analítica'
        ).filter((p: IPlanoContas) => p.tipoLancamento === this.tipoLancamentoPlano);
    })
  }

  onSelectChange(event:any): void {
    this.currentPath = event.value
    console.log("this.currentPath: ", this.currentPath);
    this.pathUrl = this.pathUrl = (`/lancamentos/${this.currentPath}s`).toLowerCase();
  }

  findRoles(){
    if(this.auth.temPermissao('ROLE_READ')){
      this.perfil = 'SINDICALIZADO'
    }
  }

}
