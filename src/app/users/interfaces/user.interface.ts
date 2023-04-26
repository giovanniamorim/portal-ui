export interface IUser {

    codigo: number,
    nome: string,
    email: string,
    celular: string,
    cpf: string,
    rg: string,
    rgOrgaoExp: string,
    matricula: string,
    situacao: ISituacao[]
    senha: string
    permissoes: IPermissoes[]

}

export interface IPermissoes {
    codigo: number,
    descricao: string
}

export interface ISituacao {
    id: number,
    nome: string
}

export interface IChangePassword {
    oldPassword: string
    newPassword: string,
    confirmPassword: string
}