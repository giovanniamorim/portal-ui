import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { LancamentosService } from '../contabil/lancamentos/lancamentos.service';
import { ThemePalette } from '@angular/material/core';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  public carregando = false;
  public color: ThemePalette = 'accent';

  public criteriaReceita = {
    "tipoLancamento": "Receita",
    "anoExercicio": "2023",
  }
  public criteriaDespesa = {
    "tipoLancamento": "Despesa",
    "anoExercicio": "2023",
  }

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/img/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/img/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/img/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/img/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/img/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/img/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];
  public mainChart: IChartProps = {};
  public lancamentoChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month')
  });

  totalReceita: any;
  totalDespesa: any;

  constructor(
    private chartsData: DashboardChartsData,
    private lancamentosService: LancamentosService
    ) {
  }

  ngOnInit(): void {
    this.buscaReceitaTotalAnual(this.criteriaReceita)
    this.buscaDespesaTotalAnual(this.criteriaDespesa)
    this.initCharts();
  }

  initCharts(): void {
    setTimeout(() => {
      this.lancamentoChart = this.chartsData.lancamentoChart;
    }, 8000);
    
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initLancamentoChart(value);
    this.initCharts();
  }

  public buscaReceitaTotalAnual(criterias: any){
    this.carregando = true
    this.lancamentosService.busca(criterias).subscribe((res) => {
      this.totalReceita = res.totalValor
      this.carregando = false
    })
  }

  public buscaDespesaTotalAnual(criterias: any){
    this.carregando = true
    this.lancamentosService.busca(criterias).subscribe((res) => {
      this.totalDespesa = res.totalValor
      this.carregando = false
    })
  }
}
