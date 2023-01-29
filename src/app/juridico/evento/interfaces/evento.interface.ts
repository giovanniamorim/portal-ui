import { IProcesso } from "../../processo/interfaces/processo.interface"

export interface IEvento {

    id: number,
    data: Date,
    nome: string,
    descricao: string,
    processo: IProcesso,
    fileUrl: string
}
