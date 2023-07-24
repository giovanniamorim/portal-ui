import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, concatMap, map, take, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { ILancamentos } from '../interfaces/lancamentos.interface';
import { LancamentosService } from '../lancamentos.service';
import { EMPTY, Observable, Subject, of } from 'rxjs';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { url } from 'inspector';
import { FilesService } from 'src/app/files/files.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-lancamentos',
  templateUrl: './lancamentos.component.html',
  styleUrls: ['./lancamentos.component.scss']
})
export class LancamentosComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() searchCriteria: any;
  @Output() sendTipoLancamento = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;

  displayedColumns: string[] = ['id', 'dataLancamento', 'planoConta',  'modoPagamento', 'tipoComprovante',  'supCaixa', 'valor', 'fileUrl', 'actions'];
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  imgSrc!: string;
  showFirstLastButtons = true

  imgId: any;
  tipoLancamentoPage!: string;
  pathUrl!: string;
  perfil!: string;
  imageUrl: any;
  listImages: any;

  typeMessage: string = ''
  showTopMessage: boolean = false
  message: string = ''
  tipoLanc: any;
  criterias: any;
  inicialCriteria: any;
  carregandoImagem: boolean = false;

  private unsubscribe = new Subject<void>();
  
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


  ngOnInit() {

    this.lancamentoService.lancamentoRemovido$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.listarLancamentos(this.criterias));

    this.tipoLancamentoPage = this.router.url.substring(13);
    if( this.tipoLancamentoPage === 'receitas') {
      this.pathUrl = '/lancamentos/receitas'
      this.tipoLanc = "Receita"
      this.criterias = { 'page': 0, 'size': 5, tipoLancamento: "Receita", ...this.inicialCriteria}
    } else {
      this.pathUrl = '/lancamentos/despesas'
      this.tipoLanc = "Despesa"
      this.criterias = { 'page': 0, 'size': 5, tipoLancamento: "Despesa", ...this.inicialCriteria}
    }

    this.inicialCriteria = {
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
      "valorMax": ""
    }

    this.findRoles();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.listarLancamentos(this.criterias)
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
 }  

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  errorServer(){
    Swal.fire({
      title: 'Error!',
      text: 'Erro no servidor. Tente novemente mais tarde.',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }

  public addLancamento() {
    this.router.navigate(['lancamentos/novo'])
  }

  public listarLancamentos = (criterias: any) => {

    console.log("this.searchCriteria: ", this.searchCriteria);
    console.log("this.criterias:: ", criterias);
    
    // Lista inicial
    if(this.searchCriteria === undefined){
      this.criterias = { ...criterias, ...this.inicialCriteria }
    }
    
    // Lista com busca
    if(this.searchCriteria !== undefined){
      console.log("Pagina inicial do criteria existe?:", criterias.page);
      if(criterias.page === undefined) {
        this.criterias = { 'page': 0, 'size': 5, ...this.searchCriteria }
      } 
      this.criterias = { ...criterias, ...this.searchCriteria }
    }
    

    this.carregando = true;
    
      console.log("Criterios no listarLancamentos:", this.criterias);
      this.lancamentoService
      .busca(this.criterias)
      .pipe( take(1))
      .subscribe(
          (lancamento) => {
              this.datasource = new MatTableDataSource(lancamento.content);
              this.datasource.sort = this.sort;
              this.carregando = false;
              this.totalElements = lancamento.totalElements

              this.showTopMessage = true
              if(this.totalElements === 0){
                this.typeMessage = 'warning'
                this.message = 'Não encontramos registros para sua busca'
          
              } else {
                this.typeMessage = 'success'
                this.message = `Encontramos ${this.totalElements} registros para sua busca`
              }
          },
          (error) => {
              this.datasource = new MatTableDataSource();
              this.carregando = false;
              console.log("Erro ao listar itens");
              Swal.fire({
                title: 'Error!',
                text: 'Erro ao listar itens',
                icon: 'error',
                confirmButtonText: 'Ok'
              })
          }
      );
    

  }


  nextPage(event: PageEvent) {
        const request: any = {};
        request['page'] = event.pageIndex.toString();
        request['size'] = event.pageSize.toString();
        this.listarLancamentos(request);
 }



  onDelete(lancamento: ILancamentos){
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
        this.lancamentoService.remove(lancamento).subscribe(() => {
        Swal.fire(
          'Removido!',
          'O Receita foi removido com sucesso.',
          'success'
        )})
      } 
    })

  }

  onEdit(lancamento: ILancamentos){
    this.router.navigate(['editar', lancamento.id], {relativeTo: this.route})
  }



  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }

  onSearchCriteria(search: any){

    const criteria = {
      "id": search.id,
      "tipoLancamento": this.tipoLanc,
      "dataLancamentoDe": search.dataLancamentoDe,
      "dataLancamentoAte": search.dataLancamentoAte,
      "planoConta": search.planoConta.descricao !== undefined ? search.planoConta.descricao : '',
      "modoPagamento": search.modoPagamento,
      "tipoComprovante": search.tipoComprovante,
      "numDoc": search.numDoc,
      "numCheque": search.numCheque,
      "supCaixa": search.supCaixa,
      "anoExercicio": search.anoExercicio,
      "valorMin": search.valorMin,
      "valorMax": search.valorMax
    }

    this.searchCriteria = criteria
    console.log("Critérios recebidos: ", this.searchCriteria);
    this.listarLancamentos(this.searchCriteria)
  }

  onResetParams(resetForm: any){
    this.searchCriteria = resetForm
    console.log("Critérios recebidos: ", this.searchCriteria);
    this.listarLancamentos(this.searchCriteria)
  }

  onClick(lancamento: any): void {
    console.log("Image: ", lancamento.fileUrl);
    this.imgId = lancamento.id;
    this.carregandoImagem = true;
    this.carregando = true

    // Verificar a existência do arquivo usando a função checkIfFileExists
    this.checkIfFileExists(lancamento.fileUrl).pipe(
      concatMap((res: any) => {
        if (res === true) {
          // Se o arquivo existe (status 200), abrir o modal com a imagem
          console.log("Abrindo o modal...");
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

  openModal(fileUrl: string): void {
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
    console.log("this.imgSrc no openaModal: ", this.imgSrc);
    
  }

  closeModal(): void {
    this.carregando = false
    this.carregandoImagem = false
    // Encontrar o elemento do modal usando seu ID e fechar o modal
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      modalElement.classList.remove('show'); // Remover a classe 'show' para fechar o modal
      modalElement.style.display = 'none'; // Ocultar o modal definindo o estilo 'display' para 'none'
    }
  }


  checkIfFileExists(fileUrl: string): Observable<boolean> {
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

 


}





