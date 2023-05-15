import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../auth.service';

// import { ErrorHandlerService } from 'src/app/core/error-handler.service';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, OnDestroy  {

  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

  hide = true;
  isValid!: boolean
  carregando = false
  jwtPayload: any;
  message: string = ''
  loginForm!: FormGroup
  resetForm!: FormGroup
  inProgress!: boolean
  isReset: boolean = false
  
  public token  = localStorage.getItem('token');
  isSuccess: boolean = false;
  errorMsg: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isValid = true
    this.inProgress = false
    this.loginForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      senha: ['', Validators.required]
    })

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })


    // add the css-style to the html and body tags
    this.bodyTag.classList.add('login-page');
    this.htmlTag.classList.add('login-page');
  }

  ngOnDestroy() {
    // remove the the body classes
    this.bodyTag.classList.remove('login-page');
    this.htmlTag.classList.remove('login-page');
  }

  login(){
    const usuario = this.loginForm.get('usuario')?.value;
    const senha = this.loginForm.get('senha')?.value;
    this.carregando = true

    // Logica de autenticação
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
    } 
  }

  formResetSenha(){
    this.isReset = true
    this.router.navigate(['/forgot-password']);
  }


  fazerLogin(){
    this.isReset = false
  }


}