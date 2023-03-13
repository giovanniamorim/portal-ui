import { Injectable } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/utils/src';

export interface IChartProps {
  data?: any;
  labels?: any;
  options?: any;
  colors?: any;
  type?: any;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor() {
    this.initMainChart();
  }

  public mainChart: IChartProps = {};

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart(period: string = 'Month') {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info'), 10) ?? '#20a8d8';
    const brandDanger = getStyle('--cui-danger') || '#f86c6b';

    // mainChart
    // mainChart
    this.mainChart['elements'] = period === 'Month' ? 12 : 27;
    this.mainChart['Data1'] = [
      285557, 121557, 352362
    ];
    this.mainChart['Data2'] = [
      22262, 265660, 12536, 35896, 22698, 68466, 2262, 365660, 62536, 35896, 12698, 18466,

    ];
    this.mainChart['Data3'] = [
      32262, 65660, 12536, 15896, 56698, 20466, 32262, 95660, 39536, 55896, 2698, 1466,
    ];

    // generate random values for mainChart
    for (let i = 0; i <= this.mainChart['elements']; i++) {
      // this.mainChart['Data1'].push(this.random(50, 240));
      // this.mainChart['Data2'].push(this.random(20, 160));
      // this.mainChart['Data3'].push(65);
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
        data: this.mainChart['Data1'],
        label: 'Ano 2023',
        ...colors[0]
      },
      {
        data: this.mainChart['Data2'],
        label: 'Ano 2022',
        ...colors[1]
      },
      {
        data: this.mainChart['Data3'],
        label: 'Ano 2021',
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

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels
    };
  }

}
