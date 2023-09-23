import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IRegimento } from '../regimento.interface';
import { RegimentosService } from '../regimentos.service';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-regimentos',
  templateUrl: './regimentos.component.html',
  styleUrls: ['./regimentos.component.scss']
})
export class RegimentosComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['id', 'dataAprovacao', 'descricao', 'fileUrl', 'actions'];
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  showFirstLastButtons = true

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  perfil!: string;

  
  constructor(
    private regimentoService: RegimentosService, 
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
    this.listarRegimentos({ page: "0", size: "5" })
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

  public addRegimento() {
    this.router.navigate(['novo'], {relativeTo: this.route})
  }

  public listarRegimentos = (request:any) => {
    this.carregando = true;
    this.regimentoService
        .listAll( request)
        .pipe(take(1))
        .subscribe(
            (regimento: any) => {
                this.datasource = new MatTableDataSource(regimento.content) ;
                this.datasource.sort = this.sort;
                this.carregando = false;
                this.totalElements = regimento.totalElements
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
        this.listarRegimentos(request);
    }


  onDelete(regimento: IRegimento){

    Swal.fire({
      title: 'Deseja remover o Balanço?',
      text: "ATENÇÃO: Esta operação é irreversível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.regimentoService.remove(regimento).subscribe( (res: any) => {
          this.listarRegimentos({ page: "0", size: "5" })
        })
        Swal.fire(
          'Removido!',
          'O Balanço foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onEdit(regimento: IRegimento){
    this.router.navigate(['editar', regimento.id], {relativeTo: this.route})
  }

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }

}




