import { MatTableDataSource } from "@angular/material/table"
import { IEvento } from "../../evento/interfaces/evento.interface"

export interface IProcesso {
    id: number,
    numero: string,
    exequente: string,
    executado: string,
    juizo: string,
    juiz: string,
    assunto: string,
    valor: number
    eventos?: IEvento[] | MatTableDataSource<IEvento>
}