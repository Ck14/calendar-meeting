import { Component, Injector, OnInit } from "@angular/core";
import { StartupConfigurationService } from "../utils/startup-configuration.service";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { TwoFactorAuthComponent } from "../private-app/components/two-factor-auth/two-factor-auth.component";
import { ConfigUserModel } from "../private-app/interfaces/usuario";
import { configInput } from "../private-app/interfaces/ConfigInput";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ICredencialesUsuario } from "../private-app/interfaces/Login";
import { SeguridadService } from "../private-app/modules/seguridad/seguridad.service";
import { IRespuestaHttp } from "../private-app/interfaces/compartido/resultado-http";
import { EstadosHttp } from "../private-app/constants/estado-http";
import { encode } from "../utils/functions/encode";
import { Notify } from "notiflix";
import { localStorageCore } from "../utils/functions/localStorageCore";

@Component({
  selector: "app-redirect-to",
  templateUrl: "./redirect-to.component.html",
  styleUrls: ["./redirect-to.component.css"],
})
export class RedirectToComponent implements OnInit {
  private bsModalChangePinPass: BsModalRef | undefined;

  constructor(
    private config: StartupConfigurationService,
    private injector: Injector,
    private modalService: BsModalService,
    private http: SeguridadService,
    private router: Router,
    private local: localStorageCore
  ) {}

  ngOnInit(): void {
    if (!this.config.usuario.isAuthenticated) {
      this.injector.get(Router).navigate(["public"]);
      return;
    }

    this.config.obtenerSesionActual().then(
      (usuario) => {
        if (!usuario) {
          this.injector.get(Router).navigate(["public"]);
        }
        switch (true) {
          case usuario.dobleFactorObligatorio && usuario.idPolitica < 1:
            this.validarCuenta();
            break;
          case usuario.dobleFactorAuth === false:
            // DOBLE FACTOR DE AUTENTICACION ESTA INHABILITADO
            const solicitud: ICredencialesUsuario = {
              nitUsuario: this.config.usuario.nit,
              dobleFactor: usuario.dobleFactorAuth,
            };
            this.iniciarSesionConDobleFactor(solicitud);
            break;
          case usuario.sesionActiva:
            console.log("sesion activa");

            this.injector.get(Router).navigate(["admin", "dashboard"]);
            break;
          default:
            this.openModalTwoFactorAuthentication(usuario);
            break;
        }
      },
      (error) => {
        if (error.estado) {
          Notify.failure(error.mensaje);
        } else {
          Notify[error.status as keyof typeof Notify](error.message);
        }
        this.injector.get(Router).navigate(["admin"]);
      }
    );
  }

  validarCuenta() {
    Swal.fire({
      icon: "warning",
      text: "Para activar su usuario por favor, agregue un metodo Verificación en dos pasos, en la pestaña Politica de privacidad",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.local.setItem("loginInicial", "true");
        this.router.navigate(["admin/seguridad/mi-perfil"]);
      } else {
        this.injector.get(Router).navigate(["admin"]);
      }
    });
  }

  openModalTwoFactorAuthentication(data: ConfigUserModel) {
    const configInput: configInput = {
      etiqueta: data.etiqueta,
      pattern: data.pattern,
      required: true,
      messagePattern: data.messagePattern,
      messageMinLength: data.messageMinlength,
      messageRequired: data.messageRequired,
      maxLength: data.maxLength,
      minLength: data.minLength,
      mask: data.mask,
      class: data.class,
      descripcion: data.descripcion,
      descriptionLogin: data.descriptionLogin,
    };

    const initialState = {
      titleModal: `Verificacion de dos pasos`,
      btnCancel: false,
      configInput: configInput,
    };

    this.bsModalChangePinPass = this.modalService.show(TwoFactorAuthComponent, {
      initialState,
      keyboard: false,
      backdrop: false,
      ignoreBackdropClick: true,
    });

    this.bsModalChangePinPass.content.EventModel.subscribe((model: string) => {
      const reqLogin: ICredencialesUsuario = {
        nitUsuario: this.config.usuario.nit,
        valor: model,
        dobleFactor: data.dobleFactorAuth,
      };
      this.iniciarSesionConDobleFactor(reqLogin);
    });
  }

  iniciarSesionConDobleFactor(credencialUsuario: ICredencialesUsuario) {
    this.http.login(credencialUsuario).subscribe({
      next: (data: IRespuestaHttp) => {
        if (data.estado === EstadosHttp.success) {
          localStorage.setItem(encode("logToken"), encode(data.mensaje));
          this.bsModalChangePinPass?.hide();
          this.injector.get(Router).navigate(["admin", "dashboard"]);
        } else {
          Swal.fire({
            title: data.titulo,
            icon: data.icono,
            html: data.mensaje,
          });
        }
      },
      error: (error) => {
        this.bsModalChangePinPass?.hide();
        Notify.failure(error.message);
        this.injector.get(Router).navigate(["admin"]);
      },
    });
  }
}
