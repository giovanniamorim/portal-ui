import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
const bcrypt = require("bcryptjs")
import { IPermissoes, ISituacao, IUser } from '../interfaces/user.interface';
import { UserService } from '../user.service';


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
  user!: IUser;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
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
          permissoes: ['', Validators.required]
      })

      if(this.router.url.includes(`/detalhe/editar/`)){
        this.isEditUser = true
        this.currentId =  parseInt(this.router.url.substring(16))
      } else if(this.router.url.includes('/detalhe/novo')) {
        this.findLastItemId()
        this.isEditUser = false
      }
    }


  ngOnInit(): void {
       this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const usuario$ = this.userService.loadById(id);
        usuario$.subscribe(usuario => {
          this.user = usuario
          this.updateForm(usuario)
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
      situacao: user.situacao
    })
  }

  onSubmit(){
    this.submitted = true;
    console.log(this.form.value);
    // this.form.get('permissoes')?.setValue(this.addPermitions)
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

    Swal.fire({
      title: 'Deseja atualizar o usuário?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: `Cancelar`,
      
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.userService.updateUser(this.user.codigo, this.form.value)
        .subscribe(
          res => {
            Swal.fire('Usuário salvo com sucesso!', '', 'success')
            this.router.navigate(['./usuarios'])
          },
          err => {
            console.log("Erro ao atualizar usuario: ", err);
            
            Swal.fire({
              icon: 'error',
              title: `Erro: ${err.status}`,
              text: err.error[0].mensagemUsuario
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

  showPassword() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  // getInitials(nameString:any , i:any){
  //   const fullName = nameString.split(' ');
  //   const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
  //   return initials.toUpperCase();
  // }

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
