import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { EventoService } from '../../evento/evento.service';
import { IEvento } from '../../evento/interfaces/evento.interface';
import { IProcesso } from '../interfaces/processo.interface';
import { ProcessoService } from '../processo.service';

export interface Options {
  orderBy: string;
  orderDir: 'ASC' | 'DESC';
  search: string,
  size: number,
  page: number;
}

export interface Response {
  records: IEvento[];
  filtered: number;
  total: number;
}

@Component({
  selector: 'app-processo-detail',
  templateUrl: './processo-detail.component.html',
  styleUrls: ['./processo-detail.component.scss'],
})
export class ProcessoDetailComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'nome', 'data', 'descricao', 'fileUrl', 'actions'];
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  currentId!: number
  processo: any = {};
  carregando = false
  totalElements: any
  datasource = new MatTableDataSource();
  eventosFiltrados: any[] = [];
  perfil!: string;
  showFirstLastButtons = true

  constructor(
    private processoService: ProcessoService,
    private eventoService: EventoService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
    ) {
    }

  ngOnInit(): void {

    this.findRoles()
    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        this.getProcesso(id) 
      }
    )
    
  }

  ngAfterViewInit() {
    this.listarEventos({ page: "0", size: "5" })
    this.datasource.sort = this.sort;
  }



  getProcesso(id: number){
    this.processoService.loadById(id).subscribe((processo) => {
      this.processo = processo
      this.currentId = processo.id
    })
  }

  meusEventos() {
    this.processo.eventos.subscribe((eventos:any) => {
                this.datasource = new MatTableDataSource(eventos.content) ;
                this.datasource.sort = this.sort;
                this.carregando = false;
                this.totalElements = eventos.totalElements
    })
  }

  public listarEventos = (request:any) => {
    this.carregando = true;
    this.eventoService
        .listAll( request)
        .pipe(take(1))
        .subscribe(
            (eventos) => {
                this.datasource = new MatTableDataSource(eventos.content) ;
                this.datasource.sort = this.sort;
                this.carregando = false;
                this.totalElements = eventos.totalElements
                
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
          // this.listarProcessos({ page: "0", size: "5" })
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

  nextPage(event: PageEvent) {
            const request:any = {};
            request['page'] = event.pageIndex.toString();
            request['size'] = event.pageSize.toString();
    //         this.listarProcessos(request);
  }

onDeleteEvento(evento: IEvento){
  Swal.fire({
    title: 'Deseja remover o Evento?',
    text: "ATENÇÃO: Esta operação é irreversível!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, pode remover!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.eventoService.remove(evento).subscribe( res => {
        console.log("resultado ");
        
        // todo
        this.router.navigate([`/juridico/processos/detalhe/${this.currentId}`]);
      })
      Swal.fire(
        'Removido!',
        'O Evento foi removido com sucesso.',
        'success'
      )
    } 
  })

}

  onEditEvento(evento: IEvento){
    console.log("recebe evento: ", evento);
    
    this.router.navigate(['/juridico/eventos/editar', evento.id])
  }

  public addEvento() {
    this.router.navigate(['novo'], {relativeTo: this.route})
  }

  searchEventos(){
      // Declare variables
      let input:any, filter, table:any, tr, td, i, txtValue;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");
    
      // Loop through all table rows, and hide those who don't match the search query
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }

    filterData($event : any){
      // this.datasource.filter = $event.target.value;
      this.datasource.filter = $event.target.value.trim().toLocaleLowerCase();
    }

    findRoles(){
      if(!this.auth.temPermissao('ROLE_CREATE')){
        this.perfil = 'SINDICALIZADO'
      }
    }
  
}
