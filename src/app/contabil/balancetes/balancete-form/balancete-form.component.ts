import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';


import { BalancetesService } from '../balancetes.service';
import { environment } from 'src/environments/environment';
import { IBalancete, IMeses } from '../balancete.interface';

@Component({
  selector: 'app-balancete-form',
  templateUrl: './balancete-form.component.html',
  styleUrls: ['./balancete-form.component.scss'],
})
export class BalanceteFormComponent implements OnInit {

  form: FormGroup;

  showInputFile = false
  showInputFileUrl = false
  isEditBalance!: boolean
  editar: any
  currentId!: number
  submitted = false;
  s3Url = environment.s3Url + 'balancete_'
  isDisabled: boolean = true;

  mesesControl = new FormControl<string | IMeses>('');

  filteredIMesess!: Observable<IMeses[]>;
  
  meses: IMeses[] = [
    { id: 1, nome: 'Janeiro' },
    { id: 2, nome: 'Fevereiro' },
    { id: 3, nome: 'Março' },
    { id: 4, nome: 'Abril' },
    { id: 5, nome: 'Maio' },
    { id: 6, nome: 'Junho' },
    { id: 7, nome: 'Julho' },
    { id: 8, nome: 'Agosto' },
    { id: 9, nome: 'Setembro' },
    { id: 10, nome: 'Outubro' },
    { id: 11, nome: 'Novembro' },
    { id: 12, nome: 'Dezembro' }
  ]
 


  constructor(
    private formBuilder: FormBuilder,
    private balancetesService: BalancetesService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    ) {
        this.form =  this.formBuilder.group({
        ano: [null, [Validators.required]],
        mes: [null, [Validators.required]],
        fileUrl: [`${this.s3Url}${this.currentId}.pdf`]
      })

      if(this.router.url.includes(`/balancetes/editar/`)){
        console.log("Chegou aqui if", this.router.url.substring(19));
        
        this.isEditBalance = true
        this.currentId =  parseInt(this.router.url.substring(19))
      } else if(this.router.url.includes('/balancetes/novo')) {
        console.log("Chegou aqui else");
        this.isEditBalance = false
      }
    }


  ngOnInit(): void {

       this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const balancete$ = this.balancetesService.loadById(id);
        balancete$.subscribe(balancete => {
          this.updateForm(balancete)
        })
      }
    )

        
  }

  updateForm(balancete: IBalancete){
    this.form.patchValue({
      id: this.currentId,
      ano: balancete.ano,
      mes: balancete.mes,
      fileUrl: `${this.s3Url}${this.currentId}.pdf`
    })
    console.log("chegou no updateForm", this.form);
    

  }

  onSubmit(){
    this.submitted = true;
    console.log(this.form.value);
    this.balancetesService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Balancete adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        this.router.navigate(['./balancetes'])
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
    this.balancetesService.updateBalancete(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            title: 'Balancete atualizado. \n Deseja adicionar um arquivo agora?',
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Adicionar Arquivo',
            denyButtonText: `Agora não`,
            cancelButtonText: `Cancelar`,
            
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Envie um arquivo com o nome', "balancete_" + res.id + ".pdf", 'info')
              this.router.navigate(['./uploads'])
            } else if (result.isDenied) {
              Swal.fire('Balancete salvo com sucesso!', '', 'success')
              this.router.navigate(['./balancetes'])
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
