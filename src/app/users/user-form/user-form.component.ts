import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { IPermissoes, ISituacao, IUser } from '../interfaces/user.interface';
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

  listaPermissoes: IPermissoes[] = [
    { codigo: 1, descricao:'ROLE_CREATE'}, 
    { codigo: 2, descricao:'ROLE_READ'}, 
    { codigo: 3, descricao:'ROLE_UPDATE'},
    { codigo: 4, descricao:'ROLE_DELETE'}
  ]

  situacoes: ISituacao[] = [
    { id: 1, nome: 'Ativo' },
    { id: 2, nome: 'Inativo' },
    { id: 3, nome: 'Aposentado(a)' },
    { id: 4, nome: 'Pensionista' }
  ]
  userList: any;
  lastItemId: any;
  addPermitions: IPermissoes[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
          nome: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          celular: [''],
          cpf: [''],
          rg: [''],
          rgOrgaoExp: [''],
          matricula: [''],
          situacao: [''],
          senha: [''],
          permissoes: ['', Validators.required]
      })

      if(this.router.url.includes(`/usuarios/editar/`)){
        this.isEditUser = true
        this.currentId =  parseInt(this.router.url.substring(17))
      } else if(this.router.url.includes('/usuarios/novo')) {
        this.findLastItemId()
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
      celular: user.celular,
      cpf: user.cpf,
      rg: user.rg,
      rgOrgaoExp: user.rgOrgaoExp,
      matricula: user.matricula,
      situacao: user.situacao,
      senha: user.senha,
      permissoes: this.addPermitions
    })
  }

  onSubmit(){
    this.submitted = true;
    console.log(this.form.value);
    this.form.get('permissoes')?.setValue(this.addPermitions)
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
    this.form.get('permissoes')?.setValue(this.addPermitions)
    console.log("valor do form no edit:", this.form.value );
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

  findLastItemId(): void {
    this.userService.listAll({ page: "0", size: "5" })
      .subscribe({
        next: (data) => {
          this.userList = data.content ;
          this.lastItemId = data.content[0].id + 1;
        },
        error: (e) => console.error(e)
      });
  }

  onChange(permissao: any) {

    if(this.addPermitions.includes(permissao)){
      this.addPermitions.splice(this.addPermitions.indexOf(permissao), 1)
    } else {
      this.addPermitions.push(permissao)
    }
    console.log("Permissoes adicionadas: ", this.addPermitions);
    
  }


}
