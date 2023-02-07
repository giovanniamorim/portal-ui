import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AuthService } from 'src/app/seguranca/auth.service';

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

  constructor(
    private classToggler: ClassToggleService,
    private auth: AuthService,
    private router: Router,
    ) {
    super();
    
  }
  ngOnInit(): void {
    this.findPerfil()
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
    console.log("Buscar perfil: ", this.auth);
    
  }

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }

    
    
  }
}
