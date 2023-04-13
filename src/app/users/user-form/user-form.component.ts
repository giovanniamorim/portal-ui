import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
const bcrypt = require("bcryptjs")
import { IPermissoes, ISituacao, IUser } from '../interfaces/user.interface';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import { log } from 'console';


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
  show = false;
  

  listaPermissoes: IPermissoes[] = [
    { codigo: 1, descricao:'Escrita'}, 
    { codigo: 2, descricao:'Leitura'}, 
    { codigo: 3, descricao:'Atualização'},
    { codigo: 4, descricao:'Deleção'}
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
  addDefaultPermitions: IPermissoes[] = [{ codigo: 2, descricao: "ROLE_READ" }];
  perfil!: string;
  usuario!: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
    ) {
      this.findSelectedUser()

      this.form =  this.formBuilder.group({
          nome: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          celular: [''],
          cpf: [''],
          rg: [''],
          rgOrgaoExp: [''],
          matricula: [''],
          situacao: [''],
          senha: ['', Validators.required],
          permissoes: ['']
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
    this.findRoles()
    
    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const user$ = this.userService.loadById(id);
        user$.subscribe(user => {
          this.updateForm(user)
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
      permissoes: user.permissoes
    })
  }

  onSubmit(){
    this.form.get('permissoes')?.setValue(this.addDefaultPermitions)
    this.submitted = true;
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
        let fullMessage = err.error[0]?.mensagemUsuario
        let cutMessage = fullMessage.indexOf(":")
        let finalMessage = fullMessage.slice(cutMessage + 1)
        
        Swal.fire({
          icon: 'error',
          title: err.status,
          text: finalMessage
        })
      },
      
    )

  }

  onEdit(){   

    Swal.fire({
      title: 'Deseja atualizar o usuário?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: `Cancelar`,
      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.userService.updateUser(this.currentId, this.form.value)
        .subscribe(
          res => {
            console.log("Res", res);
            
            Swal.fire('Usuário salvo com sucesso!', '', 'success')
            this.router.navigate(['./usuarios'])
          },
          err => {
            let fullMessage = err.error[0]?.mensagemUsuario
            let cutMessage = fullMessage.indexOf(":")
            let finalMessage = fullMessage.slice(cutMessage + 1)
            
            Swal.fire({
              icon: 'error',
              title: err.status,
              text: finalMessage
            })
          }
        )
        
      }
    })




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


  findSelectedUser(){
    this.userService.loadById(this.currentId)
        .subscribe((user: IUser) => {
          console.log("User: -> ", user);
          
          this.usuario = user
        });
    
  }


  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
  }


}
