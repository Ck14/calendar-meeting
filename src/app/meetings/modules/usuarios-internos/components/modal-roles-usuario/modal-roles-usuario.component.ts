import { Component, EventEmitter, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { EMPTY, Subscription, catchError, forkJoin, switchMap } from "rxjs";
import { ResizeService } from "src/app/utils/resize.service";
import { SCREEN_SIZE } from "src/app/utils/screen-size.enum";
import { UsuariosInternosService } from "../../usuarios-internos.service";
import { Loading, Notify } from "notiflix";
import { IUsuarioClima } from '../../../../../interfaces/sso/usuarioModelo';
import { RolClimaModelo } from '../../../../../interfaces/administracion/rol-clima-model';

@Component({
  selector: "app-modal-roles-usuario",
  templateUrl: "./modal-roles-usuario.component.html",
  styleUrls: ["./modal-roles-usuario.component.css"],
})
export class ModalRolesUsuarioComponent implements OnInit {
  tituloModal: string = "";
  usuarioEditar!: IUsuarioClima;
  eventoGuardarUsuario = new EventEmitter();
  FormUsuario: FormGroup = {} as FormGroup;

  rolesAsignados?: RolClimaModelo[];
  rolesSinAsignar?: RolClimaModelo[];

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

    this.cargarRoles();
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

  cargarRoles() {
    Loading.standard("Cargando datos...");
    forkJoin({
      asignados: this.usuariosInternosService.obtenerRolesAsignados(
        this.usuarioEditar.nitUsuario
      ),
      sinAsignar: this.usuariosInternosService.obtenerRolesSinAsignar(
        this.usuarioEditar.nitUsuario
      ),
    }).subscribe({
      next: (result) => {
        this.rolesAsignados = result.asignados;
        this.rolesSinAsignar = result.sinAsignar;
      },
      error: (error) => {
        console.log(error);
      },
      complete() {
        Loading.remove();
      },
    });
  } // end

  asignar(item: RolClimaModelo) {
    Loading.standard("Asignando rol...");

    this.usuariosInternosService
      .asignar(this.usuarioEditar.nitUsuario, item.idRol)
      .pipe(
        switchMap((response) => {
          let asignados = this.usuariosInternosService.obtenerRolesAsignados(
            this.usuarioEditar.nitUsuario
          );
          let sinAsignar = this.usuariosInternosService.obtenerRolesSinAsignar(
            this.usuarioEditar.nitUsuario
          );
          return forkJoin({ asignados, sinAsignar });
        }),
        catchError((error) => {
          throw error;
        })
      )
      .subscribe({
        next: (result) => {
          this.rolesAsignados = result.asignados;
          this.rolesSinAsignar = result.sinAsignar;
        },
        error: (error) => {
          Notify.failure(
            "Ocurrió un error al realizar la asignación, intente de nuevo."
          );
          Loading.remove();
        },
        complete() {
          Notify.success(
            "Usuario actualizado, el rol fue asignado exitosamente."
          );
          Loading.remove();
        },
      });
  }

  desasignar(item: RolClimaModelo) {
    Loading.standard("Desasignando rol...");

    this.usuariosInternosService
      .desasignar(this.usuarioEditar.nitUsuario, item.idRol)
      .pipe(
        switchMap((response) => {
          let asignados = this.usuariosInternosService.obtenerRolesAsignados(
            this.usuarioEditar.nitUsuario
          );
          let sinAsignar = this.usuariosInternosService.obtenerRolesSinAsignar(
            this.usuarioEditar.nitUsuario
          );
          return forkJoin({ asignados, sinAsignar });
        }),
        catchError((error) => {
          throw error;
        })
      )
      .subscribe({
        next: (result) => {
          this.rolesAsignados = result.asignados;
          this.rolesSinAsignar = result.sinAsignar;
        },
        error: (error) => {
          Notify.failure(
            "Ocurrió un error al realizar la desasignación, intente de nuevo."
          );
          Loading.remove();
        },
        complete() {
          Notify.success(
            "Usuario actualizado, el rol fue removido exitosamente."
          );
          Loading.remove();
        },
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
} // end
