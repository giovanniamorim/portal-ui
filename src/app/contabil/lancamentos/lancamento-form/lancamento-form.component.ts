import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/seguranca/auth.service';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { IModoPagamento } from '../../plano-contas/interfaces/modo-pagamento.interface';
import { CONTAS, IContas, IPlanoContas } from '../../plano-contas/interfaces/plano-contas.interface';
import { IProfundidade } from '../../plano-contas/interfaces/profundidade.interface';
import { ITipoComprovante } from '../../plano-contas/interfaces/tipo-comprovante.interface';
import { PlanoContasService } from '../../plano-contas/plano-contas.service';
import { ILancamentos } from '../interfaces/lancamentos.interface';
import { LancamentosService } from '../lancamentos.service';


@Component({
  selector: 'app-lancamento-form',
  templateUrl: './lancamento-form.component.html',
  styleUrls: ['./lancamento-form.component.scss']
})
export class LancamentoFormComponent implements OnInit  {

  form: FormGroup;
  lancamentoFileName!: string;
  showInputFile = false
  showInputFileUrl = false
  isEditLancamento!: boolean
  editar: any
  currentId!: number
  submitted = false;

  currentMiddleUrl = environment.apiUrl
  middleFileUrl = '/portal-api/api/file/find?name='
  baseUpload = environment.uploadUrl 
  baseUrl = environment.apiUrl
  isDisabled: boolean = true;


