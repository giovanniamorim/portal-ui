import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { IContrato } from '../contratos.interface';
import { ContratosService } from '../contratos.service';
import { AuthService } from '../../../seguranca/auth.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['id', 'prestador', 'descServico', 'dataInicial', 'dataFinal', 'obs', 'valor', 'fileUrl', 'actions'];
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  s3Url = environment.s3Url + 'contrato_'

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  perfil!: string;

  
  constructor(
    private contratoService: ContratosService, 
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
    this.listarContratos({ page: "0", size: "5" })
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

  public addContrato() {
    this.router.navigate(['novo'], {relativeTo: this.route})
  }

  public listarContratos = (request:any) => {
    this.carregando = true;
    this.contratoService
        .listAll( request)
        .pipe(take(1))
        .subscribe(
            (contrato: any) => {
                this.datasource = new MatTableDataSource(contrato.content) ;
                this.datasource.sort = this.sort;
                this.carregando = false;
                this.totalElements = contrato.totalElements
            },
            (error: any) => {
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

  filterData($event : any){
    this.datasource.filter = $event.target.value.trim().toLocaleLowerCase();
  }

    nextPage(event: PageEvent) {
        const request:any = {};
        request['page'] = event.pageIndex.toString();
        request['size'] = event.pageSize.toString();
        this.listarContratos(request);
    }


  onDelete(contrato: IContrato){

    Swal.fire({
      title: 'Deseja remover o Contrato?',
      text: "ATENÇÃO: Esta operação é irreversível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contratoService.remove(contrato).subscribe( (res: any) => {
          this.listarContratos({ page: "0", size: "5" })
        })
        Swal.fire(
          'Removido!',
          'O contrato foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onEdit(contrato: IContrato){
    this.router.navigate(['editar', contrato.id], {relativeTo: this.route})
  }

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }

}




