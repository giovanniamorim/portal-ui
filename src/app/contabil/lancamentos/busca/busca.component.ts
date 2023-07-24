import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

import { IModoPagamento } from '../../plano-contas/interfaces/modo-pagamento.interface';
import { ITipoComprovante } from '../../plano-contas/interfaces/tipo-comprovante.interface';
import { IConta } from '../interfaces/lancamentos.interface';

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

  modosPagamentos: IModoPagamento[] = [
    { nome: 'Dinheiro'}, 
    { nome: 'Cheque'}, 
    { nome: 'Transação Bancária'},
    { nome: 'Cartão de Crédito'},
    { nome: 'Cartão de Débito'},
    { nome: 'PIX'}
  ];

  tiposComprovantes: ITipoComprovante[] = [
    { nome: 'Boleto'}, 
    { nome: 'Recibo'}, 
    { nome: 'Cupom Fiscal'},
    { nome: 'Nota Fiscal'},
    { nome: 'Recibo Bancário'},
    { nome: 'DOC'},
    { nome: 'TED'}
  ];

  contas: IConta[] = [

      {
        codigo: '3.1.1.01.0001',
        descricao: 'Associados Ativos',
        profundidade: 'Analítica',
        tipoLancamento: 'Receita',
      },
      {
        codigo: '3.1.1.01.0002',
        descricao: 'Associados Aposentados',
        profundidade: 'Analítica',
        tipoLancamento: 'Receita',
      },
      {
        codigo: '3.1.1.01.0004',
        descricao: 'Associados Pensionistas',
        profundidade: 'Analítica',
        tipoLancamento: 'Receita',
      },
      {
        codigo: '3.2.1.01.0001',
        descricao: 'Fundo de Aplicação em Curto Prazo',
        profundidade: 'Analítica',
        tipoLancamento: 'Receita',
      },
      {
        codigo: '3.2.1.01.0002',
        descricao: 'Outras Receitas - Superavit',
        profundidade: 'Analítica',
        tipoLancamento: 'Receita',
      },
      {
        codigo: '3.3.1.01.0001',
        descricao: 'Ressarcimentos e Diárias',
        profundidade: 'Analítica',
        tipoLancamento: 'Receita',
      },
      {
        codigo: '3.3.1.01.0002',
        descricao: 'Outras Receitas',
        profundidade: 'Analítica',
        tipoLancamento: 'Receita',
      },
      {
        codigo: '4.2.1.01.0001',
        descricao: 'Vencimentos e Vantagens',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0002',
        descricao: 'Vale Transporte',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0003',
        descricao: 'Obrigações Patrimôniais - INSS',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0004',
        descricao: 'IRRF',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0005',
        descricao: 'Obrigações Patrimôniais - FGTS',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0006',
        descricao: 'Estagiário',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0007',
        descricao: 'Auxílio Plano Saúde',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0008',
        descricao: 'PIS s/Folha',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0009',
        descricao: 'Férias',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0010',
        descricao: 'Contribuição Social',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0011',
        descricao: '13º Salário',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0012',
        descricao: 'Assistência Médica',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0013',
        descricao: 'Verbas Rescisórias',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0014',
        descricao: 'Quinquênio',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0015',
        descricao: 'Anuênio',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0016',
        descricao: 'Multas Fiscais',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0017',
        descricao: 'INSS Verbas Rescisórias',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0018',
        descricao: '13º s/Rescisão',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.01.0019',
        descricao: 'Obrigações Patrimôniais - INSS s/13º Salário',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0001',
        descricao: 'Manutenção e Conserv de Máquinas',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0002',
        descricao: 'Material de Expediente',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0003',
        descricao: 'Alimentação e Mat. Higiene',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0004',
        descricao: 'Materiais Elétricos e Telefonia',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0005',
        descricao: 'Rede Celpa',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0006',
        descricao: 'Cosanpa',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0007',
        descricao: 'Serviços Telefônicos Móveis',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0008',
        descricao: 'Serviços Telefônicos Fixo e Internet',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0009',
        descricao: 'Mat e Acess p/ Maq e Aparelho Xerox',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0010',
        descricao: 'Despesas Bancárias',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0011',
        descricao: 'Ressarcimentos',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0012',
        descricao: 'Impostos Taxas e Emol Divrs IPTU',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0013',
        descricao: 'Custas Processuais',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0014',
        descricao: 'Locação de Móveis',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0015',
        descricao: 'Eventos',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0016',
        descricao: 'Serviços Gráficos',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0017',
        descricao: 'Publicação em Jornais',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0018',
        descricao: 'Assinaturas Periódicas',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0019',
        descricao: 'Pass, Cond, Taxi e Estacionamento',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0020',
        descricao: 'Material Limpeza e Conservação',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0022',
        descricao: 'Eventos - Concursados',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0023',
        descricao: 'Seguros',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0024',
        descricao: 'Confraternização Natalina',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0028',
        descricao: 'Despesas com Cartão de Crédito',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0029',
        descricao: 'Custas Judiciais',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0030',
        descricao: 'Despesas Judiciais',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0031',
        descricao: 'Manutenção de Sistemas - Banco de Dados',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0032',
        descricao: 'Material e Serviços Informática',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0033',
        descricao: 'Patrocínio',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0034',
        descricao: 'Seguros Prédio',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0035',
        descricao: 'Cursos e Treinamentos',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0036',
        descricao: 'Vestuários e Uniformes',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0037',
        descricao: 'Despesas com Veí­culos',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0038',
        descricao: 'Bens de Pequeno Valor',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0039',
        descricao: 'Despesas de Cartórios',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0040',
        descricao: 'Depreciação',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0041',
        descricao: 'Despesas Com Custeio',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0042',
        descricao: 'Internet Dedicada',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.02.0043',
        descricao: 'Despesa com Reuniões na Internet',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.03.0001',
        descricao: 'Assessoria de Imprensa',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.03.0002',
        descricao: 'Assessoria de Informática',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.03.0003',
        descricao: 'Assessoria Jurídica',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.03.0004',
        descricao: 'Assessoria de Comunicação',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.03.0005',
        descricao: 'Serviços de Terceiros - PF',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.03.0006',
        descricao: 'Nutricionista',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.04.0001',
        descricao: 'Honorários Advocatícios',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.04.0002',
        descricao: 'Serviços de Segurança',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.04.0003',
        descricao: 'Honorários Contábeis',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.04.0004',
        descricao: 'Serviços Terceiros - PJ',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.04.0005',
        descricao: 'Marketing Digital - PJ',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.04.0006',
        descricao: 'Consultoria Especializada',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.05.0001',
        descricao: 'Entrega Express Postag (Correios)',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.05.0002',
        descricao: 'Home Page, Prov/Manut Portal',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.05.0003',
        descricao: 'Jornal, Rádio e TV',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.05.0004',
        descricao: 'Serv Fotog, Cartaz, Faixa, Ban/Video',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.05.0005',
        descricao: 'Divulgação Diversas (BLOG)',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.05.0006',
        descricao: 'Produção de Vídeos',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.05.0007',
        descricao: 'Campanha Publicitária',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.05.0008',
        descricao: 'Aplicativo Site',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.05.0010',
        descricao: 'Publicação de Edital',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.06.0001',
        descricao: 'Diárias Diretores',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.06.0002',
        descricao: 'Passagens e Taxas',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.06.0003',
        descricao: 'Passagens e Hospedagens',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.06.0004',
        descricao: 'Diárias c/ Funcionários Outros',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.07.0001',
        descricao: 'Contribuições da FENAFISCO',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.07.0002',
        descricao: 'Contribuições ao DIEESE',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.07.0003',
        descricao: 'Pecúlio Pós Morte',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.07.0005',
        descricao: 'SINDITAF',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.08.0001',
        descricao: 'Programa de Form Sindical  / CD FENAFISCO',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.08.0002',
        descricao: 'Encontro de Aposentados',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.08.0003',
        descricao: 'Eleições Sindifisco',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.09.0001',
        descricao: 'Campanha Institucional',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.09.0002',
        descricao: 'Fundo de Reserva',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.09.0003',
        descricao: 'Campanha Salarial',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.09.0004',
        descricao: 'Mobilização / Congresso Estadual',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.09.0005',
        descricao: 'Superávit Exercí­cio Anterior',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.09.0006',
        descricao: 'Evento - Atividade de Integração',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.09.0007',
        descricao: 'Caravana',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.09.0008',
        descricao: 'Curso de Formação de Liderança',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.09.0009',
        descricao: 'Ajuda de Custo Interior',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.10.0001',
        descricao: 'Assistência a Entidades e Pessoas (Filant.)',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.11.0001',
        descricao: 'Sede Própria',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.11.0002',
        descricao: 'Obras Instalações e Reformas',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.11.0003',
        descricao: 'Máquinas e Equipamentos',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.11.0004',
        descricao: 'Móveis e Utensí­lios',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.11.0005',
        descricao: 'Computadores e Periféricos',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.1.11.0006',
        descricao: 'Software de Máquinas e Equipamentos',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      },
      {
        codigo: '4.2.11.0007',
        descricao: 'Equipamento de Processamento de Dados',
        profundidade: 'Analítica',
        tipoLancamento: 'Despesa',
      }
  ]

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
          const descricao = typeof value === 'string' ? value : value?.descricao;
          console.log("Descrição:", descricao);
          
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
    console.log("dataLancamentoDeFormatada: ", dataLancamentoDeFormatada);

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
