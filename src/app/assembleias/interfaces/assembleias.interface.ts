export interface IAssembleias {

    id: number,
    data: Date,
    tipo: string,
    assunto: string,
    comentario: string,
    fileUrl: string

}

export interface ITipoAssembleia {
    id: number,
    nome: string
}