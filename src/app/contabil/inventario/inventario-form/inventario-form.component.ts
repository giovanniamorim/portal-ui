import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { InventarioService } from '../inventario.service';
import { IDepartamentos, IEstadoConservacao, IInventario} from '../interfaces/inventario.interface';


@Component({
  selector: 'app-inventario-form',
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.scss'],
})
export class InventarioFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditInventario!: boolean
  editar: any
  currentId!: number
  submitted = false;
  anos: string[] = ['2022', '2024']
  isDisabled: boolean = true;
  s3Url = environment.s3Url + 'inventario_'

  departamentos: IDepartamentos[] = [
    { id: 1, nome: 'Cozinha' },
    { id: 2, nome: 'Secretaria' },
    { id: 3, nome: 'Banheiros' },
    { id: 4, nome: 'Diretoria' }
  ]

  estadosConservacao: IEstadoConservacao[] = [
      { id: 1, nome: 'Novo'}, 
      { id: 2, nome: 'Bom'}, 
      { id: 3, nome: 'Regular'},
      { id: 4, nome: 'Péssimo'},
      { id: 5, nome: 'Sucata'}
  ]
 

  constructor(
    private formBuilder: FormBuilder,
    private inventarioService: InventarioService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
          dataAquisicao: [new FormControl(new Date()), [Validators.required]],
          departamento: [''],
          numero: ['', [Validators.required]],
          quant: ['', [Validators.required]],
          descricao: ['', [Validators.required]],
          estadoConservacao: [''],
          fileUrl: [`${this.s3Url}${this.currentId}.jpg`]
      })

      if(this.router.url.includes(`/inventario/editar/`)){
        this.isEditInventario= true
        this.currentId =  parseInt(this.router.url.substring(19))
      } else if(this.router.url.includes('/inventario/novo')) {
        this.isEditInventario= false
      }
    }


  ngOnInit(): void {
       this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const inventario$ = this.inventarioService.loadById(id);
        inventario$.subscribe(inventario=> {
          this.updateForm(inventario)
        })
      }
    )
  }

  updateForm(inventario: IInventario){
    this.form.patchValue({
      id: this.currentId,
      dataAquisicao: inventario.dataAquisicao,
      departamento: inventario.departamento,
      numero: inventario.numero,
      quant: inventario.quant,
      descricao: inventario.descricao,
      estadoConservacao: inventario.estadoConservacao,
      fileUrl: `${this.s3Url}${this.currentId}.jpg`
    })   

  }

  onSubmit(){
    this.submitted = true;
    console.log(this.form.value);
    this.inventarioService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Item de inventário adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./inventario'])
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
    console.log("Editando: ", this.form.value);
    this.inventarioService.updateInventario(this.currentId, this.form.value)
    
      .subscribe(
        res => {
          Swal.fire({
            title: 'Inventário atualizado. \n Deseja adicionar um arquivo agora?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Adicionar Arquivo',
            denyButtonText: `Agora não`,
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Envie um arquivo com o nome', "inventario_" + res.id + ".jpg", 'info')
              this.router.navigate(['./uploads'])
            } else if (result.isDenied) {
              Swal.fire('Inventário salvo com sucesso!', '', 'success')
              this.router.navigate(['./inventario'])
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
