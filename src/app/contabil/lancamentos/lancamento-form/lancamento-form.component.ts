import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import {
  CONTAS,
  MODOS_PAGAMENTOS,
  PROFUNDIDADES,
  TIPOS_COMPROVANTES,
} from '../../plano-contas/interfaces/plano-contas.interface';
import { IConta, ILancamentos } from '../interfaces/lancamentos.interface';
import { LancamentosService } from '../lancamentos.service';

@Component({
  selector: 'app-lancamento-form',
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.scss']
})
export class LancamentoFormComponent implements OnInit, OnDestroy {
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  form: FormGroup;
  contaFilterCtrl: FormControl = new FormControl();
  filteredContas: ReplaySubject<IConta[]> = new ReplaySubject<IConta[]>(1);

  lancamentoFileName!: string;
  showInputFile = false;
  showInputFileUrl = false;
  isEditLancamento!: boolean;
  editar: any;
  currentId!: number;
  submitted = false;

  filteredOptions: Observable<IConta[]> | undefined;

  currentMiddleUrl = environment.apiUrl;
  middleFileUrl = '/api/file/find?name=';
  baseUrl = environment.apiUrl;
  isDisabled: boolean = true;
  isReceita: boolean = false;
  isDespesa: boolean = false;

  modosPagamentos = MODOS_PAGAMENTOS;
  tiposComprovantes = TIPOS_COMPROVANTES;
  profundidade = PROFUNDIDADES;

  protected _onDestroy = new Subject<void>();

  listarContas$: Observable<IConta[]> | undefined;

  contas = CONTAS

  
  

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
  original_options: any;
  tipoLanc: any;
  selectedPlano: any;

  constructor(
    private formBuilder: FormBuilder,
    private lancamentosService: LancamentosService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private auth: AuthService
  ) {
    this.tipoLancamentoPage = this.router.url.substring(13, 21);

    this.form = this.formBuilder.group({
      tipoLancamento: ['', [Validators.required]],
      dataLancamento: ['', [Validators.required]],
      planoConta: ['', [Validators.required]],
      modoPagamento: ['', [Validators.required]],
      tipoComprovante: ['', [Validators.required]],
      supCaixa: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      numDoc: [''],
      numCheque: [''],
      obs: [''],
      anoExercicio: ['', [Validators.required]],
      fileUrl: ['']
    });
  }

