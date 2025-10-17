import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { IMeetModelo } from 'src/app/interfaces/meetings/meetModel';

export interface ICalendarMeeting extends IMeetModelo {
    nombreSala?: string;
    nombrePrioridad?: string;
    nombreEstado?: string;
    nombreTipoMeet?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CalendarMeetingsService {

    constructor(private http: HttpClient) { }

    /**
     * Obtiene las reuniones según el rango de fechas y vista seleccionada
     * @param startDate - Fecha de inicio del rango
     * @param endDate - Fecha de fin del rango
     * @param viewType - Tipo de vista: 'day', 'week', 'month'
     * @returns Observable<ICalendarMeeting[]> - Array de reuniones
     */
    obtenerReunionesPorRango(startDate: Date, endDate: Date, viewType: string): Observable<ICalendarMeeting[]> {
        // Simular llamada a API con delay
        // return of(this.generarReunionesSimuladas(startDate, endDate, viewType)).pipe(delay(500));

        let url = `api/meet/reunionesPorRango`;

        const params = new HttpParams()
            .set('startDate', startDate.toDateString())
            .set('endDate', endDate.toDateString());


        return this.http.get<ICalendarMeeting[]>(url, { params });
    }






    /**
     * Obtiene el color de prioridad - Esquema Azul/Morado
     */
    obtenerColorPorPrioridad(idPrioridad: number): string {
        const colores = {
            1: '#2196F3', // Baja - Azul Material
            2: '#9C27B0', // Media - Púrpura Material
            3: '#3F51B5'  // Alta - Índigo Material
        };
        return colores[idPrioridad as keyof typeof colores] || '#6c757d';
    }

    /**
     * Obtiene el color del borde por prioridad - Esquema Azul/Morado
     */
    obtenerColorBordePorPrioridad(idPrioridad: number): string {
        const colores = {
            1: '#1565C0', // Baja - Azul Material oscuro
            2: '#6A1B9A', // Media - Púrpura Material oscuro  
            3: '#283593'  // Alta - Índigo Material oscuro
        };
        return colores[idPrioridad as keyof typeof colores] || '#495057';
    }

    /**
     * Obtiene la clase CSS por prioridad
     */
    obtenerClasePrioridad(idPrioridad: number): string {
        const clases = {
            1: 'success',
            2: 'warning',
            3: 'danger'
        };
        return clases[idPrioridad as keyof typeof clases] || 'info';
    }
}
