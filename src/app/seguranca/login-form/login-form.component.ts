import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  hide = true;
  isValid = true
  carregando = false
  jwtPayload: any;
  message: string = ''

  public token  = localStorage.getItem('token');

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(usuario: string, senha: string) {
    this.isValid = true
    this.carregando = true;
    this.auth.login(usuario, senha)
      .then(() => {
        this.carregando = false
        this.temPermissao()
        this.router.navigate(['/dashboard']);
      })
      .catch(erro => {
        this.isValid = false
        this.carregando = false
        this.message = "Usuário ou senha inválido"
        console.log("Erro ao logar: ", erro);
        
      });
  }


  
  temPermissao() {
    if(this.jwtPayload && this.jwtPayload.authorities ){
      this.isValid = true
    } else {
      this.isValid = false
      this.message = 'Este usuário não tem permissão para acessar a aplicação. Entre em contato com o Sindicato.'
    }
  }


}