export interface IMeetModelo {
    titulo: string;
    descripcion?: string;
    fechaInicio: Date;
    horaInicio?: Date;
    fechaFin?: Date;
    horaFin?: Date;
    idSala: number;
    idPrioridad: number;
    idEstado: number;
    idTipoMeet: number;
}

