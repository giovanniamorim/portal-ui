import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, map, take, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/seguranca/auth.service';
import { FilesService } from 'src/app/shared/utils/files/files.service';
import Swal from 'sweetalert2';

import { ILancamentos } from '../interfaces/lancamentos.interface';
import { LancamentosService } from '../lancamentos.service';


@Component({
  selector: 'app-lancamentos',
  templateUrl: './lancamentos.component.html',
  styleUrls: ['./lancamentos.component.scss']
})
export class LancamentosComponent implements OnInit, AfterViewInit, OnDestroy {
  // #region Properties (27)

  private _tipoLanc: any;
  private unsubscribe = new Subject<void>();

  public carregando = false
  public carregandoImagem: boolean = false;
  public criterias: any;
  public datasource = new MatTableDataSource()
  public displayedColumns: string[] = ['id', 'dataLancamento', 'planoConta',  'modoPagamento', 'tipoComprovante',  'supCaixa', 'valor', 'fileUrl', 'actions'];
  public imageUrl: any;
  public imgId: any;
  public imgSrc!: string;
  public inicialCriteria = {
    "tipoLancamento": this.tipoLanc,
    "id": "",
    "dataLancamentoDe": "",
    "dataLancamentoAte": "",
    "planoConta": "",
    "modoPagamento": "",
    "tipoComprovante": "",
    "numDoc": "",
    "numCheque": "",
    "supCaixa": "",
    "anoExercicio": "",
    "valorMin": "",
    "valorMax": "",
  }

  public listImages: any;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  public message: string = ''
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public pathUrl!: string;
  public perfil!: string;
  @Input() public searchCriteria: any;
  @Output() public sendTipoLancamento = new EventEmitter<string>();
  public showFirstLastButtons = true
  public showTopMessage: boolean = false
  @ViewChild(MatSort) sort!: MatSort;
  public tipoLancamentoPage!: string;
  public totalElements: any
  public totalGeral: number = 0;
  public totalPagina: number = 0;
  public typeMessage: string = ''

  constructor(
    private lancamentoService: LancamentosService,
    private fileService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
    ) {
  }


  public get tipoLanc(): any {
    return this._tipoLanc;
  }

  public set tipoLanc(value: any) {
    this._tipoLanc = value;
  }


  public addLancamento() {
    this.router.navigate(['lancamentos/novo'])
  }

  public announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public buildQueryParams(params: any) {
    params.tipoLancamento = this.tipoLanc;
    const queryParams: any = {};
    for(const key in params){
      console.log("keys: ", key);
      if(params[key] !== ""){
        queryParams[key] = params[key];
      }
    }

    return queryParams;
  }

  public checkIfFileExists(fileUrl: string): Observable<boolean> {
    const startIndex = fileUrl.lastIndexOf("name=");
    if (startIndex !== -1) {
      const fileName = fileUrl.substring(startIndex + "name=".length);
  
      return this.fileService.findByName(fileName).pipe(
        map((response: HttpResponse<any>) => response.status === 200),
        catchError((error: HttpErrorResponse) => of(error.status !== 404)),  
      );
    }
    // Retorne um Observable com valor false caso "name=" não seja encontrado na URL
    return of(false);
  }

