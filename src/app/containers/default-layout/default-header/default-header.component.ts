import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { log } from 'console';
import { AuthService } from 'src/app/seguranca/auth.service';
import { IUser } from 'src/app/users/interfaces/user.interface';
import { UserService } from 'src/app/users/user.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  perfil!: string;
  usuario!:any
  userLogged!: IUser;

  constructor(
    private classToggler: ClassToggleService,
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
    super();
    
  }
  ngOnInit(): void {
    this.findPerfil()
    this.findUser()
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      // .catch(erro => this.errorHandler.handle(erro));
  }

  findPerfil(){
    this.usuario = this.auth
  }

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }

  findUser(){
    this.userService.findByEmail(this.auth.jwtPayload.user_name)
        .subscribe((user: IUser) => {
          this.userLogged = user
        });
    
  }

  viewPerfil(){
    this.router.navigate(['usuarios/editar/', this.userLogged.codigo], {relativeTo: this.route})
  }

  getInitials(fullName: any) {
    const nome = fullName.trim().split(' ');
    const initials = nome.reduce((acc:any, curr:any, index:any) => {
      if(index === 0 || index === nome.length - 1){
        acc = `${acc}${curr.charAt(0).toUpperCase()}`;
      }
      return acc;
    }, '');
    return initials;
  }

}
