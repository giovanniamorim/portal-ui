import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';


import { IUser } from '../interfaces/user.interface';
import { UserService } from '../user.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit  {
  
  displayedColumns: string[] = ['codigo', 'nome', 'email', 'permissoes', 'actions'];
  headerPdf = [['ID', 'NOME', 'USUÁRIO', 'PERFIS']]
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  userRoles: any
  roleSuperAdmin: string =  'ROLE_PESQUISAR_ASSEMBLEIA'.substring(0, 14)

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  test: any;
  dataTeste: any;
  perfil!: string;

  
  constructor(
    private userService: UserService, 
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
    this.listarUsers({ page: "0", size: "5" })
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

  public addUser() {
    this.router.navigate(['novo'], {relativeTo: this.route})
  }

  public listarUsers = (request:any) => {
    this.carregando = true;
    this.userService
        .listAll( request)
        .pipe(
          take(1)
          )
        .subscribe(
            (users) => {
              console.log("users: ", users);
                this.datasource = new MatTableDataSource(users.content) ;
                this.datasource.sort = this.sort;
                this.test = users.content
                this.carregando = false;
                users.content.forEach((user:any) => {
                  user.permissoes.forEach((role: any) => {
                    this.userRoles = role.descricao;
                    console.log("role name: ", this.userRoles);
                    
                  });
                  user.roleName = this.userRoles;
                });
                
                this.totalElements = users.totalElements
                console.log("Usuários:", users);
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
    this.datasource.filter = $event.target.value;
  }

    nextPage(event: PageEvent) {
        const request:any = {};
        request['page'] = event.pageIndex.toString();
        request['size'] = event.pageSize.toString();
        this.listarUsers(request);
    }


  onDelete(user: IUser){
    Swal.fire({
      title: 'Deseja remover o Usuário?',
      text: "ATENÇÃO: Esta operação é irreversível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.remove(user).subscribe( res => {
          this.listarUsers({ page: "0", size: "5" })
        })
        Swal.fire(
          'Removido!',
          'O Usuário foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onEdit(user: IUser){
    this.router.navigate(['editar', user.codigo], {relativeTo: this.route})
  }

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }


}




