import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { AssembleiasService } from '../assembleias.service';
import { IAssembleias } from '../interfaces/assembleias.interface';


@Component({
  selector: 'app-assembleias',
  templateUrl: './assembleias.component.html',
  styleUrls: ['./assembleias.component.scss']
})
export class AssembleiasComponent implements OnInit, AfterViewInit  {

  displayedColumns: string[] = ['id', 'data', 'tipo', 'assunto', 'comentario', 'fileUrl', 'actions'];
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  pathUrl!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  perfil!: string;

  
  constructor(
    private assembleiaService: AssembleiasService, 
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
    this.listarAssembleias({ page: "0", size: "5" })
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

  public addAssembleia() {
    this.router.navigate(['novo'], {relativeTo: this.route})
  }

  public listarAssembleias = (request:any) => {
    this.carregando = true;
    this.assembleiaService
        .listAll( request)
        .pipe(
          take(1),)
        .subscribe(
            (Assembleia) => {
                this.datasource = new MatTableDataSource(Assembleia.content) ;
                this.datasource.sort = this.sort;
                this.carregando = false;
                this.totalElements = Assembleia.totalElements
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
        this.listarAssembleias(request);
    }


  onDelete(Assembleia: IAssembleias){

    Swal.fire({
      title: 'Deseja remover o Assembleia?',
      text: "ATENÇÃO: Esta operação é irreversível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.assembleiaService.remove(Assembleia).subscribe( res => {
          this.listarAssembleias({ page: "0", size: "5" })
        })
        Swal.fire(
          'Removido!',
          'O Assembleia foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onEdit(assembleia: IAssembleias){

    this.router.navigate(['editar', assembleia.id], {relativeTo: this.route})

  }

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }

}




