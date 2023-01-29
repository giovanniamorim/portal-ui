import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BalancoService } from '../plano-contas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-balancos',
  templateUrl: './balancos.component.html',
  styleUrls: ['./balancos.component.scss']
})
export class BalancosComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['id', 'descricao', 'fileUrl', 'actions'];
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  s3Url = environment.s3Url + 'balanco_'

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  constructor(
    private balancoService: BalancoService, 
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer
    ) { 

  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.listarBalancos({ page: "0", size: "5" })
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

  public addBalanco() {
    this.router.navigate(['novo'], {relativeTo: this.route})
  }

  public listarBalancos = (request:any) => {
    this.carregando = true;
    this.balancoService
        .listAll( request)
        .pipe(take(1))
        .subscribe(
            (Balanco) => {
                this.datasource = new MatTableDataSource(Balanco.content) ;
                this.datasource.sort = this.sort;
                this.carregando = false;
                this.totalElements = Balanco.totalElements
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
        this.listarBalancos(request);
    }


  onDelete(Balanco: IBalanco){

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
        this.balancoService.remove(Balanco).subscribe( res => {
          this.listarBalancos({ page: "0", size: "5" })
        })
        Swal.fire(
          'Removido!',
          'O Balanço foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onEdit(balanco: IBalanco){

    this.router.navigate(['editar', balanco.id], {relativeTo: this.route})

  }

}




