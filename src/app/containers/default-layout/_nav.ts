import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Contábil'
  },
  {
    name: 'Lançamentos',
    url: '',
    icon: 'fa fa-money',
    children: [
      {
        name: 'Receitas',
        url: '/lancamentos/receitas'
      },
      {
        name: 'Despesas',
        url: '/lancamentos/despesas'
      },
      
    ]
  },
  {
    name: 'Demonstrativos',
    url: '',
    icon: 'fa fa-line-chart',
    children: [
      {
        name: 'Balancetes',
        url: '/balancetes'
      },
      {
        name: 'Balanços',
        url: '/balancos'
      },
      
    ]
  },
  {
    name: 'Orçamentos',
    url: '',
    icon: "fa fa-paperclip",
    children: [
      {
        name: 'Execução',
        url: '/execucoes'
      },
      {
        name: 'Planejamento',
        url: '/planejamentos'
      },
      
    ]
  },

  {
    name: 'Inventário',
    url: '/inventario',
    icon: 'fa fa-fax'
  },

  {
    name: 'Documentos',
    title: true
  },
  {
    name: 'Contratos',
    url: '/documentos/contratos',
    icon: 'fa fa-book'
  },
  {
    name: 'Regimento',
    url:"/documentos/regimentos",
    icon: 'fa fa-clipboard'
  },
  {
    name: 'Acordo Coletivo',
    url:"/documentos/acordos",
    icon: 'fa fa-handshake-o'
  },
  {
    name: 'Assembleias',
    url:"/assembleias",
    icon: 'fa fa-bullhorn'
  },
  {
    title: true,
    name: 'Jurídico'
  },
  {
    name: 'Processos',
    url: '/juridico/processos',
    icon: 'fa fa-balance-scale'
  },


];
