export interface MeetCrearModelo {
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

// Validation decorators for Angular reactive forms
export const MeetCrearModeloValidators = {
    titulo: {
        required: { value: true, message: 'El título es requerido' },
        maxLength: { value: 500, message: 'El título no puede exceder 500 caracteres' }
    },
    descripcion: {
        maxLength: { value: 1000, message: 'La descripción no puede exceder 1000 caracteres' }
    },
    fechaInicio: {
        required: { value: true, message: 'La fecha de inicio es requerida' }
    },
    idSala: {
        required: { value: true, message: 'La sala es requerida' }
    },
    idPrioridad: {
        required: { value: true, message: 'La prioridad es requerida' }
    },
    idEstado: {
        required: { value: true, message: 'El estado es requerido' }
    },
    idTipoMeet: {
        required: { value: true, message: 'El tipo de reunión es requerido' }
    }
};