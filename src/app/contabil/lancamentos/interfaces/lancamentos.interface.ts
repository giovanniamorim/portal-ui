import { IModoPagamento } from '../../plano-contas/interfaces/modo-pagamento.interface';
import { IPlanoContas } from '../../plano-contas/interfaces/plano-contas.interface';
import { ITipoComprovante } from '../../plano-contas/interfaces/tipo-comprovante.interface';

export interface ILancamentos {

    id: number,
    tipoLancamento: string,
    dataLancamento: Date,
    planoConta: IPlanoContas,
    valor: string,
    modoPagamento: IModoPagamento,
    tipoComprovante: ITipoComprovante,
    obs: string,
    supCaixa: string,
    fileUrl: string

}
