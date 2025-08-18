import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPrioridadModel } from 'src/app/interfaces/meetings/prioridadModelo';
import { ISalaModel } from 'src/app/interfaces/meetings/salaModelo';

@Injectable({
  providedIn: 'root'
})
export class ModalCrearMeetService {

  constructor(private http: HttpClient) { }

  obtenerCategorias(): Observable<ISalaModel[]> {
    let url = `api/CatalogosMeet/salas`;
    return this.http.get<ISalaModel[]>(url);
  } // end

  obtenerPrioridades(): Observable<IPrioridadModel[]> {
    let url = `api/CatalogosMeet/prioridades`;
    return this.http.get<IPrioridadModel[]>(url);
  } // end
}
