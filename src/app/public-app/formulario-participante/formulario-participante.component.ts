import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormularioParticipanteService, TokenValidationResponse, FormularioParticipanteData } from './formulario-participante.service';
import { forkJoin } from 'rxjs';
import { ComunidadLinguistica, Discapacidad, Pueblo, RangoEdad } from 'src/app/interfaces/meetings/catalogoModelo';
import { Loading, Notify } from 'notiflix';

@Component({
    selector: 'app-formulario-participante',
    templateUrl: './formulario-participante.component.html',
    styleUrls: ['./formulario-participante.component.css']
})
export class FormularioParticipanteComponent implements OnInit {
    formParticipante: FormGroup;
    llaveFormulario: string = '';
    isLoading: boolean = false;
    meetingInfo: any = null;

    // Opciones para los selects
    opcionesSexo = [
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Femenino' }
    ];

    public rangosEdad: RangoEdad[] = [];
    public comunidadesLinguisticas: ComunidadLinguistica[] = [];
    public discapacidades: Discapacidad[] = [];
    public pueblos: Pueblo[] = [];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private formularioParticipanteService: FormularioParticipanteService
    ) {
        this.formParticipante = this.fb.group({
            dpi: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
            nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
            puesto: ['', [Validators.required]],
            institucion: ['', [Validators.required]],
            telefonoExtension: ['', [Validators.required]],
            correo: ['', [Validators.required, Validators.email]],
            sexo: ['', [Validators.required]],
            rangoEdad: ['', [Validators.required]],
            discapacidad: ['', [Validators.required]],
            pueblo: ['', [Validators.required]],
            comunidadLinguistica: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.validarTokenYRedirigir();
    }

    /**
     * Valida el token y redirige según el estado de la reunión
     */
    validarTokenYRedirigir(): void {
        // Obtener la llave del formulario desde los query params
        this.route.queryParams.subscribe(params => {
            this.llaveFormulario = params['token'] || '';
            console.log('Llave del formulario:', this.llaveFormulario);

            // Si no hay token, redirigir a not-found
            if (!this.llaveFormulario || this.llaveFormulario.trim() === '') {
                this.router.navigate(['/not-found']);
                return;
            }

            // Validar el token
            this.validarToken();
        });
    }

    /**
     * Valida el token con el servicio
     */
    validarToken(): void {
        Loading.standard("Validando acceso...");
        this.isLoading = true;

        this.formularioParticipanteService.validarToken(this.llaveFormulario).subscribe({
            next: (response: TokenValidationResponse) => {
                console.log('response', response);
                Loading.remove();
                this.isLoading = false;

                if (!response.isValid) {

                    if (response.validationCode == 0) {//token no valido o no existe
                        this.router.navigate(['/not-found']);
                        return;
                    } else if (response.validationCode == 2) {//token vencido muy temprano

                        this.router.navigate(['/formulario-desactivado']);
                        return;
                    } else if (response.validationCode == 3) {// token vencido muy tarde
                        this.router.navigate(['/formulario-vencido']);
                        return;
                    }
                }

                if (response.meeting) {
                    this.meetingInfo = response.meeting;
                    this.validarHorarioReunion(response.meeting);
                }
            },
            error: (error) => {
                Loading.remove();
                this.isLoading = false;
                console.error('Error al validar token:', error);
                this.router.navigate(['/not-found']);
            }
        });
    }

    /**
     * Valida si el horario actual está dentro del rango de la reunión
     */
    validarHorarioReunion(meeting: any): void {
        const now = new Date();
        const fechaInicio = new Date(meeting.fechaInicio);
        const fechaFin = new Date(meeting.fechaFin);

        // Agregar margen de 15 minutos antes y después de la reunión
        const margenAntes = new Date(fechaInicio.getTime() - 15 * 60 * 1000);
        const margenDespues = new Date(fechaFin.getTime() + 15 * 60 * 1000);

        console.log('=== Validación de Horario ===');
        console.log('Hora actual:', now.toLocaleString());
        console.log('Fecha inicio reunión:', fechaInicio.toLocaleString());
        console.log('Fecha fin reunión:', fechaFin.toLocaleString());
        console.log('Margen antes:', margenAntes.toLocaleString());
        console.log('Margen después:', margenDespues.toLocaleString());
        console.log('¿Es antes de la reunión?', now < margenAntes);
        console.log('¿Es después de la reunión?', now > margenDespues);

        if (now < margenAntes) {
            // La reunión aún no ha comenzado
            console.log('Redirigiendo a formulario-desactivado');
            console.log('URL de redirección: /formulario-desactivado');
            this.router.navigate(['/formulario-desactivado']).then(() => {
                console.log('Navegación completada exitosamente');
            }).catch((error) => {
                console.error('Error en la navegación:', error);
            });
            return;
        }

        if (now > margenDespues) {
            // La reunión ya terminó
            console.log('Redirigiendo a formulario-vencido');
            console.log('URL de redirección: /formulario-vencido');
            this.router.navigate(['/formulario-vencido']).then(() => {
                console.log('Navegación completada exitosamente');
            }).catch((error) => {
                console.error('Error en la navegación:', error);
            });
            return;
        }

        // El horario está dentro del rango, cargar el formulario
        console.log('Mostrando formulario - horario válido');
        this.obtenerCatalogos();
    }

    obtenerCatalogos(): void {
        let categorias = this.formularioParticipanteService.obtenerRangosEdad();
        let comunidadesLinguisticas = this.formularioParticipanteService.obtenerComunidadLinguistica();
        let discapacidades = this.formularioParticipanteService.obtenerDiscapacidad();
        let pueblos = this.formularioParticipanteService.obtenerPueblo();

        forkJoin([categorias, comunidadesLinguisticas, discapacidades, pueblos]).subscribe({
            next: (result) => {
                console.log('result', result);
                this.rangosEdad = result[0];
                this.comunidadesLinguisticas = result[1];
                this.discapacidades = result[2];
                this.pueblos = result[3];
            },
            error: (error) => { },
            complete() { },
        });
    }

    onSubmit(): void {
        if (this.formParticipante.valid) {
            console.log('Formulario válido:', this.formParticipante.value);
            console.log('Llave del formulario:', this.llaveFormulario);

            // Preparar datos para enviar
            const datos: FormularioParticipanteData = {
                token: this.llaveFormulario,
                ...this.formParticipante.value
            };

            // Guardar formulario
            this.guardarFormulario(datos);
        } else {
            this.marcarCamposInvalidos();
        }
    }

    /**
     * Guarda el formulario usando el servicio
     */
    guardarFormulario(datos: FormularioParticipanteData): void {
        Loading.standard("Guardando formulario...");
        this.isLoading = true;

        this.formularioParticipanteService.guardarFormularioParticipante(datos).subscribe({
            next: (response) => {
                Loading.remove();
                this.isLoading = false;

                Notify.success('Formulario guardado exitosamente');

                // Limpiar formulario después de guardar
                this.formParticipante.reset();

                // Opcional: redirigir a una página de confirmación
                // this.router.navigate(['/public/confirmacion']);
            },
            error: (error) => {
                Loading.remove();
                this.isLoading = false;
                console.error('Error al guardar formulario:', error);
                Notify.failure('Error al guardar el formulario. Por favor, intente nuevamente.');
            }
        });
    }

    marcarCamposInvalidos(): void {
        Object.keys(this.formParticipante.controls).forEach(key => {
            const control = this.formParticipante.get(key);
            if (control?.invalid) {
                control.markAsTouched();
            }
        });
    }

    getErrorMessage(controlName: string): string {
        const control = this.formParticipante.get(controlName);
        if (control?.errors && control.touched) {
            if (control.errors['required']) {
                return 'Este campo es requerido';
            }
            if (control.errors['email']) {
                return 'Ingrese un correo electrónico válido';
            }
            if (control.errors['pattern']) {
                return 'Formato inválido';
            }
            if (control.errors['minlength']) {
                return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
            }
        }
        return '';
    }
}