  public closeModal(): void {
    this.carregando = false
    this.carregandoImagem = false
    // Encontrar o elemento do modal usando seu ID e fechar o modal
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      modalElement.classList.remove('show'); // Remover a classe 'show' para fechar o modal
      modalElement.style.display = 'none'; // Ocultar o modal definindo o estilo 'display' para 'none'
    }
  }

  public errorServer(){
    Swal.fire({
      title: 'Error!',
      text: 'Erro no servidor. Tente novemente mais tarde.',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }

  public findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }

  public listarLancamentos(criterias: any) {
    console.log("criterias no listar: ", criterias); 
    console.log("criterias no plano conta: ", criterias.planoConta); 
  
    // Se a página e o tamanho não estiverem definidos, utilize os valores padrão
    if (!criterias.page  && !criterias.size) {
      criterias.page = 0
      criterias.size = 5
    }

    if(criterias.planoConta){
      criterias.planoConta = criterias.planoConta.descricao
    } 
  
    criterias = this.buildQueryParams(criterias);

    console.log("criterias final: ", criterias);
    this.carregando = true;
    this.lancamentoService
      .busca(criterias)
      .pipe(take(1))
      .subscribe(
        (res) => {
          console.log("Lançamento retornado: ", res);
          
          // Cria uma nova instância de MatTableDataSource com os resultados ordenados
          this.datasource = new MatTableDataSource(res.lancamentos.content);
          this.datasource.sort = this.sort;
          this.carregando = false;
          this.totalElements = res.lancamentos.totalElements;
          // Calcule o total da página atual
          this.totalPagina = res.lancamentos.content.reduce((total:any, item:any) => total + item.valor, 0);
          // Calcule o total geral
          this.totalGeral = res.totalValor;     
          
  
          this.showTopMessage = true;
          if (this.totalElements === 0) {
            this.typeMessage = 'warning';
            this.message = 'Não encontramos registros para sua busca';
          } else {
            this.typeMessage = 'success';
            this.message = `Encontramos ${this.totalElements} registros para sua busca`;
          }
        },
        (error) => {
          this.datasource = new MatTableDataSource();
          this.carregando = false;
          Swal.fire({
            title: 'Error!',
            text: 'Erro ao listar itens',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      );
  }



  public nextPage(event: PageEvent) {
    console.log("event do next: ", event);
    
    console.log("criteriascriterias", this.criterias);
        const request: any = {
          ...this.criterias, // Keep the existing criteria
          page: event.pageIndex.toString(),
          size: event.pageSize.toString(),
          tipoLancamento: this.tipoLanc
        };
        this.listarLancamentos(request);
   }

  public ngAfterContentChecked(): void {
      this.cdr.detectChanges();
  }

  public ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    
    this.listarLancamentos(this.criterias)
  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public ngOnInit() {
    this.tipoLancamentoPage = this.router.url.substring(13);
    if (this.tipoLancamentoPage === 'receitas') {
      this.pathUrl = '/lancamentos/receitas';
      this.tipoLanc = "Receita";
    } else {
      this.pathUrl = '/lancamentos/despesas';
      this.tipoLanc = "Despesa";
    }
    // Atualiza o tipoLancamento em this.inicialCriteria antes de aplicar o spread
    this.inicialCriteria.tipoLancamento = this.tipoLanc;
  
    // Atualiza o objeto criterias com o tipo de lançamento
    this.criterias = {
      'page': 0,
      'size': 5,
      ...this.inicialCriteria
    };
    console.log("Criterios: ", this.criterias);
  
    this.lancamentoService.lancamentoRemovido$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.listarLancamentos(this.criterias));
  
    this.findRoles();
  }

  public onClick(lancamento: any): void {
    this.imgId = lancamento.id;
    this.carregandoImagem = true;
    this.carregando = true

    // Verificar a existência do arquivo usando a função checkIfFileExists
    this.checkIfFileExists(lancamento.fileUrl).pipe(
      concatMap((res: any) => {
        if (res === true) {
          // Se o arquivo existe (status 200), abrir o modal com a imagem
          this.openModal(lancamento.fileUrl);
        } else {
           // Exibir o mensagem caso o arquivo não exista (status não é 200)
          this.carregando = false
          this.closeModal();
          Swal.fire({
            title: 'Error!',
            text: 'O arquivo não foi encontrada no servidor.',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }

        // Retornar uma observável vazia para continuar a cadeia de operadores
        return EMPTY;
      })
    ).subscribe(() => {
      // Quando a cadeia de operadores for concluída, atualizar o carregandoImagem para false
      this.carregandoImagem = false;
      this.carregando = false
    });
  }

  public onDelete(lancamento: ILancamentos){
    Swal.fire({
      title: 'Deseja remover o Receita?',
      text: "ATENÇÃO: Esta operação é irreversível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carregando = true
        this.lancamentoService.remove(lancamento).subscribe(() => {
        Swal.fire(
          'Removido!',
          'O Receita foi removido com sucesso.',
          'success'
        )})
        this.carregando = false
      } 
    })
  }

  public onEdit(lancamento: ILancamentos){
    this.router.navigate(['editar', lancamento.id], {relativeTo: this.route})
  }

  public onResetParams(){
    this.listarLancamentos(this.inicialCriteria)
  }

  public onSearchCriteria(search: any){
    this.criterias = this.buildQueryParams(search);

    console.log("Criterios da busca: ", this.criterias);
    this.listarLancamentos(this.criterias)
  }

  public openModal(fileUrl: string): void {
    // Encontrar o elemento do modal usando seu ID e abrir o modal
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      modalElement.classList.add('show'); // Adicionar a classe 'show' para abrir o modal
      modalElement.style.display = 'block'; // Exibir o modal definindo o estilo 'display' para 'block'
    }

    // Atualizar a propriedade 'imgSrc' com a URL do arquivo para exibir a imagem no modal
    this.imgSrc = fileUrl;
    this.carregandoImagem = false
    this.carregando = false
  }

  // #endregion Public Methods (19)

  
}