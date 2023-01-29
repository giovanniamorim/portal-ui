export interface IUser {

    codigo: number,
    nome: string,
    email: string,
    senha: string
    permissoes: IPermissoes[]

}

export interface IPermissoes {
    id: number,
    nome: string
}
