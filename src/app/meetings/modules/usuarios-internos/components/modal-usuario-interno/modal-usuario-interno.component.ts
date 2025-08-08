import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { EMPTY, Subscription, iif, merge, mergeMap, of, switchMap } from "rxjs";
import { ResizeService } from "src/app/utils/resize.service";
import { SCREEN_SIZE } from "src/app/utils/screen-size.enum";
import { Confirm, Loading, Notify } from "notiflix";
import Swal from "sweetalert2";
import { UsuariosInternosService } from "../../usuarios-internos.service";
import { IUsuarioInterno } from '../../../../../interfaces/administracion/usuario-interno';
import { IUsuarioSSO } from '../../../../../interfaces/sso/usuarioModelo';

@Component({
  selector: "app-modal-usuario-interno",
  templateUrl: "./modal-usuario-interno.component.html",
  styleUrls: ["./modal-usuario-interno.component.css"],
})
export class ModalUsuarioInternoComponent implements OnInit {
  tituloModal: string = "";
  esEdicion: boolean = false;
  usuarioInternoModelo?: IUsuarioInterno;
  eventoGuardarUsuario = new EventEmitter();
  bloquearBotones: boolean = false;
  FormUsuario: FormGroup = {} as FormGroup;
  servicesPantalla$: Subscription = new Subscription();
  mq: SCREEN_SIZE = SCREEN_SIZE.LG;

