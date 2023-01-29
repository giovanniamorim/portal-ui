import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { IPermissoes, IUser } from '../interfaces/user.interface'
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {

  form: FormGroup;
  isEditUser!: boolean
  editar: any
  currentId!: number
  submitted = false;
  isDisabled: boolean = true;

  permissoes: IPermissoes[] = [
    { id: 1, nome: 'Analista de Sistemas'}, 
    { id: 2, nome: 'Administrador'}, 
    { id: 3, nome: 'Sindicalizado'}
  ]

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
        codigo: [null, [Validators.required]],
        nome: [null, [Validators.required, Validators.email]],
        email: [''],
        senha: [''],
        permissoes: [null]
      })

      if(this.router.url.includes(`/usuarios/editar/`)){
        this.isEditUser = true
        this.currentId =  parseInt(this.router.url.substring(17))
      } else if(this.router.url.includes('/usuarios/novo')) {
        this.isEditUser = false
      }
    }


  ngOnInit(): void {
       this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const balanco$ = this.userService.loadById(id);
        balanco$.subscribe(balanco => {
          this.updateForm(balanco)
        })
      }
    )
  }

  updateForm(user: IUser){
    this.form.patchValue({
      codigo: this.currentId,
      nome: user.nome,
      email: user.email,
      senha: user.senha,
      permissoes: user.permissoes
    })
  }

  onSubmit(){
    this.submitted = true;
    console.log(this.form.value);
    this.userService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuário adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./usuarios'])
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: err.error.status,
          text: err.error.message
        })
      },
      
    )

  }

  onEdit(){
    this.userService.updateUser(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            title: 'Deseja atualizar o usuário?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('usuário salvo com sucesso!', '', 'success')
              this.router.navigate(['./usuarios'])
            }
          })
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: err.error.status,
            text: err.error.message
          })
        }
      )
  }




}
