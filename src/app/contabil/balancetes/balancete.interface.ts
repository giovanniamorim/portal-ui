export interface IBalancete {

    id: number,
    ano: number,
    mes: IMeses,
    fileUrl: string

}

export interface IMeses {
    id: number,
    nome: string
}
