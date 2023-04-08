import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { IPlanejamento } from '../interfaces/planejamentos.interface';
import { PlanejamentosService } from '../planejamentos.service';


@Component({
  selector: 'app-planejamentos',
  templateUrl: './planejamentos.component.html',
  styleUrls: ['./planejamentos.component.scss']
})
export class PlanejamentosComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['id', 'ano', 'descricao', 'fileUrl', 'actions'];
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  showFirstLastButtons = true

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  perfil!: string;

  
  constructor(
    private planejamentoService: PlanejamentosService, 
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
    this.listarPlanejamentos({ page: "0", size: "5" })
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

  public addPlanejamento() {
    this.router.navigate(['novo'], {relativeTo: this.route})
  }

  public listarPlanejamentos = (request:any) => {
    this.carregando = true;
    this.planejamentoService
        .listAll( request)
        .pipe(take(1))
        .subscribe(
            (Planejamento) => {
                this.datasource = new MatTableDataSource(Planejamento.content) ;
                this.datasource.sort = this.sort;
                this.carregando = false;
                this.totalElements = Planejamento.totalElements
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

  filterData($event : any){
    this.datasource.filter = $event.target.value.trim().toLocaleLowerCase();
  }

    nextPage(event: PageEvent) {
        const request:any = {};
        request['page'] = event.pageIndex.toString();
        request['size'] = event.pageSize.toString();
        this.listarPlanejamentos(request);
    }


  onDelete(Planejamento: IPlanejamento){

    Swal.fire({
      title: 'Deseja remover o Planejamento?',
      text: "ATENÇÃO: Esta operação é irreversível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.planejamentoService.remove(Planejamento).subscribe( res => {
          this.listarPlanejamentos({ page: "0", size: "5" })
        })
        Swal.fire(
          'Removido!',
          'O Planejamento foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onEdit(planejamento: IPlanejamento){
    this.router.navigate(['editar', planejamento.id], {relativeTo: this.route})
  }

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }

}




