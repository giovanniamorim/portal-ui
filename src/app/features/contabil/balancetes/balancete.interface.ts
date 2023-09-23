export interface IBalancete {

    id: number,
    ano: number,
    mes: IMeses,
    descricao: string,
    fileUrl: string

}

export interface IMeses {
    id: number,
    nome: string
}
