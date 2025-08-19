import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidacionesService {

    constructor() { }

    /**
     * Validador para verificar que la fecha final sea mayor a la fecha inicial
     * @param fechaInicioControl - Nombre del control de fecha de inicio
     * @param fechaFinControl - Nombre del control de fecha de fin
     * @returns ValidatorFn que retorna error si la fecha final es menor o igual a la inicial
     */
    rangoFechasValidator(fechaInicioControl: string, fechaFinControl: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const fechaInicio = formGroup.get(fechaInicioControl);
            const fechaFin = formGroup.get(fechaFinControl);

            if (!fechaInicio || !fechaFin) {
                return null;
            }

            const fechaInicioValue = fechaInicio.value;
            const fechaFinValue = fechaFin.value;

            // Si alguno de los campos está vacío, no validar
            if (!fechaInicioValue || !fechaFinValue) {
                return null;
            }

            // Convertir a objetos Date para comparación
            const fechaInicioDate = new Date(fechaInicioValue);
            const fechaFinDate = new Date(fechaFinValue);

            // Verificar que las fechas sean válidas
            if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
                return null;
            }

            // Comparar las fechas
            if (fechaFinDate <= fechaInicioDate) {
                return {
                    rangoFechasInvalido: {
                        message: 'La fecha de finalización debe ser posterior a la fecha de inicio'
                    }
                };
            }

            return null;
        };
    }

    /**
     * Validador para verificar que la hora final sea mayor a la hora inicial (mismo día)
     * @param horaInicioControl - Nombre del control de hora de inicio
     * @param horaFinControl - Nombre del control de hora de fin
     * @returns ValidatorFn que retorna error si la hora final es menor o igual a la inicial
     */
    rangoHorasValidator(horaInicioControl: string, horaFinControl: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const horaInicio = formGroup.get(horaInicioControl);
            const horaFin = formGroup.get(horaFinControl);

            if (!horaInicio || !horaFin) {
                return null;
            }

            const horaInicioValue = horaInicio.value;
            const horaFinValue = horaFin.value;

            // Si alguno de los campos está vacío, no validar
            if (!horaInicioValue || !horaFinValue) {
                return null;
            }

            // Convertir a objetos Date para comparación
            const horaInicioDate = new Date(horaInicioValue);
            const horaFinDate = new Date(horaFinValue);

            // Verificar que las fechas sean válidas
            if (isNaN(horaInicioDate.getTime()) || isNaN(horaFinDate.getTime())) {
                return null;
            }

            // Comparar las horas (asumiendo que son del mismo día)
            if (horaFinDate <= horaInicioDate) {
                return {
                    rangoHorasInvalido: {
                        message: 'La hora de finalización debe ser posterior a la hora de inicio'
                    }
                };
            }

            return null;
        };
    }

    /**
     * Validador para verificar que la fecha y hora final sea mayor a la fecha y hora inicial
     * @param fechaHoraInicioControl - Nombre del control de fecha y hora de inicio
     * @param fechaHoraFinControl - Nombre del control de fecha y hora de fin
     * @returns ValidatorFn que retorna error si la fecha y hora final es menor o igual a la inicial
     */
    rangoFechaHoraValidator(fechaHoraInicioControl: string, fechaHoraFinControl: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const fechaHoraInicio = formGroup.get(fechaHoraInicioControl);
            const fechaHoraFin = formGroup.get(fechaHoraFinControl);

            if (!fechaHoraInicio || !fechaHoraFin) {
                return null;
            }

            const fechaHoraInicioValue = fechaHoraInicio.value;
            const fechaHoraFinValue = fechaHoraFin.value;

            // Si alguno de los campos está vacío, no validar
            if (!fechaHoraInicioValue || !fechaHoraFinValue) {
                return null;
            }

            // Convertir a objetos Date para comparación
            const fechaHoraInicioDate = new Date(fechaHoraInicioValue);
            const fechaHoraFinDate = new Date(fechaHoraFinValue);

            // Verificar que las fechas sean válidas
            if (isNaN(fechaHoraInicioDate.getTime()) || isNaN(fechaHoraFinDate.getTime())) {
                return null;
            }

            // Comparar las fechas y horas completas
            if (fechaHoraFinDate <= fechaHoraInicioDate) {
                return {
                    rangoFechaHoraInvalido: {
                        message: 'La fecha y hora de finalización debe ser posterior a la fecha y hora de inicio'
                    }
                };
            }

            return null;
        };
    }
}
