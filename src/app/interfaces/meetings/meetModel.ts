export interface IMeetModelo {
    idMeet?: number;
    titulo?: string;
    descripcion?: string;
    fechaInicio: Date;
    horaInicio?: Date;
    fechaFin?: Date;
    horaFin?: Date;
    idSala?: number;
    sala?: string;
    idPrioridad?: number;
    idEstado?: number;
    idTipoMeet?: number;
    invitados?: string[];
    organizadores?: string[];
}

export interface IValidarSalaModel {
    idSala: number;
    fechaInicio: Date;
    fechaFin: Date;
}

