import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { IDepartamentos, IEstadoConservacao, IInventario } from '../interfaces/inventario.interface';
import { InventarioService } from '../inventario.service';


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
  isDisabled: boolean = true;
  
  // Config File
  inventarioFileName: string = 'inventario_';
  middleFileUrl = '/api/file/download/'  
  baseUrl = environment.apiUrl
  invantarioList: any;
  lastItemId!: number;

  departamentos: IDepartamentos[] = [
    { id: 1, nome: 'Corredor' },
    { id: 2, nome: 'Secretaria' },
    { id: 3, nome: 'Presidência' },
    { id: 4, nome: 'Administrativo/Financeiro' },
    { id: 5, nome: 'Comunicação' },
    { id: 6, nome: 'Vice-Presidencia/Dir. Aposentados' },
    { id: 7, nome: 'Jurídico' },
    { id: 8, nome: 'Informática' },
    { id: 9, nome: 'Cozinha' }
  ]

  estadosConservacao: IEstadoConservacao[] = [
      { id: 1, nome: 'Novo'}, 
      { id: 2, nome: 'Bom'}, 
      { id: 3, nome: 'Recuperável'}
  ]
 

  constructor(
    private formBuilder: FormBuilder,
    private inventarioService: InventarioService,
    private router: Router,
    private route: ActivatedRoute,
    ) {

      this.findLastItemId()

        this.form =  this.formBuilder.group({
          dataAquisicao: [new FormControl(new Date()), [Validators.required]],
          departamento: [''],
          numero: ['', [Validators.required]],
          quant: ['', [Validators.required]],
          descricao: ['', [Validators.required]],
          estadoConservacao: [''],
          fileUrl: ['']
      })


    }


  ngOnInit(): void {

    if(this.router.url.includes(`/inventario/editar/`)){
      this.isEditInventario= true
      this.currentId =  parseInt(this.router.url.substring(19))
      this.inventarioFileName = `inventario_${this.currentId}.jpg`
    } else if(this.router.url.includes('/inventario/novo')) {
      this.findLastItemId()
      this.isEditInventario= false
    }

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
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.inventarioFileName}`
    })   

  }

  onSubmit(){
    this.submitted = true;
    this.form.get('fileUrl')?.setValue(`${this.baseUrl}${this.middleFileUrl}${this.inventarioFileName}`);
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
            position: 'top-end',
            icon: 'success',
            title: 'Balancete atualizado com sucesso!',
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
        }
      )
  }

  findLastItemId(): void {
    this.inventarioService.getAll()
      .subscribe({
        next: (data) => {
          this.invantarioList = data.content ;
          this.lastItemId = data.content[0].id + 1;
          this.inventarioFileName = `inventario_${this.lastItemId}.jpg`
        },
        error: (e) => console.error(e)
      });
  }




}
