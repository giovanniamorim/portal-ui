import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserService } from '../../features/users/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  resetSuccessMessage!: string;
  errorMessage!: any;
  token: string = '';
  hide = true;
  isValid!: boolean
  carregando = false
  message: string = ''
  isSuccess: boolean = false
  erroToken: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });

    this.token = this.route.snapshot.queryParams.token;
    console.log("token2", this.token);
  }

  get confirmPassword(): AbstractControl {
    return this.resetPasswordForm.get('confirmPassword')!;
  }

  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')!;
    const confirmPassword = control.get('confirmPassword')!;

    if (password.value !== confirmPassword.value) {
      return { mustMatch: true };
    }

    return null;
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.carregando = true

    const password = this.resetPasswordForm.value.password;

    this.userService.newPassword(password, this.token)
    .pipe(catchError(err => {

      this.errorMessage = err.error
      if(err.error === "Token Inválido" || err.error === "O token está expirado") {
        this.erroToken = "Token Inválido ou Expirado. Solicite um novo resete na tela de resetar senha."
      }
      if(err.error.text === "Sua senha foi resetada com sucesso. Verifique a caixa de entrada de seu email ou a caixa de spam.") {
        this.successMessage = err.error.text
        setTimeout(() => {
          this.carregando = true
          this.isSuccess = true
          this.router.navigate(['/login']);
        }, 10000);
      }
      
      return throwError(err)
    }))
      .subscribe(
        response => {
          this.resetSuccessMessage = response;
          this.carregando = false
          console.log("Response do new password", response);
        },
        error => {
          this.carregando = false
          this.errorMessage = error;
          console.log();
          
          if(error.error.text = "Sua senha foi resetada com sucesso. Verifique a caixa de entrada de seu email ou a caixa de spam."){
            setTimeout(() => {
              this.isSuccess = true
              
              this.router.navigate(['/login']);
            }, 10000);
            
          }
          this.resetSuccessMessage = error;
        }
      );
  }
}
