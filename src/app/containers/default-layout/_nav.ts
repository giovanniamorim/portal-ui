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
    name: 'Contratos',
    url: '/contratos',
    icon: 'fa fa-fax'
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
    name: 'Regimento',
    url:"https://portal-sindifisco.s3.sa-east-1.amazonaws.com/regimento.pdf",
    icon: 'fa fa-file-text-o'
  },
  {
    name: 'Acordo Coletivo',
    url:"https://portal-sindifisco.s3.sa-east-1.amazonaws.com/acordo_coletivo.pdf",
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
  {
    title: true,
    name: 'Configurações'
  },
  {
    name: 'Arquivos',
    url: '/files',
    icon: 'fa fa-balance-scale'
  },
  



];
