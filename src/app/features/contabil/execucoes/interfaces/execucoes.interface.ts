import { IMeses } from "../../balancetes/balancete.interface";

export interface IExecucao {

    id: number,
    ano: number,
    mes: IMeses;
    descricao: String,
    fileUrl: string

}
