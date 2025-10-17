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


    public obtenerReporteAsistentes(qr?: string) {
        const url =
            environment.servidorReportes +
            `/asistencia.pdf?net.sf.jasperreports.json.source=` +
            environment.urlSistema +
            `api/meet/participantes/consulta?token=${qr}`;

        //En el auht.interceptor.ts se maneja el authorization y ahí se envía la clave de jasper
        return this.http.get(url, {
            responseType: "blob",
            withCredentials: true,
        });
    } // end
}
