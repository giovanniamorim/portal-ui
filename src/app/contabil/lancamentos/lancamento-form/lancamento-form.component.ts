import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { IModoPagamento } from '../../plano-contas/interfaces/modo-pagamento.interface';
import { IPlanoContas } from '../../plano-contas/interfaces/plano-contas.interface';
import { IProfundidade } from '../../plano-contas/interfaces/profundidade.interface';
import { ITipoComprovante } from '../../plano-contas/interfaces/tipo-comprovante.interface';
import { PlanoContasService } from '../../plano-contas/plano-contas.service';
import { ILancamentos } from '../interfaces/lancamentos.interface';
import { LancamentosService } from '../lancamentos.service';


@Component({
  selector: 'app-lancamento-form',
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.scss']
})
export class LancamentoFormComponent implements OnInit  {

  form: FormGroup;
  lancamentoFileName!: string;
  showInputFile = false
  showInputFileUrl = false
  isEditLancamento!: boolean
  editar: any
  currentId!: number
  submitted = false;

  currentMiddleUrl = environment.apiUrl
  middleFileUrl = '/upload-dir/'
  baseUpload = environment.uploadUrl 
  baseUrl = environment.apiUrl
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
  currentPath!: string;
  perfil!: string;
  inicialFileName!: string;
  showFile!: string;
  mgsImage!: string;
  lastItemId!: number;
  lancamentosList: any;
  lastItemIdx: any;
  isURLValid!: any;

  constructor(
    private formBuilder: FormBuilder,
    private lancamentosService: LancamentosService,
    private planoContaService: PlanoContasService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private auth: AuthService
    ) {
      this.findLastItemId()
      this.planoContasList();
      this.tipoLancamentoPage = this.router.url.substring(13,21);
      
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
        fileUrl: ['']
      })

      if(
        this.router.url.includes(`/lancamentos/receitas/editar/`) ||
        this.router.url.includes(`/lancamentos/despesas/editar/`) 
        ){
        this.isEditLancamento = true
        this.currentId =  parseInt(this.router.url.substring(29))
        this.lancamentoFileName = `${this.inicialFileName}${this.currentId}.jpg`
      } else if(
        this.router.url.includes('/lancamentos/novo')
        ) {
        this.isEditLancamento = false
        
      }
      
    }


  ngOnInit(): void {
    this.findLastItemId();

    this.lancamentoFileName = `${this.inicialFileName}${this.lastItemId}.jpg`
    
    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const lancamento$ = this.lancamentosService.loadById(id);
        lancamento$.subscribe(lancamento => {
          this.updateForm(lancamento)
        })
      }

    )

    if(this.router.url.substring(13,21) === 'novo'){
      this.currentMiddleUrl = (`/lancamentos/${this.currentPath}`).toLowerCase();
    }
    
    if( this.router.url.substring(13,21) === 'receitas') {
      this.currentMiddleUrl = '/lancamentos/receitas'
      this.tipoLancamentoPlano = 'Receita'
    } else {
      this.currentMiddleUrl = '/lancamentos/despesas'
      this.tipoLancamentoPlano = 'Despesa'
    }

    
  }



  updateForm(lancamento: ILancamentos){

    this.showFile = `${this.baseUpload}${this.middleFileUrl}${this.inicialFileName}${this.currentId}.jpg`
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
      fileUrl: `${this.baseUpload}${this.middleFileUrl}${this.inicialFileName}${this.currentId}.jpg`
    })
    

  }

  onSubmit(){

    this.submitted = true;
    

    this.form.get('fileUrl')?.setValue(`${this.baseUpload}${this.middleFileUrl}${this.lancamentoFileName}`);

        
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
        console.log("path atual", this.currentMiddleUrl);
        
        this.router.navigate([this.currentMiddleUrl])

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
    
    this.lancamentosService.updateLancamento(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Lançamento atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2000
          }) 
          this.router.navigate([this.currentMiddleUrl])
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
    this.currentMiddleUrl = this.currentMiddleUrl = (`/lancamentos/${this.currentPath}s`).toLowerCase();

    console.log(this.currentPath);
        console.log(this.lastItemId);
        
      this.lancamentoFileName = (`${this.currentPath}_${this.lastItemId}.jpg`).toLocaleLowerCase()
      console.log(this.lancamentoFileName );

      this.inicialFileName
        
  }

  findRoles(){
    if(this.auth.temPermissao('ROLE_READ')){
      this.perfil = 'SINDICALIZADO'
    }
  }

  
  findLastItemId(): void {
    this.lancamentosService.getAll()
      .subscribe({
        next: (data) => {
          this.lancamentosList = data.content ;
          this.lastItemId = data.content[0].id + 1;

          this.tipoLancamentoPage === 'despesas' ? this.inicialFileName = 'despesa_' : this.inicialFileName = 'receita_'
        },
        error: (e) => console.error(e)
      });
  }


}
