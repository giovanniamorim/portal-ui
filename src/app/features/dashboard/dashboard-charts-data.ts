import { Injectable, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/utils/src';
import { LancamentosService } from '../contabil/lancamentos/lancamentos.service';
import { Observable, forkJoin } from 'rxjs';

export interface IChartProps {
  colors?: any;
  data?: any;
  labels?: any;
  legend?: any;
  options?: any;
  type?: any;

  [propName: string]: any;

}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData implements OnInit {

  public lancamentoChart: IChartProps = {};
  public despesasMensais: Array<IChartProps>;
  public receitasMensais: Array<IChartProps>;


  constructor( private lancamentoService: LancamentosService ) {
    this.despesasMensais = [];
    this.receitasMensais = [];
    this.initLancamentoChart();
  }


  // public initLancamentoChart2(period: string = 'Month') {

  //   forkJoin([
  //     this.obterValoresReceitasPorMes(),
  //     this.obterValoresDespesasPorMes()
  //   ]).subscribe(
  //     ([receitas, despesas]) => {
  //       console.log("receitas", receitas);
  //       console.log("despesas", despesas);
        
  //       // Aqui você pode atribuir os valores recebidos aos arrays do gráfico
  //       this.lancamentoChart['Receitas'] = [...receitas.totalValor];
  //       this.lancamentoChart['Despesas'] = [...despesas.totalValor];
  //       console.log("this.lancamentoChart['Receitas']", this.lancamentoChart['Receitas']);
  //     },
  //     error => {
  //       console.error('Erro ao obter valores:', error);
  //     }
  //   );
  //   const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
  //   const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
  //   const brandInfoBg = hexToRgba(getStyle('--cui-info'), 10) ?? '#20a8d8';
  //   const brandDanger = getStyle('--cui-danger') || '#f86c6b';

  //   this.lancamentoChart['elements'] = period === 'Month' ? 12 : 27;

  //   let labels: string[] = [];
  //   if (period === 'Month') {
  //     labels = [
  //       'Janeiro',
  //       'Fevereiro',
  //       'Março',
  //       'Abril',
  //       'Maio',
  //       'Junho',
  //       'Julho',
  //       'Agosto',
  //       'Setembro',
  //       'Outubro',
  //       'Novembro',
  //       'Dezembro'
  //     ];
  //   } else {
  //     /* tslint:disable:max-line-length */
  //     const week = [
  //       'Segunda-Feira',
  //       'Terça-Feira',
  //       'Quarta-Feira',
  //       'Quinta-Feira',
  //       'Sexta-Feira',
  //       'Sábado',
  //       'Domingo'
  //     ];
  //     labels = week.concat(week, week, week);
  //   }

  //   const colors = [
  //     {
  //       // brandInfo
  //       backgroundColor: brandInfoBg,
  //       borderColor: brandInfo,
  //       pointHoverBackgroundColor: brandInfo,
  //       borderWidth: 2,
  //       // fill: true
  //     },
  //     {
  //       // brandSuccess
  //       backgroundColor: 'transparent',
  //       borderColor: brandSuccess || '#4dbd74',
  //       pointHoverBackgroundColor: '#fff',
  //       borderWidth: 2,
  //     },
  //     {
  //       // brandDanger
  //       backgroundColor: 'transparent',
  //       borderColor: brandDanger || '#f86c6b',
  //       pointHoverBackgroundColor: brandDanger,
  //       borderWidth: 2,
  //       // borderDash: [8, 5]
  //     }
  //   ];

  //   const datasets = [
  //     {
  //       data: this.lancamentoChart['Receitas'] ,
  //       label: 'Receitas',
  //       ...colors[0]
  //     },
  //     {
  //       data: this.lancamentoChart['Despesas'],
  //       label: 'Despesas',
  //       ...colors[1]
  //     }
  //   ];
  //   console.log("DATASET: ", datasets);

  //   const plugins = {
  //     legend: {
  //       display: false
  //     },
  //     tooltip: {
  //       callbacks: {
  //         labelColor: function(context: any) {
  //           return {
  //             backgroundColor: context.dataset.borderColor
  //           };
  //         }
  //       }
  //     }
  //   };

  //   const options = {
  //     maintainAspectRatio: false,
  //     plugins,
  //     scales: {
  //       x: {
  //         grid: {
  //           drawOnChartArea: false
  //         }
  //       },
  //       y: {
  //         beginAtZero: true,
  //         max: 500000,
  //         ticks: {
  //           maxTicksLimit: 5,
  //           stepSize: Math.ceil(250 / 5)
  //         }
  //       }
  //     },
  //     elements: {
  //       line: {
  //         tension: 0.4
  //       },
  //       point: {
  //         radius: 0,
  //         hitRadius: 10,
  //         hoverRadius: 4,
  //         hoverBorderWidth: 3
  //       }
  //     }
  //   };

  //   this.lancamentoChart.type = 'line';
  //   this.lancamentoChart.options = options;
  //   this.lancamentoChart.data = {
  //     datasets,
  //     labels
  //   };
  // }

  initLancamentoChart(period: string = 'Month') {

        forkJoin([
          this.obterValoresReceitasPorMes(),
          this.obterValoresDespesasPorMes()
        ]).subscribe(
          ([receitas, despesas]) => {
            // Aqui você pode atribuir os valores recebidos aos arrays do gráfico
            this.lancamentoChart['Data1'] = [...receitas];
            this.lancamentoChart['Despesas'] = [...despesas];
          },
          error => {
            console.error('Erro ao obter valores:', error);
          }
        );


    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info'), 10) ?? '#20a8d8';
    const brandDanger = getStyle('--cui-danger') || '#f86c6b';

    // lancamentoChart
    // lancamentoChart
    this.lancamentoChart['elements'] = period === 'Month' ? 12 : 27;
    this.lancamentoChart['Data1'] = this.receitasMensais;
    this.lancamentoChart['Data2'] = this.despesasMensais;
    // generate random values for lancamentoChart
    for (let i = 0; i <= this.lancamentoChart['elements']; i++) {
      // this.lancamentoChart['Data1'].push(this.random(50, 240));
      // this.lancamentoChart['Data2'].push(this.random(20, 160));
      // this.lancamentoChart['Data3'].push(65);
    }

    let labels: string[] = [];
    if (period === 'Month') {
      labels = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
      ];
    } else {
      /* tslint:disable:max-line-length */
      const week = [
        'Segunda-Feira',
        'Terça-Feira',
        'Quarta-Feira',
        'Quinta-Feira',
        'Sexta-Feira',
        'Sábado',
        'Domingo'
      ];
      labels = week.concat(week, week, week);
    }

    const colors = [
      {
        // brandInfo
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        // fill: true
      },
      {
        // brandSuccess
        backgroundColor: 'transparent',
        borderColor: brandSuccess || '#4dbd74',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
      },
      {
        // brandDanger
        backgroundColor: 'transparent',
        borderColor: brandDanger || '#f86c6b',
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 2,
        // borderDash: [8, 5]
      }
    ];

    const datasets = [
      {
        data: this.lancamentoChart['Data1'],
        label: 'Receitas',
        ...colors[1]
      },
      {
        data: this.lancamentoChart['Data2'],
        label: 'Despesas',
        ...colors[2]
      }
    ];

    const plugins = {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          labelColor: function(context: any) {
            return {
              backgroundColor: context.dataset.borderColor
            };
          }
        }
      }
    };

    const options = {
      maintainAspectRatio: false,
      plugins,
      scales: {
        x: {
          grid: {
            drawOnChartArea: false
          }
        },
        y: {
          beginAtZero: true,
          max: 500000,
          ticks: {
            maxTicksLimit: 5,
            stepSize: Math.ceil(250 / 5)
          }
        }
      },
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.lancamentoChart.type = 'line';
    this.lancamentoChart.options = options;
    this.lancamentoChart.data = {
      datasets,
      labels
    };
  }


  public ngOnInit(): void {
    
  }

  public obterValoresDespesasPorMes(): Observable<any>{

    const ano = 2023;
    const meses = Array.from({ length: 12 }, (_, i) => i + 1); // Array de 1 a 12 representando os meses

    const observables: Observable<any>[] = meses.map(mes => {
      const dataInicial = `${ano}-${mes.toString().padStart(2, '0')}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFinal = `${ano}-${mes.toString().padStart(2, '0')}-${ultimoDia.toString().padStart(2, '0')}`;

      const request = {
        dataLancamentoDe: dataInicial,
        dataLancamentoAte: dataFinal
      };

      return this.lancamentoService.buscaDespesas(request);
    });

    // Agora você pode usar o forkJoin para fazer todas as requisições de uma vez
    forkJoin(observables).subscribe(
      responses => {
        // 'responses' é um array contendo as respostas para cada mês
        for (let i = 0; i < responses.length; i++) {
          // console.log(`Valores para o mês ${meses[i]}:`, responses[i]);
          this.despesasMensais.push(responses[i].totalValor)
          console.log("total despesas dash: ", this.receitasMensais);
        }
      },
      error => {
        console.error('Erro ao obter valores por mês:', error);
      }
    );

    return forkJoin(observables)
  }

  public obterValoresReceitasPorMes(): Observable<any>{
    const ano = 2023;
    const meses = Array.from({ length: 12 }, (_, i) => i + 1); // Array de 1 a 12 representando os meses

    const observables: Observable<any>[] = meses.map(mes => {
      const dataInicial = `${ano}-${mes.toString().padStart(2, '0')}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFinal = `${ano}-${mes.toString().padStart(2, '0')}-${ultimoDia.toString().padStart(2, '0')}`;

      const request = {
        dataLancamentoDe: dataInicial,
        dataLancamentoAte: dataFinal
      };

      return this.lancamentoService.buscaReceitas(request);
    });

    // Agora você pode usar o forkJoin para fazer todas as requisições de uma vez
    forkJoin(observables).subscribe(
      responses => {
        // 'responses' é um array contendo as respostas para cada mês
        for (let i = 0; i < responses.length; i++) {
          // console.log(`Valores para o mês ${meses[i]}:`, responses[i]);
          this.receitasMensais.push(responses[i].totalValor)
          console.log("total receitas dash: ", this.receitasMensais);
        }
      },
      error => {
        console.error('Erro ao obter valores por mês:', error);
      }
    );

    return forkJoin(observables)
  }

  // #endregion Public Methods (4)
}
