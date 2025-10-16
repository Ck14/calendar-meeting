import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConsultaParticipantesService } from './consulta-participantes.service';
import { Loading, Notify } from 'notiflix';

@Component({
    selector: 'app-consulta-participantes',
    templateUrl: './consulta-participantes.component.html',
    styleUrls: ['./consulta-participantes.component.css']
})
export class ConsultaParticipantesComponent implements OnInit {
    formConsulta: FormGroup;
    isLoading: boolean = false;
    participantes: any[] = [];
    meetingInfo: any = null;
    hasSearched: boolean = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private consultaParticipantesService: ConsultaParticipantesService
    ) {
        this.formConsulta = this.fb.group({
            token: ['', [Validators.required, Validators.minLength(1)]]
        });
    }

    ngOnInit(): void {
        // Configurar notificaciones
        Notify.init({
            position: 'right-top',
            timeout: 10000,
            clickToClose: true,
        });

        // Verificar si viene token por query parameter
        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            if (token) {
                this.formConsulta.patchValue({ token });
                this.buscarParticipantes();
            }
        });
    }

    /**
     * Busca participantes por token
     */
    buscarParticipantes(): void {
        if (this.formConsulta.invalid) {
            this.formConsulta.markAllAsTouched();
            return;
        }

        const token = this.formConsulta.get('token')?.value;
        if (!token || token.trim() === '') {
            Notify.failure('Por favor ingrese un token válido');
            return;
        }

        this.isLoading = true;
        this.hasSearched = true;
        this.participantes = [];
        this.meetingInfo = null;

        this.consultaParticipantesService.consultarParticipantes(token).subscribe({
            next: (response: any) => {
                console.log('response', response);
                this.isLoading = false;
                /* if (response.success) { */
                //this.meetingInfo = response.meetingInfo;
                this.participantes = response || [];

                if (this.participantes.length === 0) {
                    Notify.info('No se encontraron participantes para esta reunión');
                } else {
                    this.meetingInfo = {
                        titulo: this.participantes[0].nombreReunion,
                        fechaReunion: this.participantes[0].fechaReunion,
                        horaInicioReunion: this.participantes[0].horaInicioReunion,
                        horaFinReunion: this.participantes[0].horaFinReunion,
                        descripcionReunion: this.participantes[0].descripcionReunion,
                        documentoOficial: this.participantes[0].documentoOficial,
                        token: this.participantes[0].token

                    }
                    console.log('this.meetingInfo', this.meetingInfo);
                    Notify.success(`Se encontraron ${this.participantes.length} participantes`);
                }
                /*  } else {
                     Notify.failure(response.message || 'Error al consultar participantes');
                 } */
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Error al consultar participantes:', error);
                Notify.failure('Error al consultar participantes. Por favor intente nuevamente.');
            }
        });
    }

    /**
     * Limpia el formulario y los resultados
     */
    limpiarConsulta(): void {
        this.formConsulta.reset();
        this.participantes = [];
        this.meetingInfo = null;
        this.hasSearched = false;
    }

    /**
     * Permite realizar una nueva búsqueda
     */
    nuevaBusqueda(): void {
        this.participantes = [];
        this.meetingInfo = null;
        this.hasSearched = false;
        this.formConsulta.reset();
    }

    /**
     * Obtiene el mensaje de error para un campo específico
     */
    getErrorMessage(fieldName: string): string {
        const field = this.formConsulta.get(fieldName);
        if (field?.errors && field.touched) {
            if (field.errors['required']) {
                return 'Este campo es requerido';
            }
            if (field.errors['minlength']) {
                return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
            }
        }
        return '';
    }

    /**
     * TrackBy function para optimizar el rendimiento de la lista
     */
    trackByParticipante(index: number, participante: any): number {
        return participante.id;
    }


    descargarPdf(qr: string) {
        Loading.standard("Generando cuestionario...");

        this.consultaParticipantesService
            .obtenerReporteAsistentes(qr)
            .subscribe({
                next(response) {
                    const file = new Blob([response], { type: "application/pdf" });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                },
                error(err) {
                    Notify.failure("No se pudo generar el reporte.");
                    Loading.remove();
                },
                complete() {
                    Notify.success("Vista previa generada.");
                    Loading.remove();
                },
            });
    }
}