  planoContas: IContas[] = [
    {
      contaPai: '', 
      codigo: '3', 
      descricao: 'Receitas Correntes', 
      profundidade: 'Sintética', 
      tipoLancamento: 'Receita'
  },
  {
      contaPai: '3', 
      codigo: '3.1', 
      descricao: 'Receitas Gerais', 
      profundidade: 'Sintética', 
      tipoLancamento: 'Receita'
  },
  {
      contaPai: '3.1', 
      codigo: '3.1.1', 
      descricao: 'Receitas Ordinárias da Atividade', 
      profundidade:'Sintética', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.1.1', 
      codigo: '3.1.1.01', 
      descricao: 'Contribuições de Associados', 
      profundidade:'Sintética', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.1.1.01', 
      codigo: '3.1.1.01.0001', 
      descricao: 'Associados Ativos', 
      profundidade: 'Analítica', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.1.1.01', 
      codigo: '3.1.1.01.0002', 
      descricao: 'Associados Aposentados', 
      profundidade: 'Analítica', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.1.1.01', 
      codigo: '3.1.1.01.0004', 
      descricao: 'Associados Pensionistas', 
      profundidade: 'Analítica', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3', 
      codigo: '3.2', 
      descricao: 'Receitas Patrimôniais', 
      profundidade:'Sintética', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.2', 
      codigo: '3.2.1', 
      descricao: 'Receita Patrimônial', 
      profundidade:'Sintética', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.2.1', 
      codigo: '3.2.1.01', 
      descricao: 'Receitas de Valores Imobiliários', 
      profundidade:'Sintética', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.2.1.01', 
      codigo: '3.2.1.01.0001', 
      descricao: 'Fundo de Aplicação em Curto Prazo', 
      profundidade: 'Analítica', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.2.1.01', 
      codigo: '3.2.1.01.0002', 
      descricao: 'Outras Receitas - Superavit', 
      profundidade: 'Analítica', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3', 
      codigo: '3.3',  
      descricao: 'Outras Receitas',
      profundidade:'Sintética', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.3', 
      codigo: '3.3.1', 
      descricao: 'Outras Receitas Correntes', 
      profundidade:'Sintética', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.3.1', 
      codigo: '3.3.1.01', 
      descricao: 'Outras Receitas Correntes Gerais', 
      profundidade:'Sintética', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.3.1.01', 
      codigo: '3.3.1.01.0001', 
      descricao: 'Ressarcimentos e Diárias', 
      profundidade: 'Analítica', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '3.3.1.01', 
      codigo: '3.3.1.01.0002', 
      descricao: 'Outras Receitas', 
      profundidade: 'Analítica', 
      tipoLancamento:'Receita'
  },
  {
      contaPai: '', 
      codigo: '4', 
      descricao: 'Despesas Correntes', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4', 
      codigo: '4.2', 
      descricao: 'Despesas Operacionais', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2', 
      codigo: '4.2.1', 
      descricao: 'Despesas Gerais e Administrativas', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.01', 
      descricao: 'Despesas com Pessoal e Encargos', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0001', 
      descricao: 'Vencimentos e Vantagens', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0002', 
      descricao: 'Vale Transporte', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0003', 
      descricao: 'Obrigações Patrimôniais - INSS', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0004', 
      descricao: 'IRRF', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0005', 
      descricao: 'Obrigações Patrimôniais - FGTS', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0006', 
      descricao: 'Estagiário', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0007', 
      descricao: 'Auxílio Plano Saúde', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0008', 
      descricao: 'PIS s/Folha', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0009', 
      descricao: 'Férias', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0010', 
      descricao: 'Contribuição Social', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0011', 
      descricao: '13º Salário', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0012', 
      descricao: 'Assistência Médica', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0013', 
      descricao: 'Verbas Rescisórias', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0014', 
      descricao: 'Quinquênio', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0015', 
      descricao: 'Anuênio', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0016', 
      descricao: 'Multas Fiscais', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0017', 
      descricao: 'INSS Verbas Rescisórias', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0018', 
      descricao: '13º s/Rescisão', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.01', 
      codigo: '4.2.1.01.0019', 
      descricao: 'Obrigações Patrimôniais - INSS s/13º Salário', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.02', 
      descricao: 'Despesas com Custeio Exceto Pessoal', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0001', 
      descricao: 'Manutenção e Conserv de Máquinas', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0002', 
      descricao: 'Material de Expediente', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0003', 
      descricao: 'Alimentação e Mat. Higiene', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0004', 
      descricao: 'Materiais Elétricos e Telefonia', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0005', 
      descricao: 'Rede Celpa', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0006', 
      descricao: 'Cosanpa', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0007', 
      descricao: 'Serviços Telefônicos Móveis', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0008', 
      descricao: 'Serviços Telefônicos Fixo e Internet', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0009', 
      descricao: 'Mat e Acess p/ Maq e Aparelho Xerox', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0010', 
      descricao: 'Despesas Bancárias', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0011', 
      descricao: 'Ressarcimentos', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0012', 
      descricao: 'Impostos Taxas e Emol Divrs IPTU', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0013', 
      descricao: 'Custas Processuais', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0014', 
      descricao: 'Locação de Móveis', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0015', 
      descricao: 'Eventos', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0016', 
      descricao: 'Serviços Gráficos', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0017', 
      descricao: 'Publicação em Jornais', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0018', 
      descricao: 'Assinaturas Periódicas', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0019', 
      descricao: 'Pass, Cond, Taxi e Estacionamento', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0020', 
      descricao: 'Material Limpeza e Conservação', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0022', 
      descricao: 'Eventos - Concursados', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0023', 
      descricao: 'Seguros', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0024', 
      descricao: 'Confraternização Natalina', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0028', 
      descricao: 'Despesas com Cartão de Crédito', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0029', 
      descricao: 'Custas Judiciais', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0030', 
      descricao: 'Despesas Judiciais', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0031', 
      descricao: 'Manutenção de Sistemas - Banco de Dados', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0032', 
      descricao: 'Material e Serviços Informática', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0033', 
      descricao: 'Patrocínio', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0034', 
      descricao: 'Seguros Prédio', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0035', 
      descricao: 'Cursos e Treinamentos', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0036', 
      descricao: 'Vestuários e Uniformes', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0037', 
      descricao: 'Despesas com Veí­culos', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0038', 
      descricao: 'Bens de Pequeno Valor', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0039', 
      descricao: 'Despesas de Cartórios', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0040', 
      descricao: 'Depreciação', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0041', 
      descricao: 'Despesas Com Custeio', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0042', 
      descricao: 'Internet Dedicada', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.02', 
      codigo: '4.2.1.02.0043', 
      descricao: 'Despesa com Reuniões na Internet', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.03', 
      descricao: 'Serviços Prestados Pessoa Física', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.03', 
      codigo: '4.2.1.03.0001', 
      descricao: 'Assessoria de Imprensa', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.03', 
      codigo: '4.2.1.03.0002', 
      descricao: 'Assessoria de Informática', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.03', 
      codigo: '4.2.1.03.0003', 
      descricao: 'Assessoria Jurídica', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.03', 
      codigo: '4.2.1.03.0004', 
      descricao: 'Assessoria de Comunicação', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.03', 
      codigo: '4.2.1.03.0005', 
      descricao: 'Serviços de Terceiros - PF', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.03', 
      codigo: '4.2.1.03.0006', 
      descricao: 'Nutricionista', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.04', 
      descricao: 'Serviços Prestados Pessoas Jurídicas', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.04', 
      codigo: '4.2.1.04.0001', 
      descricao: 'Honorários Advocatícios', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.04', 
      codigo: '4.2.1.04.0002', 
      descricao: 'Serviços de Segurança', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.04', 
      codigo: '4.2.1.04.0003', 
      descricao: 'Honorários Contábeis', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.04', 
      codigo: '4.2.1.04.0004', 
      descricao: 'Serviços Terceiros - PJ', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.04', 
      codigo: '4.2.1.04.0005', 
      descricao: 'Marketing Digital - PJ', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.04', 
      codigo: '4.2.1.04.0006', 
      descricao: 'Consultoria Especializada', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.05', 
      descricao: 'Despesas c Comunicação e Publicidade', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.05', 
      codigo: '4.2.1.05.0001', 
      descricao: 'Entrega Express Postag (Correios)', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.05', 
      codigo: '4.2.1.05.0002', 
      descricao: 'Home Page, Prov/Manut Portal', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.05', 
      codigo: '4.2.1.05.0003', 
      descricao: 'Jornal, Rádio e TV', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.05', 
      codigo: '4.2.1.05.0004', 
      descricao: 'Serv Fotog, Cartaz, Faixa, Ban/Video', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.05', 
      codigo: '4.2.1.05.0005', 
      descricao: 'Divulgação Diversas (BLOG)', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.05', 
      codigo: '4.2.1.05.0006', 
      descricao: 'Produção de Vídeos', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.05', 
      codigo: '4.2.1.05.0007', 
      descricao: 'Campanha Publicitária', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.05', 
      codigo: '4.2.1.05.0008', 
      descricao: 'Aplicativo Site', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.05', 
      codigo: '4.2.1.05.0010', 
      descricao: 'Publicação de Edital', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.06', 
      descricao: 'Despesas c/ Viagens e Diárias', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.06', 
      codigo: '4.2.1.06.0001', 
      descricao: 'Diárias Diretores', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.06', 
      codigo: '4.2.1.06.0002', 
      descricao: 'Passagens e Taxas', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.06', 
      codigo: '4.2.1.06.0003', 
      descricao: 'Passagens e Hospedagens', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.06', 
      codigo: '4.2.1.06.0004', 
      descricao: 'Diárias c/ Funcionários Outros', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.07', 
      descricao: 'Despesas c/ Contra A Entidades', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.07', 
      codigo: '4.2.1.07.0001', 
      descricao: 'Contribuições da FENAFISCO', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.07', 
      codigo: '4.2.1.07.0002', 
      descricao: 'Contribuições ao DIEESE', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.07', 
      codigo: '4.2.1.07.0003', 
      descricao: 'Pecúlio Pós Morte', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.07', 
      codigo: '4.2.1.07.0005', 
      descricao: 'SINDITAF', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.08', 
      descricao: 'Desp c/ Formac Sindical Cursos e Treinam', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.08', 
      codigo: '4.2.1.08.0001', 
      descricao: 'Programa de Form Sindical  / CD FENAFISCO', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.08', 
      codigo: '4.2.1.08.0002', 
      descricao: 'Encontro de Aposentados', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.08', 
      codigo: '4.2.1.08.0003', 
      descricao: 'Eleições Sindifisco', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.09', 
      descricao: 'Despesas com Fundos Especí­ficos', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.09', 
      codigo: '4.2.1.09.0001', 
      descricao: 'Campanha Institucional', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.09', 
      codigo: '4.2.1.09.0002', 
      descricao: 'Fundo de Reserva', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.09', 
      codigo: '4.2.1.09.0003', 
      descricao: 'Campanha Salarial', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.09', 
      codigo: '4.2.1.09.0004', 
      descricao: 'Mobilização / Congresso Estadual', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.09', 
      codigo: '4.2.1.09.0005', 
      descricao: 'Superávit Exercí­cio Anterior', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.09', 
      codigo: '4.2.1.09.0006', 
      descricao: 'Evento - Atividade de Integração', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.09', 
      codigo: '4.2.1.09.0007', 
      descricao: 'Caravana', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.09', 
      codigo: '4.2.1.09.0008', 
      descricao: 'Curso de Formação de Liderança', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.09', 
      codigo: '4.2.1.09.0009', 
      descricao: 'Ajuda de Custo Interior', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.10', 
      descricao: 'Despesas c/ Doações', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.10', 
      codigo: '4.2.1.10.0001', 
      descricao: 'Assistência a Entidades e Pessoas (Filant.)', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1', 
      codigo: '4.2.1.11', 
      descricao: 'Investimentos', 
      profundidade:'Sintética', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.11', 
      codigo: '4.2.1.11.0001', 
      descricao: 'Sede Própria', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.11', 
      codigo: '4.2.1.11.0002', 
      descricao: 'Obras Instalações e Reformas', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.11', 
      codigo: '4.2.1.11.0003', 
      descricao: 'Máquinas e Equipamentos', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.11', 
      codigo: '4.2.1.11.0004', 
      descricao: 'Móveis e Utensí­lios', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.11', 
      codigo: '4.2.1.11.0005', 
      descricao: 'Computadores e Periféricos', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.11', 
      codigo: '4.2.1.11.0006', 
      descricao: 'Software de Máquinas e Equipamentos', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  },
  {
      contaPai: '4.2.1.11', 
      codigo: '4.2.11.0007', 
      descricao: 'Equipamento de Processamento de Dados', 
      profundidade: 'Analítica', 
      tipoLancamento: 'Despesa'
  }
  ];

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

