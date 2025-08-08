import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { RolClimaModelo } from 'src/app/interfaces/administracion/rol-clima-model';

import { IUsuarioInterno } from 'src/app/interfaces/administracion/usuario-interno';
import { IRespuestaHttp } from 'src/app/interfaces/compartido/resultado-http';
import { IUsuarioClima, IUsuarioSAT, IUsuarioSSO } from 'src/app/interfaces/sso/usuarioModelo';



@Injectable({
  providedIn: 'root'
})
export class UsuariosInternosService {

  constructor(private http: HttpClient) { }

  obtenerUsuarioSSO(nitUsuario?: string): Observable<IUsuarioSSO> {
    let url = `api/sso/BuscarUsuarioNit?nit=${nitUsuario}`;
    return this.http.get<IUsuarioSSO>(url);
  }// end

  insertarUsuarioSSO(usuario: IUsuarioSSO): Observable<number> {
    const url = `api/sso/registrar`;
    return this.http.post<number>(url, usuario);
  }// end

  obtenerUsuarioSAT(nitUsuario?: string): Observable<IUsuarioSAT> {
    let url = `api/sat/consulta/${nitUsuario}`;
    return this.http.get<IUsuarioSAT>(url);
  }// end

  obtenerUsuarioClima(nitUsuario?: string): Observable<IUsuarioClima> {
    let url = `api/usuarioClima/consulta/${nitUsuario}`;
    return this.http.get<IUsuarioClima>(url);
  }// end

  obtenerUsuariosClima(): Observable<IUsuarioClima[]> {
    let url = `api/usuarioClima/consulta`;
    return this.http.get<IUsuarioClima[]>(url);
  }// end

  insertarUsuarioClima(usuario: IUsuarioInterno): Observable<number> {
    const url = `api/usuarioClima/registrar`;
    return this.http.post<number>(url, usuario);
  }// end

  obtenerRolesAsignados(nitUsuario: string): Observable<RolClimaModelo[]> {
    let url = `api/rol/porUsuario?nitUsuario=${nitUsuario}`;
    return this.http.get<RolClimaModelo[]>(url);
  }// end

  obtenerRolesSinAsignar(nitUsuario: string): Observable<RolClimaModelo[]> {
    let url = `api/rol/sinAsignar?nitUsuario=${nitUsuario}`;
    return this.http.get<RolClimaModelo[]>(url);
  }// end

  asignar(nitUsuario: string, idRol: number): Observable<boolean> {
    let url = `api/usuarioClima/asignarRol?nitUsuario=${nitUsuario}&idRol=${idRol}`;
    return this.http.put<boolean>(url, null);
  }

  desasignar(nitUsuario: string, idRol: number): Observable<boolean> {
    let url = `api/usuarioClima/desasignarRol?nitUsuario=${nitUsuario}&idRol=${idRol}`;
    return this.http.delete<boolean>(url);
  }


  activar(nitUsuario: string, activar: boolean): Observable<boolean> {
    let url = `api/usuarioClima/activar?nitUsuario=${nitUsuario}&activar=${activar}`;
    return this.http.put<boolean>(url, null);
  }


  updateCorreoInstitucional(nitUsuario: string, correoInstitucional: string): Observable<boolean> {
    let url = `api/usuarioClima/actualizarCorreoInstitucional?nitUsuario=${nitUsuario}&correoInstitucional=${correoInstitucional}`;
    return this.http.put<boolean>(url, null);
  }

  updateCorreoPersonal(nitUsuario: string, correoPersonal: string): Observable<boolean> {
    let url = `api/usuarioClima/actualizarCorreoPersonal?nitUsuario=${nitUsuario}&correoPersonal=${correoPersonal}`;
    return this.http.put<boolean>(url, null);
  }





  otorgarAcceso(usuario: IUsuarioSSO): Observable<number> {
    const url = `api/sso/otorgar`;
    return this.http.post<number>(url, usuario);
  }












  modificarUsuario(usuario: IUsuarioInterno) {
    const url = `${URL}/Usuarios`;
    return this.http.put<IRespuestaHttp>(url, usuario)
      .pipe(
        catchError(this.handleError)
      );
  }


  eliminarUsuario(usuario: IUsuarioInterno) {
    const url = `${URL}/Usuarios`;
    const options = { body: usuario }
    return this.http.delete<IRespuestaHttp>(url, options)
      .pipe(
        catchError(this.handleError)
      );
  }




  private handleError(error: HttpErrorResponse) {
    let mensajeError: string = '';
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else if (error.status === 400) {
      mensajeError = error.error.mensaje;
    } else if (error.status === 401) {
      mensajeError = error.error.mensaje;
    } else if (error.status === 404) {
      mensajeError = 'Lo sentimos, no hemos podido encontrar el recurso al que intentas acceder.'
    } else if (error.status === 405) {
      mensajeError = 'Lo sentimos, no hemos podido reconocer el metodo del recurso al que intentas acceder.'
    } else if (error.status === 504) {
      mensajeError = 'Se ha agotado el tiempo de espera, no se ha podido establecer comunicacion el servidor.'
    } else {
      // El backend devolvió un código de respuesta inútil.
      // El cuerpo de la respuesta puede contener pistas sobre lo que salió mal.
      mensajeError = `Backend returned code ${error.status}, body was: `, error.error;
    }
    return throwError(() => new Error(mensajeError));
  }


}
