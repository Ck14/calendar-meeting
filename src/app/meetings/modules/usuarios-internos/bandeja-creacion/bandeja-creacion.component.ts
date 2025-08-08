import { Component, OnDestroy, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Confirm, Loading, Notify } from "notiflix";
import {
  Observable,
  Subscription,
  catchError,
  delay,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";

import { IPermisosUsuario } from "src/app/interfaces/usuario";
import { AuthService } from "src/app/utils/auth.service";
import { ResizeService } from "src/app/utils/resize.service";
import { SCREEN_SIZE } from "src/app/utils/screen-size.enum";

import { UsuariosInternosService } from "../usuarios-internos.service";
import { ModalUsuarioInternoComponent } from "../components/modal-usuario-interno/modal-usuario-interno.component";

import { ModalRolesUsuarioComponent } from "../components/modal-roles-usuario/modal-roles-usuario.component";
import { ModalActualizarCorreoComponent } from "../components/modal-actualizar-correo/modal-actualizar-correo.component";
import { IUsuarioClima } from "src/app/interfaces/sso/usuarioModelo";

declare var bootstrap: any;
@Component({
  selector: "app-bandeja-creacion",
  templateUrl: "./bandeja-creacion.component.html",
  styleUrls: ["./bandeja-creacion.component.css"],
})
export class BandejaCreacionComponent implements OnInit, OnDestroy {
  private servicesPantalla$: Subscription = new Subscription();
  bsModalUsuario: BsModalRef | undefined;
  mq?: SCREEN_SIZE;
  public listaUsuarios: IUsuarioClima[] = [];
  public listaOriginal: IUsuarioClima[] = [];

  //paginate
  public maxSizeModel: number = 5;
  public page: number = 1;
  public itemsPage: number = 10;
  public currentPageModel: number = 1;
  public directionLinks: boolean = true;
  public previousLabelModel: string = "Anterior";
  public nextLabelModel: string = "Siguiente";
  public term = "";
  public textFiltro = "Todos";

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private resizeService: ResizeService,
    private usuariosInternosService: UsuariosInternosService
  ) { }
  ngOnDestroy(): void {
    this.servicesPantalla$.unsubscribe();
  }

  ngOnInit(): void {
    Notify.init({
      position: "right-top",
      timeout: 5000,
      clickToClose: true,
    });

    Loading.init({
      svgColor: "#405189",
    });

    Confirm.init({
      width: "35%",
      borderRadius: "5px",
      titleMaxLength: 200,
      titleColor: "#212529",
      messageColor: "#212529",
      plainText: false,
      messageMaxLength: 500,
      okButtonBackground: "#0ab39c",
      cancelButtonColor: "#f06548",
      cancelButtonBackground: "#fff",
    });

    this.resizeService.init();
    this.servicesPantalla$ = this.resizeService.observar().subscribe((x) => {
      this.mq = x;
    });
    this.obtenerUsuarios();
  }

  onSearchChange(newSearchValue: string) {
    // this.term = newSearchValue;
    this.currentPageModel = 1; // Reinicia a la primera página al buscar
  }

  obtenerUsuarios() {
    Loading.standard("Obteniendo usuarios...");
    return this.usuariosInternosService
      .obtenerUsuariosClima()
      .pipe(
        map((usuarios: IUsuarioClima[]) =>
          usuarios.map(({ ...resto }) => resto)
        )
      )
      .subscribe({
        next: (result) => {

          //@ts-ignore
          this.listaOriginal = result;
          //@ts-ignore
          this.listaUsuarios = result;


          this.filtrar(true);
          Loading.remove();
        },
        error: (error) => {
          Loading.remove();
          console.error("Error obteniendo usuarios:", error);
        },
        complete() { },
      });
  }

  abrirModalAgregarUsuario() {
    const initialState = {
      tituloModal: "Creación de usuario interno",
    };

    this.bsModalUsuario = this.modalService.show(ModalUsuarioInternoComponent, {
      initialState,
      class: "modal-md modal-dialog-centered",
      keyboard: true,
      backdrop: "static",
    });
    this.bsModalUsuario.content.eventoGuardarUsuario.subscribe({
      next: (result: any) => {
        Loading.standard("Obteniendo usuarios...");

        this.obtenerUsuarios();
      },
      error: (error: any) => { },
      complete() {
        Loading.remove();
      },
    });
  }

  abrirModalRolesUsuario(usuarioEditar: IUsuarioClima) {
    const initialState = {
      tituloModal: "Administración de Roles del Usuario Interno",
      usuarioEditar,
    };

    this.bsModalUsuario = this.modalService.show(ModalRolesUsuarioComponent, {
      initialState,
      class: "modal-lg modal-dialog-centered",
      keyboard: true,
      backdrop: "static",
    });
    this.bsModalUsuario.content.eventoGuardarUsuario.subscribe({
      next: (result: any) => {
        Loading.standard("Obteniendo usuarios...");
        this.obtenerUsuarios();
      },
      error: (error: any) => { },
      complete() {
        Loading.remove();
      },
    });
  } // end

  abrirModalActualizacionCorreo(usuarioEditar: IUsuarioClima) {
    const initialState = {
      tituloModal: "Actualización de Dirección de Correo Electrónico",
      usuarioEditar,
    };

    this.bsModalUsuario = this.modalService.show(
      ModalActualizarCorreoComponent,
      {
        initialState,
        class: "modal-xl modal-dialog-centered",
        keyboard: true,
        backdrop: "static",
      }
    );
    this.bsModalUsuario.content.eventoGuardarUsuario.subscribe({
      next: (result: any) => {
        Loading.standard("Obteniendo usuarios...");
        this.obtenerUsuarios();
      },
      error: (error: any) => { },
      complete() {
        Loading.remove();
      },
    });
  } // end

  botonActivar(usuarioEditar: IUsuarioClima, activar: boolean) {
    Confirm.show(
      `Confirma ${usuarioEditar.activo ? "INACTIVAR" : "ACTIVAR"
      } al usuario en el sistema`,
      `<div style="text-align: left;">Nit: <b>${usuarioEditar.nitRegistro}</b> </div>
       <div style="text-align: left;">Nombre de Usuario: <b>${usuarioEditar.nombreCompleto}</b> </div>       
       <div>&nbsp;</div>       
      `,
      "Si",
      "No",
      () => {
        this.activar(usuarioEditar, activar);
      },
      () => { }
    );
  }

  activar(usuarioEditar: IUsuarioClima, activar: boolean) {
    Loading.standard(
      activar ? "Activando usuario..." : "Desactivando usuario..."
    );

    this.usuariosInternosService
      .activar(usuarioEditar.nitUsuario, activar)
      .subscribe({
        next: (next) => {
          if (activar) {
            Notify.success("El usuario fue activado");
            usuarioEditar.activo = true;
          } else {
            usuarioEditar.activo = false;
            Notify.success("El usuario fue desactivado");
          }
        },
        error: (error) => {
          Notify.failure(
            "Ocurrió un error al realizar la acción, intente nuevamente"
          );
        },
        complete() {
          Loading.remove();
        },
      });
  }

  editarModalUsuario() { }

  clearFilter() {
    this.term = "";
  }

  filtrar(valor: boolean) {
    this.textFiltro = valor ? "Activo" : "Inactivo";
    this.listaUsuarios = this.listaOriginal;
    this.listaUsuarios = this.listaUsuarios.filter((x) => x.activo == valor);

  }

  limpiarFiltro() {
    this.textFiltro = "Todos";
    this.listaUsuarios = this.listaOriginal;
  }
}
