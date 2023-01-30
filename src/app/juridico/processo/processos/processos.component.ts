import { animate, state, style, transition, trigger } from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { IProcesso } from '../interfaces/processo.interface';
import { ProcessoService } from '../processo.service';


@Component({
  selector: 'app-processos',
  templateUrl: './processos.component.html',
  styleUrls: ['./processos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProcessosComponent implements OnInit, AfterViewInit  {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [ 'id', 'numero', 'exequente', 'executado', 'assunto', 'eventos', 'actions'];
  datasource = new MatTableDataSource();

  carregando = false
  totalElements: any
  perfil!: string;

  constructor(
    private processoService: ProcessoService, 
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private auth: AuthService
    ) { 

  }

  ngOnInit() {
    this.findRoles()
  }

  ngAfterViewInit() {
    this.listarProcessos({ page: "0", size: "5" })
    this.datasource.sort = this.sort;
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

  public addProcesso() {
    this.router.navigate(['novo'], {relativeTo: this.route})
  }

  public listarProcessos = (request:any) => {


    this.carregando = true;
    this.processoService
        .listAll( request)
        .pipe(
          take(1))
        .subscribe(
            (processo) => {
                this.datasource = new MatTableDataSource(processo.content) ;
                this.datasource.sort = this.sort;
                this.carregando = false;
                this.totalElements = processo.totalElements
            },
            (error) => {
                this.datasource = new MatTableDataSource();
                this.carregando = false;
                Swal.fire({
                  title: 'Error!',
                  text: error,
                  icon: 'error',
                  confirmButtonText: 'Ok'
                })
            }
        );
  }

  filterData($event : any){
    this.datasource.filter = $event.target.value;
  }

  nextPage(event: PageEvent) {
        const request:any = {};
        request['page'] = event.pageIndex.toString();
        request['size'] = event.pageSize.toString();
        this.listarProcessos(request);
  }


  onDelete(Processo: IProcesso){
    Swal.fire({
      title: 'Deseja remover o Processo?',
      text: "ATENÇÃO: Esta operação é irreversível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.processoService.remove(Processo).subscribe( res => {
          this.listarProcessos({ page: "0", size: "5" })
        })
        Swal.fire(
          'Removido!',
          'O Processo foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onEdit(processo: IProcesso){
    this.router.navigate(['editar', processo.id], {relativeTo: this.route})
  }

  onDetail(processo: IProcesso){
    console.log("Chegou no ondetail button", processo);
    this.router.navigate(['detalhe', processo.id], {relativeTo: this.route})
  }

  findRoles(){
    if(this.auth.temPermissao('ROLE_READ')){
      this.perfil = 'SINDICALIZADO'
    }
  }

}