  existeUsuarioSSO = false;
  activoUsuarioSSO? = false;
  existeUsuarioClima = false;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private resizeService: ResizeService,
    private usuarioInternoService: UsuariosInternosService
  ) {
    this.FormUsuario = this.obtenerControlesFormulario();
  }

  ngOnInit(): void {
    this.controlTamanioPantalla();
    if (this.esEdicion) {
      this.FormUsuario.patchValue(
        this.usuarioInternoModelo ? this.usuarioInternoModelo : {}
      );
      this.nitUsuario?.disable();
    }

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
  }

  controlTamanioPantalla() {
    this.resizeService.init();
    this.servicesPantalla$ = this.resizeService.observar().subscribe((x) => {
      this.mq = x;
      if (x === SCREEN_SIZE.XS || x === SCREEN_SIZE.SM) {
        this.bsModalRef.setClass("modal-fullscreen modal-dialog-centered");
      } else {
        this.bsModalRef.setClass("modal-lg modal-dialog-centered");
      }
    });
  }

  obtenerControlesFormulario(): FormGroup {
    const group: FormGroup = this.fb.group({
      nitUsuario: [null, Validators.required],
      nombreCompleto: [null, Validators.required],
      correoPersonal: [null, [Validators.required, Validators.email]],
      correoInstitucional: [null, [Validators.required, Validators.email]],
    });
    return group;
  } // end

  validarCampos() {
    if (this.nombreCompleto?.valid && this.correoInstitucional?.valid) {
      return true;
    } else {
      return false;
    }
  } // end

  public buscarUsuario() {
    Loading.standard("Realizando búsqueda...");
    this.limpiarFormulario();

    this.usuarioInternoService
      .obtenerUsuarioClima(this.nitUsuario?.value)
      .pipe(
        switchMap((usuarioClima) => {
          if (!usuarioClima) {
            return this.usuarioInternoService.obtenerUsuarioSSO(
              this.nitUsuario?.value
            );
          } else {
            Notify.failure(
              "El usuario ya se encuentra registrado en el sistema, intente de nuevo"
            );
            Loading.remove();
            this.existeUsuarioClima = true;
            return EMPTY;
          }
        }),
        switchMap((usuarioSSO) => {
          if (!usuarioSSO) {
            return this.usuarioInternoService.obtenerUsuarioSAT(
              this.nitUsuario?.value
            );
          } else {
            this.nombreCompleto?.setValue(
              usuarioSSO.nombre.replaceAll(",", " ")
            );
            this.correoPersonal?.setValue(usuarioSSO.correo);
            this.existeUsuarioSSO = true;
            this.activoUsuarioSSO = usuarioSSO.activo;

            this.nitUsuario?.disable();
            Loading.remove();
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: (usuarioSat) => {
          if (usuarioSat.nit != null) {
            Notify.info(
              "Estos datos son obtenidos de la información registrada en el RTU de la SAT"
            );
            this.nombreCompleto?.setValue(
              usuarioSat.nombre.replaceAll(",", " ")
            );
            this.correoPersonal?.setValue(usuarioSat.email);
            this.nitUsuario?.disable();
          } else {
            Notify.failure(
              "No se encontraron datos asociados al NIT o el formato es incorrecto, intente de nuevo"
            );
          }
        },
        error: (error) => {
          Notify.failure("No responde el servicio, intente de nuevo");
          Loading.remove();
        },
        complete: () => {
          Loading.remove();
        },
      });
  } // end

  limpiarFormulario() {
    this.nombreCompleto?.setValue("");
    this.correoPersonal?.setValue("");
    this.correoInstitucional?.setValue("");
    this.existeUsuarioClima = false;
    this.existeUsuarioSSO = false;
    this.activoUsuarioSSO = false;
  } // end

  public guardarRegistro(): void {
    if (!this.FormUsuario.valid) {
      Object.values(this.FormUsuario.controls).forEach((el) => {
        el.markAsTouched();
      });
      return;
    }

    Confirm.show(
      "¿Confirma la creación y activación del usuario?",
      `<div style="text-align: left;">Nit: <b>${this.nitUsuario?.value}</b> </div>
       <div style="text-align: left;">Nombre de Usuario: <b>${this.nombreCompleto?.value}</b> </div>
       <div style="text-align: left;">Se notificará al usuario al correo electrónico: <b>${this.correoInstitucional?.value}</b> </div>
       <div>&nbsp;</div>       
      `,
      "Si",
      "No",
      () => {
        this.crearUsuario();
      },
      () => { }
    );
  } // end

  crearUsuario() {
    Loading.standard("Creando registro...");

    const usuarioInternoModelo: IUsuarioInterno = {
      nitUsuario: this.nitUsuario?.value,
      nombreCompleto: this.nombreCompleto?.value,
      emailInstitucional: this.correoInstitucional?.value,
      emailPersonal: this.correoPersonal?.value,
    };

    const usuarioSSOModelo: IUsuarioSSO = {
      nit: this.nitUsuario?.value,
      nombre: this.nombreCompleto?.value,
      activo: true,
      correo: this.correoInstitucional?.value,
    };

    const self = this;
    const selfEvento = this.eventoGuardarUsuario;

    let usuarioCreadoSSO: boolean;

    this.usuarioInternoService
      .insertarUsuarioClima(usuarioInternoModelo)
      .pipe(
        switchMap((responseClima) => {
          if (!this.existeUsuarioSSO) {
            usuarioCreadoSSO = true;
            return this.usuarioInternoService.insertarUsuarioSSO(
              usuarioSSOModelo
            );
          } else {
            usuarioCreadoSSO = false;
            return this.usuarioInternoService.otorgarAcceso(usuarioSSOModelo);
          }
        })
      )
      .subscribe({
        next: (responseSSO) => {
          if (usuarioCreadoSSO)
            Notify.success("El usuario fue agregado al SSO.");
          // si se crea en el sso
        },
        error: (error) => {
          Notify.failure(
            "Ocurrió un error al crear el usuario, intente nuevamente."
          );
          Loading.remove();
        },
        complete() {
          Notify.success("El usuario fue creado exitosamente.");
          selfEvento.emit(true);
          self.bsModalRef.hide();
          Loading.remove();
        },
      });
  } // end

  public formatFormulario() {
    this.FormUsuario = this.obtenerControlesFormulario();
  }

  public get nitUsuario() {
    return this.FormUsuario.get("nitUsuario");
  }
  public get nombreCompleto() {
    return this.FormUsuario.get("nombreCompleto");
  }
  public get correoPersonal() {
    return this.FormUsuario.get("correoPersonal");
  }
  public get correoInstitucional() {
    return this.FormUsuario.get("correoInstitucional");
  }
}