  ngOnInit(): void {


    
    this.findLastItemId();
    this.lancamentoFileName = `${this.inicialFileName}${this.lastItemId}.jpg`;

    this.route.params.subscribe((params: any) => {
      const id = params.id;
      const lancamento$ = this.lancamentosService.loadById(id);
      lancamento$.subscribe((lancamento) => {
        // Filtrar as contas com base no tipoLancamento do lançamento
        this.contas = this.contas.filter((c) => c.tipoLancamento === lancamento.tipoLancamento);
        this.updateForm(lancamento);
      });
    });

    if (this.router.url.includes(`/lancamentos/receitas/editar/`) 
          || this.router.url.includes(`/lancamentos/despesas/editar/`) 
          || this.router.url.includes(`/lancamentos/novo`)) {
      this.isEditLancamento = this.router.url.includes(`/lancamentos/receitas/editar/`) 
          || this.router.url.includes(`/lancamentos/despesas/editar/`);
      this.currentId = parseInt(this.router.url.substring(29));
      this.inicialFileName = this.isEditLancamento ? (
          this.router.url.includes(`/lancamentos/receitas/editar/`) ? 'receita_' : 'despesa_') : '';
      this.lancamentoFileName = `${this.inicialFileName}${this.isEditLancamento ? this.currentId : this.lastItemId}.jpg`;
    }
    
    this.currentMiddleUrl = this.router.url.substring(13, 21) === 'receitas' ? '/lancamentos/receitas' : '/lancamentos/despesas';
    this.tipoLancamentoPlano = this.router.url.substring(13, 21) === 'receitas' ? 'Receita' : 'Despesa';
    // this.contas = this.contas.filter((c) => c.tipoLancamento === this.tipoLancamentoPlano);

    this.filteredOptions = this.form.get('planoConta')?.valueChanges.pipe(
      map((value) => {
        console.log("value::::", value);
               
        const descricao = typeof value === 'string' ? value : value?.descricao;
        return descricao ? this._filter(descricao as string) : this.contas.slice();
      })
    );

  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  updateForm(lancamento: ILancamentos) {
    console.log('UPDATE FOMR:', lancamento);

    // this.filteredOptions = this.form.get('planoConta')?.valueChanges.pipe(
    //   map((value) => {
    //     console.log("value::::", value);
               
    //     const descricao = typeof value === 'string' ? value : value?.descricao;
    //     return descricao ? this._filter(descricao as string) : this.contas.slice();
    //   })
    // );

    this.showFile = `${this.baseUrl}${this.middleFileUrl}${this.inicialFileName}${this.currentId}.jpg`;
    this.form.patchValue({
      id: this.currentId,
      tipoLancamento: lancamento.tipoLancamento,
      dataLancamento: lancamento.dataLancamento,
      planoConta: lancamento.planoConta,
      modoPagamento: lancamento.modoPagamento,
      tipoComprovante: lancamento.tipoComprovante,
      supCaixa: lancamento.supCaixa,
      valor: lancamento.valor,
      numDoc: lancamento.numDoc,
      numCheque: lancamento.numCheque,
      anoExercicio: lancamento.anoExercicio,
      obs: lancamento.obs,
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.inicialFileName}${this.currentId}.jpg`
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log('FILENAME REPASSADO PARA O COMPONENTE DO UPLOAD: ', this.lancamentoFileName);

    this.form.get('fileUrl')?.setValue(`${this.baseUrl}${this.middleFileUrl}${this.lancamentoFileName}`);


    this.lancamentosService.create(this.form.value).subscribe(
      (res) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Lancamento adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        });
        console.log('path atual', this.currentMiddleUrl);

        this.router.navigate([this.currentMiddleUrl]);
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: err.error.status,
          text: err.error.message
        });
      }
    );
  }

  onEdit() {
    // Extrair apenas a propriedade 'descricao' do objeto 'planoConta'
    // const planoContaDescricao = this.form.get('planoConta')?.value.descricao;

    // // Definir o campo 'planoConta' como a descrição do plano de conta
    // this.form.get('planoConta')?.setValue(planoContaDescricao);

    this.lancamentosService.updateLancamento(this.currentId, this.form.value).subscribe(
      (res) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Lançamento atualizado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate([this.currentMiddleUrl]);
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: err.error.status,
          text: err.error.message
        });
      }
    );
  }

  onSelectChange(event: any): void {
    this.currentPath = event.value;
    this.currentMiddleUrl = this.currentMiddleUrl = (`/lancamentos/${this.currentPath}s`).toLowerCase();

    this.lancamentoFileName = (`${this.currentPath}_${this.lastItemId}.jpg`).toLocaleLowerCase();
    this.inicialFileName = event.value;

    // console.log('Listar contas ao selecionar tipo ANTES:', this.contas);
    // this.contas = this.contas.filter((c) => {
    //   c.tipoLancamento = event.value;
    // });

    // this.filteredOptions = this.form.get('planoConta')?.valueChanges.pipe(
    //   map((value) => {
    //     console.log("value::::", value);
               
    //     const descricao = typeof value === 'string' ? value : value?.descricao;
    //     return descricao ? this._filter(descricao as string) : this.contas.slice();
    //   })
    // );


  }

  findRoles() {
    if (this.auth.temPermissao('ROLE_READ')) {
      this.perfil = 'SINDICALIZADO';
    }
  }

  findLastItemId(): void {
    this.lancamentosService
      .getAll()
      .pipe(takeUntil(this._onDestroy))
      .subscribe({
        next: (data) => {
          this.lancamentosList = data.content;
          this.lastItemId = data.content[0].id + 1;

          this.tipoLancamentoPage === 'despesas' ? (this.inicialFileName = 'despesa_') : (this.inicialFileName = 'receita_');
        },
        error: (e) => console.error(e)
      });
  }

  private _filter(desc: string): IConta[] {
    const filterValue = desc.toLowerCase();
    return this.contas.filter((conta) => conta.descricao.toLowerCase().includes(filterValue));
  }

  displayFn(conta: IConta): string {
    return conta && conta.descricao ? conta.descricao : '';
  }

}
