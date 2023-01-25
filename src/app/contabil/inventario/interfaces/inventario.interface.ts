export interface IInventario {

    id: number,
    dataAquisicao: Date,
    departamento: string,
    numero: string,
    quant: number,
    descricao: string,
    estadoConservacao: string,
    fileUrl: string
}

export interface IEstadoConservacao {
    id: number,
    nome: string
}

export interface IDepartamentos {
    id: number,
    nome: string
}



