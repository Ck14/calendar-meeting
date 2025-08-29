import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ComunidadLinguistica, Discapacidad, Pueblo, RangoEdad } from 'src/app/interfaces/meetings/catalogoModelo';

// Interfaz para la respuesta de validación del token
export interface TokenValidationResponse {
  isValid: boolean;
  validationCode: number;  // Nuevo campo
  meeting?: {
    idMeet: number;
    titulo: string;
    horaInicio: Date;
    horaFin: Date;
  };
  message?: string;
}

// Interfaz para el formulario de participante
export interface FormularioParticipanteData {
  token: string;
  dpi: string;
  nombreCompleto: string;
  puesto: string;
  institucion: string;
  telefonoExtension: string;
  correo: string;
  sexo: string;
  rangoEdad: number;
  discapacidad: number;
  pueblo: number;
  comunidadLinguistica: number;
}

@Injectable({
  providedIn: 'root'
})
export class FormularioParticipanteService {

  constructor(private http: HttpClient) { }

  obtenerRangosEdad(): Observable<RangoEdad[]> {
    let url = `api/CatalogosMeet/rangosEdad`;
    return this.http.get<RangoEdad[]>(url);
  }

  obtenerComunidadLinguistica(): Observable<ComunidadLinguistica[]> {
    let url = `api/CatalogosMeet/lenguajes`;
    return this.http.get<ComunidadLinguistica[]>(url);
  }

  obtenerDiscapacidad(): Observable<Discapacidad[]> {
    let url = `api/CatalogosMeet/discapacidades`;
    return this.http.get<Discapacidad[]>(url);
  }

  obtenerPueblo(): Observable<Pueblo[]> {
    let url = `api/CatalogosMeet/pueblos`;
    return this.http.get<Pueblo[]>(url);
  }

  /**
   * Valida el token y obtiene información de la reunión
   * Simula una llamada al backend
   */
  validarToken(token: string): Observable<TokenValidationResponse> {

    let url = `/api/CatalogosMeet/validateToken?token=${token}`;
    return this.http.get<TokenValidationResponse>(url);
  }

  /**
   * Guarda los datos del formulario de participante
   * Simula una llamada al backend
   */
  guardarFormularioParticipante(datos: FormularioParticipanteData): Observable<any> {
    // Simulación de guardado
    return of({ success: true, message: 'Formulario guardado exitosamente' }).pipe(delay(1000));
  }


}
