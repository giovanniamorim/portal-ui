import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

import { IModoPagamento } from '../../plano-contas/interfaces/modo-pagamento.interface';
import { ITipoComprovante } from '../../plano-contas/interfaces/tipo-comprovante.interface';
import { IConta } from '../interfaces/lancamentos.interface';
import { CONTAS, MODOS_PAGAMENTOS, TIPOS_COMPROVANTES } from '../../plano-contas/interfaces/plano-contas.interface';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.scss']
})
export class BuscaComponent implements OnInit, OnChanges {

  searchForm!: FormGroup;
  @Output() searchParams = new EventEmitter<any[]>();
  @Output() resetParams = new EventEmitter<any>();
  @Input() tipoLancamento: any
  panelOpenState = false;

  modosPagamentos = MODOS_PAGAMENTOS;

  tiposComprovantes = TIPOS_COMPROVANTES;

  contas = CONTAS;

  supCaixa: string[] = ['Sim', 'Não'];
  message: string = '';
  lancamentos!: IConta[];
  filterReceita!: IConta[];
  filterDespesa!: IConta[];
  filteredOptions: Observable<IConta[]> | undefined ;
  
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe
  ){ }

  ngOnInit(): void {
      this.searchForm = this.fb.group({
        id: [''],
        dataLancamentoDe: [''],
        dataLancamentoAte: [''],
        planoConta: [''],
        modoPagamento: [''],
        tipoComprovante: [''],
        numDoc: [''],
        numCheque: [''],
        supCaixa: [''],
        anoExercicio: [''],
        valorMin: [''],
        valorMax: [''],
        page: [0], // Valor inicial de página
        size: [5], // Valor inicial de tamanho
      })

      this.filterReceita = this.contas.filter(c => c.tipoLancamento === 'Receita')
      this.filterDespesa = this.contas.filter(c => c.tipoLancamento === 'Despesa')
      this.tipoLancamento === 'Receita' ? this.lancamentos = this.filterReceita : this.lancamentos = this.filterDespesa
      

      this.filteredOptions = this.searchForm.get('planoConta')?.valueChanges.pipe(
        startWith(''),
        map(value => {
          console.log({value});
          
          const descricao = typeof value === 'string' ? value : value?.descricao;
          return descricao ? this._filter(descricao as string) : this.lancamentos.slice();
        }),
      );

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tipoLancamento  = changes.tipoLancamento.currentValue
  }

  displayFn(conta: IConta): string {
    return conta && conta.descricao ? conta.descricao : '';
  }

  private _filter(descricao: string): IConta[] {
    const filterValue = descricao.toLowerCase();
    console.log("filterValue", filterValue);
    
    return this.lancamentos.filter(option => option.descricao.toLowerCase().includes(filterValue));
  }

  search(){
    // Obtenha o valor do campo dataLancamentoDe do formulário
    const dataLancamentoDe = this.searchForm.get('dataLancamentoDe')?.value;
    const dataLancamentoAte = this.searchForm.get('dataLancamentoAte')?.value;

    // Faça o parse da data para o formato 'yyyy-MM-dd' utilizando o date-fns
    let dataLancamentoDeFormatada = this.datePipe.transform(dataLancamentoDe, 'yyyy-MM-dd');
    let dataLancamentoAteFormatada = this.datePipe.transform(dataLancamentoAte, 'yyyy-MM-dd');

    if(dataLancamentoDeFormatada === null){
      dataLancamentoDeFormatada = ""
    }
    if(dataLancamentoAteFormatada === null){
      dataLancamentoAteFormatada = ""
    }
    
    // Defina o valor formatado de dataLancamentoDe no formulário de busca
    this.searchForm.get('dataLancamentoDe')?.setValue(dataLancamentoDeFormatada);
    this.searchForm.get('dataLancamentoAte')?.setValue(dataLancamentoAteFormatada);

    // Obtenha os valores de página e tamanho do formulário
    const page = this.searchForm.get('page')?.value;
    const size = this.searchForm.get('size')?.value;

      // Adicione os valores de página e tamanho ao corpo da requisição
    const requestBody = {
      ...this.searchForm.value,
      page,
      size,
    };

    this.searchParams.emit(requestBody)
  }


  resetarFormulario() {
    this.searchForm.reset(
       {
        "id": "",
        "tipoLancamento": this.tipoLancamento,
        "dataLancamentoDe": "",
        "dataLancamentoAte": "",
        "planoConta": "",
        "modoPagamento": "",
        "tipoComprovante": "",
        "numDoc": "",
        "numCheque": "",
        "supCaixa": "",
        "anoExercicio": "",
        "valorMin": "",
        "valorMax": "",
        
      }
    );
    this.resetParams.emit(this.searchForm.value);
  }
}
