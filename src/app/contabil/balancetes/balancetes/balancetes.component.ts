import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { distinct, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { IBalancete } from '../balancete.interface';

import { BalanceteFiltro, BalancetesService } from '../balancetes.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { BalanceteSearchComponent } from '../balancete-search/balancete-search.component';

@Component({
  selector: 'app-balancetes',
  templateUrl: './balancetes.component.html',
  styleUrls: ['./balancetes.component.scss']
})
export class BalancetesComponent implements OnInit, AfterViewInit, AfterViewChecked {

  displayedColumns: string[] = ['id', 'ano', 'mes', 'fileUrl', 'actions'];
  datasource = new MatTableDataSource()
  carregando = false
  totalElements: any
  s3Url = environment.s3Url + 'balancete_'
  filtro = new BalanceteFiltro();
  anos: string[] = ['2022', '2024']
  meses: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  // filtros
  filterValues: any;
  fields = ['ano', 'mes'];
  form!: FormGroup;
  searchText: any;
  totalCount: number = 0;
  // fim filtros

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(BalanceteSearchComponent, {static: false}) balanceteSearchComponent!: BalanceteSearchComponent;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  constructor(
    private balancetesService: BalancetesService, 
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
    ) {
      this.formInit(); 

  }


  ngOnInit() {
    this.getFilterValues();
  }

  ngAfterViewInit() {
    this.datasource = new MatTableDataSource();
    this.datasource.paginator = this.paginator
    this.datasource.sort = this.sort;
    this.route.queryParams.subscribe(params=>{
      if(params && params?.searchText){
        this.searchText= params?.searchText;
        this.balanceteSearchComponent.form.patchValue({searchText:params?.searchText})
      }
      this.getBalancetes(0,5)
    })
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
 }

  getFilterValues = () => {
    this.balancetesService.getBalancetesFilterValues().subscribe((res:any)=> {
      this.filterValues = res.content.filter(distinct)
      console.log("filterValues: ", this.filterValues);
      
    },
    error=>{
      console.error(error.message);  
    })
  }

  getBalancetes(pageIndex: number, pageSize: number){
    const formValues = this.form.getRawValue();
    if(this.searchText){
      formValues["searchText"] = this.searchText;
    }
    this.balancetesService.getBalancetes(pageIndex, pageSize, formValues).subscribe((res:any)=>{
      console.log("RES:", res);

      this.datasource = new MatTableDataSource(res.content) ;
      console.log("datasource:", this.datasource);
      this.datasource.paginator = this.paginator;
      this.totalElements = res.totalElements
      // this.totalCount = res.totalCount;
      this.datasource.sort = this.sort;
      
    },
    error=>{
      console.error(error.message);  
    })
  }

  pageNavigate(event:PageEvent){
    this.getBalancetes(event.pageIndex,event.pageSize);
  }

  formInit(){
    this.form = this.fb.group({
      ano:[''],
      mes:[''],
    })
  }

  applyFilter(){
    this.balanceteSearchComponent.form.reset();
    console.log('Paginator:', this.paginator);
    
    
    this.paginator.firstPage();
    this.searchText = ''
    this.getBalancetes(this.paginator.pageIndex,this.paginator.pageSize);
  }

  clearFilter(){
    this.form.reset();
    this.paginator.firstPage();
    this.searchText = ''
    this.getBalancetes(this.paginator.pageIndex,this.paginator.pageSize);
  }

  balanceteSearch(value: any){
    this.router.navigate([], { 
        relativeTo: this.route, 
        queryParams: { searchText: value.searchText },
        queryParamsHandling: 'merge',
        skipLocationChange: false,
    });

    this.searchText = value?.searchText || '';
    this.paginator.firstPage();
    this.getBalancetes(this.paginator.pageIndex,this.paginator.pageSize);
  }


  // announceSortChange(sortState: Sort) {
  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }

  errorServer(){
    Swal.fire({
      title: 'Error!',
      text: 'Erro no servidor. Tente novemente mais tarde.',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
  }

  addBalancete() {  
    this.router.navigate(['../balancetes/novo'])
    console.log("rota do addBalance: ", this.router.navigate(['balancetes/novo']) );
    
  }


  // public listarBalancetes = (request:any) => {
  //   this.carregando = true;
  //   this.balancetesService
  //       .listAll(request)
  //       .pipe(take(1))
  //       .subscribe(
  //           (balancete) => {
  //               this.datasource = new MatTableDataSource(balancete.content) ;
  //               this.datasource.sort = this.sort;
  //               // this.datasource.paginator = this.paginator;
  //               this.carregando = false;
  //               this.totalElements = balancete.totalElements
  //           },
  //           (error) => {
  //               this.datasource = new MatTableDataSource();
  //               this.carregando = false;
  //               console.log("Erro ao listar itens");
  //               Swal.fire({
  //                 title: 'Error!',
  //                 text: 'Erro ao listar itens',
  //                 icon: 'error',
  //                 confirmButtonText: 'Ok'
  //               })
  //           }
  //       );
  // }

  // filterData($event : any){
  //   this.datasource.filter = $event.target.value;
  // }

//   nextPage(event: PageEvent) {
//         const request:any = {};
//         request['page'] = event.pageIndex.toString();
//         request['size'] = event.pageSize.toString();
//         this.listarBalancetes(request);
//   }


  onDelete(balancete: IBalancete){
    Swal.fire({
      title: 'Deseja remover o Balancete?',
      text: "ATENÇÃO: Esta operação é irreversível!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pode remover!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.balancetesService.remove(balancete).subscribe( res => {
          this.getBalancetes(0, 5)
        })
        Swal.fire(
          'Removido!',
          'O Balancete foi removido com sucesso.',
          'success'
        )
      } 
    })

  }

  onEdit(balancete: IBalancete){
    this.router.navigate(['editar', balancete.id], {relativeTo: this.route})
  }

}
