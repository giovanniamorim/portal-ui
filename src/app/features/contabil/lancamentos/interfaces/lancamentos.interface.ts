import { IModoPagamento } from '../../plano-contas/interfaces/modo-pagamento.interface'
import { IContas, IPlanoContas } from '../../plano-contas/interfaces/plano-contas.interface'
import { ITipoComprovante } from '../../plano-contas/interfaces/tipo-comprovante.interface'

export interface ILancamentos {
  id: number
  tipoLancamento: string
  dataLancamento: Date
  planoConta: IConta
  valor: number
  modoPagamento: IModoPagamento
  tipoComprovante: ITipoComprovante
  obs: string
  numDoc: string,
  numCheque: string,
  anoExercicio: string,
  supCaixa: string,
  fileUrl: string
}

export interface IConta {
    codigo: string
    descricao: string
    profundidade: string
    tipoLancamento: string
    contaFilha?: IConta[]
}



