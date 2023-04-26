import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { UserService } from '../user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup
  usuario!: any;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    ) { 
    this.createForm();
  }

  ngOnInit(): void {
    this.findPerfil()
  }


  createForm(){
    this.changePasswordForm = this.fb.group({
      oldPassword:['', Validators.required],
      newPassword:['', Validators.required],
      confirmPassword:['', Validators.required]
    })
  }


  findPerfil(){
    this.userService.findByEmail(this.auth.jwtPayload.user_name)
        .subscribe((user: any) => {
          this.usuario = user
        });

  }

  onSubmit(){
    const oldPassword = this.changePasswordForm.value.oldPassword;
    const newPassword = this.changePasswordForm.value.newPassword;
    const confirmPassword = this.changePasswordForm.value.confirmPassword;

    let formChangeData = { oldPassword, newPassword, confirmPassword}

    this.userService.changePassword(this.usuario.codigo, formChangeData).subscribe((res: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Senha alterada com sucesso! Você será redirecionado para a página de login.',
          showConfirmButton: false,
          timer: 4000
        })
         
        this.router.navigate(['login'])
      },
      err => {
        console.log("Erro: ", JSON.stringify(err)
        );
        
        Swal.fire({
          icon: 'error',
          title: `Erro: ${err.status}`,
          text: err.error
        })

      

    })
    
  }

}
