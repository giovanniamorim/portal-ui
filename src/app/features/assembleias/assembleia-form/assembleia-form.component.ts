import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AssembleiasService } from '../assembleias.service';
import { IAssembleias, ITipoAssembleia } from '../interfaces/assembleias.interface';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-assembleia-form',
  templateUrl: './assembleia-form.component.html',
  styleUrls: ['./assembleia-form.component.scss'],
})
export class AssembleiaFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditAssembleia!: boolean
  editar: any
  currentId!: number
  submitted = false;
  isDisabled: boolean = true;
  
  // Config file
middleFileUrl = '/api/file/find?name='  
  baseUrl = environment.apiUrl
  ataFileName!: string;
  assembleiaList: any;
  lastItemId: any;

  anos: string[] = ['2022', '2024']

  tipos: ITipoAssembleia[] = [
    { id: 1, nome: 'Ordinária'}, 
    { id: 2, nome: 'Extraordinária'}, 
    { id: 3, nome: 'Outros'}
  ]
 

  constructor(
    private formBuilder: FormBuilder,
    private assembleiaService: AssembleiasService,
    private router: Router,
    private route: ActivatedRoute,
    ) {
        this.form =  this.formBuilder.group({
          data: [new FormControl(new Date()), [Validators.required]],
          tipo: [''],
          assunto: [null, [Validators.required]],
          comentario: [null, [Validators.required]],
          fileUrl: ['']
      })
    }


  ngOnInit(): void {

    if(this.router.url.includes(`/assembleias/editar/`)){
      this.isEditAssembleia = true
      this.currentId =  parseInt(this.router.url.substring(20))
      this.ataFileName = `ata_${this.currentId}.pdf`
    } else if(this.router.url.includes('/assembleias/novo')) {
      this.findLastItemId()
      this.isEditAssembleia = false
    }

    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const assembleia$ = this.assembleiaService.loadById(id);
        assembleia$.subscribe(assembleia => {
          this.updateForm(assembleia)
        })
      }
    )
  }

  updateForm(assembleia: IAssembleias){
    this.form.patchValue({
      id: this.currentId,
      data: assembleia.data,
      tipo: assembleia.tipo,
      assunto: assembleia.assunto,
      comentario: assembleia.comentario,
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.ataFileName}`
    })
  }

  onSubmit(){
    this.submitted = true;
    this.form.get('fileUrl')?.setValue(`${this.baseUrl}${this.middleFileUrl}${this.ataFileName}`);
    this.assembleiaService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Assembleia adicionada com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./assembleias'])
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
    this.assembleiaService.updateAssembleia(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Assembleia atualizada com sucesso!',
            showConfirmButton: false,
            timer: 2000
          })
          this.router.navigate(['./assembleias'])
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
    this.assembleiaService.getAll()
      .subscribe({
        next: (data) => {
          this.assembleiaList = data.content ;
          console.log('this.assembleiaList ', this.assembleiaList );
          this.lastItemId = data.content[0].id + 1;
          this.ataFileName = `ata_${this.lastItemId}.pdf`
        },
        error: (e) => console.error(e)
      });
  }

}