  profundidade: IProfundidade[] = [
    { nome: 'Analítica'}, 
    { nome: 'Sintética'}
  ];


  supCaixa: string[] = ['Sim', 'Não'];
  tipoLancamento: string[] = ['Receita', 'Despesa'];
  tipoLancamentoPlano!: string;
  tipoLancamentoPage!: string;
  currentPath!: string;
  perfil!: string;
  inicialFileName!: string;
  showFile!: string;
  mgsImage!: string;
  lastItemId!: number;
  lancamentosList: any;
  lastItemIdx: any;
  isURLValid!: any;


  constructor(
    private formBuilder: FormBuilder,
    private lancamentosService: LancamentosService,
    private planoContaService: PlanoContasService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private auth: AuthService
    ) {
      this.findLastItemId()
      this.planoContasList();
      this.tipoLancamentoPage = this.router.url.substring(13,21);
      
      this.form =  this.formBuilder.group({
        tipoLancamento: ['', [Validators.required]],
        dataLancamento: ['', [Validators.required]],
        planoConta: ['', [Validators.required]],
        modoPagamento: ['', [Validators.required]],
        tipoComprovante: ['', [Validators.required]],
        supCaixa: ['', [Validators.required]],
        valor: ['', [Validators.required]],
        obs: [''],
        fileUrl: ['']
      })

      if(
        this.router.url.includes(`/lancamentos/receitas/editar/`) ||
        this.router.url.includes(`/lancamentos/despesas/editar/`) 
        ){
        this.isEditLancamento = true
        this.currentId =  parseInt(this.router.url.substring(29))
        this.lancamentoFileName = `${this.inicialFileName}${this.currentId}.jpg`
      } else if(
        this.router.url.includes('/lancamentos/novo')
        ) {
        this.isEditLancamento = false
        
      }
      
    }


