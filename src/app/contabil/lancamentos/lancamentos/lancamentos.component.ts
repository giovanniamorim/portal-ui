import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { FilesService } from 'src/app/files/files.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { ILancamentos } from '../interfaces/lancamentos.interface';
import { LancamentosService } from '../lancamentos.service';

@Component({
  selector: 'app-lancamentos',
  templateUrl: './lancamentos.component.html',
  styleUrls: ['./lancamentos.component.scss']
})
export class LancamentosComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['id', 'dataLancamento', 'planoConta',  'modoPagamento', 'tipoComprovante',  'supCaixa', 'valor', 'fileUrl', 'actions'];
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  imgSrc!: string;
  showFirstLastButtons = true


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  imgId: any;
  tipoLancamentoPage!: string;
  pathUrl!: string;
  perfil!: string;
  imageUrl: any;
  listImages: any;
  
  constructor(
    private lancamentoService: LancamentosService, 
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private  httpClient: HttpClient
    ) {

  }

  ngOnInit() {
    this.tipoLancamentoPage = this.router.url.substring(13);
    if( this.tipoLancamentoPage === 'receitas') {
      this.pathUrl = '/lancamentos/receitas'
    } else {
      this.pathUrl = '/lancamentos/despesas'
    }
    this.findRoles();
    this.getImageList()

    
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.listarLancamentos({ page: "0", size: "5" })
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

  public listarLancamentos = (request:any) => {

    this.getImageList();
      this.carregando = true;
    
    if(this.tipoLancamentoPage === 'receitas'){
      this.lancamentoService
      .listReceitas( request)
      .pipe(take(1))
      .subscribe(
          (lancamento) => {
            console.log("Minhas receitas: ", lancamento);
            
              this.datasource = new MatTableDataSource(lancamento.content) ;
              
              this.datasource.sort = this.sort;
              this.carregando = false;
              this.totalElements = lancamento.totalElements
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
    } else {

      this.lancamentoService
      .listDespesas( request)
      .pipe(take(1))
      .subscribe(
          (lancamento) => {
            console.log("Minhas despesas: ", lancamento);
            
              this.datasource = new MatTableDataSource(lancamento.content) ;
              this.datasource.sort = this.sort;
              this.carregando = false;
              this.totalElements = lancamento.totalElements
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

        

  }

  filterData($event : any){
    this.datasource.filter = $event.target.value;
  }

  nextPage(event: PageEvent) {
          const request:any = {};
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
    this.imgSrc = lancamento.fileUrl
    console.log("this.imageUrl: ", this.imageUrl);
    
  }

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }

  getImageList() {
    this.filesService.getFiles().subscribe((i: any) => this.listImages = i) ;
    console.log("Lista de imagens no lanlamentos: ", this.listImages);
    
  }

}




