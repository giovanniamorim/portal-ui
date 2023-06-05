import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Output, ViewChild, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take, timeout, toArray } from 'rxjs/operators';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { ILancamentos } from '../interfaces/lancamentos.interface';
import { LancamentosService } from '../lancamentos.service';

@Component({
  selector: 'app-lancamentos',
  templateUrl: './lancamentos.component.html',
  styleUrls: ['./lancamentos.component.scss']
})
export class LancamentosComponent implements OnInit, AfterViewInit {

  @Input() searchCriteria: any;
  @Output() sendTipoLancamento = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['fileUrl', 'id', 'planoConta',  'valor'];
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
  
  
  constructor(
    private lancamentoService: LancamentosService,
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
    ) {

  }


  ngOnInit() {




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
                this.message = 'Nenhum registro encontrado'
          
              } else {
                this.typeMessage = 'success'
                this.message = `${this.totalElements} registros encontrados`
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
        this.lancamentoService.remove(lancamento).subscribe( res => {
          this.listarLancamentos({ page: "0", size: "5" })
        })
        Swal.fire(
          'Removido!',
          'O Receita foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onEdit(lancamento: ILancamentos){
    this.router.navigate(['editar', lancamento.id], {relativeTo: this.route})
  }

  onClick(lancamento:any){
    console.log("Image: ", lancamento);
    this.imgId = lancamento.id
    this.carregandoImagem = true
    setTimeout(() => {
      this.carregandoImagem = false
      this.imgSrc = lancamento.fileUrl
    }, 3000);

    
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


}




