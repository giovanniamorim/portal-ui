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
  isEditBalancete!: boolean
  editar: any
  currentId!: number
  submitted = false;
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

  // Config File
  balanceteFileName: string = 'balancete_';
  middleFileUrl = '/api/file/download/'  
  baseUrl = environment.apiUrl
  balanceteList: any;
  lastItemId: any;
 
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
        descricao: [null, [Validators.required]],
        fileUrl: ['']
      })
    }


  ngOnInit(): void {

    if(this.router.url.includes(`/balancetes/editar/`)){
      this.isEditBalancete = true
      this.currentId =  parseInt(this.router.url.substring(19))
      this.balanceteFileName = `balancete_${this.currentId}.pdf`
      console.log("balancete no editar: ", this.balanceteFileName );
      
    } else if(this.router.url.includes('/balancetes/novo')) {
      this.findLastItemId()
      this.isEditBalancete = false
      
      console.log("balancete no novo: ", this.balanceteFileName );
    }

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
      descricao: balancete.descricao,
      fileUrl: `${this.baseUrl}${this.middleFileUrl}${this.balanceteFileName}`
    })

  }

  onSubmit(){
    
    this.submitted = true;
    this.form.get('fileUrl')?.setValue(`${this.baseUrl}${this.middleFileUrl}${this.balanceteFileName}`);
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
            position: 'top-end',
            icon: 'success',
            title: 'Balancete atualizado com sucesso!',
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
        }
      )
  }

  findLastItemId(): void {
    this.balancetesService.getAll()
      .subscribe({
        next: (data) => {
          this.balanceteList = data.content ;
          console.log('this.balanceteList ', this.balanceteList );
          this.lastItemId = data.content[0].id + 1;
          this.balanceteFileName = `balancete_${this.lastItemId}.pdf`
        },
        error: (e) => console.error(e)
      });

  }

}
