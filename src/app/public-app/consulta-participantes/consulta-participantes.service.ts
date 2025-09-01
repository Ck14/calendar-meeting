import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormularioParticipanteData } from '../formulario-participante/formulario-participante.service';


export interface MeetingInfo {
    id: number;
    titulo: string;
    descripcion: string;
    horaInicio: string;
    horaFin: string;
    estado: string;
}



@Injectable({
    providedIn: 'root'
})
export class ConsultaParticipantesService {

    constructor(private http: HttpClient) { }

    /**
     * Consulta participantes por token de reunión
     */
    consultarParticipantes(token: string): Observable<FormularioParticipanteData[]> {
        const url = `api/meet/participantes/consulta?token=${token}`;
        return this.http.get<FormularioParticipanteData[]>(url);
    }
}
