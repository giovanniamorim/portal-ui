import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { AssembleiasService } from '../assembleias.service';
import { IAssembleias, ITipoAssembleia } from '../interfaces/assembleias.interface';



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
  anos: string[] = ['2022', '2024']
  isDisabled: boolean = true;
  s3Url = environment.s3Url + 'assembleia_';
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
        fileUrl: [`${this.s3Url}${this.currentId}.pdf`]
      })

      if(this.router.url.includes(`/assembleias/editar/`)){
        this.isEditAssembleia = true
        this.currentId =  parseInt(this.router.url.substring(20))
      } else if(this.router.url.includes('/assembleias/novo')) {
        this.isEditAssembleia = false
      }
    }


  ngOnInit(): void {
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
      fileUrl: `${this.s3Url}${this.currentId}.pdf`
    })
  }

  onSubmit(){
    this.submitted = true;
    console.log(this.form.value);
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
            title: 'Assembleia atualizada. \n Deseja adicionar um arquivo agora?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Adicionar Arquivo',
            denyButtonText: `Agora não`,
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Envie um arquivo com o nome', "assembleia_" + res.id + ".pdf", 'info')
              this.router.navigate(['./uploads'])
            } else if (result.isDenied) {
              Swal.fire('Assembleia salva com sucesso!', '', 'success')
              this.router.navigate(['./assembleias'])
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
