import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { IPermissoes, ISituacao, IUser } from '../interfaces/user.interface';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  
  form: FormGroup;
  isEditUser!: boolean
  editar: any
  currentId!: number
  submitted = false;
  isDisabled: boolean = true;
  show = false;
  password!: string
  userList: any;
  lastItemId: any;
  addPermitions: IPermissoes[] = [];
  user: IUser = {
    codigo: 0,
    nome: '',
    email: '',
    celular: '',
    cpf: '',
    rg: '',
    rgOrgaoExp: '',
    matricula: '',
    situacao: [],
    senha: '',
    confirmarSenha: '',
    permissoes: []
  };
  perfil!: string;

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

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
    ) {
        this.form =  this.formBuilder.group({
          nome: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          celular: ['', {disabled: true}],
          cpf: ['', {disabled: true}],
          rg: [''],
          rgOrgaoExp: [''],
          matricula: [''],
          situacao: [''],
          senha: ['', Validators.required],
          permissoes: ['']
      })

      if(this.router.url.includes(`/detalhe/editar/`)){
        this.isEditUser = true
        this.currentId =  parseInt(this.router.url.substring(16))
      } else if(this.router.url.includes('/detalhe/novo')) {
        this.findLastItemId()
        this.isEditUser = false
      } else if(this.router.url.includes('/usuarios/detalhe/')){
        this.currentId =  parseInt(this.router.url.substring(18))
        this.isEditUser = true
      }
  }

  ngOnInit(): void {
    this.findRoles()
    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const user$ = this.userService.loadById(id);
        user$.subscribe(user => {
          this.user = user;
          
          this.updateForm(user)
        })
      }
    )
  }

  updateForm(user: IUser){
    this.form.patchValue({
      codigo: user.codigo,
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
    Swal.fire({
      title: 'Deseja atualizar o usuário?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: `Cancelar`,
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updateUser(this.user?.codigo, this.form.value)
        .subscribe(
          res => {
            Swal.fire('Usuário salvo com sucesso!', '', 'success')
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

  findRoles(){
    if(!this.auth.temPermissao('ROLE_CREATE')){
      this.perfil = 'SINDICALIZADO'
    }
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


