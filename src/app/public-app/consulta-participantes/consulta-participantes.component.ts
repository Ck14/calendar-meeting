import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
                        documentoOficial: this.participantes[0].documentoOficial
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
}
