import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IParticipanteModel } from 'src/app/interfaces/meetings/participanteModelo';
import { IPrioridadModel } from 'src/app/interfaces/meetings/prioridadModelo';
import { ISalaModel } from 'src/app/interfaces/meetings/salaModelo';
import { CacheService } from '../../services/cache.service';
import { IMeetModelo, IValidarSalaModel } from 'src/app/interfaces/meetings/meetModel';

@Injectable({
  providedIn: 'root'
})
export class ModalCrearMeetService {

  // Claves para el caché
  private readonly SALAS_CACHE_KEY = 'meetings_salas';
  private readonly PRIORIDADES_CACHE_KEY = 'meetings_prioridades';
  private readonly PARTICIPANTES_CACHE_KEY = 'meetings_participantes';

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  /**
   * Obtiene las salas con caché
   */
  obtenerCategorias(): Observable<ISalaModel[]> {
    const url = `api/CatalogosMeet/salas`;
    return this.cacheService.cacheObservable(
      this.SALAS_CACHE_KEY,
      this.http.get<ISalaModel[]>(url),
      10 * 60 * 1000 // 10 minutos
    );
  }

  /**
   * Obtiene las prioridades con caché
   */
  obtenerPrioridades(): Observable<IPrioridadModel[]> {
    const url = `api/CatalogosMeet/prioridades`;
    return this.cacheService.cacheObservable(
      this.PRIORIDADES_CACHE_KEY,
      this.http.get<IPrioridadModel[]>(url),
      10 * 60 * 1000 // 10 minutos
    );
  }

  /**
   * Obtiene los participantes con caché
   */
  obtenerParticipantes(): Observable<IParticipanteModel[]> {
    const url = `api/Meet/participantes`;
    return this.cacheService.cacheObservable(
      this.PARTICIPANTES_CACHE_KEY,
      this.http.get<IParticipanteModel[]>(url),
      5 * 60 * 1000 // 5 minutos
    );
  }

  /**
   * Limpia el caché de todos los datos
   */
  limpiarCache(): void {
    this.cacheService.delete(this.SALAS_CACHE_KEY);
    this.cacheService.delete(this.PRIORIDADES_CACHE_KEY);
    this.cacheService.delete(this.PARTICIPANTES_CACHE_KEY);
  }

  /**
   * Limpia solo el caché de participantes
   */
  limpiarCacheParticipantes(): void {
    this.cacheService.delete(this.PARTICIPANTES_CACHE_KEY);
  }

  /**
   * Obtiene los datos del caché sin hacer llamada a la API
   */
  obtenerSalasCache(): ISalaModel[] | null {
    return this.cacheService.get<ISalaModel[]>(this.SALAS_CACHE_KEY);
  }

  obtenerPrioridadesCache(): IPrioridadModel[] | null {
    return this.cacheService.get<IPrioridadModel[]>(this.PRIORIDADES_CACHE_KEY);
  }

  obtenerParticipantesCache(): IParticipanteModel[] | null {
    return this.cacheService.get<IParticipanteModel[]>(this.PARTICIPANTES_CACHE_KEY);
  }

  /**
   * Verifica si los datos están cargados
   */
  estanCargadosSalas(): boolean {
    return this.cacheService.has(this.SALAS_CACHE_KEY);
  }

  estanCargadosPrioridades(): boolean {
    return this.cacheService.has(this.PRIORIDADES_CACHE_KEY);
  }

  estanCargadosParticipantes(): boolean {
    return this.cacheService.has(this.PARTICIPANTES_CACHE_KEY);
  }

  insertarMeet(meet: IMeetModelo): Observable<number> {
    console.log(meet);
    const url = `api/meet`;
    return this.http.post<number>(url, meet);
  } // end


  actualizarMeet(meet: IMeetModelo): Observable<boolean> {
    console.log(meet);
    const url = `api/meet`;
    return this.http.put<boolean>(url, meet);
  }


  actualizarHorariosMeet(meet: IMeetModelo): Observable<boolean> {
    console.log(meet);
    const url = `api/meet/actualizarHorarios`;
    return this.http.put<boolean>(url, meet);
  }

  /**
   * Valida si una sala está disponible en el horario especificado
   * @param meet - Modelo con idSala, fechaInicio y fechaFin
   * @returns Observable<IMeetModelo[]> - Array de meets que están ocupando la sala en ese horario
   */
  validarSalaDisponible(meet: IValidarSalaModel): Observable<IMeetModelo[]> {
    const url = `api/meet/salasOcupadas`;
    return this.http.post<IMeetModelo[]>(url, meet);
  }

}
