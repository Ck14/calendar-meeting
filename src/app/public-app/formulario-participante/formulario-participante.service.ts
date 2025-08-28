import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComunidadLinguistica, Discapacidad, Pueblo, RangoEdad } from 'src/app/interfaces/meetings/catalogoModelo';

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
}
