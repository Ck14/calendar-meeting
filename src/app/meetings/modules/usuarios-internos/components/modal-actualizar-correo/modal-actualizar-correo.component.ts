import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Observable, Subscription, forkJoin } from "rxjs";

import { ResizeService } from "src/app/utils/resize.service";
import { SCREEN_SIZE } from "src/app/utils/screen-size.enum";
import { UsuariosInternosService } from "../../usuarios-internos.service";
import { Confirm, Loading, Notify } from "notiflix";
import { IUsuarioClima } from '../../../../../interfaces/sso/usuarioModelo';

@Component({
  selector: "app-modal-actualizar-correo",
  templateUrl: "./modal-actualizar-correo.component.html",
  styleUrls: ["./modal-actualizar-correo.component.css"],
})
export class ModalActualizarCorreoComponent implements OnInit {
  tituloModal: string = "";
  usuarioEditar!: IUsuarioClima;
  eventoGuardarUsuario = new EventEmitter();

  FormUsuario: FormGroup = {} as FormGroup;
  btnActualizar = false;

  cambiosCorreoInstitucional = false;
  cambiosCorreoPersonal = false;

  servicesPantalla$: Subscription = new Subscription();
  mq: SCREEN_SIZE = SCREEN_SIZE.LG;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private resizeService: ResizeService,
    private usuariosInternosService: UsuariosInternosService
  ) {
    this.FormUsuario = this.obtenerControlesFormulario();
  }

  ngOnInit(): void {
    this.controlTamanioPantalla();

    this.nitUsuario?.setValue(this.usuarioEditar.nitUsuario);
    this.nombreCompleto?.setValue(this.usuarioEditar.nombreCompleto);
    this.correoInstitucional?.setValue(this.usuarioEditar.emailInstitucional);
    this.correoPersonal?.setValue(this.usuarioEditar.emailPersonal);

    this.consultarCorreoSat();

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
      messageMaxLength: 1500,
      okButtonBackground: "#0ab39c",
      cancelButtonColor: "#f06548",
      cancelButtonBackground: "#fff",
    });
  }

  obtenerControlesFormulario(): FormGroup {
    const group: FormGroup = this.fb.group({
      nitUsuario: [null, Validators.required],
      nombreCompleto: [null, Validators.required],
      correoPersonal: [null, [Validators.email]],
      correoPersonalSat: [null, [Validators.required, Validators.email]],
      correoInstitucional: [null, [Validators.required, Validators.email]],
      correoInstitucionalNuevo: [null, [Validators.email]],
    });
    return group;
  } // end

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

  consultarCorreoSat() {
    Loading.standard("Recuperando datos de la SAT...");

    this.usuariosInternosService
      .obtenerUsuarioSAT(this.usuarioEditar.nitUsuario)
      .subscribe({
        next: (result) => {
          this.correoPersonalSat?.setValue(result.email);
        },
        error(err) {
          Notify.failure(
            "No se pudieron recuperar datos de la SAT, intente nuevamente"
          );
        },
        complete() {
          Loading.remove();
        },
      });
  } // end

  correosIguales() {
    if (
      this.correoInstitucional?.value == this.correoInstitucionalNuevo?.value
    ) {
      return true;
    } else {
      return false;
    }
  }

  habilitarBoton() {
    // if ((this.correoInstitucionalNuevo?.valid) &&
    //   (this.correoInstitucional?.value != this.correoInstitucionalNuevo?.value) &&
    //   (this.correoInstitucionalNuevo.value != null && this.correoInstitucionalNuevo.value != '')) {
    //   return true;
    // } else {
    //   if ((this.correoPersonal?.value != this.correoPersonalSat?.value) && (this.correoInstitucionalNuevo?.value == '' || this.correoInstitucionalNuevo?.value == null)) {
    //     return true;
    //   } else {
    //     return false;
    //   }

    // }

    if (this.correoInstitucionalNuevo?.valid) {
      return true;
    } else {
      return false;
    }
  }

  guardarCambios() {
    let cambio1: number = 0;
    let cambio2: number = 0;

    if (!this.FormUsuario.valid) {
      Object.values(this.FormUsuario.controls).forEach((el) => {
        el.markAsTouched();
      });
      return;
    }

    let msjCorreoInstitucional = "";

    if (this.correoInstitucionalNuevo?.value) {
      msjCorreoInstitucional = `
            <div style="text-align: left; margin-bottom: -10px">Correo electrónico institucional (actual): <b>${this.correoInstitucional?.value
          ? this.correoInstitucional?.value
          : "sin correo"
        }</b> </div>
            <div style="text-align: left; ">Correo electrónico institucional (nuevo): <b>${this.correoInstitucionalNuevo?.value
          ? this.correoInstitucionalNuevo?.value
          : "sin correo"
        }</b> </div>`;
      this.cambiosCorreoInstitucional = true;
    } else {
      msjCorreoInstitucional = `<div style="text-align: left;">Correo electrónico institucional: <b>Sin cambios</b> </div>`;
      this.cambiosCorreoInstitucional = false;
    }

    let msjCorreoPersonal = "";

    if (this.correoPersonal?.value != this.correoPersonalSat?.value) {
      msjCorreoPersonal = `
             <div style="text-align: left; margin-bottom: -10px">Correo electrónico personal (actual): <b>${this.correoPersonal?.value
          ? this.correoPersonal?.value
          : "sin correo"
        }</b> </div>
             <div style="text-align: left; ">Correo electrónico personal (nuevo): <b>${this.correoPersonalSat?.value
          ? this.correoPersonalSat?.value
          : "sin correo"
        }</b> </div>`;
      this.cambiosCorreoPersonal = true;
    } else {
      msjCorreoPersonal = `<div style="text-align: left;">Correo electrónico personal: <b>Sin cambios</b> </div>`;
      this.cambiosCorreoPersonal = false;
    }

    // if (this.cambiosCorreoInstitucional && this.cambiosCorreoPersonal) {
    //   Notify.info('No existen ningún cambio para actualizar, verifique');
    //   return;
    // }

    Confirm.show(
      "¿Confirma actualizar la información de correos electrónicos?",
      `<div style="text-align: left;">Nit: <b>${this.nitUsuario?.value}</b> </div>
       <div style="text-align: left;">Nombre de Usuario: <b>${this.nombreCompleto?.value}</b> </div>
       <div>&nbsp;</div>
       ${msjCorreoInstitucional}
       <div>&nbsp;</div>
       ${msjCorreoPersonal}
       <div>&nbsp;</div>
      `,
      "Si",
      "No",
      () => {
        this.actualizar(
          this.usuarioEditar.nitUsuario,
          this.correoInstitucionalNuevo?.value,
          this.correoPersonalSat?.value
        );
      },
      () => { }
    );
  }

  actualizar(
    nitUsuario: string,
    correoInstitucionalNuevo: string,
    correoPersonalNuevo: string
  ) {
    Loading.standard("Actualizando correo...");

    const self = this;
    const selfEvento = this.eventoGuardarUsuario;

    if (this.cambiosCorreoInstitucional && this.cambiosCorreoPersonal) {
      //se actualizan ambos
      forkJoin({
        correoInstitucional:
          this.usuariosInternosService.updateCorreoInstitucional(
            nitUsuario,
            correoInstitucionalNuevo
          ),
        correoPersonal: this.usuariosInternosService.updateCorreoPersonal(
          nitUsuario,
          correoPersonalNuevo
        ),
      }).subscribe({
        next: (value) => {
          Notify.success("Los cambios se realizaron exitosamente");
        },
        error: (error) => {
          Notify.success("No se pudieron realizar los cambios, verifique");
          Loading.remove();
        },
        complete() {
          selfEvento.emit(true);
          self.bsModalRef.hide();
          Loading.remove();
        },
      });
    } else if (this.cambiosCorreoInstitucional && !this.cambiosCorreoPersonal) {
      this.usuariosInternosService
        .updateCorreoInstitucional(nitUsuario, correoInstitucionalNuevo)
        .subscribe({
          next: (result) => {
            Notify.success("Los cambios se realizaron exitosamente");
          },
          error: (error) => {
            Notify.success("No se pudieron realizar los cambios, verifique");
            Loading.remove();
          },
          complete() {
            selfEvento.emit(true);
            self.bsModalRef.hide();
            Loading.remove();
          },
        });
    } else if (!this.cambiosCorreoInstitucional && this.cambiosCorreoPersonal) {
      this.usuariosInternosService
        .updateCorreoPersonal(nitUsuario, correoPersonalNuevo)
        .subscribe({
          next: (result) => {
            Notify.success("Los cambios se realizaron exitosamente");
          },
          error: (error) => {
            Notify.success("No se pudieron realizar los cambios, verifique");
            Loading.remove();
          },
          complete() {
            selfEvento.emit(true);
            self.bsModalRef.hide();
            Loading.remove();
          },
        });
    } else if (
      !this.cambiosCorreoInstitucional &&
      !this.cambiosCorreoPersonal
    ) {
      Notify.success("No se realizó ningún cambio.");
      selfEvento.emit(true);
      self.bsModalRef.hide();
      Loading.remove();
    }
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
  public get correoPersonalSat() {
    return this.FormUsuario.get("correoPersonalSat");
  }
  public get correoInstitucional() {
    return this.FormUsuario.get("correoInstitucional");
  }
  public get correoInstitucionalNuevo() {
    return this.FormUsuario.get("correoInstitucionalNuevo");
  }
} // end class
