import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/users/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

  hide = true;
  isValid!: boolean
  carregando = false
  jwtPayload: any;
  message: string = ''
  resetForm!: FormGroup
  inProgress!: boolean
  isReset: boolean = false
  
  public token  = localStorage.getItem('token');
  isSuccess: boolean = false;
  errorMsg: string = '';

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isValid = true
    this.inProgress = false


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


  formResetSenha(){
    this.isReset = true
  }

  resetPassword(){
    const email = this.resetForm.get('email')?.value
    this.carregando = true
    this.userService.resetPassword(email).subscribe((res: any) => {
      this.isSuccess = true;
      this.errorMsg = '';
      this.carregando = false;
      console.log("Log de resposta resete senha: ", res)
    },
    (error) => {
      this.isSuccess = false,
      this.errorMsg = error;
      this.carregando = false
    }
    )
    
  }

  fazerLogin(){
    this.router.navigate(['/login']);
    this.isReset = false
  }

}