  ngOnInit(): void {
    this.findLastItemId();

    this.lancamentoFileName = `${this.inicialFileName}${this.lastItemId}.jpg`
    
    this.route.params.subscribe(
      (params: any) => {
        const id = params.id
        const lancamento$ = this.lancamentosService.loadById(id);
        lancamento$.subscribe(lancamento => {
          this.updateForm(lancamento)
        })
      }

    )

    if(this.router.url.substring(13,21) === 'novo'){
      this.currentMiddleUrl = (`/lancamentos/${this.currentPath}`).toLowerCase();
    }
    
    if( this.router.url.substring(13,21) === 'receitas') {
      this.currentMiddleUrl = '/lancamentos/receitas'
      this.tipoLancamentoPlano = 'Receita'
    } else {
      this.currentMiddleUrl = '/lancamentos/despesas'
      this.tipoLancamentoPlano = 'Despesa'
    }

    
  }



  updateForm(lancamento: ILancamentos){

    this.showFile = `${this.baseUpload}${this.middleFileUrl}${this.inicialFileName}${this.currentId}.jpg`
    // let idAtualizando = {id: lancamento.planoConta.id}
    
    this.form.patchValue({
      id: this.currentId,
      tipoLancamento: lancamento.tipoLancamento,
      dataLancamento: lancamento.dataLancamento,
      planoConta: lancamento.planoConta,
      modoPagamento: lancamento.modoPagamento,
      tipoComprovante: lancamento.tipoComprovante,
      supCaixa: lancamento.supCaixa,
      valor: lancamento.valor,
      obs: lancamento.obs,
      fileUrl: `${this.baseUpload}${this.middleFileUrl}${this.inicialFileName}${this.currentId}.jpg`
    })
    

  }

  onSubmit(){

    this.submitted = true;
    

    this.form.get('fileUrl')?.setValue(`${this.baseUpload}${this.middleFileUrl}${this.lancamentoFileName}`);

        
    this.lancamentosService.create(this.form.value)
    .subscribe( 
      res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Lancamento adicionado com sucesso!',
          showConfirmButton: false,
          timer: 2000
        }) 
        console.log("path atual", this.currentMiddleUrl);
        
        this.router.navigate([this.currentMiddleUrl])

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
    
    this.lancamentosService.updateLancamento(this.currentId, this.form.value)
      .subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Lançamento atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2000
          }) 
          this.router.navigate([this.currentMiddleUrl])
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

  planoContasList(){

    this.planoContas
      .filter((c: IContas) => c.tipoLancamento === this.tipoLancamentoPlano)
      .filter((c:IContas) => c.profundidade === 'Analítica');
    
      console.log("planoContasList: ", this.planoContas);

    // this.planoContaService.listAll(1).subscribe( (contas) => {
    //   console.log("Cotas no lancamento form:", contas);
      
    //   this.planoContas = contas.content.filter(
    //     (p: IContas) => p.profundidade === 'Analítica'
    //     ).filter((p: IContas) => p.tipoLancamento === this.tipoLancamentoPlano);
    // })
  }

  onSelectChange(event:any): void {
    this.currentPath = event.value
    console.log("this.currentPath: ", this.currentPath);
    this.currentMiddleUrl = this.currentMiddleUrl = (`/lancamentos/${this.currentPath}s`).toLowerCase();

    console.log(this.currentPath);
        console.log(this.lastItemId);
        
      this.lancamentoFileName = (`${this.currentPath}_${this.lastItemId}.jpg`).toLocaleLowerCase()
      console.log(this.lancamentoFileName );

      this.inicialFileName
        
  }

  findRoles(){
    if(this.auth.temPermissao('ROLE_READ')){
      this.perfil = 'SINDICALIZADO'
    }
  }

  
  findLastItemId(): void {
    this.lancamentosService.getAll()
      .subscribe({
        next: (data) => {
          this.lancamentosList = data.content ;
          this.lastItemId = data.content[0].id + 1;

          this.tipoLancamentoPage === 'despesas' ? this.inicialFileName = 'despesa_' : this.inicialFileName = 'receita_'
        },
        error: (e) => console.error(e)
      });
  }


}
